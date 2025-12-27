import { Controller } from "@hotwired/stimulus"
import { getChordData, chordExists, getChordRoot, NOTE_SEMITONES } from "chord_data"

// Handles chord diagram display on hover (desktop) and tap (mobile)
// Shows guitar, ukulele, cavaquinho, or piano chord diagrams
export default class extends Controller {
  static targets = ["tooltip", "mobilePanel", "instrumentSelector"]
  static values = {
    instrument: { type: String, default: "guitar" }
  }
  
  connect() {
    this.isMobile = window.matchMedia("(max-width: 768px)").matches
    this.currentChord = null
    this.hideTimeout = null
    
    // Listen for window resize to update mobile state
    this.resizeHandler = () => {
      this.isMobile = window.matchMedia("(max-width: 768px)").matches
    }
    window.addEventListener("resize", this.resizeHandler)
    
    // Use event delegation for chord spans (survives innerHTML changes from tab-wrapper)
    this.bindEventDelegation()
    
    // Load saved instrument preference
    const savedInstrument = localStorage.getItem("chordDiagramInstrument")
    if (savedInstrument) {
      this.instrumentValue = savedInstrument
      this.updateInstrumentSelector()
    }
  }
  
  disconnect() {
    window.removeEventListener("resize", this.resizeHandler)
    this.unbindEventDelegation()
  }
  
  bindEventDelegation() {
    // Use event delegation on the controller element
    // This survives innerHTML changes from other controllers
    this.handleMouseOverBound = this.handleMouseOver.bind(this)
    this.handleMouseOutBound = this.handleMouseOut.bind(this)
    this.handleClickBound = this.handleClick.bind(this)
    
    this.element.addEventListener("mouseover", this.handleMouseOverBound)
    this.element.addEventListener("mouseout", this.handleMouseOutBound)
    this.element.addEventListener("click", this.handleClickBound)
  }
  
  unbindEventDelegation() {
    this.element.removeEventListener("mouseover", this.handleMouseOverBound)
    this.element.removeEventListener("mouseout", this.handleMouseOutBound)
    this.element.removeEventListener("click", this.handleClickBound)
  }
  
  // Find the chord element from the event target (handles nested elements)
  findChordElement(target) {
    // Walk up the DOM to find element with data-chord
    while (target && target !== this.element) {
      if (target.dataset && target.dataset.chord) {
        return target
      }
      target = target.parentElement
    }
    return null
  }
  
  handleMouseOver(event) {
    if (this.isMobile) return
    
    const chordElement = this.findChordElement(event.target)
    if (!chordElement) return
    
    clearTimeout(this.hideTimeout)
    const chordName = chordElement.dataset.chord
    this.showTooltip(chordName, chordElement)
  }
  
