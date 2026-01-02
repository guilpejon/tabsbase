class AddKeyToTabs < ActiveRecord::Migration[8.1]
  def change
    add_column :tabs, :key, :string
  end
end
