# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Seeding database..."

# Create Tunings
puts "Creating tunings..."

guitar_standard = Tuning.create!(instrument: "Guitar", name: "Standard", strings: ["E", "A", "D", "G", "B", "E"])
guitar_drop_d = Tuning.create!(instrument: "Guitar", name: "Drop D", strings: ["D", "A", "D", "G", "B", "E"])
bass_standard = Tuning.create!(instrument: "Bass", name: "Standard", strings: ["E", "A", "D", "G"])

puts "Created #{Tuning.count} tunings"

# Create Artists
beatles = Artist.find_or_create_by!(name: "The Beatles") do |artist|
  artist.bio = "English rock band formed in Liverpool in 1960"
  artist.country = "UK"
end

nirvana = Artist.find_or_create_by!(name: "Nirvana") do |artist|
  artist.bio = "American rock band formed in Aberdeen, Washington in 1987"
  artist.country = "USA"
end

puts "Created #{Artist.count} artists"

# Create Songs
yesterday = Song.find_or_create_by!(artist: beatles, title: "Yesterday") do |song|
  song.album = "Help!"
  song.year = 1965
  song.genre = "Pop"
  song.original_key = "F"
end

come_together = Song.find_or_create_by!(artist: beatles, title: "Come Together") do |song|
  song.album = "Abbey Road"
  song.year = 1969
  song.genre = "Rock"
  song.original_key = "Dm"
end

smells_like = Song.find_or_create_by!(artist: nirvana, title: "Smells Like Teen Spirit") do |song|
  song.album = "Nevermind"
  song.year = 1991
  song.genre = "Grunge"
  song.original_key = "F"
end

puts "Created #{Song.count} songs"

# Create Tabs
Tab.find_or_create_by!(song: yesterday, instrument: "Guitar", tuning: guitar_standard) do |tab|
  tab.content = "Intro:\nF    Em7  A7\n|-1----0----0-|\n|-1----0----2-|\n|-2----0----0-|\n|-3----2----2-|\n|-3----2----0-|\n|-1----0----x-|"
  tab.difficulty = "Easy"
end

Tab.find_or_create_by!(song: come_together, instrument: "Bass", tuning: bass_standard) do |tab|
  tab.content = "Intro:\nG|----------------|\nD|----------------|\nA|--------3-3-----|\nE|-0-0-5------5-3-|"
  tab.difficulty = "Medium"
end

Tab.find_or_create_by!(song: smells_like, instrument: "Guitar", tuning: guitar_standard) do |tab|
  tab.content = "Main Riff:\ne|------------------|\nB|------------------|\nG|------------------|\nD|-------1----------|\nA|-1-1-1--3-3-3-6-6-|\nE|-1-1-1--3-3-3-6-6-|"
  tab.difficulty = "Medium"
  tab.rating = 4.8
end

Tab.find_or_create_by!(song: smells_like, instrument: "Bass", tuning: bass_standard) do |tab|
  tab.content = "Main Riff:\nG|------------------|\nD|------------------|\nA|-------1----------|\nE|-1-1-1--3-3-3-6-6-|"
  tab.difficulty = "Medium"
end

# Example tab with alternate tuning
Tab.find_or_create_by!(song: come_together, instrument: "Guitar", tuning: guitar_drop_d) do |tab|
  tab.content = "Drop D Version:\nD|----------------|\nA|--------3-3-----|\nD|-0-0-5------5-3-|\nG|----------------|\nB|----------------|\nE|----------------|\n"
  tab.difficulty = "Medium"
  tab.version_name = "Drop D Version"
end

puts "Created #{Tab.count} tabs"
puts "Seeding complete!"
