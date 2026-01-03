module CifraClub
  # Crawls a Cifra Club artist page to extract popular songs and enqueue scraping jobs.
  #
  # Usage:
  #   CifraClub::CrawlArtistJob.perform_later(
  #     url: "https://www.cifraclub.com.br/legiao-urbana/",
  #     max_songs: 15
  #   )
  #
  class CrawlArtistJob < ApplicationJob
    queue_as :default

    retry_on CifraClub::PageScraper::FetchError, wait: :polynomially_longer, attempts: 5
    retry_on CifraClub::PageScraper::ParseError, wait: 1.minute, attempts: 3

    # Constants
    CIFRA_CLUB_BASE_URL = "https://www.cifraclub.com.br"
    USER_AGENT = "Mozilla/5.0 (compatible; CifraClub Scraper)"
    INVALID_PATH_SEGMENTS = [ "/tab", "/artist", "/musico", "/album", "/playlist" ].freeze
    EXCLUDED_PAGE_SUFFIXES = [ "/musicas.html", "/albuns.html", "/discografia.html", "/videoaulas.html" ].freeze

    def perform(url:, max_songs: 15)
      artist_name = extract_artist_name(url)
      Rails.logger.info "[CC Crawl] Crawling artist: #{artist_name} (#{url})"

      song_urls = extract_song_urls(url, artist_name, max_songs)

      Rails.logger.info "[CC Crawl] Found #{song_urls.size} popular songs for '#{artist_name}'"

      if song_urls.empty?
        Rails.logger.warn "[CC Crawl] No songs found for artist: #{artist_name}"
        return
      end

      # Filter out songs that have already been scraped
      existing_urls = Tab.where(source_url: song_urls).pluck(:source_url).to_set
      new_song_urls = song_urls.reject { |song_url| existing_urls.include?(song_url) }

      Rails.logger.info "[CC Crawl] #{existing_urls.size} already scraped, #{new_song_urls.size} new songs to scrape"

      # Enqueue scraping jobs for each song with staggered delays
      new_song_urls.each_with_index do |song_url, index|
        ScrapeTabJob.set(wait: (index * 5).seconds).perform_later(song_url, all_versions: true)
      end

      # Be polite
      sleep(rand(1.0..2.0))
    end

    private

    def extract_artist_name(url)
      url.split("/")[-2] || url.split("/")[-1]
    end

    def extract_song_urls(artist_url, artist_name, max_songs)
      require "nokogiri"
      require "open-uri"

      html = URI.open(artist_url, "User-Agent" => USER_AGENT).read
      doc = Nokogiri::HTML(html)

      song_links = []

      # Look for links that are likely song pages
      doc.css("a[href]").each do |link|
        href = link["href"]
        next unless href

        # Skip external links, anchor links, and non-song links
        next if href.start_with?("http") && !href.include?(CIFRA_CLUB_BASE_URL)
        next if href.start_with?("#")
        next if INVALID_PATH_SEGMENTS.any? { |segment| href.include?(segment) }

        # Clean up the href
        clean_href = href.split(/[?#]/).first

        # Look for URLs with exactly 2 path segments (artist/song)
        path_parts = clean_href.split("/").reject(&:empty?)
        if path_parts.length == 2 && path_parts[0] != "tab" && path_parts[0] != "artist"
          # Make sure it's not the current artist page
          artist_path = artist_url.sub(CIFRA_CLUB_BASE_URL, "").chomp("/")
          next if clean_href == artist_path

          full_url = clean_href.start_with?("http") ? clean_href : "#{CIFRA_CLUB_BASE_URL}#{clean_href}"
          song_links << full_url unless song_links.include?(full_url)
        end
      end

      # Filter to only include URLs for this artist
      song_links.select! do |url|
        url.include?("/#{artist_name}/") &&
        EXCLUDED_PAGE_SUFFIXES.none? { |suffix| url.include?(suffix) } &&
        url.end_with?("/")
      end

      # Remove duplicates and limit to most popular songs
      song_links.uniq.first(max_songs)
    rescue OpenURI::HTTPError => e
      raise CifraClub::PageScraper::FetchError, "Failed to fetch artist page: #{e.message}"
    rescue Nokogiri::XML::SyntaxError => e
      raise CifraClub::PageScraper::ParseError, "Failed to parse artist page: #{e.message}"
    end
  end
end
