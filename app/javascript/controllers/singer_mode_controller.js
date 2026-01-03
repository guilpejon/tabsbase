import { Controller } from "@hotwired/stimulus"

// Safely strip HTML tags by looping until no more matches (prevents bypass with nested tags)
function stripHtmlTags(str) {
  let prev
  do {
    prev = str
    str = str.replace(/<[^>]*>/g, "")
  } while (str !== prev)
  return str
}

// Singer Mode Controller
// Hides chords, tabs, and musical notation to show only lyrics
export default class extends Controller {
  static targets = ["toggleButton"]
  static values = {
    enabled: { type: Boolean, default: false },
    chordTab: { type: Boolean, default: false },
    lyrics: { type: String, default: "" }
  }

  connect() {
    // Only apply singer mode on chord-type tabs OR tabs with dedicated lyrics
    // This prevents the mode from breaking non-chord tabs without lyrics
    if (!this.chordTabValue && !this.hasMeaningfulLyrics()) {
      return
    }
    
    // Don't load saved preference - lyrics mode should not persist across sessions
    
    // Apply mode after a short delay to ensure DOM is ready
    // and other controllers have finished their setup
    setTimeout(() => {
      this.applyMode()
    }, 100)
    
    this.updateButtonState()
  }

  toggle() {
    // Only allow toggle on chord-type tabs OR tabs with dedicated lyrics
    if (!this.chordTabValue && !this.hasMeaningfulLyrics()) return
    
    this.enabledValue = !this.enabledValue
    this.applyMode()
    this.updateButtonState()
  }

  applyMode() {
    if (this.enabledValue) {
      this.element.classList.add("singer-mode")
      if (this.hasMeaningfulLyrics()) {
        this.displayLyrics()
      } else {
        this.hideMusicalElements()
        // Delay processing to ensure tab-wrapper has finished
        setTimeout(() => {
          this.processContentForSingerMode()
        }, 200)
      }
    } else {
      this.element.classList.remove("singer-mode")
      this.showMusicalElements()
      this.restoreOriginalContent()
    }
  }

