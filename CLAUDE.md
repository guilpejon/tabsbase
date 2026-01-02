# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TabsBase is a Rails 8 application for scraping, storing, and displaying guitar tabs, bass tabs, and other musical tablature. It scrapes content from Ultimate Guitar and Cifra Club (Brazilian Portuguese site), processes the data, and presents it in a searchable format.

## Tech Stack

- **Rails 8.1.1** with PostgreSQL
- **Hotwire** (Turbo + Stimulus)
- **Tailwind CSS** for styling
- **Solid Queue** for background job processing (replaces Sidekiq/Redis)
- **Solid Cache** for caching
- **Selenium WebDriver** for browser automation during scraping
- **Kamal** for deployment
- **Mission Control Jobs** for job monitoring at `/jobs`

## Development Commands

### Setup
```bash
bin/setup                    # Initial setup: install dependencies, prepare DB, start server
bin/setup --skip-server      # Setup without starting server
bin/setup --reset            # Reset database during setup
```

### Running the Application
```bash
bin/dev                      # Start development server (runs Procfile.dev with foreman)
bin/rails s                  # Start Rails server directly
bin/jobs                     # Start Solid Queue worker for background jobs
```

### Database
```bash
bin/rails db:prepare         # Create/migrate database
bin/rails db:migrate         # Run migrations
bin/rails db:reset           # Drop, create, migrate, and seed database
bin/rails db:sync:push       # Sync local database to production (custom task)
```

### Code Quality
```bash
bin/rubocop                  # Run Ruby linter (Omakase style)
bin/brakeman                 # Security scanner
bin/bundler-audit            # Check for vulnerable dependencies
bin/ci                       # Run all CI checks
```

### Testing
```bash
bin/rails test                          # Run all tests
bin/rails test test/models/tab_test.rb # Run specific test file
bin/rails test test/models/tab_test.rb:27 # Run test at specific line
```

### Deployment
```bash
bin/kamal deploy             # Deploy to production (requires 1Password auth)
bin/kamal logs               # View logs
bin/kamal console            # Open Rails console on production
bin/kamal app restart        # Restart application
```

## Core Architecture

### Data Model

The application follows a hierarchical structure:

```
Artist (has many Songs)
  └─ Song (belongs to Artist, has many Tabs)
      └─ Tab (belongs to Song, belongs to Tuning)
```

**Key Models:**
- `Artist`: Musicians/bands (has slug for URLs)
- `Song`: Individual songs (has lyrics, belongs to Artist)
- `Tab`: Musical tablature/chords for a song (has content, instrument, tuning, key, capo, difficulty, rating, source)
- `Tuning`: Instrument tuning configurations (guitar, bass, ukulele, etc.)

**Important Model Features:**
- Both `Artist` and `Tab` auto-generate slugs for SEO-friendly URLs
- Tabs are de-duplicated by `source_url`
- Tabs store `source` field ("ultimate_guitar" or "cifra_club") for tracking origin
- Lyrics are stored at the Song level, not Tab level
- Tab keys are stored at the Tab level for transposition support

### URL Structure

```
/                                    # Home page (tabs search/browse)
/tabs/:artist_slug/:tab_slug         # Tab detail page
/artists                             # Artist browse by letter
/artists/:artist_slug                # Artist detail page (shows all tabs)
/jobs                                # Mission Control Jobs dashboard
```

### Scraping Services

Two main scraping services in `app/services/`:

**UltimateGuitar::PageScraper**
- Scrapes Ultimate Guitar tab pages
- Extracts embedded JSON from `window.UGAPP.store.page` or `<div class="js-store">`
- Filters non-Latin content via `LanguageFilter`
- Sanitizes content to remove redundant headers (artist, title, tuning, capo)
- Extracts: artist, song, tab content, tuning, capo, key, difficulty, rating, YouTube URLs

**CifraClub::PageScraper**
- Scrapes Cifra Club (Brazilian) tab pages
- Parses HTML with Nokogiri
- Can scrape multiple versions: principal, simplified, drum, bass
- Compares tab quality scores when duplicates exist
- Extracts lyrics from separate `/letra/` pages
- Handles Portuguese chord notation and capo patterns

Both services:
- Are idempotent (safe to run multiple times)
- Use `import!` method to scrape and persist data in a transaction
- Handle HTML entity decoding
- Normalize tuning names (e.g., "E A D G B E" → "Standard")

### Background Jobs

All background jobs inherit from `ApplicationJob` and use Solid Queue.

