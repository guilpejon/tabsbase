module TabsHelper
  TAB_BLOCK_RE = /\[tab\](.*?)\[\/tab\]/m
  CHORD_RE = /\[ch\](.*?)\[\/ch\]/m
  # Regex for inline chords (not wrapped in [ch] tags)
  # Matches chord patterns like: C, C7, Cm, Cmaj7, C#dim, Db9, etc.
  # Requires uppercase root note to avoid matching English words like "am"
  INLINE_CHORD_RE = /(?<=\W|^)[A-G][#b]?(?:maj|min|m|dim|aug|sus\d*|add\d*|7M|7|9|11|13|6|5|4|2|1|0|º|°)*(?:\([^)]+\))?(?:\/[A-G][#b]?)?(?=\W|$)/


  # Check if content contains any chords (tagged or inline)
  def tab_has_chords?(content, tab = nil)
    return false if content.blank?
    # Skip chord detection for bass tabs
    return false if tab&.instrument&.downcase == "bass"
    # Check for tagged chords
    return true if content.to_s.match?(CHORD_RE)
    # Check for actual inline chords (not just tablature string names)
    extract_unique_chords(content, tab).present?
  end

  # Extract all unique chord names from content, preserving order of first appearance
  def extract_unique_chords(content, tab = nil)
    return [] if content.blank?
    # Skip chord extraction for bass tabs
    return [] if tab&.instrument&.downcase == "bass"

    chords = []
    seen = Set.new

    # Extract from tagged chords [ch]...[/ch]
    content.to_s.scan(CHORD_RE) do |match|
      chord = decode_html_entities(match[0].to_s.strip)
      unless chord.blank? || seen.include?(chord)
        seen.add(chord)
        chords << chord
      end
    end

    # Extract from inline chords
    content.to_s.scan(INLINE_CHORD_RE) do |match|
      chord = match.to_s.strip
      next if chord.blank? || seen.include?(chord)

      # Filter out likely false positives:
      # - Single lowercase letters that are common in words (like 'a' in 'casa')
      next if chord.length == 1 && chord.match?(/^[a-z]$/)

      # Filter out tablature string labels (chord followed by tablature indicators)
      match_position = Regexp.last_match.offset(0)[0]
      following_text = content[match_position + chord.length, 100] || ""
      # Check for various tablature formats: |, :, -, etc. (including on next line)
      next if following_text.match?(/[\|:\-\|]+/)
      # Also check if this chord appears to be a tablature string name followed by dashes on the next line
      next if content[match_position..match_position + 200].match?(/^#{Regexp.escape(chord)}\s*\n\s*\|[\-\|]+/m)
      # Special check for single letters that might be tablature string names
      if chord.length == 1 && chord.match?(/^[A-G]$/)
        # Check if this looks like a tablature line (chord followed by |--- or similar)
        next if following_text.match?(/^\s*\|[\-\|]+/)
      end

      # Filter out chords in instructional text about strings/tuning
      context_start = [ 0, match_position - 50 ].max
      context_end = [ content.length, match_position + chord.length + 50 ].min
      surrounding_context = content[context_start..context_end]
      next if surrounding_context && surrounding_context.match?(/string|tune|tuning| capo|capotraste/i)

      seen.add(chord)
      chords << chord
    end

    chords
  end

  # Common HTML named entities that CGI.unescapeHTML doesn't handle
  HTML_ENTITIES = {
    "&rsquo;" => "'",    # Right single quote
    "&lsquo;" => "'",    # Left single quote
    "&rdquo;" => '"',    # Right double quote
    "&ldquo;" => '"',    # Left double quote
    "&mdash;" => "—",    # Em dash
    "&ndash;" => "–",    # En dash
    "&hellip;" => "…",   # Ellipsis
    "&nbsp;" => " ",     # Non-breaking space
    "&amp;" => "&",      # Ampersand (handle before others)
    "&lt;" => "<",       # Less than
    "&gt;" => ">",       # Greater than
    "&quot;" => '"',     # Quote
    "&apos;" => "'"     # Apostrophe
  }.freeze

  # Renders Ultimate Guitar-style markup contained in Tab#content.
  #
  # Currently supported:
  # - [tab]...[/tab] blocks: rendered as a distinct preformatted block
  # - [ch]...[/ch] chords: rendered as styled inline spans (style differs inside/outside [tab])
  def render_ug_content(content)
    return "DEBUG: content length #{content.to_s.length}" if content.blank?

    text = fix_malformed_chord_charts(content.to_s)

    # Add spacing before section markers for better readability
    text = add_section_spacing(text)

    # Check if this content contains [tab] blocks (Ultimate Guitar format)
    # If so, parse them individually - this takes precedence over other logic
    if text.match?(TAB_BLOCK_RE)
      # Continue to parse [tab] blocks below (don't return early)
    elsif has_tablature?(text)
      # Check if this is Cifra Club content (doesn't use [tab] tags)
      # If it contains tablature patterns, treat the whole thing as a tab block
      return render_ug_tab_block(text)
    end

    nodes = []
    cursor = 0
    tab_buffer = []

    flush_tab_buffer = lambda do
      next if tab_buffer.empty?
      # Join consecutive tab blocks with a blank line for visual separation
      merged = tab_buffer.join("\n\n")
      nodes << render_ug_tab_block(merged)
      tab_buffer.clear
    end

    text.to_enum(:scan, TAB_BLOCK_RE).each do
      m = Regexp.last_match

      between = text[cursor...m.begin(0)]
      if between.present?
        if tab_buffer.any? && between.match?(/\A[ \t\r\n]+\z/)
          # Keep only the semantic line breaks between consecutive [tab] blocks
          # (UG often has a newline between blocks, but we don't want extra vertical spacing).
        else
          flush_tab_buffer.call
          nodes << render_ug_text_block(between)
        end
      end

      inner = m[1].to_s
      # Avoid accidental blank lines caused by [tab]\n...\n[/tab]
      inner = inner.gsub(/\A[\r\n]+/, "").gsub(/[\r\n]+\z/, "")
      tab_buffer << inner

      cursor = m.end(0)
    end

    after = text[cursor..]
    if after.present?
      if tab_buffer.any? && after.match?(/\A[ \t\r\n]+\z/)
        flush_tab_buffer.call
      else
        flush_tab_buffer.call
        nodes << render_ug_text_block(after)
      end
    else
      flush_tab_buffer.call
    end

    # Wrap without adding vertical spacing so content reads like a normal document.
    content_tag(:div, safe_join(nodes), class: "space-y-0")
  end

  private

  def add_section_spacing(text)
    lines = text.lines
    result = []

    lines.each_with_index do |line, index|
      # Check if this line starts with a section marker (case-insensitive)
      is_section = line.strip.match?(/^\[(?:Intro|Verse|Chorus|Bridge|Break|Outro|Pre-Chorus|Post-Chorus|Interlude|Solo|Instrumental|Hook|Refrain|Primeira Parte|Segunda Parte|Terceira Parte|Quarta Parte|Pré-Refrão|Refrão|Ponte|Final)/i)

      # Add blank line before section marker (unless it's the first line or previous line is already blank)
      if is_section && index > 0 && !lines[index - 1].strip.empty?
        result << "\n"
      end

      result << line
    end

    result.join
  end

  def render_ug_tab_block(text)
    # Add spacing before section markers for better readability
    lines = text.to_s.lines
    result = []

    lines.each_with_index do |line, index|
      # Check if this line starts with a section marker
      is_section = line.strip.match?(/^\[(?:Intro|Verse|Chorus|Bridge|Break|Outro|Pre-Chorus|Post-Chorus|Interlude|Solo|Instrumental|Hook|Refrain|Primeira Parte|Segunda Parte|Terceira Parte|Pré-Refrão|Refrão|Ponte|Final)/i)

      # Add blank line before section marker (unless it's the first line or previous line is already blank)
      if is_section && index > 0 && !lines[index - 1].strip.empty?
        result << "\n"
      end

      result << line
    end

    processed_text = result.join

    inner_html = ug_inline_format(processed_text, chord_variant: :mono)

    # Don't use whitespace-pre - let JavaScript controller handle wrapping at natural break points
    # overflow-x-auto as fallback for very wide content
    content_tag(
      :pre,
      inner_html,
      class: "m-0 text-sm leading-6 text-slate-900 font-mono overflow-x-auto"
    )
  end

  # Section markers that should have spacing before them
  SECTION_MARKERS = /^\s*\[(?:Verse|Chorus|Bridge|Break|Intro|Outro|Pre-Chorus|Post-Chorus|Interlude|Solo|Instrumental|Hook|Refrain).*\]/i

  def has_tablature?(text)
    # Check for tablature patterns like |---|---|---| or string indicators like e| B| G| etc.
    # Also check for drum tablature patterns like Cr|, Ri|, Ch|, Cx|, T1|, T2|, Su|, BD|, SN|, HH|, etc.
    # And drum tablature with piece names like C |, H |, S |, B |
    standard_tab = text.match?(/^\|[-\d\s]+\|$/m)
    guitar_strings = text.match?(/^[eBGDAE]\s*\|/m)
    # Check for bass strings with various formats: G|, G :, G:-, G|| etc.
    bass_strings = (text.match?(/^[A-G][#b]?\s*:/m) || text.match?(/^[A-G][#b]?\s*-/m) || text.match?(/^[GDAE]\s*\|/m) || text.match?(/^[A-G][#b]?\|\|/m)) && (!text.match?(/^[eE]\s*:/m) && !text.match?(/^[eE]\s*\|/m) && !text.match?(/^[eE]\|\|/m))
    drum_pieces = text.match?(/^[CHSB]\s*\|/m) # Drum pieces: C |, H |, S |, B |
    other_indicators = text.match?(/Cr \|/) || text.match?(/Ri \|/) || text.match?(/Ch \|/)
    drum_notation = text.match?(/^(?:Cr|Ri|Ch|Cx|T1|T2|Su|Bu|BD|SN|HH|FT|MT|HT|SD|LT)\s*\|/m)

    standard_tab || guitar_strings || bass_strings || drum_pieces || other_indicators || drum_notation
  end

  def has_bass_tablature?(text)
    # Check if this is specifically bass tablature (typically 4 strings, various tunings)
    # Look for patterns that indicate bass tabs without guitar high strings
    # Common bass tunings: GDAE, GDAC#, etc. Various formats: G|, G :, G:-, G||
    has_bass_patterns = text.match?(/^[A-G][#b]?\s*:/m) || text.match?(/^[A-G][#b]?\s*-/m) || text.match?(/^[GDAE]\|/m) || text.match?(/^[A-G][#b]?\|\|/m)
    no_guitar_high_strings = !text.match?(/^[eE]\s*:/m) && !text.match?(/^[eE]\|/m) && !text.match?(/^[eE]\|\|/m)
    bass_indicators = text.match?(/bass/i) || text.match?(/baixo/i)

    (has_bass_patterns && no_guitar_high_strings) || bass_indicators
  end

  def has_grouped_tablature?(text)
    # Check if this tablature should be grouped together on mobile (no internal wrapping)
    # This includes guitar tabs (6 strings), bass tabs (4 strings) and drum tabs
    # These tabs are too dense to wrap effectively - use horizontal scroll instead
    has_tablature?(text)
  end

  def has_drum_tablature?(text)
    # Check for common drum notation patterns (both 2-letter and 1-letter with space)
    # Examples: BD|, SN|, HH|, CC|, Cr|, Ch|, C |, H |, S |, B |, etc.
    # Allow leading whitespace with ^\s*
    drum_patterns = [
      /^\s*(?:CC|HH|SD|BD|SN|FT|MT|HT|LT|RC|RD|CR|Cr|Ri|Ch|Cx|T1|T2|T3|Su|Bu)\s*[\|\-xo]/m,  # Two-letter drum notation
      /^\s*(?:C|H|S|B)\s+[\|\-xo]/m  # Single letter with space (C |, H |, S |, B |)
    ]
    drum_patterns.any? { |pattern| text.match?(pattern) }
  end

  def has_significant_lyrics?(content)
    return false if content.blank?

    lines = content.lines
    return false if lines.length < 10  # Too short to analyze

    tablature_lines = 0
    lyric_lines = 0

    lines.each do |line|
      stripped = line.strip
      next if stripped.empty?

      # Count tablature lines
      if stripped.match?(/^[A-G][#b]?(?:\s*[\|:\-]|[\|:\-])/) || stripped.match?(/^\|[-\d\s]+\|/)
        tablature_lines += 1
      # Count potential lyric lines (not section markers, not tablature, not too short)
      elsif !stripped.match?(/^\[.*\]$/) && !stripped.match?(/^\(.*\)$/) && stripped.length > 3
        lyric_lines += 1
      end
    end

    # Has significant lyrics if more than 5 lyric lines and lyrics > 10% of content
    lyric_lines > 5 && (lyric_lines.to_f / lines.length) > 0.1
  end

  def has_chord_lyrics_format?(text)
    lines = text.lines
    return false if lines.length < 10  # Need some content to analyze

    # Look for chord/lyrics patterns:
    # 1. Lines with just chords (short lines with chord symbols)
    # 2. Lines with lyrics (longer lines with text)
    # 3. Alternating pattern of short chord lines and longer lyric lines

    chord_lines = 0
    lyric_lines = 0
    total_lines = 0

    lines.each do |line|
      stripped = line.strip
      next if stripped.empty?

      total_lines += 1
      break if total_lines > 50  # Only check first 50 lines

      # Count chord lines (short lines that look like chords)
      if stripped.length <= 15 && stripped.match?(/[A-G]#?(?:maj|min|m|dim|aug|sus|add)?\d*(?:\/[A-G]#?)?/)
        chord_lines += 1
      # Count lyric lines (longer lines with text)
      elsif stripped.length > 15 && stripped.match?(/[a-zA-Z]/)
        lyric_lines += 1
      end
    end

    # If we have a significant number of both chord and lyric lines, it's likely chord/lyrics format
    chord_lines >= 3 && lyric_lines >= 3 && chord_lines + lyric_lines >= total_lines * 0.6
  end

  # Fix malformed chord charts where [tab] block ends too early
  # Pattern: [tab]...[/tab] followed by lines of fingering data (0-9, x, spaces)
  def fix_malformed_chord_charts(text)
    # Match [/tab] followed by lines that look like chord fingering rows
    # Fingering lines: mostly spaces, numbers 0-9, and 'x' characters
    # Handle both \n and \r\n line endings
    text.gsub(/\[\/tab\]((?:\r?\n[ \t]*[\d\sx]+)+)/i) do |_match|
      trailing_lines = Regexp.last_match(1)

      # Check if these lines are actually fingering data (not lyrics or chords)
      lines = trailing_lines.strip.split(/\r?\n/)
      all_fingering = lines.all? do |line|
        stripped = line.strip
        # Fingering line: only contains digits, x, and spaces, no letters except x
        stripped.match?(/^[\d\sx]+$/) && stripped.length > 0
      end

      if all_fingering && lines.length >= 2
        # Move the fingering lines inside the [tab] block
        "#{trailing_lines}[/tab]"
      else
        "[/tab]#{trailing_lines}" # Keep original if not fingering data
      end
    end
  end

  def render_ug_text_block(text)
    # Preserve blank lines (don't collapse them)
    # But limit excessive blank lines (more than 2 consecutive) to just 2
    normalized = text.to_s.gsub(/\n{3,}/, "\n\n").strip
    html = ug_inline_format(normalized, chord_variant: :inline)

    # Add top margin if this block starts with a section marker
    starts_with_section = normalized.match?(SECTION_MARKERS)

    # All text blocks use pre-wrap for wrapping and preserve whitespace/newlines
    css_class = "text-sm leading-6 text-slate-900 font-mono whitespace-pre-wrap"
    css_class += " mt-6" if starts_with_section

    content_tag(
      :div,
      html,
      class: css_class
    )
  end

  def ug_inline_format(text, chord_variant:)
    # First decode HTML entities from the source (e.g., &rsquo; -> ')
    decoded = decode_html_entities(text)

    # Escape the text for HTML safety
    escaped = ERB::Util.h(decoded)

    # Process tagged chords [ch]...[/ch] first
    escaped = escaped.gsub(CHORD_RE) do
      chord = Regexp.last_match(1).to_s
      chord_span(chord, variant: chord_variant)
    end

    # Process inline chords (skip any that are now inside chord spans)
    escaped = escaped.gsub(INLINE_CHORD_RE) do |match|
      chord = match.to_s
      # Filter out likely false positives: single lowercase letters in words
      next match if chord.length == 1 && chord.match?(/^[a-z]$/)

      # Skip if this match is inside a chord span
      match_position = Regexp.last_match.offset(0)[0]
      before_match = escaped[0, match_position]
      # Check if the most recent <span is not closed
      last_span_start = before_match.rindex("<span")
      last_span_end = before_match.rindex("</span>")
      # If there's an unclosed span, skip this match
      next match if last_span_start && (last_span_end.nil? || last_span_end < last_span_start)

      # Filter out tablature string labels (chord followed by tablature indicators in original text)
      match_position = Regexp.last_match.offset(0)[0]
      following_text = decoded[match_position + chord.length, 10] || ""
      # Check for various tablature formats: |, :, -, etc.
      next match if following_text.match?(/^[#b]?\s*[\|:\-]/)

      # Filter out chords in instructional text about strings/tuning
      context_start = [ 0, match_position - 50 ].max
      context_end = [ decoded.length, match_position + chord.length + 50 ].min
      surrounding_context = decoded[context_start..context_end]
      next match if surrounding_context && surrounding_context.match?(/string|tune|tuning| capo|capotraste/i)

      chord_span(chord, variant: chord_variant)
    end

    escaped.html_safe
  end

  def decode_html_entities(text)
    result = text.to_s
    HTML_ENTITIES.each do |entity, char|
      result = result.gsub(entity, char)
    end
    # Also handle numeric entities like &#39;
    result.gsub(/&#(\d+);/) { [ $1.to_i ].pack("U") }
          .gsub(/&#x([0-9a-fA-F]+);/) { [ $1.to_i(16) ].pack("U") }
  end

  def chord_span(chord, variant:)
    # Decode any HTML entities in chord names, then escape for safe HTML output
    chord_decoded = decode_html_entities(chord)
    chord_escaped = ERB::Util.h(chord_decoded)

    # All chords get the same black badge style for consistency
    # Using inline instead of inline-block allows better line wrapping on mobile
    # Added data-chord attribute for chord dictionary lookup
    "<span class=\"inline rounded bg-slate-900 px-1 py-0.5 text-xs font-semibold text-white whitespace-nowrap cursor-pointer hover:bg-slate-700 transition-colors\" data-chord=\"#{chord_escaped}\">#{chord_escaped}</span>".html_safe
  end
end
