namespace :chords do
  desc "Find all unique chords in tabs that are missing chord definitions"
  task missing: :environment do
    require "set"

    # Load chord data
    chord_data_path = Rails.root.join("app/javascript/chord_data.js")
    chord_data_content = File.read(chord_data_path)

    # Extract defined chords from each instrument section
    guitar_chords = extract_chord_names(chord_data_content, "GUITAR_CHORDS")
    ukulele_chords = extract_chord_names(chord_data_content, "UKULELE_CHORDS")
    cavaquinho_chords = extract_chord_names(chord_data_content, "CAVAQUINHO_CHORDS")
    piano_chords = extract_chord_names(chord_data_content, "PIANO_CHORDS")

    puts "=== Defined Chords ==="
    puts "Guitar:     #{guitar_chords.size} chords"
    puts "Ukulele:    #{ukulele_chords.size} chords"
    puts "Cavaquinho: #{cavaquinho_chords.size} chords"
    puts "Piano:      #{piano_chords.size} chords"
    puts ""

    # Extract all chords from tabs
    chord_regex = /\[ch\](.*?)\[\/ch\]/
    all_chords = Set.new
    chord_usage = Hash.new(0)

    Tab.find_each do |tab|
      tab.content.to_s.scan(chord_regex) do |match|
        chord = match[0].strip
        # Normalize - decode HTML entities
        chord = CGI.unescapeHTML(chord)
        all_chords.add(chord)
        chord_usage[chord] += 1
      end
    end

    puts "=== Chords Found in Tabs ==="
    puts "Total unique chords: #{all_chords.size}"
    puts ""

    # Find missing chords for each instrument
    missing_guitar = all_chords - guitar_chords
    missing_ukulele = all_chords - ukulele_chords
    missing_cavaquinho = all_chords - cavaquinho_chords
    missing_piano = all_chords - piano_chords

    # Sort by usage (most used first)
    sorted_missing_guitar = missing_guitar.sort_by { |c| -chord_usage[c] }
    sorted_missing_ukulele = missing_ukulele.sort_by { |c| -chord_usage[c] }
    sorted_missing_cavaquinho = missing_cavaquinho.sort_by { |c| -chord_usage[c] }
    sorted_missing_piano = missing_piano.sort_by { |c| -chord_usage[c] }

    # Missing from ALL instruments (highest priority)
    missing_all = missing_guitar & missing_ukulele & missing_cavaquinho & missing_piano
    sorted_missing_all = missing_all.sort_by { |c| -chord_usage[c] }

    puts "=== Missing from ALL Instruments (#{sorted_missing_all.size} chords) ==="
    sorted_missing_all.first(100).each do |chord|
      puts "  #{chord.ljust(15)} (used #{chord_usage[chord]} times)"
    end
    puts "  ... and #{sorted_missing_all.size - 100} more" if sorted_missing_all.size > 100
    puts ""

    puts "=== Missing from Guitar Only (#{(missing_guitar - missing_all).size} chords) ==="
    (sorted_missing_guitar - sorted_missing_all.to_a).first(50).each do |chord|
      puts "  #{chord.ljust(15)} (used #{chord_usage[chord]} times)"
    end
    puts ""

    puts "=== Missing from Ukulele Only (#{(missing_ukulele - missing_all).size} chords) ==="
    (sorted_missing_ukulele - sorted_missing_all.to_a).first(50).each do |chord|
      puts "  #{chord.ljust(15)} (used #{chord_usage[chord]} times)"
    end
    puts ""

    puts "=== Missing from Cavaquinho Only (#{(missing_cavaquinho - missing_all).size} chords) ==="
    (sorted_missing_cavaquinho - sorted_missing_all.to_a).first(50).each do |chord|
      puts "  #{chord.ljust(15)} (used #{chord_usage[chord]} times)"
    end
    puts ""

    puts "=== Missing from Piano Only (#{(missing_piano - missing_all).size} chords) ==="
    (sorted_missing_piano - sorted_missing_all.to_a).first(50).each do |chord|
      puts "  #{chord.ljust(15)} (used #{chord_usage[chord]} times)"
    end
    puts ""

    # Summary
    puts "=== Summary ==="
    puts "Missing from Guitar:     #{missing_guitar.size}"
    puts "Missing from Ukulele:    #{missing_ukulele.size}"
    puts "Missing from Cavaquinho: #{missing_cavaquinho.size}"
    puts "Missing from Piano:      #{missing_piano.size}"
    puts "Missing from ALL:        #{missing_all.size}"
  end

  desc "List all unique chords used in tabs"
  task list: :environment do
    chord_regex = /\[ch\](.*?)\[\/ch\]/
    chord_usage = Hash.new(0)

    Tab.find_each do |tab|
      tab.content.to_s.scan(chord_regex) do |match|
        chord = CGI.unescapeHTML(match[0].strip)
        chord_usage[chord] += 1
      end
    end

    puts "=== All Chords (sorted by usage) ==="
    chord_usage.sort_by { |_, count| -count }.each do |chord, count|
      puts "#{chord.ljust(20)} #{count}"
    end
    puts ""
    puts "Total unique chords: #{chord_usage.size}"
  end

  private

  def extract_chord_names(content, section_name)
    # Find the section and extract chord names
    # Pattern: "ChordName": { ... }
    section_match = content.match(/export const #{section_name} = \{(.*?)\n\}/m)
    return Set.new unless section_match

    section_content = section_match[1]
    chords = Set.new

    # Match chord names like "C", "Dm", "F#m7", etc.
    section_content.scan(/"([^"]+)":\s*\{/) do |match|
      chords.add(match[0])
    end

    chords
  end
end

def extract_chord_names(content, section_name)
  # Find the section and extract chord names
  section_match = content.match(/export const #{section_name} = \{(.*?)\n\}/m)
  return Set.new unless section_match

  section_content = section_match[1]
  chords = Set.new

  # Match chord names like "C", "Dm", "F#m7", etc.
  section_content.scan(/"([^"]+)":\s*\{/) do |match|
    chords.add(match[0])
  end

  chords
end

