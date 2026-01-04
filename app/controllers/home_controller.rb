class HomeController < ApplicationController
  def index
    @query = params[:q].to_s.strip
    @instrument = params[:instrument].to_s.strip.presence
    @tab_type = params[:tab_type].to_s.strip.presence
    @version = params[:version].to_s.strip.presence
    @difficulty = params[:difficulty].to_s.strip.presence

    @has_active_search = @query.present? || @instrument.present? || @tab_type.present? || @version.present? || @difficulty.present?

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

      # Filter by difficulty if selected
      if @difficulty.present?
        tabs = tabs.where(difficulty: @difficulty)
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
        # For filtered searches without text query, order by popularity first, then recency
        tabs = tabs.order("tabs.views_count DESC, tabs.created_at DESC")
      end

      # Pagy v43 API: pagy(:offset, collection)
      @pagy, @tabs = pagy(:offset, tabs)

      # Group tabs by artist for display (always group when there's an active search)
      @grouped_tabs = @tabs.group_by(&:artist)
    else
      # No active search - show popular content and navigation options
      @top_tabs = Tab
        .includes(:tuning, song: :artist)
        .order(views_count: :desc)
        .limit(20)

      @instrument_counts = Tab.group(:instrument).count

      @difficulty_counts = Tab.group(:difficulty).count.slice(*@difficulties).transform_values { |v| v || 0 }

      @top_artists = Artist
        .joins(:tabs)
        .group("artists.id")
        .select("artists.*, COUNT(tabs.id) AS tabs_count, SUM(tabs.views_count) AS total_views")
        .order("total_views DESC, tabs_count DESC")
        .limit(12)
    end

    # Get available options for filters
    @instruments = Tab.distinct.pluck(:instrument).compact.sort
    @tab_types = Tab.distinct.pluck(:tab_type).compact.sort
    @versions = Tab.distinct.pluck(:version_name).compact.sort
    @difficulties = [ "beginner", "intermediate", "advanced" ]
  end
end
