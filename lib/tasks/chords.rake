namespace :chords do
  desc "Discover all chords from existing tabs"
  task discover: :environment do
    puts "\n🎸 Discovering chords from all tabs..."
    chords = ChordDiscoveryService.discover_all

    unique_count = chords.map(&:name).uniq.size
    puts "\n✅ Found #{unique_count} unique chords (#{chords.size} total instances)"

    puts "\n📊 Top 20 most common:"
    Chord.ordered_by_usage.limit(20).each_with_index do |chord, i|
      puts "  #{(i+1).to_s.rjust(2)}. #{chord.name.ljust(15)} - #{chord.usage_count} uses"
    end
  end

  desc "Show missing chords (in DB but not in chord_data.js)"
  task missing: :environment do
    chord_file = Rails.root.join("app/javascript/chord_data.js")
    js_content = File.read(chord_file)
    js_chords = js_content.scan(/"([A-G][#b]?[^"]*)"\s*:/).flatten.to_set

    missing = Chord.where.not(name: js_chords.to_a).ordered_by_usage

    puts "\n📊 Chords in database: #{Chord.count}"
    puts "📊 Chords in chord_data.js: #{js_chords.size}"
    puts "📊 Missing from chord_data.js: #{missing.count}\n"

    if missing.any?
      puts "\nTop 50 missing chords:"
      missing.limit(50).each_with_index do |chord, i|
        status = chord.has_fingering? ? "✓" : "✗"
        puts "  #{(i+1).to_s.rjust(2)}. #{chord.name.ljust(15)} - #{chord.usage_count.to_s.rjust(4)} uses #{status}"
      end
    end
  end

  desc "Show chord statistics"
  task stats: :environment do
    total = Chord.count
    with_fingerings = Chord.with_fingerings.count
    without_fingerings = Chord.without_fingerings.count

    puts "\n📊 Chord Statistics"
    puts "=" * 50
    puts "Total chords: #{total}"
    puts "  With fingerings: #{with_fingerings}"
    puts "  Without fingerings: #{without_fingerings}"

    if total > 0
      most_common = Chord.ordered_by_usage.first
      puts "\nMost common: #{most_common.name} (#{most_common.usage_count} uses)"
    end
  end

  desc "Normalize all chord names in database"
  task normalize: :environment do
    puts "\n🔄 Normalizing chord names..."

    service = ChordDiscoveryService.new
    normalized_count = 0
    merged_count = 0

    Chord.find_each do |chord|
      original_name = chord.name
      normalized_name = service.send(:normalize_chord_name, original_name)

      next if normalized_name.blank?
      next if normalized_name == original_name

      # Find or create the normalized chord
      target_chord = Chord.find_or_initialize_by(name: normalized_name)

      if target_chord.new_record?
        # Rename this chord
        chord.update_column(:name, normalized_name)
        normalized_count += 1
        puts "  ✓ Renamed: #{original_name} → #{normalized_name}"
      else
        # Merge into existing normalized chord
        target_chord.increment!(:usage_count, chord.usage_count)
        chord.destroy
        merged_count += 1
        puts "  ✓ Merged: #{original_name} → #{normalized_name} (+#{chord.usage_count} uses)"
      end
    rescue => e
      puts "  ✗ Error normalizing #{original_name}: #{e.message}"
    end

    puts "\n✅ Normalization complete!"
    puts "   Renamed: #{normalized_count} chords"
    puts "   Merged: #{merged_count} chords"
    puts "   Total chords now: #{Chord.count}"
  end
end
