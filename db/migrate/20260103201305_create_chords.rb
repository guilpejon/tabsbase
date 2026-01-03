class CreateChords < ActiveRecord::Migration[8.1]
  def change
    create_table :chords do |t|
      t.string :name, null: false
      t.integer :usage_count, default: 0, null: false
      t.jsonb :fingerings

      t.timestamps
    end

    add_index :chords, :name, unique: true
    add_index :chords, :usage_count
  end
end