**Ultimate Guitar Jobs:**
- `UltimateGuitar::CrawlAlphabetJob` - Crawl all letters A-Z
- `UltimateGuitar::CrawlBandListJob` - Crawl band list for a letter
- `UltimateGuitar::CrawlBandJob` - Crawl all tabs for a band
- `UltimateGuitar::CrawlBandPaginatedJob` - Crawl paginated band tabs
- `UltimateGuitar::ScrapeTabJob` - Scrape a single tab

**Cifra Club Jobs:**
- `CifraClub::ScrapeTabJob` - Scrape a single tab

**Running Jobs:**
Jobs are enqueued but require Solid Queue worker to be running:
```bash
bin/jobs
```

### Rake Tasks

**Ultimate Guitar:**
```bash
bin/rails ultimate_guitar:crawl                    # Crawl A-Z (bands with 100+ tabs)
bin/rails ultimate_guitar:crawl LETTERS=a,b,c      # Crawl specific letters
bin/rails ultimate_guitar:crawl_letter[a]          # Crawl single letter
bin/rails ultimate_guitar:crawl_band[URL]          # Crawl specific band
bin/rails ultimate_guitar:scrape_tab[URL]          # Scrape single tab (synchronous)
bin/rails ultimate_guitar:stats                    # Show crawl statistics
```

**Cifra Club:**
```bash
bin/rails cifra_club:scrape_tab[URL]               # Scrape all versions of a song
bin/rails cifra_club:scrape_artist[URL]            # Scrape top 15 songs from artist
```

All tasks enqueue background jobs except `ultimate_guitar:scrape_tab` which runs synchronously.

### Frontend

**Stimulus Controllers:**
- `app/javascript/controllers/transpose_controller.js` - Chord transposition
- `app/javascript/controllers/singer_mode_controller.js` - Singer mode UI

**JavaScript Modules:**
- `app/javascript/chord_data.js` - Chord definitions and transposition logic

**Views:**
- Uses ERB templates with Hotwire (Turbo frames/streams)
- Tailwind CSS for styling
- ViewComponents not used (plain ERB partials)

## Important Implementation Notes

### Scraping Best Practices

1. **Always run scraping in background jobs** - Use `perform_later` instead of direct service calls
2. **Respect rate limits** - Jobs should include delays between requests
3. **Handle failures gracefully** - Services raise specific errors (`FetchError`, `ParseError`, `SkippedError`)
4. **De-duplication** - Tabs use `source_url` as unique identifier

### Content Cleaning

Both scrapers sanitize tab content to remove redundant metadata that's already extracted:
- Song title and artist name
- Tuning information
- Capo information
- Key/tonality
- YouTube URLs (extracted to separate field)

This keeps the tab content clean and focused on the actual musical notation.

### Tab Quality Scoring (Cifra Club)

When Cifra Club finds duplicate tabs, it uses a quality scoring system based on:
- Source preference (Cifra Club gets 100 points baseline)
- Completeness (content length, sections, chord variety)
- Rating quality (weighted by rating count)
- Community engagement (view counts)
- Content quality (formatting, tablature presence)

The higher-quality tab is kept, lower-quality duplicates are replaced.

### Tuning Normalization

Both scrapers normalize tuning names:
- String patterns like "E A D G B E" → "Standard"
- Instrument-specific defaults (guitar: E A D G B E, bass: E A D G, ukulele: G C E A)
- Drop tunings detected (e.g., "Drop D")
- Tunings de-duplicated by string values, not just names

### Language Filtering (Ultimate Guitar)

Ultimate Guitar scraper uses `UltimateGuitar::LanguageFilter` to skip non-Latin content (Japanese, Chinese, Korean, Cyrillic) to maintain focus on English and European language content.

## Configuration

- Environment variables managed via Rails credentials/master.key
- Production uses Kamal deployment (see DEPLOY.md)
- No Redis - Solid Queue and Solid Cache use PostgreSQL
- Mission Control authentication disabled in development

## Job Monitoring

Access Mission Control Jobs at `/jobs` to:
- Monitor job queues
- Retry failed jobs
- View job execution history
- Check Solid Queue performance

## When Adding New Features

1. **New scraping sources** - Create service in `app/services/[source]/page_scraper.rb` following existing patterns
2. **New instruments** - Add to tuning normalization logic in scrapers
3. **New tab metadata** - Add column to `tabs` table and update both scrapers
4. **New routes** - Follow RESTful pattern with slugs for SEO
