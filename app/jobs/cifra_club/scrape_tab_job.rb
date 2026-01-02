module CifraClub
  class ScrapeTabJob < ApplicationJob
    queue_as :default

    retry_on CifraClub::PageScraper::FetchError, wait: :polynomially_longer, attempts: 5
    retry_on CifraClub::PageScraper::ParseError, wait: 1.minute, attempts: 3
    retry_on ActiveRecord::RecordInvalid, wait: 30.seconds, attempts: 2

    # Don't retry on duplicate key errors - the tab already exists
    discard_on ActiveRecord::RecordNotUnique

    # Don't retry on skipped content - just log and move on
    discard_on CifraClub::PageScraper::SkippedError

    # Scrape a single Cifra Club tab URL or all versions of a song
    #
    # @param url [String] The Cifra Club tab URL to scrape
    # @param force [Boolean] Whether to force re-scraping even if URL already exists
    # @param all_versions [Boolean] Whether to scrape all available versions of the song
    def perform(url, force: false, all_versions: false)
      return if url.blank?

      begin
        if all_versions
          tabs = CifraClub::PageScraper.import_all_versions!(url)

          Rails.logger.info "Successfully scraped #{tabs.length} Cifra Club tabs from #{url}"
          tabs
        else
          # Skip if we already have this URL and not forcing
          existing_tab = Tab.find_by(source_url: url)
          return existing_tab if existing_tab && !force

          tab = CifraClub::PageScraper.import!(url)

          Rails.logger.info "Successfully scraped Cifra Club tab: #{tab.display_name} (ID: #{tab.id})"

          tab
        end
      rescue CifraClub::PageScraper::SkippedError => e
        Rails.logger.info "Skipped Cifra Club tab #{url}: #{e.message}"
        raise  # Let discard_on handle it
      rescue CifraClub::PageScraper::Error => e
        Rails.logger.error "Failed to scrape Cifra Club tab #{url}: #{e.message}"
        raise
      end
    end
  end
end
