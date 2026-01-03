namespace :cifra_club do
  # Constants for repeated values
  CIFRA_CLUB_BASE_URL = "https://www.cifraclub.com.br"
  USER_AGENT = "Mozilla/5.0 (compatible; CifraClub Scraper)"
  INVALID_PATH_SEGMENTS = [ "/tab", "/artist", "/musico", "/album", "/playlist" ]
  EXCLUDED_PAGE_SUFFIXES = [ "/musicas.html", "/albuns.html", "/discografia.html", "/videoaulas.html" ]
  MAX_POPULAR_SONGS = 15
  DELAY_BETWEEN_SONGS = 1
  DELAY_BETWEEN_ARTISTS = 2
  desc "Scrape all available versions of a Cifra Club song"
  task :scrape_tab, [ :url ] => :environment do |t, args|
    unless args[:url]
      puts "Usage: rake cifra_club:scrape[url]"
      puts "Example: rake cifra_club:scrape['#{CIFRA_CLUB_BASE_URL}/linkin-park/in-the-end/']"
      puts "This will scrape: principal, simplified, drum, and bass versions (if available)"
      exit 1
    end

    puts "Scraping all versions of Cifra Club song: #{args[:url]}"

    begin
      tabs = CifraClub::PageScraper.import_all_versions!(args[:url])

      puts "✓ Successfully scraped #{tabs.length} tabs:"
      tabs.each do |tab|
        version = tab.version_name.presence || "principal"
        puts "  - #{tab.artist_name} - #{tab.song_title} (#{tab.instrument}, #{version})"
        puts "    Source: #{tab.source}"
        puts "    Capo: #{tab.capo || 'None'}"
        puts "    YouTube Lesson: #{tab.youtube_lesson_url || 'None'}"
        puts "    YouTube Music: #{tab.song.youtube_music_url || 'None'}"
        puts "    Content length: #{tab.content.length} characters"
      end
    rescue => e
      puts "✗ Failed to scrape tabs: #{e.message}"
      puts e.backtrace.join("\n") if ENV["DEBUG"]
      exit 1
    end
  end

  desc "Crawl multiple Cifra Club artists (enqueues background jobs)"
  task scrape_artists: :environment do
    max_songs = ENV.fetch("MAX_SONGS", 15).to_i

    puts "Enqueueing crawl jobs for all Cifra Club artists"
    puts "Each artist will scrape up to #{max_songs} popular songs"
    puts "=" * 80

    CifraClub::CrawlArtistsJob.perform_later(max_songs: max_songs)

    puts "✓ Enqueued CrawlArtistsJob"
    puts "Monitor progress at /jobs or run 'bin/jobs' to process the queue"
  end

  desc "Crawl a Cifra Club artist page (enqueues background jobs)"
  task :scrape_artist, [ :url ] => :environment do |t, args|
    unless args[:url]
      puts "Usage: rake cifra_club:scrape_artist[url]"
      puts "Example: rake cifra_club:scrape_artist['#{CIFRA_CLUB_BASE_URL}/legiao-urbana/']"
      puts "This will crawl the artist page and enqueue jobs to scrape popular songs"
      exit 1
    end

    max_songs = ENV.fetch("MAX_SONGS", 15).to_i
    artist_url = args[:url]
    artist_name = artist_url.split("/")[-2] || artist_url.split("/")[-1]

    puts "Enqueueing crawl job for Cifra Club artist: #{artist_name}"
    puts "Will scrape up to #{max_songs} popular songs"
    puts "=" * 80

    CifraClub::CrawlArtistJob.perform_later(url: artist_url, max_songs: max_songs)

    puts "✓ Enqueued CrawlArtistJob for #{artist_name}"
    puts "Monitor progress at /jobs or run 'bin/jobs' to process the queue"
  end

  desc "Fix HTML entities in existing Cifra Club tab content"
  task fix_html_entities: :environment do
    puts "Fixing HTML entities in Cifra Club tab content..."

    # Find tabs with HTML entities in content
    tabs_with_entities = Tab.where(source: "cifra_club")
                           .where("content LIKE ?", "%&%")

    puts "Found #{tabs_with_entities.count} tabs with HTML entities"

    fixed_count = 0
    tabs_with_entities.each do |tab|
      begin
        # Decode HTML entities in content
        original_content = tab.content
        decoded_content = decode_html_entities(original_content)

        if decoded_content != original_content
          tab.update!(content: decoded_content)
          fixed_count += 1
          puts "✓ Fixed tab: #{tab.song_title} (#{tab.instrument})"
        end
      rescue => e
        puts "✗ Failed to fix tab #{tab.id}: #{e.message}"
      end
    end

    puts "\n✓ Fixed HTML entities in #{fixed_count} tabs"

    # Verify the fix
    remaining = Tab.where(source: "cifra_club").where("content LIKE ?", "%&%").count
    if remaining == 0
      puts "✓ All Cifra Club tabs now have properly decoded content"
    else
      puts "✗ #{remaining} tabs still contain HTML entities"
    end
  end

  def decode_html_entities(text)
    return text unless text.is_a?(String)
    begin
      # Force UTF-8 encoding to avoid encoding issues
      text = text.force_encoding("UTF-8").scrub
      @html_coder ||= HTMLEntities.new
      @html_coder.decode(text)
    rescue
      # Return original text if decoding fails
      text
    end
  end
end
