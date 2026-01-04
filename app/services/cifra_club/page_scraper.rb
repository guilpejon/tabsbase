require "net/http"
require "openssl"
require "uri"
require "cgi"
require "nokogiri"
require "selenium-webdriver"

module CifraClub
  # Scrapes a single Cifra Club tab page and extracts the chord/tablature data.
  #
  # Example:
  #   result = CifraClub::PageScraper.scrape("https://www.cifraclub.com.br/julliany-souza/quem-e-esse/")
  #   result[:artist_name] #=> "Julliany Souza"
  #   result[:song_title]  #=> "Quem É Esse?"
  #   result[:tab][:content] #=> "... chord and tab content ..."
  #
  # Notes:
  # - Cifra Club pages contain the tab content directly in HTML
  # - Portuguese chord notation uses capo frequently
  # - Content includes both chord symbols and tablature
  class PageScraper
    class Error < StandardError; end
    class FetchError < Error; end
    class ParseError < Error; end
    class SkippedError < Error; end

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

    # Scrape all available versions of a song from Cifra Club.
    #
    # For each song, this will attempt to scrape:
    # - Principal (main) version
    # - Simplified version (if available)
    # - Principal drum tab (if available)
    # - Principal bass tab (if available)
    #
    # Returns an array of saved Tab records.
    def self.import_all_versions!(url, **kwargs)
      new(**kwargs).import_all_versions!(url)
    end

    def initialize(user_agent: DEFAULT_USER_AGENT, timeout: 15, cookies: nil, headers: nil)
      @user_agent = user_agent
      @timeout = timeout
      @cookies = cookies
      @headers = headers || {}
    end

    def self.scrape(url, **kwargs)
      new(**kwargs).scrape(url)
    end

    def scrape(url)
      uri = URI.parse(url)
      html = fetch_html(uri)
      # Ensure HTML is properly encoded as UTF-8
      html = html.force_encoding("UTF-8")
      html = html.valid_encoding? ? html : html.encode("UTF-8", invalid: :replace, undef: :replace)
      doc = Nokogiri::HTML(html)

      # Check if this is a lyrics page (ends with /letra/)
      if url.end_with?("/letra/")
        # This is a lyrics-only page
        lyrics = extract_lyrics_content(doc)
        {
          source_url: url,
          artist_name: extract_artist_name(doc),
          song_title: extract_song_title(doc),
          genre: extract_genre(doc),
          lyrics: lyrics
        }
      else
        # This is a tab page - check for lyrics URL
        lyrics_url = lyrics_url_from_tab_url(url)
        lyrics = nil
        if lyrics_url
          begin
            lyrics_uri = URI.parse(lyrics_url)
            lyrics_html = fetch_html(lyrics_uri)
            lyrics_doc = Nokogiri::HTML(lyrics_html)
            lyrics = extract_lyrics_content(lyrics_doc)
          rescue => e
            Rails.logger.warn "Failed to scrape lyrics from #{lyrics_url}: #{e.message}"
          end
        end

        {
          source_url: url,
          artist_name: extract_artist_name(doc),
          song_title: extract_song_title(doc),
          genre: extract_genre(doc),
          tab: normalize_tab(doc, url),
          lyrics: lyrics
        }
      end
    end

    def self.import!(url, **kwargs)
      new(**kwargs).import!(url)
    end

    def self.import_all_versions!(url, **kwargs)
      new(**kwargs).import_all_versions!(url)
    end

    def import!(url)
      # Check if tab already exists with this source_url
      existing_tab = Tab.find_by(source_url: url)
      return existing_tab if existing_tab

      payload = scrape(url)

      artist_name = payload[:artist_name]
      song_title = payload[:song_title]
      raise Error, "Missing artist_name from scraped payload" if artist_name.to_s.strip.empty?
      raise Error, "Missing song_title from scraped payload" if song_title.to_s.strip.empty?

      # Handle lyrics-only pages
      if payload.key?(:lyrics) && !payload.key?(:tab)
        # This is a lyrics-only import
        ActiveRecord::Base.transaction do
          artist = find_or_create_artist!(artist_name)
          song = find_or_create_song!(artist, song_title)

          # Check for existing tab with same source_url
          existing_tab = Tab.find_by(source_url: url)
          if existing_tab
            # Tab exists, lyrics are handled at song level
            return existing_tab
          else
            # Create new tab for lyrics
            tab = Tab.create!(
              song: song,
              tuning: find_or_create_tuning!("guitar", default_tuning_strings("guitar")),
              instrument: "guitar",
              tab_type: "lyrics",
              content: "", # Empty content for lyrics-only tabs
              source: "cifra_club",
              source_url: url,
              difficulty: "beginner",
              capo: nil,
              key: nil,
              rating: nil,
              rating_count: 0,
              views_count: 0,
              version_name: "Lyrics"
            )
            return tab
          end
        end
      end

      tab_attrs = payload.fetch(:tab)
      instrument = tab_attrs.fetch(:instrument)
      tuning_attrs = tab_attrs.fetch(:tuning)
      youtube_music_url = tab_attrs.delete(:youtube_music_url)

      ActiveRecord::Base.transaction do
        artist = find_or_create_artist!(artist_name)
        song = find_or_create_song!(artist, song_title)

        # Update song lyrics if provided and not already set
        if payload[:lyrics].present? && song.lyrics.blank?
          song.update!(lyrics: payload[:lyrics])
        end

        # Update song youtube_music_url if provided and not already set
        if youtube_music_url.present? && song.youtube_music_url.blank?
          song.update!(youtube_music_url: youtube_music_url)
        end

        tuning = find_or_create_tuning!(instrument, tuning_attrs)

        # Check for existing tab with same source_url
        existing_tab = Tab.find_by(source_url: url)
        if existing_tab
          # Update existing tab if content has changed
          if existing_tab.content != tab_attrs[:content] || existing_tab.capo != tab_attrs[:capo]
            existing_tab.update!(
              tuning: tuning,
              instrument: instrument,
              tab_type: tab_attrs[:tab_type],
              content: tab_attrs[:content],
              difficulty: tab_attrs[:difficulty],
              capo: tab_attrs[:capo],
              key: tab_attrs[:key],
              views_count: tab_attrs[:views_count],
              version_name: tab_attrs[:version_name],
              youtube_lesson_url: instrument == "guitar" ? tab_attrs[:youtube_lesson_url] : nil
            )
          end
          return existing_tab
        end

          tab = Tab.new(
            song: song,
            tuning: tuning,
            instrument: instrument,
            tab_type: tab_attrs[:tab_type],
            content: tab_attrs[:content],
            difficulty: tab_attrs[:difficulty],
            capo: tab_attrs[:capo],
            key: tab_attrs[:key],
            views_count: tab_attrs[:views_count],
            version_name: tab_attrs[:version_name],
            youtube_lesson_url: instrument == "guitar" ? tab_attrs[:youtube_lesson_url] : nil,
            source_url: url,
            source: "cifra_club"
          )

        tab.save!

        # Discover and register chords from the tab
        ChordDiscoveryService.discover_from_tab(tab) if tab.persisted?

        tab
      end
    end

    def import_all_versions!(url)
      version_urls = detect_available_versions(url)
      tabs = []

      version_urls.each do |version_url|
        begin
          tab = import!(version_url)
          tabs << tab
          Rails.logger.info "Successfully scraped #{version_url} (ID: #{tab.id})"
        rescue CifraClub::PageScraper::Error => e
          Rails.logger.warn "Failed to scrape version #{version_url}: #{e.message}"
          # Continue with other versions even if one fails
        end
      end

      tabs
    end

    private

    attr_reader :user_agent, :timeout, :cookies, :headers

    def detect_available_versions(url)
      uri = URI.parse(url)
      html = fetch_html(uri)
      doc = Nokogiri::HTML(html)

      # Normalize to base song URL (remove version-specific suffixes)
      base_path = normalize_base_path(uri.path)
      base_uri = URI("#{uri.scheme}://#{uri.host}#{base_path}")

      versions = []

      # Always include the principal version
      versions << base_uri.to_s

      # Check for original version
      original_link = doc.at_css("a[href*='original.html']")
      if original_link
        original_url = original_link.attr("href")
        original_url = URI.join(base_uri, original_url).to_s unless original_url.start_with?("http")
        versions << original_url
      else
        # Try original URL pattern
        original_url = "#{base_uri.to_s.chomp('/')}original.html"
        versions << original_url
      end

      # Check for simplified version
      simplified_link = doc.at_css("a[href*='simplificada.html']")
      if simplified_link
        simplified_url = simplified_link.attr("href")
        simplified_url = URI.join(base_uri, simplified_url).to_s unless simplified_url.start_with?("http")
        versions << simplified_url
      else
        # Try simplified URL pattern
        simplified_url = "#{base_uri.to_s.chomp('/')}simplificada.html"
        versions << simplified_url
      end

      # Try drum tab (construct URL based on pattern)
      drum_url = URI.join(base_uri, "tabs-bateria/").to_s
      versions << drum_url

      # Try bass tab (construct URL based on pattern)
      bass_url = URI.join(base_uri, "tabs-baixo/").to_s
      versions << bass_url

      versions.uniq
    end

    # Normalize URL path to base song path, removing version-specific suffixes
    def normalize_base_path(path)
      # Remove trailing slashes and version-specific endings
      path = path.chomp("/")

      # Remove version suffixes to get base song path
      path = path.sub(/\/simplificada\.html$/, "")  # Remove /simplificada.html
      path = path.sub(/\/original\.html$/, "")  # Remove /original.html
      path = path.sub(/\/tabs-(bateria|baixo)$/, "")  # Remove /tabs-bateria, /tabs-baixo
      path = path.sub(/\/tab-(bateria|baixo)\.html$/, "")  # Remove /tab-bateria.html, /tab-baixo.html

      # Ensure it ends with /
      path += "/" unless path.end_with?("/")
      path
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
      request["Accept-Language"] = "pt-BR,pt;q=0.9,en-US,en;q=0.8,en;q=0.7"
      request["Accept-Encoding"] = "gzip,deflate"
      request["Upgrade-Insecure-Requests"] = "1"
      request["Connection"] = "keep-alive"
      request["Referer"] = "https://www.cifraclub.com.br/"

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
      store = OpenSSL::X509::Store.new
      store.set_default_paths
      store.flags = 0

      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
      http.cert_store = store
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

      decoded_body = case encoding
      when "gzip"
        gz = Zlib::GzipReader.new(StringIO.new(body))
        gz.read
      when "deflate"
        Zlib::Inflate.inflate(body)
      else
        body
      end

      # Ensure proper UTF-8 encoding
      decoded_body.force_encoding("UTF-8")
      decoded_body.valid_encoding? ? decoded_body : decoded_body.encode("UTF-8", invalid: :replace, undef: :replace)
    rescue Zlib::Error
      body = response.body.to_s
      body.force_encoding("UTF-8")
      body.valid_encoding? ? body : body.encode("UTF-8", invalid: :replace, undef: :replace)
    end

    def extract_artist_name(doc)
      # First try: parse from title tag (most reliable for accents)
      title = doc.at_css("title")&.text
      if title && title.include?(" - ")
        # Format: "Song Title - Artist Name - Cifra Club"
        parts = title.split(" - ")
        if parts.length >= 3 && parts.last.include?("Cifra Club")
          return parts[-2]&.strip
        end
      end

      # Second try: various HTML selectors
      selectors = [
        "h1[itemprop='name'] a",
        ".artista-nome",
        ".artist-name",
        "h1 a[href*='/']"
      ]

      selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        text = element.text&.strip
        return text if text.present? && text != "Cifra Club"
      end

      # Last resort: extract from canonical URL path (may not have accents)
      canonical_url = doc.at_css("link[rel='canonical']")&.attr("href")
      if canonical_url
        uri = URI.parse(canonical_url)
        path_parts = uri.path&.split("/")&.reject(&:empty?)
        if path_parts&.length&.>= 2
          artist_slug = path_parts[0]
          return artist_slug.titleize if artist_slug.present?
        end
      end

      nil
    end

    def extract_song_title(doc)
      # First try: parse from title tag (most reliable for accents)
      title = doc.at_css("title")&.text
      if title && title.include?(" - ")
        # Format: "Song Title - Artist Name - Cifra Club"
        parts = title.split(" - ")
        if parts.length >= 2
          song_title = parts[0]&.strip
          return song_title if song_title.present?
        end
      end

      # Second try: various HTML selectors
      selectors = [
        ".cifra-nome",
        ".song-title",
        "h1:not(:has(a))"
      ]

      selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        text = element.text&.strip
        return text if text.present? && text != "Cifra Club"
      end

      # Last resort: extract from canonical URL path (may not have accents)
      canonical_url = doc.at_css("link[rel='canonical']")&.attr("href")
      if canonical_url
        uri = URI.parse(canonical_url)
        path_parts = uri.path&.split("/")&.reject(&:empty?)
        if path_parts&.length&.>= 2
          song_slug = path_parts[1]
          return song_slug.titleize.gsub("-", " ") if song_slug.present?
        end
      end

      nil
    end

    def extract_genre(doc)
      # Try to find genre in meta tags or structured data
      meta_genre = doc.at_css("meta[property='music:genre']")&.attr("content")
      return meta_genre if meta_genre.present?

      # Look for genre in breadcrumbs
      genre_link = doc.at_css(".breadcrumb a[href*='/estilos/']")
      return genre_link&.text&.strip if genre_link

      nil
    end

    def extract_key(doc)
      # Look for key information in various page elements
      key_selectors = [
        "[data-key]",
        "[data-tom]",
        ".key",
        ".tom",
        "#cifra_tom",
        ".cifra-tom",
        ".tonality",
        ".song-key",
        ".key-info"
      ]

      key_selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        text = element.attr("data-key") || element.attr("data-tom") || element.text
        key = extract_key_from_text(text)
        return key if key
      end

      # Look for key in page metadata/script data
      script_content = doc.css("script").map(&:text).join
      if script_content =~ /(?:tom|key|tonality)[":\s]+([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?\d*)/i
        key = extract_key_from_text($1)
        return key if key
      end

      # Search the entire page text for key patterns
      page_text = doc.text
      key_patterns = [
        /(?:tom|key|tonality)[:\s]+([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?\d*)/i,
        /no\s+tom\s+de[:\s]+([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?\d*)/i,
        /tom[:\s]+([A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?\d*)/i
      ]

      key_patterns.each do |pattern|
        match = page_text.match(pattern)
        if match
          key = extract_key_from_text(match[1])
          return key if key
        end
      end

      # Fallback: try to extract from tab content
      content = extract_tab_content(doc)
      if content
        # Look for patterns like "tom: Em" or "Key: Em" in the content
        match = content.match(/(?:tom|key|tonality)[:\s]+([A-G]#?(?:m|maj|min|dim|aug|sus|add)?\d*)/i)
        key = extract_key_from_text(match[1]) if match
        return key if key
      end

      nil
    end

    def extract_key_from_text(text)
      return nil if text.nil? || text.empty?

      # Clean the text
      key = text.strip

      # Handle common abbreviations (case insensitive)
      key = case key.downcase
      when "major", "maj" then "C"  # Default to C major if just "major"
      when "minor", "min" then "Am"  # Default to A minor if just "minor"
      else key
      end

      # Validate it's a proper musical key format
      # Allow: C, C#, Cb, Cm, Cmaj, Cmin, etc.
      return key if key.match?(/^[A-G][#b]?[m]?(?:maj|min|dim|aug|sus|add)?\d*$/i)

      nil
    end

    def normalize_tab(doc, url)
      content = extract_tab_content(doc)
      raise ParseError, "Tab content not found in page" if content.to_s.strip.empty?

      capo = extract_capo(doc)
      tuning_name, tuning_strings = extract_tuning(doc)
      key = extract_key(doc)
      youtube_urls = extract_youtube_urls(url)
      youtube_lesson_url = youtube_urls[:lesson]

      # Determine instrument based on content first, fallback to URL
      instrument = analyze_content_for_instrument(content, url)

      # Extract metadata for content cleaning
      artist_name = extract_artist_name(doc)
      song_title = extract_song_title(doc)

      # Check if song already exists and has YouTube URLs to avoid expensive extraction
      skip_youtube_extraction = false
      if artist_name.present? && song_title.present?
        existing_artist = Artist.find_by("LOWER(name) = ?", artist_name.downcase)
        if existing_artist
          existing_song = existing_artist.songs.find_by("LOWER(title) = ?", song_title.downcase)
          if existing_song&.youtube_music_url.present?
            Rails.logger.info "Skipping YouTube extraction - song already has YouTube URL: #{artist_name} - #{song_title}"
            skip_youtube_extraction = true
          end
        end
      end

      # Extract YouTube URLs unless we already have them
      youtube_urls = skip_youtube_extraction ? { lesson: nil, music: nil } : extract_youtube_urls(url)
      youtube_lesson_url = youtube_urls[:lesson]

      # Clean redundant header info from content
      content = sanitize_tab_content(content, {
        artist_name: artist_name,
        song_title: song_title,
        capo: capo
      })

      {
        instrument: instrument,
        tab_type: determine_tab_type(content),
        content: content,
        difficulty: extract_difficulty(doc),
        capo: capo,
        key: key,
        views_count: extract_views_count(doc),
        version_name: extract_version_name(doc, url),
        source_url: url,
        tuning: {
          name: tuning_name || default_tuning_name(instrument),
          strings: tuning_strings || default_tuning_strings(instrument)
        },
        youtube_lesson_url: youtube_lesson_url,
        youtube_music_url: youtube_urls[:music]
      }
    end

    def extract_tab_content(doc)
      # Look for the main tab content container
      content_selectors = [
        ".cifra_cnt",
        ".cifra-content",
        ".tab-content",
        "[data-cy='cifra-content']",
        ".js-cifra-cnt"
      ]

      content_selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        # Get text content and decode HTML entities
        content = decode_html_entities(element.text)
        return content if content.present?
      end

      # Fallback: look for preformatted content or divs with chord/tab classes
      tab_div = doc.at_css("pre, .tab, .chords")
      return decode_html_entities(tab_div.text) if tab_div

      # Last resort: extract all text that looks like chords/tabs
      # This is less reliable but better than nothing
      body = doc.at_css("body")
      return extract_tab_like_content(decode_html_entities(body.text)) if body

      nil
    end

    def extract_tab_like_content(text)
      lines = text.lines
      tab_lines = []

      lines.each do |line|
        # Keep lines that contain chords, tab notation, or section markers
        if line.match?(/\[(?:Intro|Verse|Chorus|Bridge|Outro|Solo|Tab|Pre-Chorus|Cifra|Refrão|Primeira Parte)\]/i) ||
           line.match?(/^[A-G]#?(?:maj|min|m|dim|aug|sus|add)?\d*(?:\/[A-G]#?)?/) ||
           line.match?(/^\|[-\d\s]+\|$/) ||  # Tab lines like |---|---|---|
           line.match?(/^[eBGDAE]\|/)        # String indicators
          tab_lines << line.strip
        end
      end

      tab_lines.join("\n")
    end

    def extract_capo(doc)
      # Look for capo information
      capo_selectors = [
        ".capo",
        ".capo-info",
        "[data-capo]",
        ".js-capo",
        "#cifra_capo"
      ]

      capo_selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        text = element.text&.strip
        # Extract number from text like "Capo 2", "2ª casa", "Capotraste na 2ª casa", etc.
        match = text.match(/(?:capo|capotraste)\s*(?:na\s*)?(\d+)[\sª]*casa/i)
        return match[1].to_i if match
      end

      # Look for capo in page title or description
      title = doc.at_css("title")&.text
      if title && title.match?(/capo|capotraste/i)
        match = title.match(/(?:capo|capotraste)\s*(?:na\s*)?(\d+)/i)
        return match[1].to_i if match
      end

      # Look for capo in the main content
      content = extract_tab_content(doc)
      if content
        match = content.match(/(?:capo|capotraste)\s*(?:na\s*)?(\d+)[\sª]*casa/i)
        return match[1].to_i if match
      end

      nil
    end

    def extract_tuning(doc)
      # Cifra Club usually uses standard tuning, but check for explicit tuning
      tuning_selectors = [
        ".tuning",
        ".tuning-info",
        "[data-tuning]"
      ]

      tuning_selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        text = element.text&.strip
        return [ text, parse_tuning_strings(text) ] if text.present?
      end

      # Check for tuning in the tab content
      content = extract_tab_content(doc)
      if content
        # Look for Portuguese tuning patterns with colon
        match = content.match(/(?:afinação|tuning)[:\s]+([A-G][#b]?(?:\s+[A-G][#b]?)+)/i)
        if match
          tuning_text = match[1].strip
          return [ tuning_text, parse_tuning_strings(tuning_text) ]
        end

        # Look for Portuguese tuning patterns without colon (e.g., "AFINAÇÃO DROP D ( D A D G B E )")
        match = content.match(/(?:afinação|tuning)\s+(.+?)\(\s*([A-G][#b]?(?:\s+[A-G][#b]?)+)\s*\)/i)
        if match
          tuning_name = match[1].strip
          tuning_strings = match[2].strip
          return [ "#{tuning_name} (#{tuning_strings})", parse_tuning_strings(tuning_strings) ]
        end

        # Look for simple Portuguese tuning with just strings (e.g., "AFINAÇÃO D A D G B E")
        match = content.match(/(?:afinação|tuning)\s+([A-G][#b]?(?:\s+[A-G][#b]?)+)/i)
        if match
          tuning_text = match[1].strip
          return [ tuning_text, parse_tuning_strings(tuning_text) ]
        end
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

    def determine_tab_type(content)
      # Cifra Club doesn't distinguish between chords and tabs like Ultimate Guitar
      # All Cifra Club content is just musical notation, so return nil
      nil
    end

    def determine_instrument(url)
      return "drums" if url.include?("bateria") || url.include?("drum")
      return "bass" if url.include?("baixo") || url.include?("bass")
      "guitar"  # Default for Cifra Club
    end

    # Analyze tab content to determine actual instrument
    # Prioritizes URL-based detection for explicit instrument indicators, then content analysis
    def analyze_content_for_instrument(content, url)
      # First priority: URL-based detection for explicit instrument indicators
      # These are reliable and should override content analysis
      if url.include?("baixo") || url.include?("bass")
        Rails.logger.info "[CifraClub] URL indicates bass tab: #{url}"
        return "bass"
      end

      if url.include?("bateria") || url.include?("drum")
        Rails.logger.info "[CifraClub] URL indicates drum tab: #{url}"
        return "drums"
      end

      # Second priority: explicit instrument detection from content
      return "guitar" if has_guitar_notation?(content)
      return "bass" if has_bass_notation?(content)
      return "drums" if has_drum_notation?(content)

      # Third priority: check for mixed content (guitar + bass strings)
      # If we have both guitar and bass strings, it's likely guitar with bass notation
      has_guitar_strings = content.match?(/^[eEBGDAE]\s*[\|\:]/)
      has_bass_strings = content.match?(/^[GDAE]\s*[\|\:]/)

      if has_guitar_strings && has_bass_strings
        Rails.logger.info "[CifraClub] Mixed guitar/bass notation detected, classifying as guitar: #{url}"
        return "guitar"
      end

      # Fourth priority: check for chord-only content (likely guitar)
      has_chords_only = content.match?(/[A-G][#b]?(?:maj|min|m|dim|aug|sus|add|7M|7|9|11|13)/) &&
                       !content.match?(/^[eEBGDAE]\s*[\|\:]/) &&
                       !content.match?(/^[GDAE]\s*[\|\:]/)

      if has_chords_only && content.lines.count > 5
        Rails.logger.info "[CifraClub] Chord-only content detected, classifying as guitar: #{url}"
        return "guitar"
      end

      # Last resort: URL-based detection for less explicit cases
      instrument = determine_instrument(url)

      Rails.logger.warn "[CifraClub] Using fallback URL-based instrument detection for #{url}: #{instrument}"

      instrument
    end

    # Check if content contains guitar tablature notation
    def has_guitar_notation?(content)
      return false if content.blank?

      # Check for 6-string guitar patterns (E|A|D|G|B|e)
      has_guitar_strings = content.match?(/^[eEBGDAE]\s*[\|\:]/)
      has_fret_numbers = content.match?(/^[eEBGDAE]\s*[\|\:][^\n]*[\d]/)
      has_chords = content.match?(/[A-G][#b]?(?:maj|min|m|dim|aug|sus|add|7M|7|9|11|13)/)

      # Strong signal: guitar strings + fret numbers OR chords
      (has_guitar_strings && has_fret_numbers) ||
      (has_guitar_strings && has_chords) ||
      (has_chords && content.lines.count > 10)
    end

    # Check if content contains bass tablature notation
    def has_bass_notation?(content)
      return false if content.blank?

      # Check for 4-string bass patterns WITHOUT high guitar strings
      has_bass_strings = content.match?(/^[GDAE]\s*[\|\:]/)
      no_high_strings = !content.match?(/^[eEB]\s*[\|\:]/)
      has_fret_numbers = content.match?(/^[GDAE]\s*[\|\:][^\n]*[\d]/)

      has_bass_strings && no_high_strings && has_fret_numbers
    end

    # Check if content contains drum notation
    def has_drum_notation?(content)
      return false if content.blank?

      # Check for drum-specific notation patterns (CC=crash, HH=hihat, BD=bass drum, SN=snare, etc.)
      content.match?(/^\s*(?:CC|HH|BD|SN|FT|MT|HT|LT|RC|CR|Cr|Ri|Ch|Cx|T[123]|Su|Bu)\s*[\|\-xo]/m) ||
      content.match?(/^\s*[CHSB]\s+[\|\-xo]/m)
    end

    def default_tuning_name(instrument)
      case instrument
      when "guitar" then "Standard"
      when "bass" then "Standard Bass"
      when "drums" then nil  # Drums don't have tuning
      else "Standard"
      end
    end

    def default_tuning_strings(instrument)
      case instrument
      when "guitar" then %w[E A D G B E]
      when "bass" then %w[E A D G]
      when "drums" then [ "Drums" ]  # Placeholder for drums
      else %w[E A D G B E]
      end
    end

    def extract_difficulty(doc)
      # Look for difficulty information on Cifra Club pages
      # Cifra Club shows difficulty in version lists like "Simplificada Iniciante"

      # Check URL for version indicators and map to known difficulties
      url = doc.at_css("link[rel='canonical']")&.attr("href") || ""
      if url.include?("simplificada")
        return normalize_difficulty("Iniciante")
      end

      # Look for difficulty in the HTML structure
      # Find the current version's difficulty in the versions table
      current_version_link = doc.at_css(".list-versions a[href*='#{url.split('/').last}']")
      if current_version_link
        # The difficulty is in the next span element after the version name
        difficulty_span = current_version_link.at_css("span:nth-child(2)")
        if difficulty_span
          difficulty = difficulty_span.text&.strip
          return normalize_difficulty(difficulty) if difficulty.present? && difficulty.match?(/^(Iniciante|Básico|Intermediário|Avançado|Expert)$/i)
        end
      end

      # Fallback: look in the page content
      content = doc.text
      difficulty_patterns = [
        /(Iniciante|Básico|Intermediário|Avançado|Expert)\s+\d/i,  # difficulty followed by number
        /(?:dificuldade|difficulty)[:\s]*(Iniciante|Básico|Intermediário|Avançado|Expert)/i
      ]

      difficulty_patterns.each do |pattern|
        match = content.match(pattern)
        return normalize_difficulty(match[1].strip) if match
      end

      nil
    end

    def normalize_difficulty(difficulty)
      return nil if difficulty.nil?

      # Ensure proper UTF-8 encoding
      normalized = difficulty.strip.force_encoding("UTF-8").scrub

      case normalized.downcase
      when "iniciante", "básico", "absolute beginner"
        "beginner"
      when "intermediário"
        "intermediate"
      when "avançado", "expert"
        "advanced"
      when "beginner", "intermediate", "advanced"
        # Already normalized
        normalized
      else
        nil
      end
    end


    def extract_views_count(doc)
      # Look for view count in various formats
      selectors = [
        ".containerExibitions .exib"
      ]

      selectors.each do |selector|
        element = doc.at_css(selector)
        next unless element

        count = element.attr("data-views") || element.text
        integer = parse_view_count(count)
        return integer if integer && integer > 0
      end

      # Fallback: search for "exibições" pattern in the entire page content
      content = doc.text
      if content =~ /(\d{1,3}(?:\.\d{3})*)\s*exibições?/i
        integer = parse_view_count($1)
        return integer if integer && integer > 0
      end

      nil
    end

    def parse_view_count(count_text)
      return nil if count_text.nil? || count_text.empty?

      # Remove any non-numeric characters except dots (thousands separators)
      # and convert dots to empty strings for Brazilian number format
      cleaned = count_text.strip
                    .gsub(/[^\d.]/, "")  # Keep only digits and dots
                    .gsub(".", "")       # Remove thousands separators

      integer = cleaned.to_i
      integer > 0 ? integer : nil
    rescue
      nil
    end

    def extract_youtube_urls(url)
      # Use Selenium to extract both YouTube lesson and music URLs
      return { lesson: nil, music: nil } unless url.present?

      Rails.logger.info "Attempting to extract YouTube URLs from #{url}"

      options = Selenium::WebDriver::Chrome::Options.new
      options.add_argument("--headless=new")
      options.add_argument("--no-sandbox")
      options.add_argument("--disable-dev-shm-usage")
      options.add_argument("--disable-gpu")
      options.add_argument("--disable-blink-features=AutomationControlled")
      options.add_argument("--window-size=1920,1080")
      options.add_argument("user-agent=#{user_agent}")
      options.binary = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

      # Use 'eager' page load strategy - don't wait for images/ads to fully load
      options.page_load_strategy = :eager

      driver = nil
      youtube_lesson_url = nil
      youtube_music_url = nil

      begin
        driver = Selenium::WebDriver.for :chrome, options: options

        # # Set page load timeout to avoid hanging
        driver.manage.timeouts.page_load = 10
        driver.manage.timeouts.implicit_wait = 2

        Rails.logger.debug "Loading page with Selenium: #{url}"

        # Use a non-blocking page load strategy to avoid timeout from ads
        driver.get(url)

        # Wait for page to load and look for VideoAula button
        wait = Selenium::WebDriver::Wait.new(timeout: 5)

        # Try to find and click the VideoAula button
        video_lesson_button = driver.find_element(css: "#side-video")

        # Click the lesson button if found
        if video_lesson_button
          begin
            # Use JavaScript click to avoid "element click intercepted" errors from modals
            driver.execute_script("arguments[0].scrollIntoView(true);", video_lesson_button)
            sleep(0.5)  # Give time for scroll
            driver.execute_script("arguments[0].click();", video_lesson_button)
            sleep(1)  # Give time for the video player to load

            Rails.logger.debug "Waiting for YouTube iframe to appear"

            # Wait for YouTube iframe or video to appear
            iframe = wait.until do
              driver.find_element(css: "iframe[src*='youtube.com'], iframe[src*='youtu.be']")
            end

            # Extract YouTube URL from iframe
            iframe_src = iframe.attribute("src")
            Rails.logger.debug "Found iframe with src: #{iframe_src}"

            if iframe_src
              youtube_lesson_url = extract_youtube_url_from_text(iframe_src)
              if youtube_lesson_url
                Rails.logger.info "Successfully extracted YouTube lesson URL: #{youtube_lesson_url}"
              else
                Rails.logger.warn "Failed to parse YouTube URL from iframe src: #{iframe_src}"
              end
            end
          rescue Selenium::WebDriver::Error::TimeoutError
            Rails.logger.debug "Timeout waiting for lesson video iframe on #{url}"
            # Continue - still try to extract music video
          rescue StandardError => e
            Rails.logger.debug "Error extracting lesson video: #{e.message}"
            # Continue - still try to extract music video
          end
        end

        # Now try to extract music video URL from #js-pl-v element
        Rails.logger.debug "Looking for music video player (#js-pl-v)"
        begin
          music_player = driver.find_element(css: "#js-pl-v")
          if music_player
            Rails.logger.debug "Found music player element"

            # Scroll to the music player to ensure it's visible and loaded
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", music_player)
            sleep(1)  # Give time for scroll

            # Try to click the play button if it exists (player might be in init state)
            play_button = music_player.find_element(css: ".player-placeholder") rescue nil
            if play_button
              Rails.logger.debug "Found play button in music player, clicking it"
              driver.execute_script("arguments[0].click();", play_button)
              sleep(2)  # Give time for video player to initialize
            end

            # Look for YouTube iframe in the music player
            music_iframe = music_player.find_element(css: "iframe[src*='youtube.com'], iframe[src*='youtu.be']") rescue nil
            if music_iframe
              music_iframe_src = music_iframe.attribute("src")
              Rails.logger.debug "Found music iframe with src: #{music_iframe_src}"
              youtube_music_url = extract_youtube_url_from_text(music_iframe_src) if music_iframe_src
              Rails.logger.info "Successfully extracted YouTube music URL: #{youtube_music_url}" if youtube_music_url
            end
          end
        rescue Selenium::WebDriver::Error::NoSuchElementError
          Rails.logger.debug "No music video player found on #{url}"
        rescue StandardError => e
          Rails.logger.debug "Error extracting music video URL: #{e.message}"
        end

      rescue Selenium::WebDriver::Error::TimeoutError => e
        Rails.logger.debug "Timeout waiting for videos on #{url}: #{e.message}"
        # Continue - may still have extracted one of the URLs
      rescue Selenium::WebDriver::Error::WebDriverError => e
        Rails.logger.warn "Selenium error extracting YouTube URLs from #{url}: #{e.message}"
        # Continue - may still have extracted one of the URLs
      rescue StandardError => e
        Rails.logger.error "Unexpected error extracting YouTube URLs from #{url}: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.first(5).join("\n")
        # Continue - may still have extracted one of the URLs
      ensure
        # Always quit the driver to avoid hanging processes
        if driver
          Rails.logger.debug "Closing Selenium driver"
          driver.quit
        end
      end

      { lesson: youtube_lesson_url, music: youtube_music_url }
    end

    def extract_youtube_music_url(doc)
      # Extract YouTube music video URL from the player section
      # The URL is embedded in the #js-pl-v element's data attributes or iframe
      player_section = doc.at_css("#js-pl-v")
      return nil unless player_section

      # Try to find YouTube iframe in the player section
      iframe = player_section.at_css("iframe[src*='youtube.com'], iframe[src*='youtu.be']")
      if iframe
        iframe_src = iframe.attr("src")
        return extract_youtube_url_from_text(iframe_src) if iframe_src
      end

      # Try to find YouTube URL in data attributes
      data_video = player_section.attr("data-video") || player_section.attr("data-yt")
      if data_video
        return extract_youtube_url_from_text(data_video)
      end

      # Try to find YouTube URL in any child elements
      player_html = player_section.to_html
      extract_youtube_url_from_text(player_html)
    end

    def extract_youtube_url_from_text(text)
      return nil if text.nil? || text.empty?

      # YouTube URL patterns
      patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
      ]

      patterns.each do |pattern|
        match = text.match(pattern)
        if match
          video_id = match[1]
          return "https://www.youtube.com/watch?v=#{video_id}"
        end
      end

      nil
    end

    def extract_version_name(doc, url = nil)
      # Check URL for version indicators first - only exact matches to avoid parsing URL paths
      if url
        return "Simplified" if url.include?("simplificada")
        return "Original" if url.include?("original")
      end

      # Check for version indicators in title only - be very conservative to avoid false matches
      title = doc.at_css("title")&.text
      if title
        title_lower = title.downcase

        # Check for complete multi-word phrases first
        return "Ao Vivo" if title_lower.include?("ao vivo")
        return "Unplugged" if title_lower.include?("unplugged")
        return "Acoustic" if title_lower.include?("acoustic") && !title_lower.include?("electric")

        # Look for standalone version keywords (not part of other words)
        version_indicators = {
          "acoustic" => "Acoustic",
          "solo" => "Solo",
          "intro" => "Intro",
          "outro" => "Outro",
          "live" => "Live",
          "fingerstyle" => "Fingerstyle",
          "electric" => "Electric",
          "original" => "Original",
          "simplificada" => "Simplified",
          "acustico" => "Acústico",
          "desconectado" => "Desconectado",
          "eletrico" => "Elétrico"
        }

        # Only match if the keyword appears as a separate word/component in the title
        version_indicators.each do |keyword, display_name|
          # Use word boundaries and check that this isn't part of a URL path
          if title_lower.match?(/\b#{Regexp.escape(keyword)}\b/i)
            # Additional check: make sure this isn't extracting from a URL-like string
            next if title.include?("/") && title.split("/").any? { |part| part.downcase.include?(keyword) }
            Rails.logger.debug "[CifraClub] Found version '#{display_name}' in title: #{title}"
            return display_name
          end
        end
      end

      # Never try to parse URL paths or other content for version names
      Rails.logger.debug "[CifraClub] No version found for URL: #{url}"
      nil
    end

    def sanitize_tab_content(content, metadata)
      return content if content.nil? || content.empty?

      lines = content.lines
      removed_lines = 0
      max_lines_to_check = 15

      lines_to_remove = []

      lines.each_with_index do |line, index|
        break if index >= max_lines_to_check

        stripped = line.strip
        next if stripped.empty?

        # Skip lines that are section markers (we want to keep these)
        next if stripped.match?(/^\[?(?:Intro|Verse|Chorus|Bridge|Outro|Solo|Tab|Pre-Chorus|Cifra|Refrão|Primeira Parte|Segunda Parte|Pré-Refrão|Interlude|Instrumental)/i)

        if redundant_header_line?(stripped, metadata)
          lines_to_remove << index
          removed_lines += 1
        else
          # Once we hit a non-redundant, non-empty line, stop checking
          break if removed_lines > 0 && index > removed_lines + 3
        end
      end

      # Remove the identified lines
      lines_to_remove.reverse.each { |i| lines.delete_at(i) }

      # Remove leading empty lines
      lines.shift while lines.first&.strip&.empty?

      content = lines.join

      # Remove key information from anywhere in the content
      # Patterns like "tom: Em", "Key: Em", "tom: Ebm (forma dos acordes no tom de Dm)"
      content = content.gsub(/(?:^|\n)\s*(?:tom|key)\s*[:=]?\s*[A-G][#b]?(?:m|maj|min|dim|aug|sus|add)?\d*(?:\s*\([^)]*\))?\s*(?:\n|$)/i, "")

      # Remove capo information from anywhere in the content
      # Patterns like "Capotraste na 1ª casa", "Capo na 2ª casa", etc.
      content = content.gsub(/(?:^|\n)\s*(?:capo|capotraste)\s*(?:na\s*)?\d+[\sª]*casa\s*(?:\n|$)/i, "")

      # Remove tuning information and headers
      # Remove tuning headers like "Standard Tuning", "Tuning:", etc.
      content = content.gsub(/(?:^|\n)\s*(?:standard\s+)?tuning\s*[:=]?\s*(?:\n|$)/i, "")
      # Remove Portuguese tuning patterns like "Afinação: Db Ab Db Gb Bb Eb"
      content = content.gsub(/(?:^|\n)\s*(?:afinação|tuning)\s*[:=]?\s*[A-G][#b]?(?:\s+[A-G][#b]?)+\s*(?:\n|$)/i, "")
      # Remove Portuguese tuning patterns like "AFINAÇÃO DROP D ( D A D G B E )"
      content = content.gsub(/(?:^|\n)\s*(?:afinação|tuning)\s+.+\(\s*[A-G][#b]?(?:\s+[A-G][#b]?)+\s*\)\s*(?:\n|$)/i, "")
      # Remove simple Portuguese tuning like "AFINAÇÃO D A D G B E"
      content = content.gsub(/(?:^|\n)\s*(?:afinação|tuning)\s+[A-G][#b]?(?:\s+[A-G][#b]?)+\s*(?:\n|$)/i, "")
      # Remove tuning string listings like "E A D G B E"
      content = content.gsub(/(?:^|\n)\s*(?:[A-G][#b]?\s+){5,}[A-G][#b]?\s*(?:\n|$)/i, "")

      content
    end

    def redundant_header_line?(line, metadata)
      line_lower = line.downcase.strip

      # Remove common header patterns
      return true if line_lower.match?(/^(standard\s+)?tuning\s*[:=]?\s*/i)
      return true if line_lower.match?(/^standard\s+tuning$/i)
      return true if line_lower.match?(/^afinação\s+.+\(\s*[a-g][#b]?(?:\s+[a-g][#b]?)*\s*\)/i)  # "AFINAÇÃO DROP D ( D A D G B E )"
      return true if line_lower.match?(/^afinação\s+[a-g][#b]?(?:\s+[a-g][#b]?)+/i)  # "AFINAÇÃO D A D G B E"
      return true if line_lower.match?(/^capo\s*(on)?\s*\d+$/i)
      return true if line_lower.match?(/^capo\s*[:=]\s*\d+$/i)
      return true if line_lower.match?(/^capo\s+\d+\s*(st|nd|rd|th)?\s*(fret)?$/i)
      return true if line_lower.match?(/^\d+[\sª]*casa$/i)  # Portuguese "2ª casa"
      return true if line_lower.match?(/^no\s+capo$/i)
      return true if line_lower.match?(/^key\s*[:=]?\s*[a-g][#b]?(m|min|maj|major|minor)?$/i)
      return true if line_lower.match?(/^tom\s*[:=]?\s*[a-g][#b]?(m|min|maj|major|minor)?$/i)

      # Check if line matches song title or artist
      artist_name = metadata[:artist_name]&.to_s&.downcase&.strip
      song_title = metadata[:song_title]&.to_s&.downcase&.strip

      if artist_name.present? && song_title.present?
        combined_patterns = [
          "#{song_title} - #{artist_name}",
          "#{artist_name} - #{song_title}",
          song_title,
          artist_name
        ]

        combined_patterns.each do |pattern|
          clean_line = line_lower.gsub(/[^\w\s]/, "").gsub(/\s+/, " ").strip
          clean_pattern = pattern.gsub(/[^\w\s]/, "").gsub(/\s+/, " ").strip

          return true if clean_line == clean_pattern
          return true if clean_line.start_with?(clean_pattern) && clean_line.length < clean_pattern.length + 20
        end
      end

      false
    end

    def find_or_create_artist!(name)
      name = decode_html_entities(name.to_s).strip

      # Try accent-insensitive match first (broader search)
      normalized_name = normalize_for_search(name)
      existing = Artist.all.find do |artist|
        normalize_for_search(artist.name) == normalized_name
      end
      return existing if existing

      # Try exact case-insensitive match
      existing = Artist.where("LOWER(name) = ?", name.downcase).first
      return existing if existing

      Artist.create!(name: name)
    rescue ActiveRecord::RecordNotUnique
      # Race condition - try finding again
      Artist.all.find do |artist|
        normalize_for_search(artist.name) == normalize_for_search(name)
      end || Artist.where("LOWER(name) = ?", name.downcase).first || Artist.find_by!(name: name)
    end

    def normalize_for_search(text)
      return text unless text.is_a?(String)
      begin
        # Force UTF-8 encoding
        text = text.force_encoding("UTF-8").scrub
        # Use Rails' transliterate for accent removal
        I18n.transliterate(text).downcase.strip
      rescue
        # Fallback to simple downcase if transliterate fails
        text.downcase.strip
      end
    end

    def find_or_create_song!(artist, title, genre: nil)
      title = decode_html_entities(title.to_s).strip

      # Try accent-insensitive match first (broader search)
      normalized_title = normalize_for_search(title)
      existing = artist.songs.find do |song|
        normalize_for_search(song.title) == normalized_title
      end
      return existing if existing

      # Try exact case-insensitive match
      existing = artist.songs.where("LOWER(title) = ?", title.downcase).first
      return existing if existing

      song = Song.find_or_create_by!(artist: artist, title: title)
    rescue ActiveRecord::RecordNotUnique
      song = artist.songs.find do |s|
               normalize_for_search(s.title) == normalize_for_search(title)
             end || artist.songs.where("LOWER(title) = ?", title.downcase).first || Song.find_by!(artist_id: artist.id, title: title)
    ensure
      if song && genre.present? && song.genre.blank?
        song.update!(genre: genre)
      end
    end

    def find_or_create_tuning!(instrument, tuning_attrs)
      # Drums don't have tuning
      return nil if instrument == "drums"

      name = tuning_attrs.fetch(:name).to_s.strip
      strings = tuning_attrs.fetch(:strings)
      strings = Array(strings).map(&:to_s) if strings.present?

      # Normalize tuning name - if it looks like string notes, give it a proper name
      name = normalize_tuning_name(name, strings, instrument)

      # First, try to find an existing tuning with the same strings (regardless of name)
      if strings.present?
        existing_tunings = Tuning.where(instrument: instrument).select do |t|
          t.strings.present? && t.strings.map(&:to_s).sort == strings.map(&:to_s).sort
        end

        if existing_tunings.any?
          # Prefer tunings with proper names over string-based names
          proper_named = existing_tunings.find { |t| !t.name.match?(/^[A-G]/) }
          return proper_named if proper_named

          # Otherwise return the first one
          return existing_tunings.first
        end
      end

      # Otherwise, find or create by name
      tuning = Tuning.find_or_create_by!(instrument: instrument, name: name) do |t|
        t.strings = strings if strings.present?
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
      standard_tunings = {
        "guitar" => %w[E A D G B E],
        "bass" => %w[E A D G],
        "ukulele" => %w[G C E A],
        "cavaquinho" => %w[D G B D]
      }

      # If name is empty or looks like string notes
      if name.blank? || (strings.present? && name.match?(/^[A-Ga-g]#?\s*[-\s]\s*[A-Ga-g]/i))
        # Check if it matches a standard tuning
        standard = standard_tunings[instrument.to_s.downcase]
        if standard && strings.present? && strings.map(&:upcase) == standard.map(&:upcase)
          return instrument == "bass" ? "Standard Bass" : "Standard"
        end

        # If we have strings but no good name, derive a name from the pattern
        if strings.present?
          return strings.join(" ")
        end

        # For instruments without strings (like drums), return a default name
        return instrument == "drums" ? "Standard Drums" : "Standard"
      end

      name
    end

    def decode_html_entities(text)
      return text unless text.is_a?(String)
      begin
        # Force UTF-8 encoding to avoid encoding issues
        text = text.force_encoding("UTF-8").scrub
        @html_coder ||= HTMLEntities.new
        @html_coder.decode(text)
      rescue
        # Return original text if decoding fails
        text
      end
    end

    def content_similarity(content1, content2)
      return 1.0 if content1 == content2
      return 0.0 if content1.blank? || content2.blank?

      # Simple similarity based on common lines
      lines1 = content1.lines.map(&:strip).reject(&:empty?)
      lines2 = content2.lines.map(&:strip).reject(&:empty?)

      return 0.0 if lines1.empty? && lines2.empty?

      intersection = (lines1 & lines2).length
      union = (lines1 | lines2).length

      intersection.to_f / union.to_f
    end

    def completeness_score(tab_attrs)
      content = tab_attrs[:content].to_s
      score = 0

      # Length indicates completeness
      length_score = [ content.length / 100, 20 ].min
      score += length_score

      # Presence of sections indicates better structure
      section_patterns = [
        /\[intro\]/i, /\[verse\]/i, /\[chorus\]/i, /\[bridge\]/i, /\[outro\]/i,
        /\[refrão\]/i, /\[primeira parte\]/i, /\[segunda parte\]/i, /\[pré-refrão\]/i
      ]

      sections_found = section_patterns.count { |pattern| content.match?(pattern) }
      score += [ sections_found * 3, 15 ].min

      # Chord progression complexity
      chord_count = content.scan(/[A-G]#?(?:maj|min|m|dim|aug|sus|add)?\d*(?:\/[A-G]#?)?/).uniq.length
      chord_score = [ chord_count / 2, 15 ].min
      score += chord_score

      score
    end

    def content_quality_score(tab_attrs)
      content = tab_attrs[:content].to_s
      score = 0

      # Well-formatted content (has line breaks and structure)
      lines = content.lines.length
      score += 5 if lines > 10  # Multi-section tab

      # Has tablature if it's a tab (not just chords)
      if tab_attrs[:tab_type] == "tab" && content.match?(/^\|[-\d\s]+\|$/)
        score += 3
      end

      # Proper capo indication if present
      score += 2 if tab_attrs[:capo].present? && tab_attrs[:capo] > 0

      score
    end

    # Generate lyrics URL from tab URL
    def lyrics_url_from_tab_url(tab_url)
      return nil unless tab_url.include?("cifraclub.com.br")

    # Convert tab URL to lyrics URL by replacing or adding /letra/
    if tab_url.match?(/\/tabs-\w+\/$/)
      # Has instrument suffix like /tabs-guitar/, replace with /letra/
      tab_url.sub(/\/tabs-\w+\/$/, "/letra/")
    else
      # No instrument suffix, add /letra/ before the trailing slash
      tab_url.sub(/\/$/, "/letra/")
    end
  end

  # Extract lyrics content from a lyrics page
  def extract_lyrics_content(doc)
    # Look for lyrics content - try most specific selectors first
    content_selectors = [
      ".letra", # Main lyrics container
      "[data-cy='letra-content']", # Most specific - data attribute
      ".letra-cnt", # Container for lyrics
      ".letra-content", # Direct content container
      ".lyrics-content", # Alternative content container
      ".cifra_cnt .letra", # Inside tab container (fallback)
      ".cifra-content .letra" # Inside content container (fallback)
    ]

    content_selectors.each do |selector|
      elements = doc.css(selector)
      elements.each do |element|
        # Skip elements that are too large (likely contain whole page)
        next if element.text.length > 10000

        # Extract text content, preserving line breaks and paragraph structure
        # First, let's get the raw inner HTML and process it more carefully
        html_content = element.inner_html

        # Replace <br> tags with newlines
        html_content = html_content.gsub(/<br\s*\/?>/i, "\n")

        # Replace paragraph and div tags with double newlines to separate stanzas
        html_content = html_content.gsub(/<\/p>/i, "\n\n")
        html_content = html_content.gsub(/<\/div>/i, "\n\n")

        # Remove all other HTML tags
        html_content = html_content.gsub(/<[^>]+>/, "")

        # Decode HTML entities
        content = decode_html_entities(html_content).strip

        # Skip if content looks like HTML/CSS (contains curly braces, @media, etc.)
        next if content.include?("{") || content.include?("@") || content.include?("position: absolute")

        # Skip if content is too short (likely not actual lyrics)
        next if content.length < 50

        # Check if it looks like lyrics (has line breaks and reasonable structure)
        # PRESERVE empty lines for paragraph breaks
        lines = content.split("\n").map(&:strip)
        non_empty_lines = lines.reject(&:empty?)
        next unless non_empty_lines.length >= 3 # Lyrics should have multiple lines

        # Check if most lines start with capital letters or are short (verse markers)
        lyric_like_lines = non_empty_lines.count do |line|
          line.start_with?(/[A-Z]/) || line.length <= 3 || (line.start_with?("[") && line.end_with?("]"))
        end
        next unless lyric_like_lines >= non_empty_lines.length * 0.6 # At least 60% look like lyrics

        # Filter out translation content - stop when we encounter Portuguese text
        # that indicates the start of a translation
        filtered_lines = []
        lines.each do |line|
          # Stop if we encounter clear Portuguese translation indicators
          break if line.downcase.start_with?("estou")  # "I'm tired" in Portuguese
          break if line.downcase.start_with?("cansado")  # "Tired" in Portuguese
          break if line.downcase.start_with?("sentindo")  # "Feeling" in Portuguese
          break if line.downcase.include?("tradução")  # Translation header

          filtered_lines << line
        end

        # Make sure we have enough content after filtering (counting non-empty lines)
        next unless filtered_lines.reject(&:empty?).length >= 3

        # Clean up excessive empty lines (more than 2 consecutive)
        result = filtered_lines.join("\n").gsub(/\n{3,}/, "\n\n")
        return result
      end
    end

    # If no suitable lyrics content found with specific selectors, return nil
    # This prevents accidentally scraping large HTML chunks
    nil
  end
  end
end
