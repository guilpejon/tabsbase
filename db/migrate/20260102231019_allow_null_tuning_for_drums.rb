class AllowNullTuningForDrums < ActiveRecord::Migration[8.1]
  def change
    # Allow tuning_id to be null for drum tabs
    change_column_null :tabs, :tuning_id, true
  end
end
