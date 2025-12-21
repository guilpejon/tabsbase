module TabsHelper
  TAB_BLOCK_RE = /\[tab\](.*?)\[\/tab\]/m
  CHORD_RE = /\[ch\](.*?)\[\/ch\]/m
  
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
    "&apos;" => "'",     # Apostrophe
  }.freeze

  # Renders Ultimate Guitar-style markup contained in Tab#content.
  #
  # Currently supported:
  # - [tab]...[/tab] blocks: rendered as a distinct preformatted block
  # - [ch]...[/ch] chords: rendered as styled inline spans (style differs inside/outside [tab])
  def render_ug_content(content)
    return "" if content.blank?

    text = content.to_s
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

  def render_ug_tab_block(text)
    inner_html = ug_inline_format(text.to_s, chord_variant: :mono)

    # Use whitespace-pre to preserve formatting, and overflow-x: auto for horizontal scroll
    # as a fallback when JavaScript wrapping doesn't trigger (instead of overflow-wrap: anywhere
    # which causes ugly character-level breaks)
    content_tag(
      :pre,
      inner_html,
      class: "m-0 text-sm leading-6 text-slate-900 whitespace-pre font-mono overflow-x-auto"
    )
  end

  # Section markers that should have spacing before them
  SECTION_MARKERS = /^\s*\[(?:Verse|Chorus|Bridge|Break|Intro|Outro|Pre-Chorus|Post-Chorus|Interlude|Solo|Instrumental|Hook|Refrain).*\]/i

  def render_ug_text_block(text)
    # Normalize spacing - remove all blank lines within blocks
    normalized = text.to_s.gsub(/\n{2,}/, "\n").strip
    html = ug_inline_format(normalized, chord_variant: :inline)

    # Add top margin if this block starts with a section marker
    starts_with_section = normalized.match?(SECTION_MARKERS)
    
    # Check if content uses multiple consecutive spaces for alignment (like chord diagrams)
    # If so, use whitespace-pre to preserve the formatting
    # Use 6+ consecutive spaces as threshold to avoid false positives from chord progressions
    uses_spacing_alignment = normalized.match?(/      +/) # 6+ consecutive spaces
    
    if uses_spacing_alignment
      css_class = "whitespace-pre text-sm leading-6 text-slate-900 font-mono overflow-x-auto"
    else
      css_class = "whitespace-pre-line text-sm leading-6 text-slate-900 font-mono"
    end
    css_class += " mt-6" if starts_with_section

    content_tag(
      :div,
      html,
      class: css_class,
      style: uses_spacing_alignment ? nil : "overflow-wrap: anywhere;"
    )
  end

  def ug_inline_format(text, chord_variant:)
    # First decode HTML entities from the source (e.g., &rsquo; -> ')
    decoded = decode_html_entities(text)
    
    # Then escape for safe HTML output
    escaped = ERB::Util.h(decoded)

    escaped = escaped.gsub(CHORD_RE) do
      chord = Regexp.last_match(1).to_s
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
    result.gsub(/&#(\d+);/) { [$1.to_i].pack("U") }
          .gsub(/&#x([0-9a-fA-F]+);/) { [$1.to_i(16)].pack("U") }
  end

  def chord_span(chord, variant:)
    # Decode any HTML entities in chord names, then escape for safe HTML output
    chord_decoded = decode_html_entities(chord)
    chord_escaped = ERB::Util.h(chord_decoded)

    # All chords get the same black badge style for consistency
    # Using inline instead of inline-block allows better line wrapping on mobile
    %(<span class="inline rounded bg-slate-900 px-1 py-0.5 text-xs font-semibold text-white whitespace-nowrap">#{chord_escaped}</span>)
  end
end


