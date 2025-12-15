# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_16_003933) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "artists", force: :cascade do |t|
    t.text "bio"
    t.string "country"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_artists_on_name", unique: true
  end

  create_table "songs", force: :cascade do |t|
    t.string "album"
    t.bigint "artist_id", null: false
    t.datetime "created_at", null: false
    t.integer "duration"
    t.string "genre"
    t.string "original_key"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "year"
    t.index ["artist_id", "title"], name: "index_songs_on_artist_id_and_title"
    t.index ["artist_id"], name: "index_songs_on_artist_id"
    t.index ["title"], name: "index_songs_on_title"
  end

  create_table "tabs", force: :cascade do |t|
    t.integer "capo"
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.string "difficulty"
    t.string "instrument", null: false
    t.decimal "rating", precision: 3, scale: 2
    t.bigint "song_id", null: false
    t.string "source_url"
    t.bigint "tuning_id", null: false
    t.datetime "updated_at", null: false
    t.string "version_name"
    t.integer "views_count", default: 0
    t.index ["instrument"], name: "index_tabs_on_instrument"
    t.index ["song_id", "instrument"], name: "index_tabs_on_song_id_and_instrument"
    t.index ["song_id"], name: "index_tabs_on_song_id"
    t.index ["tuning_id"], name: "index_tabs_on_tuning_id"
  end

  create_table "tunings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "instrument", null: false
    t.string "name", null: false
    t.json "strings", null: false
    t.datetime "updated_at", null: false
    t.index ["instrument", "name"], name: "index_tunings_on_instrument_and_name", unique: true
    t.index ["instrument"], name: "index_tunings_on_instrument"
  end

  add_foreign_key "songs", "artists"
  add_foreign_key "tabs", "songs"
  add_foreign_key "tabs", "tunings"
end
