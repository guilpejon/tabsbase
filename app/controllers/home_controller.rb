class HomeController < ApplicationController
  def index
    @query = params[:q].to_s.strip

    tabs = Tab
      .joins(song: :artist)
      .includes(:tuning, song: :artist)

    if @query.present?
      q = "%#{@query}%"
      tabs = tabs.where(
        "artists.name ILIKE :q OR songs.title ILIKE :q OR tabs.instrument ILIKE :q",
        q: q
      )

      tabs = tabs.order("artists.name ASC, songs.title ASC, tabs.instrument ASC, tabs.created_at DESC")
    else
      tabs = tabs.order("tabs.created_at DESC")
    end

    @pagy, @tabs = pagy(tabs)
  end
end


