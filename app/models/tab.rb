class Tab < ApplicationRecord
  belongs_to :song
  belongs_to :tuning
  has_one :artist, through: :song

  validates :content, presence: true
  validates :song_id, presence: true
  validates :instrument, presence: true
  validates :tuning_id, presence: true

  # Scopes
  scope :by_instrument, ->(instrument) { where(instrument: instrument) }
  scope :by_difficulty, ->(difficulty) { where(difficulty: difficulty) }
  scope :by_song, ->(song_id) { where(song_id: song_id) }
  scope :popular, -> { order(views_count: :desc) }
  scope :top_rated, -> { where.not(rating: nil).order(rating: :desc) }
  scope :recent, -> { order(created_at: :desc) }

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
    parts = [instrument.titleize]
    parts << tab_type.titleize if tab_type.present?
    parts << version_name.titleize if version_name.present?
    parts.join(" ")
  end
end

