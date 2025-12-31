class Artist < ApplicationRecord
  has_many :songs, dependent: :destroy
  has_many :tabs, through: :songs

  validates :name, presence: true, uniqueness: true

  # Scopes
  scope :with_tabs, -> { joins(:tabs).distinct }
  scope :alphabetical, -> { order(:name) }

  # Instance methods
  def tab_count
    tabs.count
  end

  def song_count
    songs.count
  end
end
