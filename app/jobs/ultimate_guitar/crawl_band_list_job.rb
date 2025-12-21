module UltimateGuitar
  # Crawls a band list page (e.g., /bands/a.htm) and its pagination.
  # For each band with tab_count >= min_tab_count, enqueues a CrawlBandJob.
  #
  # Usage:
  #   UltimateGuitar::CrawlBandListJob.perform_later(
  #     url: "https://www.ultimate-guitar.com/bands/a.htm",
  #     letter: "a",
  #     min_tab_count: 100
  #   )
  #
  class CrawlBandListJob < ApplicationJob
    queue_as :default

    BASE_URL = "https://www.ultimate-guitar.com".freeze

    retry_on UltimateGuitar::BandListScraper::FetchError, wait: :polynomially_longer, attempts: 5
    retry_on UltimateGuitar::BandListScraper::ParseError, wait: 1.minute, attempts: 3

    def perform(url:, letter:, min_tab_count: 100, page: 1)
      Rails.logger.info "[UG Crawl] Crawling band list: #{url} (letter=#{letter}, page=#{page})"

      result = UltimateGuitar::BandListScraper.scrape(url)
      bands = result[:bands]
      pagination = result[:pagination]

      Rails.logger.info "[UG Crawl] Found #{bands.size} bands on page #{page} of letter '#{letter}'"

      # Filter bands with enough tabs and enqueue crawl jobs
      eligible_bands = bands.select { |b| b[:tab_count] >= min_tab_count }

      Rails.logger.info "[UG Crawl] #{eligible_bands.size} bands have >= #{min_tab_count} tabs"

      # Filter out bands with non-Latin names (Russian, Chinese, etc.)
      latin_bands = eligible_bands.select { |b| latin_name?(b[:name]) }
      skipped_count = eligible_bands.size - latin_bands.size

      if skipped_count > 0
        Rails.logger.info "[UG Crawl] Skipped #{skipped_count} bands with non-Latin names"
      end

      latin_bands.each_with_index do |band, index|
        next if band[:url].blank?

        # Stagger band crawl jobs (10 second delay between bands)
        CrawlBandJob.set(wait: (index * 10).seconds).perform_later(
          url: absolutize_url(band[:url]),
          band_name: band[:name],
          min_tab_count: min_tab_count
        )
      end

      # Continue to next page if available (max 50 pages per letter)
      max_pages = 30
      if pagination[:next_url].present? && pagination[:current] < pagination[:total] && page < max_pages
        # Wait before crawling next page to be polite
        CrawlBandListJob.set(wait: 5.seconds).perform_later(
          url: absolutize_url(pagination[:next_url]),
          letter: letter,
          min_tab_count: min_tab_count,
          page: pagination[:current] + 1
        )
      else
        reason = page >= max_pages ? "reached max #{max_pages} pages" : "#{pagination[:total]} pages"
        Rails.logger.info "[UG Crawl] Finished crawling letter '#{letter}' (#{reason})"
      end

      # Be polite - sleep a bit before job completes
      sleep(rand(1.0..2.0))
    end

    private

    def absolutize_url(url)
      return nil if url.nil? || url.empty?
      return url if url.start_with?("http://", "https://")

      "#{BASE_URL}#{url.start_with?('/') ? '' : '/'}#{url}"
    end

    # Returns true if the name uses only ASCII characters (A-Z, a-z, 0-9, punctuation)
    # Filters out names with special diacritics, Cyrillic, Chinese, etc.
    def latin_name?(name)
      return false if name.nil? || name.empty?

      # Only allow printable ASCII characters (0x20-0x7E: space through tilde)
      name.each_byte.all? { |byte| byte >= 0x20 && byte <= 0x7E }
    end
  end
end

