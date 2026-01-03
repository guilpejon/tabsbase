import { Controller } from "@hotwired/stimulus"

// Auto-scroll Controller
// Manages automatic scrolling of tab content with adjustable speed
export default class extends Controller {
  static targets = ["playButton", "playIcon", "pauseIcon", "playText", "speedSlider", "speedDisplay", "content", "arrow"]
  static values = {
    songDuration: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    speed: { type: Number, default: 1.0 },
    expanded: { type: Boolean, default: false }
  }

  connect() {
    // Calculate base scroll speed
    this.calculateBaseSpeed()

    // Initialize state
    this.animationFrameId = null
    this.startTime = null
    this.pausedAt = 0
    this.currentScrollTop = 0
    this.lastContentHeight = this.getScrollableHeight()

    // Bind event handlers
    this.handleManualScrollBound = this.handleManualScroll.bind(this)
    this.handleResizeBound = this.handleResize.bind(this)
    this.handleTransposeBound = this.handleContentChange.bind(this)
    this.handleSingerModeBound = this.handleContentChange.bind(this)
    this.handleWrapperResizeBound = this.handleContentChange.bind(this)

    // Listen for events
    window.addEventListener('scroll', this.handleManualScrollBound, { passive: true })
    window.addEventListener('resize', this.handleResizeBound)
    document.addEventListener('transpose:transposed', this.handleTransposeBound)
    document.addEventListener('singer-mode:modeChanged', this.handleSingerModeBound)
    document.addEventListener('tab-wrapper:contentResized', this.handleWrapperResizeBound)

    // Initialize UI
    this.updateSpeedDisplay()
  }

  toggleSection() {
    this.expandedValue = !this.expandedValue

    if (this.expandedValue) {
      // Expand section
      this.contentTarget.classList.remove('hidden')
      this.arrowTarget.style.transform = 'rotate(90deg)'
    } else {
      // Collapse section and stop scrolling if playing
      this.contentTarget.classList.add('hidden')
      this.arrowTarget.style.transform = 'rotate(0deg)'
      if (this.isPlayingValue) {
        this.stopScrolling()
      }
    }
  }

  disconnect() {
    // Clean up
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    // Remove event listeners
    window.removeEventListener('scroll', this.handleManualScrollBound)
    window.removeEventListener('resize', this.handleResizeBound)
    document.removeEventListener('transpose:transposed', this.handleTransposeBound)
    document.removeEventListener('singer-mode:modeChanged', this.handleSingerModeBound)
    document.removeEventListener('tab-wrapper:contentResized', this.handleWrapperResizeBound)
  }

  calculateBaseSpeed() {
    const contentHeight = this.getScrollableHeight()
    const viewportHeight = window.innerHeight
    const scrollableDistance = contentHeight - viewportHeight

    if (scrollableDistance <= 0) {
      this.basePixelsPerSecond = 0
      return
    }

    if (this.songDurationValue && this.songDurationValue > 0) {
      // Use song duration with 20% buffer
      const bufferTime = this.songDurationValue * 0.2
      const totalTime = this.songDurationValue + bufferTime
      this.basePixelsPerSecond = scrollableDistance / totalTime
    } else {
      // Fallback: estimate based on content length
      // Average reading speed: ~200 words per minute
      // Estimate ~50 pixels = 1 line, ~10 words per line
      const estimatedWords = contentHeight / 5
      const estimatedMinutes = estimatedWords / 200
      const estimatedSeconds = Math.max(estimatedMinutes * 60, 60) // Minimum 1 minute
      this.basePixelsPerSecond = scrollableDistance / estimatedSeconds
    }
  }

  togglePlay() {
    if (this.isPlayingValue) {
      this.stopScrolling()
    } else {
      this.startScrolling()
    }
  }

  startScrolling() {
    this.isPlayingValue = true
    this.startTime = performance.now()
    this.currentScrollTop = window.scrollY
    this.pausedAt = this.currentScrollTop

    // Update UI
    this.updatePlayButton()

    // Start animation loop
    this.animationFrameId = requestAnimationFrame((t) => this.scroll(t))
  }

  stopScrolling() {
    this.isPlayingValue = false
    this.pausedAt = window.scrollY

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // Update UI
    this.updatePlayButton()
  }

