class AddTabTypeToTabs < ActiveRecord::Migration[8.1]
  def change
    add_column :tabs, :tab_type, :string
  end
end

