module UltimateGuitar
  # Crawls a band's page to extract songs and their tabs.
  # Filters out Official/Pro/Power tabs, picks highest-rated tab per song.
  #
  # Usage:
  #   UltimateGuitar::CrawlBandJob.perform_later(
  #     url: "https://www.ultimate-guitar.com/artist/radiohead_175",
  #     band_name: "Radiohead"
  #   )
  #
  class CrawlBandJob < ApplicationJob
    queue_as :default

    retry_on UltimateGuitar::BandPageScraper::FetchError, wait: :polynomially_longer, attempts: 5
    retry_on UltimateGuitar::BandPageScraper::ParseError, wait: 1.minute, attempts: 3

    def perform(url:, band_name:, min_tab_count: 100, page: 1)
      Rails.logger.info "[UG Crawl] Crawling band: #{band_name} (#{url}, page=#{page})"

      result = UltimateGuitar::BandPageScraper.scrape(url)
      tabs = result[:tabs]
      pagination = result[:pagination]

      Rails.logger.info "[UG Crawl] Found #{tabs.size} tabs on page #{page} for '#{band_name}'"

      # Accumulate tabs across all pages, then select best when done
      accumulated_tabs = tabs

      # If this is the first page and there are more pages, crawl all pages first
      if page == 1 && pagination[:total] > 1
        # For bands with multiple pages, we'll collect all tabs then process
        CrawlBandPaginatedJob.perform_later(
          start_url: url,
          band_name: band_name,
          min_tab_count: min_tab_count
        )
      else
        # Single page band - process tabs directly
        process_tabs(accumulated_tabs, band_name)
      end

      # Be polite
      sleep(rand(1.0..2.0))
    end

    private

    def process_tabs(tabs, band_name)
      # Filter and select best tabs
      tab_urls = UltimateGuitar::BandPageScraper.select_best_tabs(tabs)

      Rails.logger.info "[UG Crawl] Selected #{tab_urls.size} tabs to scrape for '#{band_name}'"

      # Filter out URLs that have already been scraped
      existing_urls = Tab.where(source_url: tab_urls).pluck(:source_url).to_set
      new_tab_urls = tab_urls.reject { |url| existing_urls.include?(url) }

      Rails.logger.info "[UG Crawl] #{existing_urls.size} already scraped, #{new_tab_urls.size} new tabs to scrape"

      new_tab_urls.each_with_index do |tab_url, index|
        # Stagger tab scraping jobs
        ScrapeTabJob.set(wait: (index * 5).seconds).perform_later(url: tab_url)
      end
    end
  end
end