  handleMouseOut(event) {
    if (this.isMobile) return
    
    const chordElement = this.findChordElement(event.target)
    if (!chordElement) return
    
    // Check if we're moving to another element within the same chord or to the tooltip
    const relatedChord = this.findChordElement(event.relatedTarget)
    if (relatedChord === chordElement) return
    
    // Delay hiding to allow moving mouse to tooltip
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip()
    }, 100)
  }
  
  handleClick(event) {
    const chordElement = this.findChordElement(event.target)
    if (!chordElement) return
    
    event.preventDefault()
    event.stopPropagation()
    
    const chordName = chordElement.dataset.chord
    
    if (this.isMobile) {
      this.showMobilePanel(chordName)
    } else {
      // On desktop, clicking toggles the tooltip
      if (this.currentChord === chordName && this.hasTooltipTarget && !this.tooltipTarget.classList.contains("hidden")) {
        this.hideTooltip()
      } else {
        this.showTooltip(chordName, chordElement)
      }
    }
  }
  
  showTooltip(chordName, targetElement) {
    if (!this.hasTooltipTarget) return
    
    const chordData = getChordData(chordName, this.instrumentValue)
    if (!chordData) {
      this.tooltipTarget.innerHTML = this.renderUnknownChord(chordName)
    } else {
      this.tooltipTarget.innerHTML = this.renderChordDiagram(chordName, chordData)
    }
    
    this.currentChord = chordName
    
    // Position tooltip near the target element
    const rect = targetElement.getBoundingClientRect()
    
    // Show tooltip first to get dimensions
    this.tooltipTarget.classList.remove("hidden")
    
    // Calculate position (above the chord by default)
    let top = rect.top - this.tooltipTarget.offsetHeight - 8
    let left = rect.left + (rect.width / 2) - (this.tooltipTarget.offsetWidth / 2)
    
    // Adjust if going off screen (top)
    if (top < 8) {
      top = rect.bottom + 8 // Show below instead
    }
    // Adjust if going off screen (bottom)
    if (top + this.tooltipTarget.offsetHeight > window.innerHeight - 8) {
      top = rect.top - this.tooltipTarget.offsetHeight - 8
    }
    // Adjust if going off screen (left)
    if (left < 8) {
      left = 8
    }
    // Adjust if going off screen (right)
    if (left + this.tooltipTarget.offsetWidth > window.innerWidth - 8) {
      left = window.innerWidth - this.tooltipTarget.offsetWidth - 8
    }
    
    // Use fixed positioning (no scroll offset needed)
    this.tooltipTarget.style.top = `${top}px`
    this.tooltipTarget.style.left = `${left}px`
    
    // Add hover listeners to tooltip itself
    this.tooltipTarget.addEventListener("mouseenter", this.handleTooltipEnter.bind(this))
    this.tooltipTarget.addEventListener("mouseleave", this.handleTooltipLeave.bind(this))
  }
  
  handleTooltipEnter() {
    clearTimeout(this.hideTimeout)
  }
  
  handleTooltipLeave() {
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip()
    }, 100)
  }
  
  hideTooltip() {
    if (this.hasTooltipTarget) {
      this.tooltipTarget.classList.add("hidden")
    }
    this.currentChord = null
  }
  
  showMobilePanel(chordName) {
    if (!this.hasMobilePanelTarget) return
    
    const chordData = getChordData(chordName, this.instrumentValue)
    const contentContainer = this.mobilePanelTarget.querySelector("[data-chord-content]")
    
    if (contentContainer) {
      if (!chordData) {
        contentContainer.innerHTML = this.renderUnknownChord(chordName, true)
      } else {
        contentContainer.innerHTML = this.renderChordDiagram(chordName, chordData, true)
      }
    }
    
    this.currentChord = chordName
    this.mobilePanelTarget.classList.remove("hidden")
    this.mobilePanelTarget.classList.add("flex")
    
    // Prevent body scroll when panel is open
    document.body.style.overflow = "hidden"
  }
  
  closeMobilePanel() {
    if (this.hasMobilePanelTarget) {
      this.mobilePanelTarget.classList.add("hidden")
      this.mobilePanelTarget.classList.remove("flex")
    }
    document.body.style.overflow = ""
    this.currentChord = null
  }
  
  // Prevent clicks inside the mobile panel from closing it
  stopPropagation(event) {
    event.stopPropagation()
  }
  
  selectInstrument(event) {
    const instrument = event.target.dataset.instrument || event.currentTarget.dataset.instrument
    if (instrument) {
      this.instrumentValue = instrument
      localStorage.setItem("chordDiagramInstrument", instrument)
      this.updateInstrumentSelector()
      
      // Refresh the current chord display if visible
      if (this.currentChord) {
        const chordData = getChordData(this.currentChord, this.instrumentValue)
        
        if (this.hasTooltipTarget && !this.tooltipTarget.classList.contains("hidden")) {
          if (!chordData) {
            this.tooltipTarget.innerHTML = this.renderUnknownChord(this.currentChord)
          } else {
            this.tooltipTarget.innerHTML = this.renderChordDiagram(this.currentChord, chordData)
          }
        }
        
        if (this.hasMobilePanelTarget && !this.mobilePanelTarget.classList.contains("hidden")) {
          const contentContainer = this.mobilePanelTarget.querySelector("[data-chord-content]")
          if (contentContainer) {
            if (!chordData) {
              contentContainer.innerHTML = this.renderUnknownChord(this.currentChord, true)
            } else {
              contentContainer.innerHTML = this.renderChordDiagram(this.currentChord, chordData, true)
            }
          }
        }
      }
    }
  }
  
  updateInstrumentSelector() {
    if (this.hasInstrumentSelectorTarget) {
      const buttons = this.instrumentSelectorTarget.querySelectorAll("[data-instrument]")
      buttons.forEach(btn => {
        if (btn.dataset.instrument === this.instrumentValue) {
          btn.classList.add("bg-slate-900", "text-white")
          btn.classList.remove("bg-white", "text-slate-600", "hover:bg-slate-100")
        } else {
          btn.classList.remove("bg-slate-900", "text-white")
          btn.classList.add("bg-white", "text-slate-600", "hover:bg-slate-100")
        }
      })
    }
    
    // Also update mobile panel selector if present
    if (this.hasMobilePanelTarget) {
      const mobileButtons = this.mobilePanelTarget.querySelectorAll("[data-instrument]")
      mobileButtons.forEach(btn => {
        if (btn.dataset.instrument === this.instrumentValue) {
          btn.classList.add("bg-slate-900", "text-white")
          btn.classList.remove("bg-white", "text-slate-600")
        } else {
          btn.classList.remove("bg-slate-900", "text-white")
          btn.classList.add("bg-white", "text-slate-600")
        }
      })
    }
  }
  
  renderChordDiagram(chordName, chordData, large = false) {
    switch (this.instrumentValue) {
      case "guitar":
        return this.renderFrettedInstrument(chordName, chordData, large, 6, ['E', 'A', 'D', 'G', 'B', 'e'])
      case "ukulele":
        return this.renderFrettedInstrument(chordName, chordData, large, 4, ['G', 'C', 'E', 'A'])
      case "cavaquinho":
        return this.renderFrettedInstrument(chordName, chordData, large, 4, ['D', 'G', 'B', 'D'])
      case "piano":
        return this.renderPianoChord(chordName, chordData, large)
      default:
        return this.renderFrettedInstrument(chordName, chordData, large, 6, ['E', 'A', 'D', 'G', 'B', 'e'])
    }
  }
  
  renderUnknownChord(chordName, large = false) {
    const size = large ? "text-lg" : "text-sm"
    return `
      <div class="flex flex-col items-center p-4">
        <div class="font-bold ${large ? 'text-xl' : 'text-base'} mb-2">${this.escapeHtml(chordName)}</div>
        <div class="${size} text-slate-500">Chord diagram not available</div>
      </div>
    `
  }
  
  // Unified renderer for guitar, ukulele, cavaquinho (fretted instruments)
  renderFrettedInstrument(chordName, chordData, large, numStrings, stringNames) {
    const { frets, barreAt, startFret = 1 } = chordData
    const numFrets = 5
    
    // Dimensions - adjusted for proper alignment
    const stringSpacing = large ? 24 : 16
    const fretSpacing = large ? 28 : 20
    const dotRadius = large ? 8 : 6
    const padding = large ? 30 : 24
    
    const gridWidth = (numStrings - 1) * stringSpacing
    const gridHeight = numFrets * fretSpacing
    const width = gridWidth + padding * 2
    const height = gridHeight + (large ? 85 : 68)
    
    const offsetX = padding
    const offsetY = large ? 55 : 45
    
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="chord-diagram">`
    
    // Chord name
    svg += `<text x="${width/2}" y="${large ? 22 : 16}" text-anchor="middle" font-weight="bold" font-size="${large ? '18' : '14'}" fill="#1e293b">${this.escapeHtml(chordName)}</text>`
    
    // Fret position indicator (if not starting at fret 1)
    if (startFret > 1) {
      svg += `<text x="${offsetX - 14}" y="${offsetY + fretSpacing/2 + 5}" text-anchor="middle" font-size="${large ? '13' : '11'}" fill="#64748b">${startFret}</text>`
    }
    
    // Draw nut (thick line at top) or thin line if not at first fret
    const nutY = offsetY
    if (startFret === 1) {
      svg += `<rect x="${offsetX - 2}" y="${nutY - 3}" width="${gridWidth + 4}" height="${large ? 5 : 4}" fill="#1e293b" rx="1"/>`
    } else {
      svg += `<line x1="${offsetX}" y1="${nutY}" x2="${offsetX + gridWidth}" y2="${nutY}" stroke="#64748b" stroke-width="2"/>`
    }
    
    // Draw frets (horizontal lines)
    for (let i = 1; i <= numFrets; i++) {
      const y = offsetY + i * fretSpacing
      svg += `<line x1="${offsetX}" y1="${y}" x2="${offsetX + gridWidth}" y2="${y}" stroke="#cbd5e1" stroke-width="1"/>`
    }
    
    // Draw strings (vertical lines)
    for (let i = 0; i < numStrings; i++) {
      const x = offsetX + i * stringSpacing
      // Thicker strings on bass side
      const strokeWidth = numStrings === 6 ? (i < 3 ? 2 : 1) : (i < 2 ? 2 : 1)
      svg += `<line x1="${x}" y1="${nutY}" x2="${x}" y2="${offsetY + gridHeight}" stroke="#64748b" stroke-width="${strokeWidth}"/>`
    }
    
    // Draw barre if present
    if (barreAt) {
      const barreDisplayFret = barreAt - startFret + 1
      if (barreDisplayFret >= 1 && barreDisplayFret <= numFrets) {
        const barreY = offsetY + (barreDisplayFret - 0.5) * fretSpacing
        // Find first and last strings with barre fret
        let firstBarre = -1, lastBarre = -1
        for (let i = 0; i < numStrings; i++) {
          if (frets[i] === barreAt) {
            if (firstBarre === -1) firstBarre = i
            lastBarre = i
          }
        }
        if (firstBarre !== -1 && lastBarre !== -1 && lastBarre > firstBarre) {
          // Extend barre beyond string centers to fully cover the strings
          const barreExtend = dotRadius + 2
          const barreX = offsetX + firstBarre * stringSpacing - barreExtend
          const barreWidth = (lastBarre - firstBarre) * stringSpacing + barreExtend * 2
          svg += `<rect x="${barreX}" y="${barreY - dotRadius}" width="${barreWidth}" height="${dotRadius * 2}" rx="${dotRadius}" fill="#1e293b"/>`
        }
      }
    }
    
    // Draw open/muted indicators and finger dots
    for (let i = 0; i < numStrings; i++) {
      const x = offsetX + i * stringSpacing
      const fret = frets[i]
      
      if (fret === -1) {
        // Muted string (X)
        const symbolY = offsetY - (large ? 14 : 11)
        const size = large ? 5 : 4
        svg += `<g transform="translate(${x}, ${symbolY})">
          <line x1="${-size}" y1="${-size}" x2="${size}" y2="${size}" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="${size}" y1="${-size}" x2="${-size}" y2="${size}" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
        </g>`
      } else if (fret === 0) {
        // Open string (O)
        const symbolY = offsetY - (large ? 14 : 11)
        const size = large ? 5 : 4
        svg += `<circle cx="${x}" cy="${symbolY}" r="${size}" fill="none" stroke="#64748b" stroke-width="1.5"/>`
      } else {
        // Fretted note
        const displayFret = fret - startFret + 1
        if (displayFret >= 1 && displayFret <= numFrets) {
          const y = offsetY + (displayFret - 0.5) * fretSpacing
          
          // Skip individual dot if it's covered by barre (same fret as barre and within barre range)
          const isPartOfBarre = barreAt && fret === barreAt
          if (!isPartOfBarre) {
            svg += `<circle cx="${x}" cy="${y}" r="${dotRadius}" fill="#1e293b"/>`
          }
        }
      }
    }
    
    // String names at bottom
    for (let i = 0; i < numStrings; i++) {
      const x = offsetX + i * stringSpacing
      svg += `<text x="${x}" y="${height - (large ? 8 : 6)}" text-anchor="middle" font-size="${large ? '12' : '10'}" fill="#94a3b8">${stringNames[i]}</text>`
    }
    
    svg += '</svg>'
    return `<div class="flex flex-col items-center">${svg}</div>`
  }
  
  renderPianoChord(chordName, chordData, large = false) {
    const { notes } = chordData
    
    // Piano keyboard dimensions - clean, simple like UG
    const whiteKeyWidth = large ? 24 : 18
    const whiteKeyHeight = large ? 80 : 60
    const blackKeyWidth = large ? 14 : 10
    const blackKeyHeight = large ? 50 : 38
    
    // Semitone values for each note
    const NOTE_SEMITONES = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    }
    
    // Normalize note names
    const normalizeNote = (note) => note.replace(/[0-9]/g, '').trim()
    
    // Get chord notes and their semitones
    const chordNotes = notes.map(n => normalizeNote(n))
    const rootNote = chordNotes[0]
    const rootSemitone = NOTE_SEMITONES[rootNote]
    
    // Calculate absolute semitone positions for each note (root first, others ascending after)
    const notePositions = []
    let currentSemitone = rootSemitone
    for (let i = 0; i < chordNotes.length; i++) {
      const note = chordNotes[i]
      let semitone = NOTE_SEMITONES[note]
      
      if (i === 0) {
        // Root note stays at its semitone
        notePositions.push({ note, semitone })
        currentSemitone = semitone
      } else {
        // Other notes should come AFTER the previous note
        while (semitone <= currentSemitone) {
          semitone += 12
        }
        notePositions.push({ note, semitone })
        currentSemitone = semitone
      }
    }
    
    // Find the range we need to display
    const minSemitone = notePositions[0].semitone
    const maxSemitone = notePositions[notePositions.length - 1].semitone
    
    // Start from the root note's natural position, show ~1.5 octaves
    // Map semitones to key positions
    const startSemitone = Math.max(0, minSemitone - 2) // Start a bit before root
    const endSemitone = Math.max(maxSemitone + 3, startSemitone + 17) // Show enough keys
    
    // Build the keyboard based on semitone range
    const keys = []
    for (let s = startSemitone; s <= endSemitone; s++) {
      const noteInOctave = s % 12
      const isBlack = [1, 3, 6, 8, 10].includes(noteInOctave)
      const noteNames = {
        0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
        6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
      }
      const altNames = { 1: 'Db', 3: 'Eb', 6: 'Gb', 8: 'Ab', 10: 'Bb' }
      keys.push({
        semitone: s,
        note: noteNames[noteInOctave],
        altNote: altNames[noteInOctave] || null,
        isBlack
      })
    }
    
    // Count white keys for sizing
    const whiteKeys = keys.filter(k => !k.isBlack)
    const numWhiteKeys = whiteKeys.length
    
    const width = numWhiteKeys * whiteKeyWidth + 20
    const height = whiteKeyHeight + (large ? 70 : 55)
    const offsetX = 10
    const offsetY = large ? 40 : 30
    
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="chord-diagram">`
    
    // Chord name
    svg += `<text x="${width/2}" y="${large ? 22 : 16}" text-anchor="middle" font-weight="bold" font-size="${large ? '18' : '14'}" fill="#1e293b">${this.escapeHtml(chordName)}</text>`
    
    // Create a set of semitones to highlight
    const highlightSemitones = new Set(notePositions.map(np => np.semitone))
    
    // Draw white keys first
    let whiteKeyIndex = 0
    const whiteKeyDots = []
    const blackKeyDots = []
    
    for (const key of keys) {
      if (key.isBlack) continue
      
      const x = offsetX + whiteKeyIndex * whiteKeyWidth
      const shouldHighlight = highlightSemitones.has(key.semitone)
      
      svg += `<rect x="${x}" y="${offsetY}" width="${whiteKeyWidth - 1}" height="${whiteKeyHeight}" fill="#fff" stroke="#1e293b" stroke-width="1"/>`
      
      if (shouldHighlight) {
        whiteKeyDots.push({ x: x + whiteKeyWidth/2 - 0.5, semitone: key.semitone })
      }
      
      whiteKeyIndex++
    }
    
    // Draw black keys on top
    whiteKeyIndex = 0
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key.isBlack) {
        // Position black key between the white keys
        const x = offsetX + whiteKeyIndex * whiteKeyWidth - blackKeyWidth/2 - 0.5
        const shouldHighlight = highlightSemitones.has(key.semitone)
        
        svg += `<rect x="${x}" y="${offsetY}" width="${blackKeyWidth}" height="${blackKeyHeight}" fill="#1e293b"/>`
        
        if (shouldHighlight) {
          blackKeyDots.push({ x: x + blackKeyWidth/2, semitone: key.semitone })
        }
      } else {
        whiteKeyIndex++
      }
    }
    
    // Draw dots on white keys
    const dotRadius = large ? 5 : 4
    for (const dot of whiteKeyDots) {
      const dotY = offsetY + whiteKeyHeight - dotRadius - (large ? 10 : 7)
      svg += `<circle cx="${dot.x}" cy="${dotY}" r="${dotRadius}" fill="#1e293b"/>`
    }
    
    // Draw dots on black keys (white dots)
    for (const dot of blackKeyDots) {
      const dotY = offsetY + blackKeyHeight - dotRadius - (large ? 6 : 4)
      svg += `<circle cx="${dot.x}" cy="${dotY}" r="${dotRadius}" fill="#fff"/>`
    }
    
    // Notes at bottom - in keyboard order (left to right)
    const notesInOrder = notePositions.map(np => np.note).join(' - ')
    svg += `<text x="${width/2}" y="${height - (large ? 8 : 5)}" text-anchor="middle" font-size="${large ? '12' : '10'}" fill="#64748b">${notesInOrder}</text>`
    
    svg += '</svg>'
    return `<div class="flex flex-col items-center">${svg}</div>`
  }
  
  escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}
