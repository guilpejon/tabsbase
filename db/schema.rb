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

ActiveRecord::Schema[8.1].define(version: 2026_01_02_175040) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "artists", force: :cascade do |t|
    t.text "bio"
    t.string "country"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "slug"
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_artists_on_name", unique: true
    t.index ["slug"], name: "index_artists_on_slug", unique: true
  end

  create_table "solid_queue_blocked_executions", force: :cascade do |t|
    t.string "concurrency_key", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.index ["concurrency_key", "priority", "job_id"], name: "index_solid_queue_blocked_executions_for_release"
    t.index ["expires_at", "concurrency_key"], name: "index_solid_queue_blocked_executions_for_maintenance"
    t.index ["job_id"], name: "index_solid_queue_blocked_executions_on_job_id", unique: true
  end

  create_table "solid_queue_claimed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.bigint "process_id"
    t.index ["job_id"], name: "index_solid_queue_claimed_executions_on_job_id", unique: true
    t.index ["process_id", "job_id"], name: "index_solid_queue_claimed_executions_on_process_id_and_job_id"
  end

  create_table "solid_queue_failed_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "error"
    t.bigint "job_id", null: false
    t.index ["job_id"], name: "index_solid_queue_failed_executions_on_job_id", unique: true
  end

  create_table "solid_queue_jobs", force: :cascade do |t|
    t.string "active_job_id"
    t.text "arguments"
    t.string "class_name", null: false
    t.string "concurrency_key"
    t.datetime "created_at", null: false
    t.datetime "finished_at"
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at"
    t.datetime "updated_at", null: false
    t.index ["active_job_id"], name: "index_solid_queue_jobs_on_active_job_id"
    t.index ["class_name"], name: "index_solid_queue_jobs_on_class_name"
    t.index ["finished_at"], name: "index_solid_queue_jobs_on_finished_at"
    t.index ["queue_name", "finished_at"], name: "index_solid_queue_jobs_for_filtering"
    t.index ["scheduled_at", "finished_at"], name: "index_solid_queue_jobs_for_alerting"
  end

  create_table "solid_queue_pauses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "queue_name", null: false
    t.index ["queue_name"], name: "index_solid_queue_pauses_on_queue_name", unique: true
  end

  create_table "solid_queue_processes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "hostname"
    t.string "kind", null: false
    t.datetime "last_heartbeat_at", null: false
    t.text "metadata"
    t.string "name", null: false
    t.integer "pid", null: false
    t.bigint "supervisor_id"
    t.index ["last_heartbeat_at"], name: "index_solid_queue_processes_on_last_heartbeat_at"
    t.index ["name", "supervisor_id"], name: "index_solid_queue_processes_on_name_and_supervisor_id", unique: true
    t.index ["supervisor_id"], name: "index_solid_queue_processes_on_supervisor_id"
  end

  create_table "solid_queue_ready_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.index ["job_id"], name: "index_solid_queue_ready_executions_on_job_id", unique: true
    t.index ["priority", "job_id"], name: "index_solid_queue_poll_all"
    t.index ["queue_name", "priority", "job_id"], name: "index_solid_queue_poll_by_queue"
  end

  create_table "solid_queue_recurring_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.datetime "run_at", null: false
    t.string "task_key", null: false
    t.index ["job_id"], name: "index_solid_queue_recurring_executions_on_job_id", unique: true
    t.index ["task_key", "run_at"], name: "index_solid_queue_recurring_executions_on_task_key_and_run_at", unique: true
  end

  create_table "solid_queue_recurring_tasks", force: :cascade do |t|
    t.text "arguments"
    t.string "class_name"
    t.string "command", limit: 2048
    t.datetime "created_at", null: false
    t.text "description"
    t.string "key", null: false
    t.integer "priority", default: 0
    t.string "queue_name"
    t.string "schedule", null: false
    t.boolean "static", default: true, null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_solid_queue_recurring_tasks_on_key", unique: true
    t.index ["static"], name: "index_solid_queue_recurring_tasks_on_static"
  end

  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "job_id", null: false
    t.integer "priority", default: 0, null: false
    t.string "queue_name", null: false
    t.datetime "scheduled_at", null: false
    t.index ["job_id"], name: "index_solid_queue_scheduled_executions_on_job_id", unique: true
    t.index ["scheduled_at", "priority", "job_id"], name: "index_solid_queue_dispatch_all"
  end

  create_table "solid_queue_semaphores", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "key", null: false
    t.datetime "updated_at", null: false
    t.integer "value", default: 1, null: false
    t.index ["expires_at"], name: "index_solid_queue_semaphores_on_expires_at"
    t.index ["key", "value"], name: "index_solid_queue_semaphores_on_key_and_value"
    t.index ["key"], name: "index_solid_queue_semaphores_on_key", unique: true
  end

  create_table "songs", force: :cascade do |t|
    t.string "album"
    t.bigint "artist_id", null: false
    t.datetime "created_at", null: false
    t.integer "duration"
    t.string "genre"
    t.text "lyrics"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "year"
    t.string "youtube_music_url"
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
    t.string "key"
    t.decimal "rating", precision: 3, scale: 2
    t.integer "rating_count"
    t.string "slug"
    t.bigint "song_id", null: false
    t.string "source", default: "ultimate_guitar"
    t.string "source_url"
    t.string "tab_type"
    t.bigint "tuning_id", null: false
    t.datetime "updated_at", null: false
    t.string "version_name"
    t.integer "views_count", default: 0
    t.string "youtube_lesson_url"
    t.string "youtube_music_url"
    t.index ["instrument"], name: "index_tabs_on_instrument"
    t.index ["slug"], name: "index_tabs_on_slug", unique: true
    t.index ["song_id", "instrument"], name: "index_tabs_on_song_id_and_instrument"
    t.index ["song_id"], name: "index_tabs_on_song_id"
    t.index ["source"], name: "index_tabs_on_source"
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

  create_table "ug_band_songs", force: :cascade do |t|
    t.decimal "best_rating", precision: 4, scale: 2
    t.string "best_tab_type"
    t.string "best_tab_url"
    t.datetime "created_at", null: false
    t.datetime "enqueued_at"
    t.datetime "imported_at"
    t.text "last_error"
    t.string "song_title", null: false
    t.bigint "ug_band_id", null: false
    t.datetime "updated_at", null: false
    t.index ["best_rating"], name: "index_ug_band_songs_on_best_rating"
    t.index ["ug_band_id", "song_title"], name: "index_ug_band_songs_on_ug_band_id_and_song_title", unique: true
    t.index ["ug_band_id"], name: "index_ug_band_songs_on_ug_band_id"
  end

  create_table "ug_bands", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "eligible", default: false, null: false
    t.datetime "last_crawled_at"
    t.text "last_error"
    t.string "name", null: false
    t.string "status", default: "pending", null: false
    t.integer "tabs_count"
    t.string "ug_url", null: false
    t.datetime "updated_at", null: false
    t.index ["eligible"], name: "index_ug_bands_on_eligible"
    t.index ["status"], name: "index_ug_bands_on_status"
    t.index ["ug_url"], name: "index_ug_bands_on_ug_url", unique: true
  end

  add_foreign_key "solid_queue_blocked_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_claimed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_failed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_ready_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_recurring_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_scheduled_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "songs", "artists"
  add_foreign_key "tabs", "songs"
  add_foreign_key "tabs", "tunings"
  add_foreign_key "ug_band_songs", "ug_bands"
end
