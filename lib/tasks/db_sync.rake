namespace :db do
  namespace :sync do
    # Constants for repeated values
    REMOTE_USER = "guilpejon"
    REMOTE_HOST = "raspberrypi.local"
    REMOTE_FILE = "~/tabsbase_data.sql"
    LOCAL_DUMP_FILE = Rails.root.join("tmp", "tabsbase_data.sql")

    # Tables to sync (scraper data only, not user data)
    SYNC_TABLES = %w[tunings artists songs tabs].freeze

    desc "Export local database data to a SQL file (data only, no schema)"
    task export: :environment do
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

      cmd += [ "-f", LOCAL_DUMP_FILE.to_s ]

      system(env, *cmd)

      if File.exist?(LOCAL_DUMP_FILE)
        size = (File.size(LOCAL_DUMP_FILE) / 1024.0 / 1024.0).round(2)
        puts "✓ Exported to #{LOCAL_DUMP_FILE} (#{size} MB)"
      else
        puts "✗ Export failed"
        exit 1
      end
    end

    desc "Copy local database data to pi"
    task copy: :environment do
      scp_cmd = "scp #{LOCAL_DUMP_FILE} #{REMOTE_USER}@#{REMOTE_HOST}:#{REMOTE_FILE}"
      puts "Running: #{scp_cmd}"
      system(scp_cmd) || abort("\n✗ SCP failed")
      puts "✓ Copied to server"
    end

    desc "Truncate pi db"
    task truncate: :environment do
      # Truncate in reverse order to respect foreign keys (tabs -> songs -> artists, tunings)
      truncate_sql = "TRUNCATE TABLE tabs, songs, artists, tunings RESTART IDENTITY CASCADE;"
      truncate_cmd = %Q(ssh #{REMOTE_USER}@#{REMOTE_HOST} 'docker exec -i $(docker ps -qf "label=service=tabsbase" | head -1) sh -c "PGPASSWORD=\\$TABSBASE_DATABASE_PASSWORD psql -h tabsbase-db -U tabsbase -d tabsbase_production -c \\"#{truncate_sql}\\""')
      puts "Running: #{truncate_cmd}"
      system(truncate_cmd) || abort("\n✗ Truncate failed")
      puts "✓ Tables truncated"
    end

    desc "Import db to docker"
    task import: :environment do
      import_cmd = %Q(ssh #{REMOTE_USER}@#{REMOTE_HOST} 'docker exec -i $(docker ps -qf "label=service=tabsbase" | head -1) sh -c "PGPASSWORD=\\$TABSBASE_DATABASE_PASSWORD psql -h tabsbase-db -U tabsbase -d tabsbase_production" < #{REMOTE_FILE}')
      puts "Running: #{import_cmd}"
      puts ""
      system(import_cmd) || abort("\n✗ Import failed")
      puts "✓ Import finished"

      # Cleanup remote file
      cleanup_cmd = "ssh #{REMOTE_USER}@#{REMOTE_HOST} 'rm #{REMOTE_FILE}'"
      system(cleanup_cmd)
      puts "✓ Cleaned up remote file"
    end

    desc "Push local scraper data to production (export + scp + import)"
    task push: :environment do
      # Step 1: Export
      puts "=" * 50
      puts "Step 1: Exporting local database..."
      puts "=" * 50
      Rake::Task["db:sync:export"].invoke

      # Step 2: Copy to server
      puts "\n#{"=" * 50}"
      puts "Step 2: Copying to server..."
      puts "=" * 50
      Rake::Task["db:sync:copy"].invoke

      # Step 3: Truncate existing data on server
      puts "\n#{"=" * 50}"
      puts "Step 3: Truncating existing data on server..."
      puts "=" * 50
      Rake::Task["db:sync:truncate"].invoke

      # Step 4: Import via SSH + docker exec
      puts "\n#{"=" * 50}"
      puts "Step 4: Importing on server..."
      puts "=" * 50
      Rake::Task["db:sync:import"].invoke

      puts "\n✓ Sync complete!"
    end
  end
end
