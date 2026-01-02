class RemoveOriginalKeyFromSongs < ActiveRecord::Migration[8.1]
  def change
    remove_column :songs, :original_key, :string
  end
end
