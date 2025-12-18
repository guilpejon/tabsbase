module TabsHelper
  TAB_BLOCK_RE = /\[tab\](.*?)\[\/tab\]/m
  CHORD_RE = /\[ch\](.*?)\[\/ch\]/m

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
      merged = tab_buffer.join("\n")
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

    content_tag(
      :pre,
      inner_html,
      class: "m-0 overflow-x-auto rounded-lg text-sm leading-5 text-slate-900 whitespace-pre font-mono"
    )
  end

  def render_ug_text_block(text)
    html = ug_inline_format(text.to_s, chord_variant: :inline)

    content_tag(
      :div,
      html,
      class: "whitespace-pre-wrap text-sm leading-5 text-slate-900"
    )
  end

  def ug_inline_format(text, chord_variant:)
    escaped = ERB::Util.h(text)

    escaped = escaped.gsub(CHORD_RE) do
      chord = Regexp.last_match(1).to_s
      chord_span(chord, variant: chord_variant)
    end

    escaped.html_safe
  end

  def chord_span(chord, variant:)
    chord_escaped = ERB::Util.h(chord)

    case variant
    when :mono
      %(<span class="text-indigo-700 font-semibold">#{chord_escaped}</span>)
    else
      %(<span class="inline-block rounded bg-slate-900 px-1.5 py-0.5 text-xs font-semibold text-white align-baseline">#{chord_escaped}</span>)
    end
  end
end


