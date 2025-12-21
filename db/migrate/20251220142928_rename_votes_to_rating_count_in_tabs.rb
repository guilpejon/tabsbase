class RenameVotesToRatingCountInTabs < ActiveRecord::Migration[8.1]
  def change
    rename_column :tabs, :votes, :rating_count
  end
end
