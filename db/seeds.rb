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
