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
    # Avoid redundancy if name is basically the same as the strings
    strings_normalized = display_strings.gsub("-", " ").downcase
    name_normalized = name.to_s.downcase.strip

    if name_normalized == strings_normalized || name_normalized.gsub(/\s+/, "") == strings_normalized.gsub(/\s+/, "")
      # Name is same as strings, just show strings with a generic label
      "Custom (#{display_strings})"
    else
      "#{name} (#{display_strings})"
    end
  end

  def standard?
    name.to_s.downcase.strip == "standard"
  end
end
