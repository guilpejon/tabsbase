module HomeHelper
  DIFFICULTY_VARIATIONS = {
    "beginner" => [ "beginner", "Iniciante", "Básico", "absolute beginner" ],
    "intermediate" => [ "intermediate", "Intermediário" ],
    "advanced" => [ "advanced", "Avançado", "Expert" ]
  }.freeze

  def difficulty_counts
    @difficulty_counts ||= begin
      counts = { "beginner" => 0, "intermediate" => 0, "advanced" => 0 }
      Tab.group(:difficulty).count.each do |difficulty, count|
        next if difficulty.blank?

        DIFFICULTY_VARIATIONS.each do |level, variations|
          if variations.map(&:downcase).include?(difficulty.downcase)
            counts[level] += count
            break
          end
        end
      end
      counts
    end
  end
end
