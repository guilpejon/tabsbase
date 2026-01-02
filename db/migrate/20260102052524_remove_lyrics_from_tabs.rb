class RemoveLyricsFromTabs < ActiveRecord::Migration[8.1]
  def change
    remove_column :tabs, :lyrics, :text
  end
end
