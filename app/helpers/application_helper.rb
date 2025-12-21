module ApplicationHelper
  include Pagy::Frontend

  # Custom pagination nav with Tailwind styling
  def pagy_tailwind_nav(pagy)
    return "" if pagy.pages < 2

    html = +%(<nav class="flex items-center justify-center gap-1" aria-label="Pagination">)

    # Previous button
    if pagy.prev
      html << link_to("←", pagy_url_for(pagy, pagy.prev),
        class: "px-3 py-2 text-sm rounded-md hover:bg-slate-100",
        aria: { label: "Previous page" })
    else
      html << %(<span class="px-3 py-2 text-sm text-slate-300">←</span>)
    end

    # Page numbers
    pagy.series.each do |item|
      case item
      when Integer
        html << link_to(item.to_s, pagy_url_for(pagy, item),
          class: "px-3 py-2 text-sm rounded-md hover:bg-slate-100")
      when String # current page
        html << %(<span class="px-3 py-2 text-sm rounded-md bg-slate-900 text-white">#{item}</span>)
      when :gap
        html << %(<span class="px-2 py-2 text-slate-400">…</span>)
      end
    end

    # Next button
    if pagy.next
      html << link_to("→", pagy_url_for(pagy, pagy.next),
        class: "px-3 py-2 text-sm rounded-md hover:bg-slate-100",
        aria: { label: "Next page" })
    else
      html << %(<span class="px-3 py-2 text-sm text-slate-300">→</span>)
    end

    html << %(</nav>)
    html.html_safe
  end
end
