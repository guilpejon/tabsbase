class AddYoutubeMusicUrlToTabs < ActiveRecord::Migration[8.1]
  def change
    add_column :tabs, :youtube_music_url, :string
  end
end
