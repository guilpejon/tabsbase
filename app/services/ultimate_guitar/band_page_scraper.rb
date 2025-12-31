require "json"
require "net/http"
require "openssl"
require "uri"
require "zlib"
require "stringio"
require "cgi"

module UltimateGuitar
  # Scrapes a band's page on Ultimate Guitar to extract songs and their tabs.
  #
  # Example:
  #   result = UltimateGuitar::BandPageScraper.scrape("https://www.ultimate-guitar.com/artist/radiohead_175")
  #   result[:artist_name]  #=> "Radiohead"
  #   result[:tabs]         #=> [{ song_title: "Creep", tab_url: "...", type: "Chords", rating: 4.5 }, ...]
  #   result[:pagination]   #=> { current: 1, total: 5, next_url: "..." }
  #
  class BandPageScraper
    class Error < StandardError; end
    class FetchError < Error; end
    class ParseError < Error; end

    # Tab types we want to skip
    EXCLUDED_TYPES = %w[Official Pro Power Video].freeze

    DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36".freeze
    MAX_REDIRECTS = 3
    BASE_URL = "https://www.ultimate-guitar.com".freeze

    def self.scrape(url, **kwargs)
      new(**kwargs).scrape(url)
    end

    # Scrapes all paginated pages for a band and returns the best tab URL per song.
    # Filters out Official/Pro/Power types, picks highest-rated tab per song.
    #
    # Returns: Array of tab URLs to scrape
    def self.scrape_all_pages(start_url, min_rating: 0, **kwargs)
      scraper = new(**kwargs)
      all_tabs = []
      base_url = start_url.gsub(/\?.*/, "") # Remove any existing query params
      pages_scraped = 0
      max_pages = 100 # Safety limit
      current_page = 1
      previous_tab_count = nil

      loop do
        break if pages_scraped >= max_pages

        # Build URL for current page
        url = current_page == 1 ? start_url : "#{base_url}?page=#{current_page}"

        Rails.logger.info "[BandPageScraper] Scraping page #{current_page}: #{url}"

        begin
          result = scraper.scrape(url)
        rescue FetchError => e
          Rails.logger.warn "[BandPageScraper] Failed to fetch page #{current_page}: #{e.message}"
          break
        end

        tabs_on_page = result[:tabs]

        # Stop if we got no tabs (empty page = past the end)
        if tabs_on_page.empty?
          Rails.logger.info "[BandPageScraper] Page #{current_page} returned no tabs, stopping"
          break
        end

        # Stop if we got the same tabs as previous page (UG sometimes returns page 1 for invalid pages)
        if previous_tab_count == tabs_on_page.size && current_page > 1
          first_tab_url = tabs_on_page.first&.dig(:tab_url)
          if all_tabs.any? { |t| t[:tab_url] == first_tab_url }
            Rails.logger.info "[BandPageScraper] Page #{current_page} returned duplicate tabs, stopping"
            break
          end
        end

        all_tabs.concat(tabs_on_page)
        previous_tab_count = tabs_on_page.size

        pagination = result[:pagination]
        Rails.logger.info "[BandPageScraper] Page #{current_page}, tabs on page: #{tabs_on_page.size}, has_next: #{pagination[:next_url].present?}"

        pages_scraped += 1
        current_page += 1

        # Stop if no next page URL
        break unless pagination[:next_url].present?

        # Be polite to the server - longer delay between pages
        sleep(rand(2.0..4.0))
      end

      Rails.logger.info "[BandPageScraper] Finished scraping #{pages_scraped} pages, total tabs: #{all_tabs.size}"

      # Group by song, filter, pick best
      select_best_tabs(all_tabs, min_rating: min_rating)
    end

    def self.select_best_tabs(tabs, min_rating: 0)
      # Filter out excluded types and Pro/Video URLs (some tabs have nil type but /pro/ or -video- in URL)
      eligible = tabs.reject do |t|
        EXCLUDED_TYPES.include?(t[:type]) ||
          t[:type] == "Unknown" ||
          t[:tab_url].to_s.include?("/pro/") ||
          t[:tab_url].to_s.include?("/pro?") ||
          t[:tab_url].to_s.include?("-video-")
      end

      # Group by song title, instrument type, AND version name
      # This way we get one tab per song per instrument per version (regular, acoustic, solo, intro, etc.)
      by_song_type_version = eligible.group_by do |t|
        song_key = t[:song_title].to_s.downcase.strip
        type_key = t[:type].to_s.downcase.strip
        version_key = t[:version_name].to_s.downcase.strip # empty string for regular versions
        [ song_key, type_key, version_key ]
      end

      # For each song+type+version combo, pick the tab with best weighted score
      by_song_type_version.filter_map do |_key, group_tabs|
        best = group_tabs.max_by { |t| weighted_score(t[:rating].to_f, t[:rating_count].to_i) }
        next if best.nil?

        # Only apply min_rating filter if there are multiple options
        # If it's the only tab for this song+type+version, keep it regardless of rating
        if group_tabs.size > 1 && best[:rating].to_f < min_rating
          next
        end

        best[:tab_url]
      end
    end

    # Calculate a weighted score that considers both rating and number of ratings.
    # A tab with 4.9 rating and 10,000 ratings should rank higher than
    # a tab with 5.0 rating and only 10 ratings.
    #
    # Uses Bayesian average: weighted = (v/(v+m)) * R + (m/(v+m)) * C
    # Where:
    #   R = tab's rating
    #   v = number of ratings
    #   m = minimum ratings for full confidence (dampening factor)
    #   C = prior mean rating (assumed average)
    def self.weighted_score(rating, rating_count)
      return 0 if rating <= 0

      m = 50   # Minimum ratings for full confidence
      c = 3.5  # Prior mean rating (conservative estimate)

      # Bayesian weighted average
      ((rating_count.to_f / (rating_count + m)) * rating) + ((m.to_f / (rating_count + m)) * c)
    end

    def initialize(user_agent: DEFAULT_USER_AGENT, timeout: 15, ssl_verify: true)
      @user_agent = user_agent
      @timeout = timeout
      @ssl_verify = ssl_verify
    end

    def scrape(url)
      uri = URI.parse(url)
      html = fetch_html(uri)
      page_state = extract_page_state!(html)

      {
        artist_name: extract_artist_name(page_state),
        tabs: extract_tabs(page_state),
        pagination: extract_pagination(page_state)
      }
    end

    private

    attr_reader :user_agent, :timeout, :ssl_verify

    def fetch_html(uri, redirects_left: MAX_REDIRECTS)
      raise FetchError, "Unsupported URL scheme: #{uri.scheme.inspect}" unless %w[http https].include?(uri.scheme)

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == "https"
      configure_ssl!(http) if http.use_ssl?
      http.open_timeout = timeout
      http.read_timeout = timeout

      request = Net::HTTP::Get.new(uri.request_uri)
      request["User-Agent"] = user_agent
      request["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
      request["Accept-Language"] = "en-US,en;q=0.9"
      request["Accept-Encoding"] = "gzip,deflate"
      request["Referer"] = "https://www.ultimate-guitar.com/"

      response = http.request(request)

      case response
      when Net::HTTPRedirection
        raise FetchError, "Too many redirects" if redirects_left <= 0
        location = response["location"]
        raise FetchError, "Redirect without Location header" if location.nil?
        fetch_html(URI.parse(location), redirects_left: redirects_left - 1)
      when Net::HTTPSuccess
        decode_body(response)
      else
        raise FetchError, "HTTP #{response.code} from #{uri} (#{response.message})"
      end
    rescue SocketError, Timeout::Error, Errno::ECONNRESET, Errno::ECONNREFUSED => e
      raise FetchError, "Failed to fetch #{uri}: #{e.class}: #{e.message}"
    end

    def configure_ssl!(http)
      if ssl_verify
        store = OpenSSL::X509::Store.new
        store.set_default_paths
        store.flags = 0
        http.verify_mode = OpenSSL::SSL::VERIFY_PEER
        http.cert_store = store
      else
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end
    end

    def decode_body(response)
      body = response.body.to_s
      encoding = response["content-encoding"].to_s.downcase

      case encoding
      when "gzip"
        gz = Zlib::GzipReader.new(StringIO.new(body))
        gz.read
      when "deflate"
        Zlib::Inflate.inflate(body)
      else
        body
      end
    rescue Zlib::Error
      response.body.to_s
    end

    def extract_page_state!(html)
      html_bin = html.to_s.b
      re = Regexp.new(
        'class=(["\'])[^"\']*\bjs-store\b[^"\']*\1[^>]*\sdata-content=(["\'])(.*?)\2'.b,
        Regexp::IGNORECASE | Regexp::MULTILINE
      )
      m = html_bin.match(re)
      raise ParseError, "Could not find js-store data-content" unless m

      encoded = m[3].to_s.force_encoding(Encoding::UTF_8)
      decoded = CGI.unescapeHTML(encoded)
      JSON.parse(decoded)
    rescue JSON::ParserError => e
      raise ParseError, "Failed to parse page state JSON: #{e.message}"
    end

    def extract_artist_name(page_state)
      page_state.dig("store", "page", "data", "artist_name") ||
        page_state.dig("store", "page", "data", "name") ||
        "Unknown Artist"
    end

    def extract_tabs(page_state)
      # The tabs are in store.page.data.other_tabs (for "Chords & Tabs" section)
      # or store.page.data.tabs
      tabs_data = page_state.dig("store", "page", "data", "other_tabs") ||
                  page_state.dig("store", "page", "data", "tabs") ||
                  []

      tabs_data.filter_map do |tab|
        next unless tab.is_a?(Hash)

        raw_song_title = tab["song_name"].to_s.strip
        next if raw_song_title.empty?

        tab_url = tab["tab_url"] || tab["url"]
        next if tab_url.to_s.empty?

        type = normalize_tab_type(tab["type"] || tab["type_name"])
        rating = tab["rating"].to_f
        version_name = extract_version_name(tab)

        # Normalize song title by removing version suffix if we extracted it from the name
        song_title = normalize_song_title(raw_song_title, version_name)

        {
          song_title: song_title,
          tab_url: tab_url,
          type: type,
          rating: rating,
          rating_count: tab["votes"].to_i,
          version_name: version_name
        }
      end
    end

    def extract_version_name(tab)
      # Check "part" field for names like "intro", "solo"
      part = tab["part"].to_s.strip
      return part.capitalize if part.present?

      # Check version_description for keywords
      version_desc = tab["version_description"].to_s
      if version_desc.present?
        extracted = extract_version_from_description(version_desc)
        return extracted if extracted
      end

      # Check if song name itself contains version keywords (e.g., "Jaded Acoustic")
      song_name = tab["song_name"].to_s
      extracted = extract_version_from_song_name(song_name)
      return extracted if extracted

      nil
    end

    def extract_version_from_song_name(song_name)
      return nil if song_name.nil? || song_name.empty?

      name_lower = song_name.downcase

      # Look for version keywords at the end of song name or in parentheses
      keywords = %w[acoustic solo intro outro live unplugged]
      keywords.each do |keyword|
        # Match "Song Acoustic", "Song (Acoustic)", "Song - Acoustic"
        if name_lower.match?(/[\s\-\(]#{keyword}[\s\)\-]*$/i)
          return keyword.capitalize
        end
      end

      nil
    end

    # Remove version suffix from song title so "Jaded Acoustic" becomes "Jaded"
    def normalize_song_title(title, version_name)
      return title if version_name.nil? || version_name.empty?

      # Remove patterns like " Acoustic", " (Acoustic)", " - Acoustic" from end
      version_lower = version_name.downcase
      title.gsub(/[\s\-]*[\(\[]?#{Regexp.escape(version_lower)}[\)\]]?\s*$/i, "").strip
    end

    def extract_version_from_description(description)
      return nil if description.nil? || description.empty?

      desc_lower = description.to_s.downcase

      # Look for common version name patterns
      keywords = %w[acoustic solo intro outro live unplugged fingerstyle fingerpicking capo]
      keywords.each do |keyword|
        if desc_lower.include?(keyword)
          return keyword.capitalize
        end
      end

      nil
    end

    def normalize_tab_type(type)
      return "Unknown" if type.nil? || type.to_s.strip.empty?

      type_str = type.to_s.strip.downcase

      # UG uses various type identifiers - normalize to consistent names
      case type_str
      when "chords", "200"
        "Chords"
      when "tab", "tabs", "100"
        "Tab"
      when "bass", "bass tabs", "400"
        "Bass"
      when "ukulele", "ukulele chords", "800"
        "Ukulele"
      when "power", "power tab", "power tabs", "600"
        "Power"
      when "pro", "guitar pro", "500"
        "Pro"
      when "official", "900"
        "Official"
      when "drums", "drum", "drum tabs", "700"
        "Drums"
      when "video", "300"
        "Video"
      else
        # Capitalize unknown types but return as-is
        type.to_s.strip.split.map(&:capitalize).join(" ")
      end
    end

    def extract_pagination(page_state)
      pagination = page_state.dig("store", "page", "data", "pagination") || {}

      # Debug: log raw pagination structure
      Rails.logger.debug "[BandPageScraper] Raw pagination keys: #{pagination.keys.inspect}"
      Rails.logger.debug "[BandPageScraper] Raw pagination: #{pagination.to_json[0..500]}"

      current = pagination["current"].to_i
      current = 1 if current < 1

      total = pagination["total"].to_i
      total = 1 if total < 1

      # Try multiple ways to find next/prev URLs
      # Method 1: Direct next/prev fields
      next_url = pagination["next"] || pagination["next_url"]
      prev_url = pagination["prev"] || pagination["prev_url"]

      # Method 2: Look in pages array
      if next_url.nil? || prev_url.nil?
        pages = pagination["pages"] || []
        if pages.any?
          next_page = pages.find { |p| p["page"].to_i == current + 1 }
          prev_page = pages.find { |p| p["page"].to_i == current - 1 }
          next_url ||= next_page&.dig("url") || next_page&.dig("href")
          prev_url ||= prev_page&.dig("url") || prev_page&.dig("href")
        end
      end

      # Method 3: Build URL from current page if we know total > current
      if next_url.nil? && total > current
        # Try to build next page URL from a known page URL pattern
        pages = pagination["pages"] || []
        sample_page = pages.find { |p| p["url"] || p["href"] }
        if sample_page
          sample_url = sample_page["url"] || sample_page["href"]
          # Replace page number in URL pattern
          next_url = sample_url.gsub(/page=\d+/, "page=#{current + 1}")
        end
      end

      {
        current: current,
        total: total,
        next_url: next_url ? absolutize_url(next_url) : nil,
        prev_url: prev_url ? absolutize_url(prev_url) : nil
      }
    end

    def absolutize_url(url)
      return nil if url.nil? || url.empty?
      return url if url.start_with?("http://", "https://")

      "#{BASE_URL}#{url.start_with?('/') ? '' : '/'}#{url}"
    end
  end
end
