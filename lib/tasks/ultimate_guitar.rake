namespace :ultimate_guitar do
  desc "Start crawling Ultimate Guitar for all bands A-Z with 100+ tabs"
  task crawl: :environment do
    puts "Starting Ultimate Guitar crawl..."
    puts "This will crawl bands A-Z with 100+ tabs and scrape their best-rated tabs."
    puts "Excluded tab types: Official, Pro, Power"
    puts ""

    min_tab_count = ENV.fetch("MIN_TAB_COUNT", 100).to_i
    letters = ENV["LETTERS"]&.split(",")&.map(&:strip)

    if letters
      puts "Crawling letters: #{letters.join(', ')}"
      UltimateGuitar::CrawlAlphabetJob.perform_later(letters: letters, min_tab_count: min_tab_count)
    else
      puts "Crawling all letters A-Z and 0-9"
      UltimateGuitar::CrawlAlphabetJob.perform_later(min_tab_count: min_tab_count)
    end

    puts ""
    puts "Jobs have been enqueued. Make sure Solid Queue is running:"
    puts "  bin/jobs"
    puts ""
    puts "Monitor progress in the Rails logs or check SolidQueue::Job table."
  end

  desc "Crawl a specific letter (e.g., rake ultimate_guitar:crawl_letter[a])"
  task :crawl_letter, [ :letter ] => :environment do |_t, args|
    letter = args[:letter]
    abort "Usage: rake ultimate_guitar:crawl_letter[LETTER]" if letter.blank?

    min_tab_count = ENV.fetch("MIN_TAB_COUNT", 100).to_i
    url = "https://www.ultimate-guitar.com/bands/#{letter}.htm"

    puts "Crawling letter '#{letter}' with min_tab_count=#{min_tab_count}"
    UltimateGuitar::CrawlBandListJob.perform_later(
      url: url,
      letter: letter,
      min_tab_count: min_tab_count
    )

    puts "Job enqueued. Run `bin/jobs` to process."
  end

  desc "Crawl a specific band by URL"
  task :crawl_band, [ :url ] => :environment do |_t, args|
    url = args[:url]
    abort "Usage: rake ultimate_guitar:crawl_band[URL]" if url.blank?

    puts "Crawling band: #{url}"
    UltimateGuitar::CrawlBandPaginatedJob.perform_later(
      start_url: url,
      band_name: "Manual crawl"
    )

    puts "Job enqueued. Run `bin/jobs` to process."
  end

  desc "Scrape a single tab by URL"
  task :scrape_tab, [ :url ] => :environment do |_t, args|
    url = args[:url]
    abort "Usage: rake ultimate_guitar:scrape_tab[URL]" if url.blank?

    puts "Scraping tab: #{url}"

    # Run synchronously for immediate feedback
    tab = UltimateGuitar::PageScraper.import!(url)
    puts "Imported: #{tab.display_name} (id=#{tab.id})"
  rescue UltimateGuitar::PageScraper::Error => e
    abort "Failed: #{e.message}"
  end

  desc "Show crawl statistics"
  task stats: :environment do
    puts "=== Ultimate Guitar Crawl Statistics ==="
    puts ""
    puts "Database:"
    puts "  Artists: #{Artist.count}"
    puts "  Songs:   #{Song.count}"
    puts "  Tabs:    #{Tab.count}"
    puts "  Tunings: #{Tuning.count}"
    puts ""

    if defined?(SolidQueue)
      pending = SolidQueue::Job.where(finished_at: nil).count
      failed = SolidQueue::FailedExecution.count
      puts "Solid Queue:"
      puts "  Pending jobs: #{pending}"
      puts "  Failed jobs:  #{failed}"
    end
  end
end
