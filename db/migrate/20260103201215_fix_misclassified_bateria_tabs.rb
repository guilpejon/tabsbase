class FixMisclassifiedBateriaTabs < ActiveRecord::Migration[8.1]
  def up
    # Find all potentially misclassified tabs from Cifra Club with "bateria" in URL
    misclassified = Tab.where(source: "cifra_club")
                       .where("source_url LIKE '%bateria%'")
                       .where(instrument: "drums")

    puts "\nFound #{misclassified.count} potentially misclassified tabs with 'bateria' in URL marked as drums"

    fixed_count = 0
    misclassified.find_each do |tab|
      # Re-analyze content using the same logic as PageScraper
      if has_guitar_notation?(tab.content)
        puts "  Fixing tab #{tab.id}: #{tab.source_url}"
        tab.update_column(:instrument, "guitar")

        # Update tuning to guitar standard if currently null or drums tuning
        if tab.tuning_id.nil? || tab.tuning&.instrument == "drums"
          guitar_tuning = Tuning.find_or_create_by!(
            instrument: "guitar",
            name: "Standard"
          ) do |t|
            t.strings = %w[E A D G B E]
          end
          tab.update_column(:tuning_id, guitar_tuning.id)
        end

        fixed_count += 1
      end
    end

    puts "\n✅ Fixed #{fixed_count} tabs from drums → guitar"
    puts "✅ #{misclassified.count - fixed_count} tabs correctly remain as drums\n"
  end

  def down
    # Not reversible - we don't want to re-break the classification
    raise ActiveRecord::IrreversibleMigration
  end

  private

  # Same logic as CifraClub::PageScraper#has_guitar_notation?
  def has_guitar_notation?(content)
    return false if content.blank?

    # Check for 6-string guitar patterns (E|A|D|G|B|e)
    has_guitar_strings = content.match?(/^[eEBGDAE]\s*[\|\:]/)
    has_fret_numbers = content.match?(/^[eEBGDAE]\s*[\|\:][^\n]*[\d]/)
    has_chords = content.match?(/[A-G][#b]?(?:maj|min|m|dim|aug|sus|add|7M|7|9|11|13)/)

    # Strong signal: guitar strings + fret numbers OR chords
    (has_guitar_strings && has_fret_numbers) ||
    (has_guitar_strings && has_chords) ||
    (has_chords && content.lines.count > 10)
  end
end
