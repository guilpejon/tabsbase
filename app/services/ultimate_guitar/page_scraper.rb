require "json"
require "net/http"
require "openssl"
require "uri"
require "zlib"
require "stringio"
require "cgi"

module UltimateGuitar
  # Scrapes a single Ultimate Guitar tab page by extracting the embedded page-state JSON.
  #
  # Example:
  #   result = UltimateGuitar::PageScraper.scrape("https://tabs.ultimate-guitar.com/tab/radiohead/creep-chords-4169")
  #   result[:artist_name] #=> "Radiohead"
  #   result[:song_title]  #=> "Creep"
  #   result[:tab][:content] #=> "... tab/chords text ..."
  #
  # Notes:
  # - This relies on the client-rendered state variable `window.UGAPP.store.page`.
  # - Some UG pages are protected by anti-bot measures; in those cases this will raise.
  class PageScraper
    class Error < StandardError; end
    class FetchError < Error; end
    class ParseError < Error; end

    DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36".freeze
    MAX_REDIRECTS = 3

    def self.scrape(url, **kwargs)
      new(**kwargs).scrape(url)
    end

    # Scrape and persist an Artist + Song + Tuning + Tab.
    #
    # Returns the saved Tab record.
    #
    # Idempotency:
    # - Tabs are de-duplicated by `source_url` when present.
    def self.import!(url, **kwargs)
      new(**kwargs).import!(url)
    end

    def initialize(user_agent: DEFAULT_USER_AGENT, timeout: 15, ssl_verify: true, cookies: nil, headers: nil)
      @user_agent = user_agent
      @timeout = timeout
      @ssl_verify = ssl_verify
      @cookies = cookies
      @headers = headers || {}
    end

    def scrape(url)
      uri = URI.parse(url)
      html = fetch_html(uri)
      page_state = extract_ugapp_page_state!(html)
      tab_payload = extract_tab_payload(page_state)

      {
        source_url: url,
        artist_name: extract_artist_name(tab_payload, page_state),
        song_title: extract_song_title(tab_payload, page_state),
        genre: extract_genre(tab_payload, page_state),
        tab: normalize_tab(tab_payload, page_state, url)
      }
    end

    def import!(url)
      payload = scrape(url)

      artist_name = payload[:artist_name]
      song_title = payload[:song_title]
      raise Error, "Missing artist_name from scraped payload" if artist_name.to_s.strip.empty?
      raise Error, "Missing song_title from scraped payload" if song_title.to_s.strip.empty?

      tab_attrs = payload.fetch(:tab)
      instrument = tab_attrs.fetch(:instrument)
      tuning_attrs = tab_attrs.fetch(:tuning)

      ActiveRecord::Base.transaction do
        artist = find_or_create_artist!(artist_name)
        song = find_or_create_song!(artist, song_title, genre: payload[:genre])
        tuning = find_or_create_tuning!(instrument, tuning_attrs)

        tab = find_or_initialize_tab!(song, url)
        tab.tuning = tuning
        tab.instrument = instrument
        tab.tab_type = tab_attrs[:tab_type]
        tab.content = tab_attrs[:content]
        tab.difficulty = tab_attrs[:difficulty]
        tab.capo = tab_attrs[:capo]
        tab.rating = tab_attrs[:rating]
        tab.rating_count = tab_attrs[:rating_count]
        tab.views_count = tab_attrs[:views_count]
        tab.version_name = tab_attrs[:version_name]
        tab.youtube_url = tab_attrs[:youtube_url]
        tab.source_url = url

        tab.save!
        tab
      end
    end

    private

    attr_reader :user_agent, :timeout, :ssl_verify, :cookies, :headers

    def find_or_create_artist!(name)
      name = name.to_s.strip
      Artist.find_or_create_by!(name: name)
    rescue ActiveRecord::RecordNotUnique
      Artist.find_by!(name: name)
    end

    def find_or_create_song!(artist, title, genre: nil)
      title = title.to_s.strip
      song = Song.find_or_create_by!(artist: artist, title: title)
    rescue ActiveRecord::RecordNotUnique
      song = Song.find_by!(artist_id: artist.id, title: title)
    ensure
      if song && genre.present? && song.genre.blank?
        song.update!(genre: genre)
      end
    end

    def find_or_create_tuning!(instrument, tuning_attrs)
      name = tuning_attrs.fetch(:name).to_s.strip
      strings = tuning_attrs.fetch(:strings)
      strings = Array(strings).map(&:to_s)

      # Normalize tuning name - if it looks like string notes, give it a proper name
      name = normalize_tuning_name(name, strings, instrument)

      tuning = Tuning.find_or_create_by!(instrument: instrument, name: name) do |t|
        t.strings = strings
      end
    rescue ActiveRecord::RecordNotUnique
      tuning = Tuning.find_by!(instrument: instrument, name: name)
    ensure
      # Keep strings up to date if we have better data.
      if tuning && strings.present? && (tuning.strings.blank? || tuning.strings != strings)
        tuning.update!(strings: strings)
      end
    end

    def normalize_tuning_name(name, strings, instrument)
      # Standard tunings for each instrument
      standard_tunings = {
        "guitar" => %w[E A D G B E],
        "bass" => %w[E A D G],
        "ukulele" => %w[G C E A],
        "cavaquinho" => %w[D G B D]
      }

      # If name is empty or looks like string notes (e.g., "G C E A" or "E-A-D-G-B-E")
      if name.blank? || name.match?(/^[A-Ga-g]#?\s*[-\s]\s*[A-Ga-g]/i)
        # Check if it matches a standard tuning
        standard = standard_tunings[instrument.to_s.downcase]
        if standard && strings.map(&:upcase) == standard.map(&:upcase)
          return "Standard"
        end

        # If we have strings but no good name, derive a name from the pattern
        if strings.present?
          # Check for common patterns
          if strings.first&.upcase == "D" && instrument.to_s.downcase == "guitar" && strings[2]&.upcase == "D"
            return "Drop D"
          end
          # Otherwise use the strings as the name but formatted nicely
          return strings.join(" ")
        end

        return "Standard"
      end

      name
    end

    def find_or_initialize_tab!(song, url)
      # Prefer source_url as the unique external identifier.
      Tab.find_or_initialize_by(source_url: url).tap do |t|
        t.song ||= song
      end
    end

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
      request["Upgrade-Insecure-Requests"] = "1"
      request["Connection"] = "keep-alive"
      request["Referer"] = "https://www.ultimate-guitar.com/"

      cookie_header = build_cookie_header(cookies)
      request["Cookie"] = cookie_header if cookie_header

      headers.each { |k, v| request[k.to_s] = v }

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
        # Some environments enable CRL checking globally in OpenSSL config, which can cause:
        #   certificate verify failed (unable to get certificate CRL)
        # Using a fresh store with default paths and no CRL flags avoids that, while
        # still verifying the certificate chain.
        store = OpenSSL::X509::Store.new
        store.set_default_paths
        store.flags = 0

        http.verify_mode = OpenSSL::SSL::VERIFY_PEER
        http.cert_store = store
      else
        http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      end
    end

    def build_cookie_header(value)
      return nil if value.nil?
      return value if value.is_a?(String)

      if value.is_a?(Hash)
        pairs = value.map do |k, v|
          next if v.nil?
          "#{k}=#{v}"
        end.compact
        return nil if pairs.empty?
        return pairs.join("; ")
      end

      nil
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
      # If decoding fails, fall back to raw body to avoid masking useful HTML.
      response.body.to_s
    end

    def extract_ugapp_page_state!(html)
      # Newer UG pages embed the initial state as HTML in:
      #   <div class="js-store" data-content="{&quot;store&quot;:{&quot;page&quot;:{...}}}">
      # Prefer this because it's present even when no JS assignment exists.
      page_from_dom = extract_page_state_from_js_store_div(html)
      return page_from_dom if page_from_dom

      # Older pattern: window.UGAPP.store.page = { ... };
      marker = "UGAPP.store.page"
      idx = html.index(marker)
      raise ParseError, "Could not find embedded UG page state (js-store data-content or #{marker})" if idx.nil?

      # Find the '=' after the marker.
      eq_idx = html.index("=", idx)
      raise ParseError, "Could not locate assignment for #{marker}" if eq_idx.nil?

      i = eq_idx + 1
      i += 1 while i < html.length && html.getbyte(i).chr.match?(/\s/)

      # Two common patterns:
      # 1) window.UGAPP.store.page = { ... };
      # 2) window.UGAPP.store.page = JSON.parse("...json...");
      if html[i, 10] == "JSON.parse"
        json_str = extract_json_parse_string!(html, i)
        JSON.parse(json_str)
      elsif html.getbyte(i) == "{".ord
        json_obj = extract_balanced_braces!(html, i)
        JSON.parse(json_obj)
      else
        snippet = html[i, 80].to_s
        raise ParseError, "Unexpected UG page-state format near: #{snippet.inspect}"
      end
    rescue JSON::ParserError => e
      raise ParseError, "Failed to parse embedded UG page state JSON: #{e.message}"
    end

    def extract_page_state_from_js_store_div(html)
      # Extract data-content="...json..." where the JSON is HTML-entity encoded.
      # Example snippet:
      #   <div class="js-store" data-content="{&quot;store&quot;:{&quot;page&quot;:{...}}}"></div>
      # NOTE: Avoid encoding issues by matching in ASCII-8BIT (binary).
      # Use a two-step approach to avoid ReDoS vulnerability
      html_bin = html.to_s.b

      # Step 1: Find the js-store element (limited pattern)
      store_match = html_bin.match(/class="js-store"[^>]{0,500}data-content="([^"]+)"/i)
      store_match ||= html_bin.match(/class='js-store'[^>]{0,500}data-content='([^']+)'/i)
      m = store_match
      return nil unless m

      # data-content is ASCII with entities, so decode safely into UTF-8.
      encoded = m[1].to_s.force_encoding(Encoding::UTF_8)
      decoded = CGI.unescapeHTML(encoded)

      root = JSON.parse(decoded)
      page = root.dig("store", "page")
      return page if page.is_a?(Hash)

      nil
    rescue JSON::ParserError
      # If this path fails, fall back to the JS assignment parser (if present).
      nil
    end

    def extract_json_parse_string!(html, start_idx)
      # JSON.parse("...") with JS string escaping.
      open_paren = html.index("(", start_idx)
      raise ParseError, "Could not parse JSON.parse(...) expression" if open_paren.nil?

      i = open_paren + 1
      i += 1 while i < html.length && html.getbyte(i).chr.match?(/\s/)

      quote = html.getbyte(i)
      raise ParseError, "Expected quote after JSON.parse(" unless quote == '"'.ord || quote == "'".ord

      i += 1
      out = +""
      escaped = false

      while i < html.length
        ch = html.getbyte(i)
        if escaped
          out << ch
          escaped = false
        else
          if ch == "\\".ord
            escaped = true
          elsif ch == quote
            break
          else
            out << ch
          end
        end
        i += 1
      end

      raise ParseError, "Unterminated string in JSON.parse(...)" if i >= html.length

      # Unescape common JS sequences so the string becomes valid JSON.
      out = out
        .gsub("\\\"", "\"")
        .gsub("\\'", "'")
        .gsub("\\n", "\n")
        .gsub("\\t", "\t")
        .gsub("\\r", "\r")
        .gsub("\\\\", "\\")

      out
    end

    def extract_balanced_braces!(str, start_idx)
      i = start_idx
      depth = 0
      in_string = nil
      escaped = false

      while i < str.length
        ch = str.getbyte(i)

        if in_string
          if escaped
            escaped = false
          elsif ch == "\\".ord
            escaped = true
          elsif ch == in_string
            in_string = nil
          end
        else
          if ch == '"'.ord || ch == "'".ord
            in_string = ch
          elsif ch == "{".ord
            depth += 1
          elsif ch == "}".ord
            depth -= 1
            if depth == 0
              return str[start_idx..i]
            end
          end
        end

        i += 1
      end

      raise ParseError, "Could not find end of embedded JSON object"
    end

    def extract_tab_payload(page_state)
      # Try common locations first, then fall back to a deep search.
      candidates = [
        page_state.dig("data", "tab_view"),
        page_state.dig("data", "tab"),
        page_state.dig("tab_view"),
        page_state.dig("tab"),
        page_state.dig("data")
      ].compact

      candidates.each do |cand|
        payload = normalize_candidate_payload(cand)
        return payload if payload
      end

      found = deep_find_hash(page_state) { |h| looks_like_tab_payload?(h) }
      return found if found

      raise ParseError, "Could not locate tab payload within embedded page state"
    end

    def normalize_candidate_payload(candidate)
      return candidate if candidate.is_a?(Hash) && looks_like_tab_payload?(candidate)

      if candidate.is_a?(Hash) && candidate["wiki_tab"].is_a?(Hash)
        merged = candidate.merge(candidate["wiki_tab"])
        return merged if looks_like_tab_payload?(merged)
      end

      nil
    end

    def looks_like_tab_payload?(hash)
      return false unless hash.is_a?(Hash)
      return true if hash.dig("wiki_tab", "content").is_a?(String)
      return true if hash["content"].is_a?(String)
      false
    end

    def deep_find_hash(obj, &block)
      stack = [ obj ]
      seen = 0

      until stack.empty?
        current = stack.pop
        seen += 1
        break if seen > 50_000 # safety valve

        if current.is_a?(Hash)
          return current if yield(current)
          current.each_value { |v| stack << v }
        elsif current.is_a?(Array)
          current.each { |v| stack << v }
        end
      end

      nil
    end

    def normalize_tab(tab_payload, page_state, url)
      content = tab_payload.dig("wiki_tab", "content") || tab_payload["content"]
      raise ParseError, "Tab content not found in payload" if content.to_s.strip.empty?

      instrument = extract_instrument(tab_payload, page_state)
      tab_type = extract_tab_type(tab_payload, page_state)
      tuning_name, tuning_strings = extract_tuning(tab_payload)
      difficulty = extract_difficulty(tab_payload, page_state)
      views_count = extract_views_count(tab_payload, page_state)
      rating = extract_rating(tab_payload, page_state)
      rating_count = extract_rating_count(tab_payload, page_state)
      version_name = extract_version_name(tab_payload, page_state)
      capo = extract_capo(tab_payload, page_state)

      # Extract metadata for sanitization
      artist_name = extract_artist_name(tab_payload, page_state)
      song_title = extract_song_title(tab_payload, page_state)

      # Extract YouTube URL from content (if present)
      youtube_url, content = extract_youtube_url(content)

      # Clean redundant header info from content
      content = sanitize_tab_content(content, {
        artist_name: artist_name,
        song_title: song_title,
        tuning_name: tuning_name,
        capo: capo
      })

      {
        instrument: instrument || "guitar",
        tab_type: tab_type || "chords",
        content: content,
        difficulty: difficulty,
        capo: capo,
        youtube_url: youtube_url,
        rating: rating,
        rating_count: rating_count,
        views_count: views_count,
        version_name: version_name,
        source_url: url,
        tuning: {
          name: tuning_name || "Standard",
          strings: tuning_strings || default_strings_for(instrument || "guitar")
        }
      }
    end

    def extract_instrument(tab_payload, page_state)
      # First try explicit instrument field
      explicit = tab_payload["instrument"] ||
                 tab_payload.dig("tab", "instrument") ||
                 tab_payload.dig("meta", "instrument")
      return normalize_instrument(explicit) if explicit.present?

      # Otherwise, derive from tab type_name (e.g., "Ukulele", "Bass", "Tab", "Chords")
      type_name = extract_type_name(tab_payload, page_state)
      instrument_from_type(type_name)
    end

    def extract_tab_type(tab_payload, page_state)
      type_name = extract_type_name(tab_payload, page_state)
      tab_type_from_type(type_name)
    end

    def extract_type_name(tab_payload, page_state)
      page_state.dig("data", "tab", "type_name") ||
        page_state.dig("data", "tab", "type") ||
        tab_payload["type_name"] ||
        tab_payload["type"]
    end

    def instrument_from_type(type_name)
      return nil if type_name.nil?

      case type_name.to_s.strip.downcase
      when "ukulele", "ukulele chords"
        "ukulele"
      when "bass", "bass tabs"
        "bass"
      when "drums", "drum", "drum tabs"
        "drums"
      when "tab", "tabs", "chords", "chord"
        "guitar"
      else
        "guitar"
      end
    end

    def tab_type_from_type(type_name)
      return nil if type_name.nil?

      case type_name.to_s.strip.downcase
      when "tab", "tabs", "bass", "bass tabs", "drums", "drum", "drum tabs"
        "tab"
      when "chords", "chord", "ukulele", "ukulele chords"
        "chords"
      else
        "chords"
      end
    end

    def extract_artist_name(tab_payload, page_state)
      presence(
        tab_payload["artist_name"] ||
        tab_payload.dig("artist", "name") ||
        page_state.dig("data", "tab_view", "artist_name") ||
        page_state.dig("data", "tab", "artist_name") ||
        page_state.dig("artist", "name")
      )
    end

    def extract_song_title(tab_payload, page_state)
      presence(
        tab_payload["song_name"] ||
        tab_payload["song_title"] ||
        tab_payload.dig("song", "song_name") ||
        tab_payload.dig("song", "name") ||
        page_state.dig("data", "tab_view", "song_name") ||
        page_state.dig("data", "tab", "song_name") ||
        page_state.dig("song", "song_name")
      )
    end

    def extract_genre(tab_payload, page_state)
      presence(
        tab_payload.dig("meta", "song_genre") ||
        tab_payload["song_genre"] ||
        page_state.dig("data", "tab_view", "meta", "song_genre") ||
        page_state.dig("data", "tab_view", "meta", "song_genre_url") ||
        page_state.dig("data", "tab", "genre")
      ).to_s.then { |v| v.empty? ? nil : v }
    end

    def extract_difficulty(tab_payload, page_state)
      presence(
        # Matches what UG displays on the page (e.g. "beginner")
        page_state.dig("data", "tab_view", "new_ug_difficulty") ||
        page_state.dig("data", "tab_view", "ug_difficulty") ||
        tab_payload["new_ug_difficulty"] ||
        tab_payload["ug_difficulty"] ||
        # Author difficulty (often "novice"/"intermediate")
        page_state.dig("data", "tab_view", "meta", "difficulty") ||
        page_state.dig("data", "tab", "difficulty") ||
        tab_payload.dig("meta", "difficulty") ||
        tab_payload["difficulty"] ||
        tab_payload["difficulty_text"]
      )
    end

    def extract_views_count(tab_payload, page_state)
      integer_or_nil(
        tab_payload.dig("stats", "view_total") ||
        tab_payload["view_total"] ||
        tab_payload["views"] ||
        page_state.dig("data", "tab_view", "stats", "view_total") ||
        page_state.dig("data", "tab_view", "stats", "views") ||
        page_state.dig("data", "tab", "views") ||
        page_state.dig("data", "tab", "view_total")
      )
    end

    def extract_rating(tab_payload, page_state)
      float_or_nil(
        tab_payload["rating"] ||
        tab_payload.dig("rating", "value") ||
        page_state.dig("data", "tab", "rating") ||
        page_state.dig("data", "tab_view", "rating")
      )
    end

    def extract_rating_count(tab_payload, page_state)
      integer_or_nil(
        tab_payload["votes"] ||
        page_state.dig("data", "tab", "votes") ||
        page_state.dig("data", "tab_view", "count_rating")
      )
    end

    def extract_capo(tab_payload, page_state)
      integer_or_nil(
        tab_payload["capo"] ||
        page_state.dig("data", "tab", "capo") ||
        page_state.dig("data", "tab_view", "meta", "capo") ||
        page_state.dig("data", "tab_view", "capo")
      )
    end

    def extract_version_name(tab_payload, page_state)
      tab_data = page_state.dig("data", "tab") || {}

      # Check "part" field for names like "intro", "solo", "acoustic"
      part = presence(tab_data["part"] || tab_payload["part"])
      return part.capitalize if part.present?

      # Check version_description for keywords
      version_desc = tab_data["version_description"] || tab_payload["version_description"]
      if version_desc.present?
        extracted = extract_version_from_description(version_desc)
        return extracted if extracted
      end

      # No meaningful version name found
      nil
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

    def extract_tuning(tab_payload)
      raw = tab_payload["tuning"] || tab_payload.dig("meta", "tuning") || tab_payload.dig("tab", "tuning")
      return [ nil, nil ] if raw.nil?

      if raw.is_a?(Hash)
        name = presence(raw["name"] || raw["title"] || raw["tuning_name"])
        strings = parse_tuning_strings(raw["value"] || raw["strings"] || raw["tuning"])
        return [ name, strings ]
      end

      if raw.is_a?(String)
        # Sometimes just "Standard" or "E A D G B E"
        strings = parse_tuning_strings(raw)
        name = strings ? nil : presence(raw)
        return [ name, strings ]
      end

      [ nil, nil ]
    end

    def parse_tuning_strings(value)
      return value if value.is_a?(Array) && value.all? { |s| s.is_a?(String) }

      return nil unless value.is_a?(String)
      compact = value.strip
      return nil if compact.empty?

      # "E A D G B E" or "E-A-D-G-B-E"
      parts =
        if compact.include?("-")
          compact.split("-")
        else
          compact.split(/\s+/)
        end

      parts = parts.map { |p| p.strip }.reject(&:empty?)
      return nil if parts.length < 4

      parts
    end

    def default_strings_for(instrument)
      case instrument.to_s.downcase
      when "ukulele"
        %w[G C E A]
      when "bass"
        %w[E A D G]
      else
        # guitar_tab, guitar_chords, guitar, etc.
        %w[E A D G B E]
      end
    end

    def normalize_instrument(value)
      return nil if value.nil?
      str = value.to_s.strip.downcase
      return nil if str.empty?
      str
    end

    def presence(value)
      v = value.is_a?(String) ? value.strip : value
      return nil if v.nil? || (v.respond_to?(:empty?) && v.empty?)
      v
    end

    def integer_or_nil(value)
      return nil if value.nil?
      Integer(value)
    rescue ArgumentError, TypeError
      nil
    end

    def float_or_nil(value)
      return nil if value.nil?
      Float(value)
    rescue ArgumentError, TypeError
      nil
    end

    # Extract YouTube URL from content and return [url, cleaned_content]
    # Looks for patterns like:
    #   - VIDEO LESSON - www.youtube.com/watch?v=...
    #   - https://youtube.com/watch?v=...
    #   - youtu.be/...
    def extract_youtube_url(content)
      return [ nil, content ] if content.nil? || content.empty?

      youtube_url = nil
      lines = content.lines
      lines_to_remove = []

      # YouTube URL patterns
      youtube_patterns = [
        # Full URLs
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
        # Just the domain without protocol (common in UG tabs)
        /(?:^|\s)(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
      ]

      lines.each_with_index do |line, index|
        next if youtube_url # Already found one

        youtube_patterns.each do |pattern|
          match = line.match(pattern)
          if match
            video_id = match[1]
            youtube_url = "https://www.youtube.com/watch?v=#{video_id}"

            # Check if this line is primarily a "VIDEO LESSON" line or just contains the URL
            # If the line is mostly about the video lesson, remove it entirely
            if line.match?(/video\s*lesson|lesson\s*video|watch\s*video|youtube/i) ||
               line.strip.match?(/^[-=_\s]*(?:video|youtube)/i) ||
               line.gsub(/[-=_\s]/, "").length < 100 # Short lines with URLs are likely just link lines
              lines_to_remove << index
            end
            break
          end
        end
      end

      # Remove the identified lines (in reverse to preserve indices)
      lines_to_remove.reverse.each { |i| lines.delete_at(i) }

      # Also remove any lines that are just dashes/equals surrounding the video link
      # (decorative separators often used around VIDEO LESSON text)
      cleaned_lines = []
      skip_separator = false

      lines.each_with_index do |line, i|
        stripped = line.strip

        # Check if this is a decorative separator line (mostly dashes, equals, underscores)
        is_separator = stripped.match?(/^[-=_\s]{20,}$/) && stripped.gsub(/[-=_\s]/, "").empty?

        # Skip separators that appear right before or after removed content
        if is_separator && lines_to_remove.any? { |removed_i| (removed_i - i).abs <= 2 }
          next
        end

        cleaned_lines << line
      end

      [ youtube_url, cleaned_lines.join ]
    end

    # Remove redundant header info from tab content that we've already extracted
    # (song title, artist name, tuning, capo, etc.)
    def sanitize_tab_content(content, metadata)
      return content if content.nil? || content.empty?

      lines = content.lines
      removed_lines = 0
      max_lines_to_check = 15 # Only check the first N lines for header info

      lines_to_remove = []

      lines.each_with_index do |line, index|
        break if index >= max_lines_to_check

        stripped = line.strip
        next if stripped.empty? # Keep empty lines for now, will be handled later

        # Skip lines that are section markers (we want to keep these)
        next if stripped.match?(/^\[?(verse|chorus|intro|outro|bridge|pre-chorus|interlude|solo|break|tab|hook|instrumental|refrain)/i)

        if redundant_header_line?(stripped, metadata)
          lines_to_remove << index
          removed_lines += 1
        else
          # Once we hit a non-redundant, non-empty line, stop checking
          # (unless it's within the first few lines and might be followed by more headers)
          break if removed_lines > 0 && index > removed_lines + 3
        end
      end

      # Remove the identified lines
      lines_to_remove.reverse.each { |i| lines.delete_at(i) }

      # Remove leading empty lines
      lines.shift while lines.first&.strip&.empty?

      lines.join
    end

    def redundant_header_line?(line, metadata)
      line_lower = line.downcase.strip

      # Remove common UG header patterns
      return true if line_lower.match?(/^(standard\s+)?tuning\s*[:=]?\s*/i)
      return true if line_lower.match?(/^standard\s+tuning$/i)
      return true if line_lower.match?(/^drop\s+[a-g]#?\s*(tuning)?$/i)
      return true if line_lower.match?(/^[a-g]#?\s+[a-g]#?\s+[a-g]#?\s+[a-g]#?(\s+[a-g]#?)*$/i) # Tuning string pattern like "E A D G B E"
      return true if line_lower.match?(/^capo\s*(on)?\s*\d+$/i)
      return true if line_lower.match?(/^capo\s*[:=]\s*\d+$/i)
      return true if line_lower.match?(/^capo\s+\d+\s*(st|nd|rd|th)?\s*(fret)?$/i)
      return true if line_lower.match?(/^no\s+capo$/i)
      return true if line_lower.match?(/^key\s*[:=]?\s*[a-g]#?(m|min|maj|major|minor)?$/i)
      return true if line_lower.match?(/^tempo\s*[:=]?\s*\d+$/i)
      return true if line_lower.match?(/^bpm\s*[:=]?\s*\d+$/i)
      return true if line_lower.match?(/^time\s*(signature)?\s*[:=]?\s*\d+\/\d+$/i)

      # Check if line matches song title or artist (with various separators)
      artist_name = metadata[:artist_name]&.to_s&.downcase&.strip
      song_title = metadata[:song_title]&.to_s&.downcase&.strip

      if artist_name.present? && song_title.present?
        # Match patterns like "Song Title - Artist" or "Artist - Song Title"
        combined_patterns = [
          "#{song_title} - #{artist_name}",
          "#{artist_name} - #{song_title}",
          "#{song_title} by #{artist_name}",
          "#{artist_name}: #{song_title}",
          "#{song_title}  #{artist_name}",
          song_title,
          artist_name
        ]

        combined_patterns.each do |pattern|
          # Fuzzy match: remove special chars and compare
          clean_line = line_lower.gsub(/[^\w\s]/, "").gsub(/\s+/, " ").strip
          clean_pattern = pattern.gsub(/[^\w\s]/, "").gsub(/\s+/, " ").strip

          return true if clean_line == clean_pattern
          return true if clean_line.start_with?(clean_pattern) && clean_line.length < clean_pattern.length + 20
        end
      elsif song_title.present?
        clean_line = line_lower.gsub(/[^\w\s]/, "").gsub(/\s+/, " ").strip
        clean_title = song_title.gsub(/[^\w\s]/, "").gsub(/\s+/, " ").strip
        return true if clean_line == clean_title
      end

      # Check for tuning name in line
      tuning_name = metadata[:tuning_name]&.to_s&.downcase&.strip
      if tuning_name.present? && tuning_name != "standard"
        return true if line_lower.include?(tuning_name)
      end

      # Check for standalone capo mention that matches our extracted capo
      capo = metadata[:capo]
      if capo.present? && capo.to_i > 0
        return true if line_lower.match?(/capo.*#{capo}/i)
      end

      false
    end
  end
end
