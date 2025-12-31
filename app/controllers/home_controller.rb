class HomeController < ApplicationController
  def index
    @query = params[:q].to_s.strip
    @instrument = params[:instrument].to_s.strip.presence

    tabs = Tab
      .joins(song: :artist)
      .includes(:tuning, song: :artist)

    # Filter by instrument if selected
    if @instrument.present?
      tabs = tabs.where(instrument: @instrument)
    end

    if @query.present?
      q = "%#{@query}%"
      tabs = tabs.where(
        "artists.name ILIKE :q OR songs.title ILIKE :q",
        q: q
      )

      tabs = tabs.order("artists.name ASC, songs.title ASC, tabs.instrument ASC, tabs.created_at DESC")
    else
      tabs = tabs.order("tabs.created_at DESC")
    end

    @pagy, @tabs = pagy(tabs)

    # Get available instruments for the filter
    @instruments = Tab.distinct.pluck(:instrument).compact.sort
  end
end


