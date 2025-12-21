# frozen_string_literal: true

# Pagy configuration
# See https://ddnexus.github.io/pagy/docs/api/pagy

require "pagy/extras/overflow"

# Items per page
Pagy::DEFAULT[:limit] = 50

# Handle overflow (page out of range)
Pagy::DEFAULT[:overflow] = :last_page

