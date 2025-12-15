class CreateTunings < ActiveRecord::Migration[8.1]
  def change
    create_table :tunings do |t|
      t.string :name, null: false
      t.string :instrument, null: false
      t.json :strings, null: false
      t.timestamps
    end

    add_index :tunings, [:instrument, :name], unique: true
    add_index :tunings, :instrument
  end
end
