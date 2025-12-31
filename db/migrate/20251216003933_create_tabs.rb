class CreateTabs < ActiveRecord::Migration[8.1]
  def change
    create_table :tabs do |t|
      t.references :song, null: false, foreign_key: true
      t.references :tuning, null: false, foreign_key: true
      t.text :content, null: false
      t.string :instrument, null: false
      t.string :difficulty
      t.integer :capo
      t.decimal :rating, precision: 3, scale: 2
      t.integer :views_count, default: 0
      t.string :source_url
      t.string :version_name # e.g., "Acoustic Version", "Live Version"
      t.timestamps
    end

    add_index :tabs, :instrument
    add_index :tabs, [ :song_id, :instrument ]
  end
end
