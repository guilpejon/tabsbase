module HomeHelper
  def difficulty_counts
    @difficulty_counts ||= begin
      # Since difficulties are now normalized to English at DB level,
      # we can just count them directly
      base_counts = Tab.group(:difficulty).count
      {
        "beginner" => base_counts["beginner"] || 0,
        "intermediate" => base_counts["intermediate"] || 0,
        "advanced" => base_counts["advanced"] || 0
      }
    end
  end
end
