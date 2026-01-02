class ApplicationController < ActionController::Base
  # Pagy v43 uses Pagy::Method instead of Pagy::Backend
  include Pagy::Method

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  private

  # Normalize string by removing accents for accent-insensitive matching
  def normalize_for_search(text)
    return text unless text.is_a?(String)

    # Force UTF-8 encoding to avoid compatibility errors
    text = text.force_encoding("UTF-8").scrub

    # Manual transliteration for common accented characters
    text = text.dup
    {
      "á" => "a", "à" => "a", "ã" => "a", "â" => "a", "ä" => "a",
      "é" => "e", "è" => "e", "ê" => "e", "ë" => "e",
      "í" => "i", "ì" => "i", "î" => "i", "ï" => "i",
      "ó" => "o", "ò" => "o", "õ" => "o", "ô" => "o", "ö" => "o",
      "ú" => "u", "ù" => "u", "û" => "u", "ü" => "u",
      "ý" => "y", "ÿ" => "y",
      "ç" => "c", "ñ" => "n",
      "Á" => "A", "À" => "A", "Ã" => "A", "Â" => "A", "Ä" => "A",
      "É" => "E", "È" => "E", "Ê" => "E", "Ë" => "E",
      "Í" => "I", "Ì" => "I", "Î" => "I", "Ï" => "I",
      "Ó" => "O", "Ò" => "O", "Õ" => "O", "Ô" => "O", "Ö" => "O",
      "Ú" => "U", "Ù" => "U", "Û" => "U", "Ü" => "U",
      "Ý" => "Y", "Ÿ" => "Y",
      "Ç" => "C", "Ñ" => "N"
    }.each do |accented, plain|
      text.gsub!(accented, plain)
    end

    text.downcase.strip
  end
end
