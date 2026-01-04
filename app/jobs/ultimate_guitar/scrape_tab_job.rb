module UltimateGuitar
  # Scrapes a single tab page and imports it into the database.
  # Uses the existing PageScraper service.
  #
  # Usage:
  #   UltimateGuitar::ScrapeTabJob.perform_later(url: "https://tabs.ultimate-guitar.com/tab/radiohead/creep-chords-4169")
  #
  class ScrapeTabJob < ApplicationJob
    queue_as :default

    retry_on UltimateGuitar::PageScraper::FetchError, wait: :polynomially_longer, attempts: 5
    # ParseError retry is handled manually in perform method
    retry_on ActiveRecord::RecordInvalid, wait: 30.seconds, attempts: 2

    # Don't retry on duplicate key errors - the tab already exists
    discard_on ActiveRecord::RecordNotUnique

    # Don't retry on skipped content (language filter, etc.) - just log and move on
    discard_on UltimateGuitar::PageScraper::SkippedError

    def perform(url:)
      # Skip if we already have this tab
      if Tab.exists?(source_url: url)
        Rails.logger.info "[UG Scrape] Tab already exists: #{url}"
        return
      end

      Rails.logger.info "[UG Scrape] Scraping tab: #{url}"

      tab = UltimateGuitar::PageScraper.import!(url)

      Rails.logger.info "[UG Scrape] Imported: #{tab.display_name} (id=#{tab.id})"

      # Be polite
      sleep(rand(1.0..2.0))
    rescue UltimateGuitar::PageScraper::ParseError => e
      # Don't retry if we can't locate the tab payload - this indicates a structural change in UG's page format
      if e.message.include?("Could not locate tab payload within embedded page state")
        Rails.logger.warn "[UG Scrape] Skipping tab due to page structure change: #{url} - #{e.message}"
        nil # Don't retry, just skip
      else
        Rails.logger.error "[UG Scrape] Parse error for #{url}: #{e.message}"
        raise
      end
    rescue UltimateGuitar::PageScraper::SkippedError => e
      Rails.logger.info "[UG Scrape] #{e.message}"
      raise  # Let discard_on handle it
    rescue UltimateGuitar::PageScraper::Error => e
      Rails.logger.error "[UG Scrape] Failed to scrape #{url}: #{e.message}"
      raise
    end
  end
end
