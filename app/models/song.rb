class Song < ApplicationRecord
  belongs_to :artist
  has_many :tabs, dependent: :destroy

  validates :title, presence: true
  validates :artist_id, presence: true

  # Scopes
  scope :with_tabs, -> { joins(:tabs).distinct }
  scope :by_artist, ->(artist_id) { where(artist_id: artist_id) }
  scope :alphabetical, -> { order(:title) }
  scope :recent, -> { order(created_at: :desc) }

  # Instance methods
  def full_name
    "#{artist.name} - #{title}"
  end

  def tab_count
    tabs.count
  end

  def instruments_available
    tabs.pluck(:instrument).uniq
  end
end

