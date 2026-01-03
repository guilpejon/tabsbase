class ChordDiscoveryService
  include TabsHelper

  # Extract and register chords from a single tab
  def self.discover_from_tab(tab)
    new.discover_from_tab(tab)
  end

  # Full database scan to discover all chords
  def self.discover_all
    new.discover_all
  end

  def discover_from_tab(tab)
    return [] if tab.content.blank?
    return [] if tab.instrument == "bass" # Skip bass tabs
    return [] if tab.instrument == "drums" # Skip drum tabs

    # Extract unique chords from tab content using TabsHelper
    chord_names = extract_unique_chords(tab.content, tab)

    chord_names.filter_map do |name|
      register_chord(name)
    end
  rescue => e
    Rails.logger.error "Failed to discover chords from tab #{tab.id}: #{e.message}"
    []
  end

  def discover_all
    discovered = []
    total_tabs = Tab.where.not(instrument: [ "bass", "drums" ]).count

    Rails.logger.info "Starting chord discovery across #{total_tabs} tabs..."

    Tab.where.not(instrument: [ "bass", "drums" ]).find_each(batch_size: 100) do |tab|
      chords = discover_from_tab(tab)
      discovered.concat(chords)

      if discovered.size % 100 == 0
        Rails.logger.info "Discovered #{discovered.size} chord instances across #{discovered.map(&:name).uniq.size} unique chords..."
      end
    end

    unique_count = discovered.map(&:name).uniq.size
    Rails.logger.info "✅ Discovery complete! Found #{unique_count} unique chords across #{discovered.size} instances"

    discovered
  end

  private

  def register_chord(name)
    # Normalize chord name
    normalized = normalize_chord_name(name)
    return nil if normalized.blank?

    # Find or create chord
    chord = Chord.find_or_initialize_by(name: normalized)

    if chord.new_record?
      chord.usage_count = 1
      Rails.logger.info "  🎸 Discovered new chord: #{normalized}"
      chord.save!
    else
      chord.record_usage!
    end

    chord
  rescue ActiveRecord::RecordNotUnique
    # Race condition - chord was created by another process
    Chord.find_by(name: normalized)&.tap(&:record_usage!)
  rescue => e
    Rails.logger.error "Failed to register chord '#{name}': #{e.message}"
    nil
  end

  def normalize_chord_name(name)
    return nil if name.blank?

    # Clean up chord name
    name = name.strip
    name = name.gsub(/\s+/, "") # Remove spaces

    # Normalize Latin/Romance language note names (Portuguese/Spanish/Italian)
    # DO, RE, MI, FA, SOL, LA, SI → C, D, E, F, G, A, B
    name = name.sub(/^DO([^A-Z]|$)/, 'C\1')
    name = name.sub(/^RE([^A-Z]|$)/, 'D\1')
    name = name.sub(/^MI([^A-Z]|$)/, 'E\1')
    name = name.sub(/^FA([^A-Z]|$)/, 'F\1')
    name = name.sub(/^SOL([^A-Z]|$)/, 'G\1')
    name = name.sub(/^LA([^A-Z]|$)/, 'A\1')
    name = name.sub(/^SI([^A-Z]|$)/, 'B\1')

    # Normalize German notation: H -> B
    # In German music notation, H = B and B = Bb
    # Simply replace H at start with B (covers H, Hm, H7, Hb, HM, Hsus, etc.)
    name = name.sub(/^H([^A-Z]|$)/, 'B\1')

    # Normalize enharmonic equivalents
    # B# = C, E# = F, Cb = B, Fb = E
    name = name.sub(/^B#/, "C")
    name = name.sub(/^E#/, "F")
    name = name.sub(/^Cb/, "B")
    name = name.sub(/^Fb/, "E")
    # Also handle B#m → Cm, E#m → Fm, etc.
    name = name.sub(/^B#m/, "Cm")
    name = name.sub(/^E#m/, "Fm")

    # Remove redundant slash chords: E/E -> E, A/A -> A, etc.
    # Pattern: Same root note on both sides of slash
    name = name.gsub(/^([A-G][#b]?)\/\1$/, '\1')

    # Normalize Brazilian notation
    name = name.gsub(/7M/, "maj7") # 7M -> maj7
    name = name.gsub(/Δ/, "maj") # Delta symbol -> maj

    # Ensure first character is uppercase
    name = name[0].upcase + name[1..-1] if name.present?

    name
  end
end
