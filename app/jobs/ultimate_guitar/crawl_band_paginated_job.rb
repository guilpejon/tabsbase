module UltimateGuitar
  # Crawls all pages of a band's tab listing, collects all tabs,
  # then selects the best tab per song and enqueues scraping jobs.
  #
  # This is used for bands with multiple pages of tabs.
  #
  class CrawlBandPaginatedJob < ApplicationJob
    queue_as :default

    retry_on UltimateGuitar::BandPageScraper::FetchError, wait: :polynomially_longer, attempts: 5
    retry_on UltimateGuitar::BandPageScraper::ParseError, wait: 1.minute, attempts: 3

    def perform(start_url:, band_name:, min_tab_count: 100)
      Rails.logger.info "[UG Crawl] Starting paginated crawl for band: #{band_name}"

      # Scrape all pages and get best tab URLs
      tab_urls = UltimateGuitar::BandPageScraper.scrape_all_pages(start_url)

      Rails.logger.info "[UG Crawl] Selected #{tab_urls.size} tabs to scrape for '#{band_name}'"

      # Filter out URLs that have already been scraped
      existing_urls = Tab.where(source_url: tab_urls).pluck(:source_url).to_set
      new_tab_urls = tab_urls.reject { |url| existing_urls.include?(url) }

      Rails.logger.info "[UG Crawl] #{existing_urls.size} already scraped, #{new_tab_urls.size} new tabs to scrape"

      new_tab_urls.each_with_index do |tab_url, index|
        # Stagger tab scraping jobs (5 second delay between tabs)
        ScrapeTabJob.set(wait: (index * 5).seconds).perform_later(url: tab_url)
      end

      Rails.logger.info "[UG Crawl] Enqueued #{new_tab_urls.size} tab scraping jobs for '#{band_name}'"
    end
  end
end

