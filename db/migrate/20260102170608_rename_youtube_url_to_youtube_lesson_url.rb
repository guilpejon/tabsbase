class RenameYoutubeUrlToYoutubeLessonUrl < ActiveRecord::Migration[8.1]
  def change
    rename_column :tabs, :youtube_url, :youtube_lesson_url
  end
end
