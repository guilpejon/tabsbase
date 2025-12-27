class Tuning < ApplicationRecord
  has_many :tabs

  validates :name, presence: true
  validates :instrument, presence: true
  validates :strings, presence: true
  validates :name, uniqueness: { scope: :instrument }

  # Scopes
  scope :for_instrument, ->(instrument) { where(instrument: instrument) }
  scope :alphabetical, -> { order(:name) }

  def display_strings
    strings.is_a?(Array) ? strings.join("-") : ""
  end

  def full_name
    "#{name} (#{display_strings})"
  end
end