  hideMusicalElements() {
    // Hide tab notation blocks (guitar/bass tablature with fret numbers)
    this.element.querySelectorAll('pre[data-tab-notation="true"]').forEach(el => {
      el.style.display = 'none'
    })
    
    // Hide chord dictionary elements
    const dictionarySelectors = [
      '[data-chord-diagram-target="tooltip"]',
      '[data-chord-diagram-target="mobilePanel"]',
      '[data-chord-diagram-target="dictionaryHeader"]',
      '[data-chord-diagram-target="dictionaryContent"]',
      '[data-chord-diagram-target="dictionaryArrow"]',
      '[data-chord-diagram-target="dictionaryGrid"]',
      '[data-chord-diagram-target="dictionaryChord"]',
      '[data-chord-diagram-target="mobileDictionaryHeader"]',
      '[data-chord-diagram-target="mobileDictionaryContent"]',
      '[data-chord-diagram-target="mobileDictionaryArrow"]'
    ]
    
    dictionarySelectors.forEach(selector => {
      this.element.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none'
      })
    })
    
    // Hide the chord dictionary sidebar (desktop)
    const sidebar = this.element.querySelector('.lg\\:block.lg\\:w-80')
    if (sidebar) sidebar.style.display = 'none'
    
    // Hide mobile chord dictionary container
    const mobileDictionary = this.element.querySelector('.mb-4.lg\\:hidden')
    if (mobileDictionary) mobileDictionary.style.display = 'none'
  }

  showMusicalElements() {
    // Show tab notation blocks
    this.element.querySelectorAll('pre[data-tab-notation="true"]').forEach(el => {
      el.style.display = ''
    })
    
    // Show chord dictionary elements
    const dictionarySelectors = [
      '[data-chord-diagram-target="tooltip"]',
      '[data-chord-diagram-target="mobilePanel"]',
      '[data-chord-diagram-target="dictionaryHeader"]',
      '[data-chord-diagram-target="dictionaryContent"]',
      '[data-chord-diagram-target="dictionaryArrow"]',
      '[data-chord-diagram-target="dictionaryGrid"]',
      '[data-chord-diagram-target="dictionaryChord"]',
      '[data-chord-diagram-target="mobileDictionaryHeader"]',
      '[data-chord-diagram-target="mobileDictionaryContent"]',
      '[data-chord-diagram-target="mobileDictionaryArrow"]'
    ]
    
    dictionarySelectors.forEach(selector => {
      this.element.querySelectorAll(selector).forEach(el => {
        el.style.display = ''
      })
    })
    
    // Show the chord dictionary sidebar (desktop)
    const sidebar = this.element.querySelector('.lg\\:block.lg\\:w-80')
    if (sidebar) sidebar.style.display = ''
    
    // Show mobile chord dictionary container
    const mobileDictionary = this.element.querySelector('.mb-4.lg\\:hidden')
    if (mobileDictionary) mobileDictionary.style.display = ''
  }

  // Display dedicated lyrics (prioritizes over chord-hiding)
  displayLyrics() {
    // Find the main content container
    const contentContainer = this.element.querySelector('[data-tab-wrapper-target="content"]')
    if (!contentContainer) return

    // Store the original HTML for restoration
    if (!contentContainer.dataset.singerOriginalHtml) {
      contentContainer.dataset.singerOriginalHtml = contentContainer.innerHTML
    }

    // Get lyrics from data attribute
    const lyricsText = this.element.dataset.singerModeLyrics || ""
    // Replace entire content with formatted lyrics
    const lyricsHtml = this.formatLyricsAsHtml(lyricsText)
    contentContainer.innerHTML = lyricsHtml
  }

  // Process content blocks to remove chord spans and collapse empty lines
  processContentForSingerMode() {
    const contentBlocks = this.element.querySelectorAll('pre, div.font-mono')

    // If we have dedicated lyrics, use those instead of processing mixed content
    if (this.hasMeaningfulLyrics()) {
      contentBlocks.forEach(block => {
        // Skip tab notation blocks - they're hidden, not processed
        if (block.dataset.tabNotation === 'true') return

        // Store the original HTML for restoration
        if (!block.dataset.singerOriginalHtml) {
          block.dataset.singerOriginalHtml = block.dataset.originalHtml || block.innerHTML
        }

        // Replace content with lyrics
        const lyricsText = this.element.dataset.singerModeLyrics || ""
        const lyricsHtml = this.formatLyricsAsHtml(lyricsText)
        block.innerHTML = lyricsHtml
        if (block.dataset.originalHtml) {
          block.dataset.originalHtml = lyricsHtml
        }
      })
      return
    }

    // Fall back to processing mixed chord/lyrics content
    const chordPattern = /^[A-G][#b]?(m|maj|min|dim|aug|sus|add|dom)?[2-9]?(\/[A-G][#b]?)?$/

    contentBlocks.forEach(block => {
      // Skip tab notation blocks - they're hidden, not processed
      if (block.dataset.tabNotation === 'true') return

      // Store the tab-wrapper's original HTML (for restoration)
      if (!block.dataset.singerOriginalHtml) {
        // Get the HTML that tab-wrapper uses (its cached original)
        block.dataset.singerOriginalHtml = block.dataset.originalHtml || block.innerHTML
      }

      // Process the content from the original source
      let html = block.dataset.singerOriginalHtml

      // Remove all chord spans (inline chords)
      html = html.replace(/<span[^>]*data-chord[^>]*>.*?<\/span>/g, '')

      // Split into lines and process
      const lines = html.split('\n')
      const processedLines = []

      for (const line of lines) {
        // Get text content without HTML tags
        const textContent = stripHtmlTags(line).trim()

        // Skip empty lines
        if (textContent === '') continue

        // Skip lines that are only chord names (chord-only lines)
        if (this.isChordOnlyLine(textContent, chordPattern)) continue

        // Keep this line
        processedLines.push(line.trim())
      }

      const processedHtml = processedLines.join('\n')

      // Update both the current innerHTML AND the tab-wrapper's cached original
      block.innerHTML = processedHtml
      if (block.dataset.originalHtml) {
        block.dataset.originalHtml = processedHtml
      }
    })
  }

  // Format lyrics text as HTML with proper line breaks and structure
  formatLyricsAsHtml(lyricsText) {
    if (!lyricsText) return ''

    // Handle case where lyrics might contain escaped newlines
    let processedText = lyricsText
    if (typeof lyricsText === 'string' && lyricsText.includes('\\n')) {
      // Convert escaped newlines to actual newlines
      processedText = lyricsText.replace(/\\n/g, '\n')
    }

    // Split into lines and add paragraph structure
    const lines = processedText.split('\n')
    const paragraphs = []
    let currentParagraph = []

    lines.forEach((line, index) => {
      const trimmed = line.trim()

      // Check if this line is a section marker (e.g., [Verso], [Refrão], [Intro], etc.)
      const isSectionMarker = /^\s*\[/.test(trimmed)

      if (trimmed === '') {
        // Empty line - end current paragraph
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph)
          currentParagraph = []
        }
      } else if (isSectionMarker) {
        // Section marker - end current paragraph and start new one with the marker
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph)
          currentParagraph = []
        }
        currentParagraph.push(line)
      } else {
        currentParagraph.push(line)

        // Auto-create paragraph breaks every 4-6 lines to separate verses
        // This helps when lyrics don't have empty lines between verses (existing data)
        const shouldBreak = currentParagraph.length >= 4 && (
          currentParagraph.length >= 6 ||  // Always break at 6 lines
          !lines[index + 1] ||              // At the end
          /^\s*\[/.test((lines[index + 1] || '').trim())  // Next line is a section marker
        )

        if (shouldBreak) {
          paragraphs.push(currentParagraph)
          currentParagraph = []
        }
      }
    })

    // Add any remaining lines
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph)
    }

    // Convert to HTML
    const htmlParagraphs = paragraphs.map(paragraph =>
      `<p class="mb-4 leading-6">${paragraph.join('<br>')}</p>`
    )

    return `<div class="lyrics-text text-sm text-slate-900 font-sans">${htmlParagraphs.join('')}</div>`
  }

  // Check if a line contains only chord names (no lyrics)
  isChordOnlyLine(text, chordPattern) {
    // Split by whitespace and check each word
    const words = text.split(/\s+/).filter(w => w.length > 0)

    if (words.length === 0) return true

    // Check if all words are chord names
    return words.every(word => {
      // Allow chord names and common chord notation characters (|, /, x, -)
      if (/^[\|\/x\-]+$/.test(word)) return true
      return chordPattern.test(word)
    })
  }

  // Restore original content when exiting singer mode
  restoreOriginalContent() {
    // First, check if the main content container was replaced with lyrics
    const contentContainer = this.element.querySelector('[data-tab-wrapper-target="content"]')
    if (contentContainer && contentContainer.dataset.singerOriginalHtml) {
      contentContainer.innerHTML = contentContainer.dataset.singerOriginalHtml
      return
    }

    // Otherwise, restore individual content blocks (for chord processing mode)
    const contentBlocks = this.element.querySelectorAll('pre, div.font-mono')
    contentBlocks.forEach(block => {
      if (block.dataset.singerOriginalHtml) {
        const originalHtml = block.dataset.singerOriginalHtml
        block.innerHTML = originalHtml
        // Restore tab-wrapper's cached original too
        if (block.dataset.originalHtml) {
          block.dataset.originalHtml = originalHtml
        }
      }
    })
  }

  // Check if we have meaningful lyrics content (not null, undefined, or empty)
  hasMeaningfulLyrics() {
    const lyricsText = this.element.dataset.singerModeLyrics || ""
    return lyricsText && lyricsText.trim() && lyricsText !== 'null'
  }

  updateButtonState() {
    if (this.hasToggleButtonTarget) {
      if (this.enabledValue) {
        this.toggleButtonTarget.classList.add("bg-slate-600", "text-white", "border-slate-600")
        this.toggleButtonTarget.classList.remove("bg-white", "text-slate-600", "border-slate-200", "hover:bg-slate-100")
        this.toggleButtonTarget.setAttribute("title", "Exit Singer Mode")
      } else {
        this.toggleButtonTarget.classList.remove("bg-slate-600", "text-white", "border-slate-600")
        this.toggleButtonTarget.classList.add("bg-white", "text-slate-600", "border-slate-200", "hover:bg-slate-100")
        this.toggleButtonTarget.setAttribute("title", "Singer Mode - Hide chords & tabs")
      }
    }
  }
}

