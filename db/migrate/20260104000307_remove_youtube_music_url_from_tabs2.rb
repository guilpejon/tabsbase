class RemoveYoutubeMusicUrlFromTabs2 < ActiveRecord::Migration[8.1]
  def change
    remove_column :tabs, :youtube_music_url, :text
  end
end
