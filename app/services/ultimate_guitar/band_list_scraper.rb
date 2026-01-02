require "json"
require "net/http"
require "openssl"
require "uri"
require "zlib"
require "stringio"
require "cgi"

module UltimateGuitar
  # Scrapes the Ultimate Guitar band directory pages.
  #
  # Example:
  #   result = UltimateGuitar::BandListScraper.scrape("https://www.ultimate-guitar.com/bands/a.htm")
  #   result[:bands]       #=> [{ name: "AC/DC", url: "...", tab_count: 1234 }, ...]
  #   result[:pagination]  #=> { current: 1, total: 5, next_url: "..." }
  #
  class BandListScraper
    class Error < StandardError; end
    class FetchError < Error; end
    class ParseError < Error; end

    DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36".freeze
    MAX_REDIRECTS = 3
    BASE_URL = "https://www.ultimate-guitar.com".freeze

    def self.scrape(url, letter: nil, **kwargs)
      new(**kwargs).scrape(url, letter: letter)
    end

    def initialize(user_agent: DEFAULT_USER_AGENT, timeout: 15, ssl_verify: true)
      @user_agent = user_agent
      @timeout = timeout
      @ssl_verify = ssl_verify
    end

    def scrape(url, letter: nil)
      uri = URI.parse(url)
      html = fetch_html(uri)
      page_state = extract_page_state!(html)

      {
        bands: extract_bands(page_state),
        pagination: extract_pagination(page_state, url, letter)
      }
    end

    # Returns all letter URLs (a.htm through z.htm, plus 0-9.htm)
    def self.alphabet_urls
      letters = ("a".."z").to_a + [ "0-9" ]
      letters.map { |letter| "#{BASE_URL}/bands/#{letter}.htm" }
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
      # UG pages embed state in: <div class="js-store" data-content="{...}">
      # Use a two-step approach to avoid ReDoS vulnerability
      html_bin = html.to_s.b

      # Find the js-store element with limited pattern to prevent catastrophic backtracking
      m = html_bin.match(/class="js-store"[^>]{0,500}data-content="([^"]+)"/i)
      m ||= html_bin.match(/class='js-store'[^>]{0,500}data-content='([^']+)'/i)
      raise ParseError, "Could not find js-store data-content" unless m

      encoded = m[1].to_s.force_encoding(Encoding::UTF_8)
      decoded = CGI.unescapeHTML(encoded)
      JSON.parse(decoded)
    rescue JSON::ParserError => e
      raise ParseError, "Failed to parse page state JSON: #{e.message}"
    end

    def extract_bands(page_state)
      # The bands are typically in store.page.data.artists
      artists = page_state.dig("store", "page", "data", "artists") || []

      artists.filter_map do |artist|
        next unless artist.is_a?(Hash)

        name = artist["name"].to_s.strip
        next if name.empty?

        url = artist["artist_url"] || artist["url"]
        tab_count = (artist["tabscount"] || artist["tab_count"]).to_i

        {
          name: name,
          url: url,
          tab_count: tab_count
        }
      end
    end

    def extract_pagination(page_state, current_url, letter = nil)
      data = page_state.dig("store", "page", "data") || {}

      current = data["current_page"].to_i
      total = data["page_count"].to_i

      current = 1 if current < 1
      total = 1 if total < 1

      # UG pagination uses filename format: a.htm, a2.htm, a3.htm, etc.
      next_url = current < total ? build_page_url(current_url, current + 1, letter) : nil
      prev_url = current > 1 ? build_page_url(current_url, current - 1, letter) : nil

      {
        current: current,
        total: total,
        next_url: next_url,
        prev_url: prev_url
      }
    end

    # UG pagination: a.htm (page 1), a2.htm (page 2), a3.htm (page 3), etc.
    def build_page_url(current_url, page_number, letter = nil)
      uri = URI.parse(current_url)

      # Use the provided letter, or extract it from the current URL if not provided
      if letter.nil?
        path = uri.path
        if path =~ %r{/bands/([a-z0-9-]+?)(\d*)\.htm}i
          letter = $1
        else
          return nil
        end
      end

      if page_number == 1
        "#{uri.scheme}://#{uri.host}/bands/#{letter}.htm"
      else
        "#{uri.scheme}://#{uri.host}/bands/#{letter}#{page_number}.htm"
      end
    rescue URI::InvalidURIError
      nil
    end
  end
end
