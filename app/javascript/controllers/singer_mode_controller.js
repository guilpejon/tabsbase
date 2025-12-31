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
    chordTab: { type: Boolean, default: false }
  }

  connect() {
    // Only apply singer mode on chord-type tabs
    // This prevents the mode from breaking non-chord tabs
    if (!this.chordTabValue) {
      return
    }
    
    // Load saved preference
    const saved = localStorage.getItem("singerModeEnabled")
    if (saved === "true") {
      this.enabledValue = true
    }
    
    // Apply mode after a short delay to ensure DOM is ready
    // and other controllers have finished their setup
    setTimeout(() => {
      this.applyMode()
    }, 100)
    
    this.updateButtonState()
  }

  toggle() {
    // Only allow toggle on chord-type tabs
    if (!this.chordTabValue) return
    
    this.enabledValue = !this.enabledValue
    localStorage.setItem("singerModeEnabled", this.enabledValue)
    this.applyMode()
    this.updateButtonState()
  }

  applyMode() {
    if (this.enabledValue) {
      this.element.classList.add("singer-mode")
      this.hideMusicalElements()
      // Delay processing to ensure tab-wrapper has finished
      setTimeout(() => {
        this.processContentForSingerMode()
      }, 200)
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

  // Process content blocks to remove chord spans and collapse empty lines
  processContentForSingerMode() {
    const contentBlocks = this.element.querySelectorAll('pre, div.font-mono')
    
    // Pattern to match chord-only lines (chord names like A, Am, C#m, Dm7, Bsus4, etc.)
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

  updateButtonState() {
    if (this.hasToggleButtonTarget) {
      if (this.enabledValue) {
        this.toggleButtonTarget.classList.add("bg-amber-500", "text-white", "border-amber-500")
        this.toggleButtonTarget.classList.remove("bg-white", "text-slate-600", "border-slate-200", "hover:bg-slate-100")
        this.toggleButtonTarget.setAttribute("title", "Exit Singer Mode")
      } else {
        this.toggleButtonTarget.classList.remove("bg-amber-500", "text-white", "border-amber-500")
        this.toggleButtonTarget.classList.add("bg-white", "text-slate-600", "border-slate-200", "hover:bg-slate-100")
        this.toggleButtonTarget.setAttribute("title", "Singer Mode - Hide chords & tabs")
      }
    }
  }
}

