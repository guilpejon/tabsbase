class Tab < ApplicationRecord
  belongs_to :song
  belongs_to :tuning, optional: true
  has_one :artist, through: :song

  delegate :lyrics, to: :song, allow_nil: true

  validates :content, presence: true
  validates :song_id, presence: true
  validates :instrument, presence: true
  validates :tuning_id, presence: true, unless: -> { instrument == "drums" }
  validates :slug, uniqueness: true, allow_nil: true

  # Default source for existing tabs
  before_validation :set_default_source, on: :create

  before_validation :generate_slug, on: :create
  before_save :generate_slug, if: :should_regenerate_slug?

  # Scopes
  scope :by_instrument, ->(instrument) { where(instrument: instrument) }
  scope :by_difficulty, ->(difficulty) { where(difficulty: difficulty) }
  scope :by_song, ->(song_id) { where(song_id: song_id) }
  scope :popular, -> { order(views_count: :desc) }
  scope :top_rated, -> { where.not(rating: nil).order(rating: :desc) }
  scope :recent, -> { order(created_at: :desc) }

  # Use slug in URLs
  def to_param
    slug || id.to_s
  end

  # Find by slug or ID
  def self.find_by_slug!(slug_or_id)
    find_by(slug: slug_or_id) || find(slug_or_id)
  end

  # Increment view count
  def increment_views!
    increment!(:views_count)
  end

  # Get artist name through song association
  def artist_name
    song.artist.name
  end

  def song_title
    song.title
  end

  def display_name
    "#{artist_name} - #{song_title}"
  end

  def tab_type_label
    parts = [ instrument.titleize ]
    parts << tab_type.titleize if tab_type.present?
    parts << version_name.titleize if version_name.present?
    parts.join(" ")
  end

  private

  def should_regenerate_slug?
    song_id_changed? || instrument_changed? || tab_type_changed? || version_name_changed?
  end

  def generate_slug
    return if song.blank?

    # Build slug from song title + instrument + type + version
    parts = [ song.title.parameterize ]
    parts << instrument.parameterize if instrument.present?
    parts << tab_type.parameterize if tab_type.present?
    parts << version_name.parameterize if version_name.present?

    base_slug = parts.join("-")
    new_slug = base_slug
    counter = 1

    while Tab.where(slug: new_slug).where.not(id: id).exists?
      counter += 1
      new_slug = "#{base_slug}-#{counter}"
    end

    self.slug = new_slug
  end

  def set_default_source
    self.source ||= determine_source_from_url
  end

  def determine_source_from_url
    return "ultimate_guitar" if source_url.blank?

    uri = URI.parse(source_url)
    host = uri.host&.downcase

    case host
    when /cifraclub\.com\.br/
      "cifra_club"
    when /ultimate-guitar\.com/, /tabs\.ultimate-guitar\.com/
      "ultimate_guitar"
    else
      "unknown"
    end
  rescue URI::InvalidURIError
    "unknown"
  end
end
