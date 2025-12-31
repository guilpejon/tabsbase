module ApplicationHelper
  # Sanitize URL to prevent XSS (only allow http/https)
  def safe_external_url(url)
    return nil if url.blank?
    uri = URI.parse(url.to_s)
    %w[http https].include?(uri.scheme) ? url : nil
  rescue URI::InvalidURIError
    nil
  end

  # Custom Tailwind pagination for Pagy v43
  def pagy_tailwind_nav(pagy)
    return "".html_safe if pagy.pages < 2

    html = +%(<nav class="flex items-center gap-1" aria-label="Pagination">)

    # Previous button
    if pagy.page > 1
      html << link_to("←", url_for(request.query_parameters.merge(page: pagy.page - 1)), class: "px-3 py-2 text-sm rounded-md hover:bg-slate-100")
    else
      html << %(<span class="px-3 py-2 text-sm text-slate-300">←</span>)
    end

    # Page numbers with ellipsis
    (1..pagy.pages).each do |page_num|
      if page_num == pagy.page
        html << %(<span class="px-3 py-2 text-sm rounded-md bg-slate-900 text-white">#{page_num}</span>)
      elsif page_num == 1 || page_num == pagy.pages || (page_num >= pagy.page - 2 && page_num <= pagy.page + 2)
        html << link_to(page_num, url_for(request.query_parameters.merge(page: page_num)), class: "px-3 py-2 text-sm rounded-md hover:bg-slate-100")
      elsif page_num == 2 || page_num == pagy.pages - 1
        html << %(<span class="px-2 py-2 text-slate-400">…</span>)
      end
    end

    # Next button
    if pagy.page < pagy.pages
      html << link_to("→", url_for(request.query_parameters.merge(page: pagy.page + 1)), class: "px-3 py-2 text-sm rounded-md hover:bg-slate-100")
    else
      html << %(<span class="px-3 py-2 text-sm text-slate-300">→</span>)
    end

    html << %(</nav>)
    html.html_safe
  end
end
