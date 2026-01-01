class Artist < ApplicationRecord
  has_many :songs, dependent: :destroy
  has_many :tabs, through: :songs

  validates :name, presence: true, uniqueness: true
  validates :slug, uniqueness: true, allow_nil: true

  before_validation :generate_slug, on: :create
  before_save :generate_slug, if: :name_changed?

  # Scopes
  scope :with_tabs, -> { joins(:tabs).distinct }
  scope :alphabetical, -> { order(:name) }

  # Use slug in URLs
  def to_param
    slug || id.to_s
  end

  # Find by slug or ID
  def self.find_by_slug!(slug_or_id)
    find_by(slug: slug_or_id) || find(slug_or_id)
  end

  # Instance methods
  def tab_count
    tabs.count
  end

  def song_count
    songs.count
  end

  private

  def generate_slug
    return if name.blank?

    base_slug = name.parameterize
    new_slug = base_slug
    counter = 1

    while Artist.where(slug: new_slug).where.not(id: id).exists?
      counter += 1
      new_slug = "#{base_slug}-#{counter}"
    end

    self.slug = new_slug
  end
end
