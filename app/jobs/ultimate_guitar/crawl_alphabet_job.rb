module UltimateGuitar
  # Kicks off the full alphabet crawl by enqueueing jobs for each letter (a-z, 0-9).
  #
  # Usage:
  #   UltimateGuitar::CrawlAlphabetJob.perform_later
  #   UltimateGuitar::CrawlAlphabetJob.perform_later(letters: ["a", "b", "c"])
  #
  class CrawlAlphabetJob < ApplicationJob
    queue_as :default

    # Retry with exponential backoff on network errors
    retry_on UltimateGuitar::BandListScraper::FetchError, wait: :polynomially_longer, attempts: 3

    def perform(letters: nil, min_tab_count: 100)
      letters ||= ("a".."z").to_a + ["0-9"]

      Rails.logger.info "[UG Crawl] Starting alphabet crawl for letters: #{letters.join(', ')}"

      letters.each_with_index do |letter, index|
        url = "https://www.ultimate-guitar.com/bands/#{letter}.htm"

        # Stagger jobs to be polite to UG servers (30 second delay between letters)
        CrawlBandListJob.set(wait: (index * 30).seconds).perform_later(
          url: url,
          letter: letter,
          min_tab_count: min_tab_count
        )
      end

      Rails.logger.info "[UG Crawl] Enqueued #{letters.size} band list jobs"
    end
  end
end

