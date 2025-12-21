class AddVotesToTabs < ActiveRecord::Migration[8.1]
  def change
    add_column :tabs, :votes, :integer
  end
end

