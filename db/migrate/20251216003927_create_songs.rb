class CreateSongs < ActiveRecord::Migration[8.1]
  def change
    create_table :songs do |t|
      t.references :artist, null: false, foreign_key: true
      t.string :title, null: false
      t.string :album
      t.integer :year
      t.string :genre
      t.string :original_key
      t.integer :duration # in seconds
      t.timestamps
    end

    add_index :songs, [:artist_id, :title]
    add_index :songs, :title
  end
end
