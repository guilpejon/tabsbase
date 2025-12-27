class AddYoutubeUrlToTabs < ActiveRecord::Migration[8.1]
  def change
    add_column :tabs, :youtube_url, :string
  end
end
