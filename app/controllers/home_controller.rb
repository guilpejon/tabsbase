class HomeController < ApplicationController
  def index
    @query = params[:q].to_s.strip
    @instrument = params[:instrument].to_s.strip.presence
    @tab_type = params[:tab_type].to_s.strip.presence
    @version = params[:version].to_s.strip.presence

    @has_active_search = @query.present? || @instrument.present? || @tab_type.present? || @version.present?

    if @has_active_search
      tabs = Tab
        .joins(song: :artist)
        .includes(:tuning, song: :artist)

      # Filter by instrument if selected
      if @instrument.present?
        tabs = tabs.where(instrument: @instrument)
      end

      # Filter by tab type if selected
      if @tab_type.present?
        tabs = tabs.where(tab_type: @tab_type)
      end

      # Filter by version if selected
      if @version.present?
        tabs = tabs.where(version_name: @version)
      end

      if @query.present?
        # Use PostgreSQL unaccent for efficient accent-insensitive search
        normalized_query = "%#{normalize_for_search(@query)}%"
        tabs = tabs.where(
          "LOWER(UNACCENT(artists.name)) LIKE :q OR LOWER(UNACCENT(songs.title)) LIKE :q",
          q: normalized_query
        )

        tabs = tabs.order("artists.name ASC, songs.title ASC, tabs.instrument ASC, tabs.created_at DESC")
      else
        tabs = tabs.order("tabs.created_at DESC")
      end

      # Pagy v43 API: pagy(:offset, collection)
      @pagy, @tabs = pagy(:offset, tabs)

      # Group tabs by artist for display
      if @query.present?
        @grouped_tabs = @tabs.group_by(&:artist)
      end
    else
      # No active search - show top 20 artists by combined views and tab count
      @top_artists = Artist
        .joins(:tabs)
        .group("artists.id")
        .select("artists.*, COUNT(tabs.id) AS tabs_count, SUM(tabs.views_count) AS total_views")
        .order("total_views DESC, tabs_count DESC")
        .limit(20)
    end

    # Get available options for filters
    @instruments = Tab.distinct.pluck(:instrument).compact.sort
    @tab_types = Tab.distinct.pluck(:tab_type).compact.sort
    @versions = Tab.distinct.pluck(:version_name).compact.sort
  end
end
