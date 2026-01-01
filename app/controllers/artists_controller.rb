class ArtistsController < ApplicationController
  def index
    @letter = params[:letter].to_s.upcase.presence || "A"

    # Handle the "#" case (numeric artists)
    if @letter == "0-9" || @letter == "#"
      @letter = "0-9"
      artists = Artist.with_tabs.where("name ~ '^[0-9]'")
    elsif @letter.match?(/\A[A-Z]\z/)
      artists = Artist.with_tabs.where("UPPER(LEFT(name, 1)) = ?", @letter)
    else
      redirect_to artists_path(letter: "A") and return
    end

    artists = artists
      .joins(:tabs)
      .group("artists.id")
      .select("artists.*, COUNT(tabs.id) AS tabs_count, COALESCE(SUM(tabs.views_count), 0) AS total_views")
      .order(Arel.sql("COALESCE(SUM(tabs.views_count), 0) DESC, COUNT(tabs.id) DESC, artists.name ASC"))

    @pagy, @artists = pagy(:offset, artists, limit: 50)
  end

  def show
    @artist = Artist.find_by_slug!(params[:slug])

    tabs = @artist.tabs
      .includes(:tuning, song: :artist)

    # Apply filters
    @instrument = params[:instrument].to_s.strip.presence
    @tab_type = params[:tab_type].to_s.strip.presence
    @version = params[:version].to_s.strip.presence

    tabs = tabs.where(instrument: @instrument) if @instrument.present?
    tabs = tabs.where(tab_type: @tab_type) if @tab_type.present?
    tabs = tabs.where(version_name: @version) if @version.present?

    tabs = tabs.joins(:song).order("songs.title ASC, tabs.instrument ASC")

    @pagy, @tabs = pagy(:offset, tabs)

    # Get available options for filters (scoped to this artist)
    @instruments = @artist.tabs.distinct.pluck(:instrument).compact.sort
    @tab_types = @artist.tabs.distinct.pluck(:tab_type).compact.sort
    @versions = @artist.tabs.distinct.pluck(:version_name).compact.sort
  end
end
