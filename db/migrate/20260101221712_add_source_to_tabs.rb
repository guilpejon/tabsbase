class AddSourceToTabs < ActiveRecord::Migration[8.1]
  def change
    add_column :tabs, :source, :string, default: 'ultimate_guitar'
    add_index :tabs, :source
  end
end
