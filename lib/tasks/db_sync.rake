namespace :db do
  namespace :sync do
    # Tables to sync (scraper data only, not user data)
    SYNC_TABLES = %w[tunings artists songs tabs].freeze

    desc "Export local database data to a SQL file (data only, no schema)"
    task export: :environment do
      dump_file = Rails.root.join("tmp", "tabsbase_data.sql")

      puts "Exporting data from local database..."
      puts "Tables: #{SYNC_TABLES.join(", ")}"

      # Build pg_dump command for data-only export
      db_config = ActiveRecord::Base.connection_db_config.configuration_hash
      env = {
        "PGPASSWORD" => db_config[:password].to_s
      }
      cmd = [
        "pg_dump",
        "--data-only",           # Only data, no schema
        "--no-owner",            # Don't set ownership
        "--no-privileges",       # Don't set privileges
        "--disable-triggers",    # Disable triggers during import
        "-h", db_config[:host] || "localhost",
        "-U", db_config[:username] || ENV["USER"],
        "-d", db_config[:database]
      ]

      # Add specific tables
      SYNC_TABLES.each { |t| cmd += [ "-t", t ] }

      cmd += [ "-f", dump_file.to_s ]

      system(env, *cmd)

      if File.exist?(dump_file)
        size = (File.size(dump_file) / 1024.0 / 1024.0).round(2)
        puts "✓ Exported to #{dump_file} (#{size} MB)"
      else
        puts "✗ Export failed"
        exit 1
      end
    end

    desc "Push local scraper data to production (export + scp + import)"
    task push: :environment do
      dump_file = Rails.root.join("tmp", "tabsbase_data.sql")
      remote_user = "guilpejon"
      remote_host = "raspberrypi.local"
      remote_file = "~/tabsbase_data.sql"

      # Step 1: Export
      puts "=" * 50
      puts "Step 1: Exporting local database..."
      puts "=" * 50
      Rake::Task["db:sync:export"].invoke

      # Step 2: Copy to server
      puts "\n#{"=" * 50}"
      puts "Step 2: Copying to server..."
      puts "=" * 50
      scp_cmd = "scp #{dump_file} #{remote_user}@#{remote_host}:#{remote_file}"
      puts "Running: #{scp_cmd}"
      system(scp_cmd) || abort("\n✗ SCP failed")
      puts "✓ Copied to server"

      # Step 3: Truncate existing data on server
      puts "\n#{"=" * 50}"
      puts "Step 3: Truncating existing data on server..."
      puts "=" * 50
      # Truncate in reverse order to respect foreign keys (tabs -> songs -> artists, tunings)
      truncate_sql = "TRUNCATE TABLE tabs, songs, artists, tunings RESTART IDENTITY CASCADE;"
      truncate_cmd = %Q(ssh #{remote_user}@#{remote_host} 'docker exec -i $(docker ps -qf "label=service=tabsbase" | head -1) sh -c "PGPASSWORD=\\$TABSBASE_DATABASE_PASSWORD psql -h tabsbase-db -U tabsbase -d tabsbase_production -c \\"#{truncate_sql}\\""')
      puts "Running: #{truncate_cmd}"
      system(truncate_cmd) || abort("\n✗ Truncate failed")
      puts "✓ Tables truncated"

      # Step 4: Import via SSH + docker exec
      puts "\n#{"=" * 50}"
      puts "Step 4: Importing on server..."
      puts "=" * 50
      import_cmd = %Q(ssh #{remote_user}@#{remote_host} 'docker exec -i $(docker ps -qf "label=service=tabsbase" | head -1) sh -c "PGPASSWORD=\\$TABSBASE_DATABASE_PASSWORD psql -h tabsbase-db -U tabsbase -d tabsbase_production" < #{remote_file}')
      puts "Running: #{import_cmd}"
      puts ""
      system(import_cmd) || abort("\n✗ Import failed")

      puts "\n✓ Sync complete!"
    end
  end
end