  scroll(timestamp) {
    if (!this.isPlayingValue) return

    // Calculate elapsed time since start
    const elapsed = (timestamp - this.startTime) / 1000 // Convert to seconds

    // Calculate new position with speed multiplier
    const pixelsToScroll = this.basePixelsPerSecond * this.speedValue * elapsed
    const newScrollTop = this.pausedAt + pixelsToScroll

    // Check if at bottom
    const maxScroll = this.getScrollableHeight() - window.innerHeight

    if (newScrollTop >= maxScroll) {
      // Reached bottom - stop scrolling
      window.scrollTo({ top: maxScroll, behavior: 'auto' })
      this.stopScrolling()
      return
    }

    // Continue scrolling
    window.scrollTo({ top: newScrollTop, behavior: 'auto' })
    this.currentScrollTop = newScrollTop

    // Continue animation
    this.animationFrameId = requestAnimationFrame((t) => this.scroll(t))
  }

  adjustSpeed(event) {
    this.speedValue = parseFloat(event.target.value)

    // Sync all sliders (mobile and desktop)
    this.speedSliderTargets.forEach(slider => {
      slider.value = this.speedValue
    })

    this.updateSpeedDisplay()

    // If currently scrolling, recalculate timing to maintain smooth transition
    if (this.isPlayingValue) {
      const currentPosition = window.scrollY
      this.pausedAt = currentPosition
      this.startTime = performance.now()
      this.currentScrollTop = currentPosition
    }
  }

  increaseSpeed() {
    const newSpeed = Math.min(this.speedValue + 0.25, 3.0)
    this.speedValue = newSpeed

    // Update all sliders (mobile and desktop)
    this.speedSliderTargets.forEach(slider => {
      slider.value = newSpeed
    })

    this.updateSpeedDisplay()

    // Recalculate if playing
    if (this.isPlayingValue) {
      const currentPosition = window.scrollY
      this.pausedAt = currentPosition
      this.startTime = performance.now()
      this.currentScrollTop = currentPosition
    }
  }

  decreaseSpeed() {
    const newSpeed = Math.max(this.speedValue - 0.25, 0.5)
    this.speedValue = newSpeed

    // Update all sliders (mobile and desktop)
    this.speedSliderTargets.forEach(slider => {
      slider.value = newSpeed
    })

    this.updateSpeedDisplay()

    // Recalculate if playing
    if (this.isPlayingValue) {
      const currentPosition = window.scrollY
      this.pausedAt = currentPosition
      this.startTime = performance.now()
      this.currentScrollTop = currentPosition
    }
  }

  reset() {
    // Stop scrolling
    if (this.isPlayingValue) {
      this.stopScrolling()
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Reset state
    this.pausedAt = 0
    this.currentScrollTop = 0
    this.startTime = null
  }

  handleManualScroll(event) {
    if (!this.isPlayingValue) return

    // Detect if user manually scrolled
    const actualScrollTop = window.scrollY
    const difference = Math.abs(actualScrollTop - this.currentScrollTop)

    if (difference > 5) {
      // User scrolled manually - adjust position tracking but KEEP scrolling
      // Recalculate startTime and pausedAt to account for manual scroll
      this.pausedAt = actualScrollTop
      this.startTime = performance.now()
      this.currentScrollTop = actualScrollTop
    }
  }

  handleContentChange() {
    const oldHeight = this.lastContentHeight || this.getScrollableHeight()
    const newHeight = this.getScrollableHeight()

    if (Math.abs(newHeight - oldHeight) < 10) {
      // Insignificant change, ignore
      return
    }

    const heightRatio = newHeight / oldHeight

    // Adjust current position proportionally if playing
    if (this.isPlayingValue) {
      const currentRelativePosition = this.currentScrollTop / oldHeight
      this.pausedAt = currentRelativePosition * newHeight
      this.currentScrollTop = this.pausedAt
      this.startTime = performance.now()
    }

    // Recalculate base speed
    this.calculateBaseSpeed()
    this.lastContentHeight = newHeight
  }

  handleResize() {
    this.handleContentChange()
  }

  getScrollableHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
  }

  updatePlayButton() {
    if (this.isPlayingValue) {
      // Show pause icon, hide play icon (handle multiple targets for mobile/desktop)
      this.playIconTargets.forEach(icon => icon.classList.add('hidden'))
      this.pauseIconTargets.forEach(icon => icon.classList.remove('hidden'))
      if (this.hasPlayTextTarget) {
        this.playTextTargets.forEach(text => text.textContent = 'Pause')
      }
    } else {
      // Show play icon, hide pause icon (handle multiple targets for mobile/desktop)
      this.playIconTargets.forEach(icon => icon.classList.remove('hidden'))
      this.pauseIconTargets.forEach(icon => icon.classList.add('hidden'))
      if (this.hasPlayTextTarget) {
        this.playTextTargets.forEach(text => text.textContent = 'Auto-scroll')
      }
    }
  }

  updateSpeedDisplay() {
    const displayText = `${this.speedValue.toFixed(2)}x`
    this.speedDisplayTargets.forEach(display => display.textContent = displayText)
  }
}
