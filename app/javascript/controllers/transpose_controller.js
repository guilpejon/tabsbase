import { Controller } from "@hotwired/stimulus"
import { transposeChord, getChordRoot, NOTE_SEMITONES, CHROMATIC_NOTES_SHARP, CHROMATIC_NOTES_FLAT, usesFlats, isMinor, getAllKeys } from "chord_data"

// Handles chord transposition for tabs
// Allows users to change the key of a song and see all chords updated
export default class extends Controller {
  static targets = ["semitoneDisplay", "keyDisplay", "chordContent"]
  static values = {
    originalChords: Array,
    semitones: { type: Number, default: 0 },
    originalKey: String,
    hasKey: { type: Boolean, default: false }
  }

  originalKeyMinor = false
  
  connect() {
    // Store the original chord elements and their positions
    this.chordElements = []
    this.originalKey = this.detectOriginalKey()
    this.originalKeyValue = this.originalKey

    // Find all chord spans in the content
    this.collectChordElements()

    // Restore saved transpose value for this session
    const savedSemitones = sessionStorage.getItem('transposeValue')
    if (savedSemitones) {
      this.semitonesValue = parseInt(savedSemitones, 10)
      this.applyTransposition()
    }

    this.updateDisplays()
  }
  
  collectChordElements() {
    // Find all chord spans with data-chord attribute
    const allChords = this.element.querySelectorAll('[data-chord]')
    this.chordElements = Array.from(allChords).map(el => ({
      element: el,
      // Use the original chord if we've transposed before, otherwise use current chord
      originalChord: el.dataset.originalChord || el.dataset.chord
    }))
  }
  
  detectOriginalKey() {
    // If the tab has a key set, use it
    if (this.hasKeyValue) {
      if (this.originalChordsValue && this.originalChordsValue.length > 0) {
        const firstChord = this.originalChordsValue[0]
        this.originalKeyMinor = isMinor(firstChord)
        return getChordRoot(firstChord) || 'C'
      }

      // Fall back to looking at the first chord element
      const firstChordEl = this.element.querySelector('[data-chord]')
      if (firstChordEl) {
        this.originalKeyMinor = isMinor(firstChordEl.dataset.chord)
        return getChordRoot(firstChordEl.dataset.chord) || 'C'
      }
    }

    // For tabs without keys, don't try to detect - just use 'C' as a placeholder
    this.originalKeyMinor = false
    return 'C'
  }
  
  transposeUp() {
    this.semitonesValue = (this.semitonesValue + 1) % 12
    if (this.semitonesValue > 6) this.semitonesValue -= 12
    this.applyTransposition()
    this.saveState()
    this.updateDisplays()
  }
  
  transposeDown() {
    this.semitonesValue = this.semitonesValue - 1
    if (this.semitonesValue < -5) this.semitonesValue += 12
    this.applyTransposition()
    this.saveState()
    this.updateDisplays()
  }
  
  reset() {
    this.semitonesValue = 0
    this.applyTransposition()
    this.saveState()
    this.updateDisplays()
  }
  
  selectKey(event) {
    const newKey = event.target.value
    const originalSemitone = NOTE_SEMITONES[this.originalKey]
    const newSemitone = NOTE_SEMITONES[newKey]
    
    if (originalSemitone !== undefined && newSemitone !== undefined) {
      this.semitonesValue = (newSemitone - originalSemitone + 12) % 12
      if (this.semitonesValue > 6) this.semitonesValue -= 12
      this.applyTransposition()
      this.saveState()
      this.updateDisplays()
    }
  }
  
  applyTransposition() {
    // Re-collect chord elements in case the DOM was modified
    this.collectChordElements()
    
    // Update each chord element
    this.chordElements.forEach(({ element, originalChord }) => {
      const transposedChord = transposeChord(originalChord, this.semitonesValue)
      
      // Update the display text
      element.textContent = transposedChord
      
      // Update the data attribute for chord diagrams
      element.dataset.chord = transposedChord
      element.dataset.originalChord = originalChord
    })
    
    // Dispatch event for chord-diagram controller to update dictionary
    this.dispatch('transposed', { 
      detail: { 
        semitones: this.semitonesValue,
        transposedChords: this.getTransposedChordList()
      }
    })
  }
  
  getTransposedChordList() {
    // Get unique transposed chords in order
    const seen = new Set()
    const transposed = []
    
    this.chordElements.forEach(({ originalChord }) => {
      const transposedChord = transposeChord(originalChord, this.semitonesValue)
      if (!seen.has(transposedChord)) {
        seen.add(transposedChord)
        transposed.push(transposedChord)
      }
    })
    
    return transposed
  }
  
  updateDisplays() {
    // Update semitone display
    if (this.hasSemitoneDisplayTarget) {
      const sign = this.semitonesValue > 0 ? '+' : ''
      this.semitoneDisplayTarget.textContent = `${sign}${this.semitonesValue}`
    }

    // Update key display
    if (this.hasKeyDisplayTarget) {
      const currentKey = this.getCurrentKey()
      this.keyDisplayTarget.textContent = currentKey
    }

    // Update key selector if present
    const keySelector = this.element.querySelector('[data-transpose-key-selector]')
    if (keySelector) {
      const currentKey = this.getCurrentKey()
      keySelector.value = currentKey
    }
  }
  
  getCurrentKey() {
    // For tabs without keys, show the semitone offset with +/- sign
    if (!this.hasKeyValue) {
      const sign = this.semitonesValue > 0 ? '+' : ''
      return `${sign}${this.semitonesValue}`
    }

    // For tabs with keys, show the actual key name
    const originalSemitone = NOTE_SEMITONES[this.originalKey] || 0
    let newSemitone = (originalSemitone + this.semitonesValue) % 12
    if (newSemitone < 0) newSemitone += 12

    let keyName
    // Use flat notation if the original key uses flats
    if (usesFlats(this.originalKey)) {
      keyName = CHROMATIC_NOTES_FLAT[newSemitone]
    } else {
      keyName = CHROMATIC_NOTES_SHARP[newSemitone]
    }

    // Append 'm' if the original key was minor
    return this.originalKeyMinor ? keyName + 'm' : keyName
  }
  
  saveState() {
    sessionStorage.setItem('transposeValue', this.semitonesValue.toString())
  }
  
  // Called when tab-wrapper updates the content (e.g., for scrolling)
  refresh() {
    this.collectChordElements()
    if (this.semitonesValue !== 0) {
      this.applyTransposition()
    }
  }
}

