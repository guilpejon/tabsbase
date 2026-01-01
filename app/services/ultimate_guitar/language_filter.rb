module UltimateGuitar
  # Filters tabs by language/script to only allow specific languages.
  #
  # Allowed languages: English, Spanish, Portuguese, Italian
  # These all use Latin script with similar character sets.
  #
  # This filter works by:
  # 1. Rejecting text with non-Latin scripts (Japanese, Chinese, Korean, Cyrillic, Arabic, etc.)
  # 2. Allowing Latin-based text through
  #
  # Note: This will also allow French, German, Dutch, etc. since they use Latin script.
  # For more precise filtering, a language detection gem would be needed.
  module LanguageFilter
    # Unicode ranges for scripts we want to REJECT
    NON_LATIN_SCRIPTS = [
      /\p{Hiragana}/,      # Japanese Hiragana
      /\p{Katakana}/,      # Japanese Katakana
      /\p{Han}/,           # Chinese/Japanese Kanji
      /\p{Hangul}/,        # Korean
      /\p{Cyrillic}/,      # Russian, Ukrainian, etc.
      /\p{Arabic}/,        # Arabic
      /\p{Hebrew}/,        # Hebrew
      /\p{Thai}/,          # Thai
      /\p{Devanagari}/,    # Hindi, Sanskrit
      /\p{Bengali}/,       # Bengali
      /\p{Tamil}/,         # Tamil
      /\p{Telugu}/,        # Telugu
      /\p{Greek}/,         # Greek
      /\p{Armenian}/,      # Armenian
      /\p{Georgian}/,      # Georgian
      /\p{Ethiopic}/,      # Amharic, etc.
      /\p{Myanmar}/,       # Burmese
      /\p{Khmer}/,         # Cambodian
      /\p{Lao}/,           # Lao
      /\p{Tibetan}/,       # Tibetan
      /\p{Sinhala}/,       # Sinhalese
      /\p{Gujarati}/,      # Gujarati
      /\p{Gurmukhi}/,      # Punjabi
      /\p{Kannada}/,       # Kannada
      /\p{Malayalam}/,     # Malayalam
      /\p{Oriya}/         # Oriya
    ].freeze

    class << self
      # Returns true if the text appears to be in an allowed language (Latin script)
      def allowed?(text)
        return true if text.blank?

        text = text.to_s

        # Check if text contains any non-Latin scripts
        NON_LATIN_SCRIPTS.none? { |pattern| text.match?(pattern) }
      end

      # Returns true if the text should be rejected (contains non-Latin scripts)
      def rejected?(text)
        !allowed?(text)
      end

      # Check both artist name and song title
      def allowed_content?(artist_name:, song_title:)
        allowed?(artist_name) && allowed?(song_title)
      end
    end
  end
end
