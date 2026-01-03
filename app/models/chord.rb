class Chord < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :usage_count, numericality: { greater_than_or_equal_to: 0 }

  # Record usage of this chord (increment count)
  def record_usage!
    increment!(:usage_count)
  end

  # Check if fingering exists for an instrument
  def has_fingering?(instrument = "guitar")
    fingerings&.dig(instrument).present?
  end

  # Scopes
  scope :ordered_by_usage, -> { order(usage_count: :desc) }
  scope :with_fingerings, -> { where.not(fingerings: nil) }
  scope :without_fingerings, -> { where(fingerings: nil) }
end
