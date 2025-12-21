import { Controller } from "@hotwired/stimulus"

// Wraps tab notation and chord+lyric groups intelligently.
// - Tab notation: all strings break at the same position
// - Chord+lyric groups: multiple chord lines + lyric line wrap together
export default class extends Controller {
  static targets = ["content"]

  connect() {
    this.wrapContent()
    this.resizeObserver = new ResizeObserver(() => this.wrapContent())
    this.resizeObserver.observe(this.element)
  }

  disconnect() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  wrapContent() {
    const container = this.contentTarget
    const containerWidth = container.clientWidth
    
    // Process pre elements (tab blocks with notation like G|---)
    container.querySelectorAll('pre').forEach(pre => {
      this.processTabBlock(pre, containerWidth)
    })
    
    // Process div elements (chord sheets / text blocks)
    container.querySelectorAll('div').forEach(div => {
      // Only process divs that are direct children and have content
      if (div.parentElement === container && div.innerHTML.includes('<span')) {
        this.processChordSheet(div, containerWidth)
      }
    })
  }

  processTabBlock(pre, containerWidth) {
    const originalText = pre.dataset.originalText || pre.textContent
    
    if (!pre.dataset.originalText) {
      pre.dataset.originalText = originalText
      pre.dataset.originalHtml = pre.innerHTML
    }
    
    const html = pre.dataset.originalHtml
    const text = pre.dataset.originalText
    
    // Check if this is tab notation (G|---, e|---, etc.) or chord sheet
    if (this.hasTabNotation(text)) {
      pre.innerHTML = this.wrapTabBlock(html, text, containerWidth, pre)
      // Keep whitespace-pre for tab notation
      pre.style.whiteSpace = 'pre'
      pre.style.overflowWrap = 'normal'
    } else if (this.usesSpacingForAlignment(text)) {
      // Content uses multiple spaces for column alignment (like chord diagrams)
      // Keep whitespace-pre to preserve the formatting
      pre.style.whiteSpace = 'pre'
      pre.style.overflowWrap = 'normal'
    } else if (html.includes('<span')) {
      // This is a chord sheet inside a <pre> block - allow text wrapping
      pre.style.whiteSpace = 'pre-wrap'
      pre.style.overflowWrap = 'anywhere'
      
      const charWidth = this.measureCharWidth(pre)
      const availableWidth = containerWidth - 32
      const charsPerLine = Math.floor(availableWidth / charWidth)
      
      if (charsPerLine > 0) {
        const maxLen = this.maxLineLength(text.split('\n'))
        if (charsPerLine < maxLen) {
          pre.innerHTML = this.wrapChordSheet(html, text, charsPerLine)
        } else {
          // No wrapping needed - restore original
          pre.innerHTML = html
        }
      }
    } else {
      // Plain text in a <pre> block - allow wrapping
      pre.style.whiteSpace = 'pre-wrap'
      pre.style.overflowWrap = 'anywhere'
    }
  }
  
  // Check if content uses multiple consecutive spaces for alignment (like chord diagrams)
  usesSpacingForAlignment(text) {
    // If any line has 3+ consecutive spaces, it's likely using spacing for alignment
    return /  {2,}/.test(text)
  }

  processChordSheet(div, containerWidth) {
    // Store original on first run
    if (!div.dataset.originalHtml) {
      div.dataset.originalHtml = div.innerHTML
      div.dataset.originalText = div.textContent
    }
    
    const html = div.dataset.originalHtml
    const text = div.dataset.originalText
    
    // Only apply JS wrapping if this has clear chord-line/lyric-line pairs
    // (where chord lines have spans and are mostly whitespace)
    // For inline chord content, let CSS handle wrapping
    if (!this.hasChordLyricPairStructure(html, text)) {
      div.innerHTML = html
      return
    }
    
    const charWidth = this.measureCharWidth(div)
    const availableWidth = containerWidth - 16
    const charsPerLine = Math.floor(availableWidth / charWidth)
    
    if (charsPerLine <= 0) {
      return
    }
    
    const maxLen = this.maxLineLength(text.split('\n'))
    if (charsPerLine >= maxLen) {
      div.innerHTML = html
      return
    }
    
    div.innerHTML = this.wrapChordSheet(html, text, charsPerLine)
  }
  
  // Check if content has chord-line/lyric-line pair structure
  // (chord lines are mostly whitespace with spans, followed by text lines)
  hasChordLyricPairStructure(html, text) {
    const htmlLines = html.split('\n')
    const textLines = text.split('\n')
    
    let chordLineCount = 0
    let lyricLineCount = 0
    
    for (let i = 0; i < Math.min(20, htmlLines.length); i++) {
      const htmlLine = htmlLines[i] || ''
      const textLine = textLines[i] || ''
      
      if (this.isChordLine(htmlLine, textLine)) {
        chordLineCount++
      } else if (textLine.trim().length > 0 && !this.isSectionMarker(textLine)) {
        lyricLineCount++
      }
    }
    
    // If we have roughly equal chord and lyric lines, it's a pair structure
    // If chord lines are much fewer than lyric lines, it's inline chords
    return chordLineCount > 0 && lyricLineCount > 0 && 
           chordLineCount >= lyricLineCount * 0.5
  }

  wrapChordSheet(html, text, charsPerLine) {
    const htmlLines = html.split('\n')
    const textLines = text.split('\n')
    
    const result = []
    let i = 0
    
    while (i < htmlLines.length) {
      // Check if current line is a chord line
      if (this.isChordLine(htmlLines[i], textLines[i])) {
        const chordHtml = htmlLines[i]
        const chordText = textLines[i] || ''
        i++
        
        // Get the lyric line that follows (if any)
        let lyricHtml = ''
        let lyricText = ''
        
        if (i < htmlLines.length && 
            !this.isChordLine(htmlLines[i], textLines[i]) &&
            (textLines[i] || '').trim() !== '' &&
            !this.isSectionMarker(textLines[i])) {
          lyricHtml = htmlLines[i]
          lyricText = textLines[i] || ''
          i++
        }
        
        // Wrap chord+lyric pair together
        if (lyricHtml) {
          const wrapped = this.wrapChordLyricPair(chordHtml, chordText, lyricHtml, lyricText, charsPerLine)
          result.push(...wrapped)
        } else {
          // Orphan chord line - just add it
          result.push(chordHtml)
        }
      } else {
        // Regular line (section marker, empty, or lyric without chord)
        result.push(htmlLines[i])
        i++
      }
    }
    
    return result.join('\n')
  }

  isSectionMarker(text) {
    if (!text) return false
    return /^\s*\[(?:Verse|Chorus|Bridge|Break|Intro|Outro)/i.test(text)
  }

  isChordLine(html, text) {
    if (!html || !html.includes('<span')) {
      return false
    }
    // A chord line has span tags (chords) and is mostly whitespace
    const htmlTextOnly = html.replace(/<[^>]*>/g, '')
    const nonSpaceChars = htmlTextOnly.replace(/\s/g, '').length
    const totalChars = htmlTextOnly.length
    
    // If more than 60% is whitespace, it's a chord positioning line
    return totalChars === 0 || (nonSpaceChars / totalChars) < 0.4
  }

  wrapChordLyricPair(chordHtml, chordText, lyricHtml, lyricText, charsPerLine) {
    const maxLen = Math.max(chordText.length, lyricText.length)
    
    if (maxLen <= charsPerLine) {
      return [chordHtml, lyricHtml]
    }
    
    const result = []
    let pos = 0
    
    while (pos < maxLen) {
      // Find break point based on the LONGER line (lyric usually)
      // to avoid cutting words mid-way
      const breakPoint = this.findBreakPoint(lyricText, chordText, pos, charsPerLine)
      
      // Slice both lines at the same position
      const chordSlice = this.extractTextRange(chordHtml, chordText, pos, breakPoint)
      const lyricSlice = this.extractTextRange(lyricHtml, lyricText, pos, breakPoint)
      
      // Add chord line first, then lyric line (maintaining the pair structure)
      if (chordSlice.trim()) {
        result.push(chordSlice)
      }
      if (lyricSlice.trim()) {
        result.push(lyricSlice)
      }
      
      pos = breakPoint
    }
    
    return result
  }
  
  // Find a good break point that doesn't split words
  findBreakPoint(lyricText, chordText, start, maxLength) {
    const targetEnd = start + maxLength
    const textLen = Math.max(lyricText.length, chordText.length)
    
    // If we'd go past the end, just return the end
    if (targetEnd >= textLen) {
      return textLen
    }
    
    // Check if we're at a natural break (space or end of text)
    if (lyricText[targetEnd] === ' ' || lyricText[targetEnd] === undefined) {
      return targetEnd
    }
    
    // We're in the middle of a word - find the last space before targetEnd
    let lastSpace = targetEnd
    while (lastSpace > start && lyricText[lastSpace] !== ' ') {
      lastSpace--
    }
    
    // If we found a space (not at start), use it
    if (lastSpace > start) {
      return lastSpace + 1 // Include the space with the previous chunk
    }
    
    // No space found - we have to cut mid-word (very long word)
    return targetEnd
  }
  
  // Extract HTML/text from start to end position
  extractTextRange(html, text, start, end) {
    if (start >= text.length) {
      return ''
    }
    
    // Simple case: no HTML
    if (!html.includes('<')) {
      return text.substring(start, end)
    }
    
    // Extract HTML while preserving spans
    return this.extractHtmlRange(html, text, start, end)
  }

  // Slice a line (with HTML) at text positions, respecting word boundaries and keeping chords together
  sliceLineAt(html, text, start, length) {
    const targetEnd = start + length
    
    // Simple case: no HTML tags - just slice text with word boundary respect
    if (!html.includes('<')) {
      return this.sliceTextAtWordBoundary(text, start, length)
    }
    
    // For HTML content, we need to:
    // 1. Find a good break point (not mid-word, not mid-chord)
    // 2. Extract that portion of HTML
    
    // First, find all chord positions in the text
    const chordPositions = this.findChordPositions(html, text)
    
    // Find the best end position (respecting word and chord boundaries)
    let actualEnd = this.findBestBreakPoint(text, start, targetEnd, chordPositions)
    
    // Now extract the HTML from start to actualEnd
    return this.extractHtmlRange(html, text, start, actualEnd)
  }
  
  // Slice plain text at word boundary
  sliceTextAtWordBoundary(text, start, length) {
    const targetEnd = start + length
    
    if (targetEnd >= text.length) {
      return text.substring(start)
    }
    
    // Find the last space before or at targetEnd
    let actualEnd = targetEnd
    if (text[targetEnd] !== ' ' && text[targetEnd] !== undefined) {
      // We're in the middle of a word, find the last space
      let lastSpace = text.lastIndexOf(' ', targetEnd)
      if (lastSpace > start) {
        actualEnd = lastSpace + 1 // Include the space
      }
      // If no space found after start, we have to cut mid-word (single long word)
    }
    
    return text.substring(start, actualEnd)
  }
  
  // Find positions of all chords (spans) in the text
  findChordPositions(html, text) {
    const positions = []
    let textPos = 0
    let i = 0
    let inSpan = false
    let spanStart = -1
    
    while (i < html.length) {
      if (html[i] === '<') {
        const tagEnd = html.indexOf('>', i)
        if (tagEnd === -1) break
        
        const tag = html.substring(i, tagEnd + 1)
        
        if (tag.startsWith('<span')) {
          inSpan = true
          spanStart = textPos
        } else if (tag === '</span>') {
          if (inSpan) {
            positions.push({ start: spanStart, end: textPos })
            inSpan = false
          }
        }
        
        i = tagEnd + 1
      } else {
        textPos++
        i++
      }
    }
    
    return positions
  }
  
  // Find the best break point that doesn't split words or chords
  findBestBreakPoint(text, start, targetEnd, chordPositions) {
    if (targetEnd >= text.length) {
      return text.length
    }
    
    // Check if targetEnd is inside a chord - if so, include the whole chord
    for (const chord of chordPositions) {
      if (targetEnd > chord.start && targetEnd < chord.end) {
        // We're cutting inside a chord - extend to include it
        targetEnd = chord.end
      }
    }
    
    // Now check if we're cutting inside a word
    if (targetEnd < text.length && text[targetEnd] !== ' ' && text[targetEnd - 1] !== ' ') {
      // We're in the middle of a word, find the last space
      let lastSpace = targetEnd
      while (lastSpace > start && text[lastSpace] !== ' ') {
        lastSpace--
      }
      
      if (lastSpace > start) {
        // Make sure this break point doesn't cut through a chord
        for (const chord of chordPositions) {
          if (lastSpace > chord.start && lastSpace <= chord.end) {
            // The space is inside or right after a chord, try before the chord
            lastSpace = chord.start
            break
          }
        }
        
        if (lastSpace > start) {
          targetEnd = lastSpace + 1 // Include trailing space
        }
      }
      // If no good break point, we have to cut (very long word)
    }
    
    return targetEnd
  }
  
  // Extract HTML from start to end text positions
  extractHtmlRange(html, text, start, end) {
    let result = ''
    let textPos = 0
    let i = 0
    let activeSpans = []
    let started = false
    
    while (i < html.length && textPos < end) {
      if (html[i] === '<') {
        const tagEnd = html.indexOf('>', i)
        if (tagEnd === -1) break
        
        const tag = html.substring(i, tagEnd + 1)
        const isClosing = tag.startsWith('</')
        
        if (isClosing) {
          if (started && activeSpans.length > 0) {
            result += tag
          }
          activeSpans.pop()
        } else {
          activeSpans.push(tag)
          if (textPos >= start || (textPos < start && this.spanCrossesStart(html, i, text, start))) {
            if (!started && activeSpans.length > 0) {
              started = true
            }
            result += tag
          }
        }
        
        i = tagEnd + 1
      } else {
        if (textPos >= start && textPos < end) {
          if (!started) {
            // Add any pending opening spans
            started = true
            if (activeSpans.length > 0 && !result.includes('<span')) {
              result = activeSpans.join('') + result
            }
          }
          result += html[i]
        }
        textPos++
        i++
      }
    }
    
    // Close any open spans
    const openSpans = (result.match(/<span/g) || []).length
    const closeSpans = (result.match(/<\/span>/g) || []).length
    for (let s = 0; s < openSpans - closeSpans; s++) {
      result += '</span>'
    }
    
    return result
  }
  
  // Check if a span starting at htmlPos contains text that crosses the start position
  spanCrossesStart(html, htmlPos, text, start) {
    let textPos = 0
    let i = 0
    
    // Count text positions up to htmlPos
    while (i < htmlPos) {
      if (html[i] === '<') {
        const tagEnd = html.indexOf('>', i)
        if (tagEnd === -1) break
        i = tagEnd + 1
      } else {
        textPos++
        i++
      }
    }
    
    // Now find where this span ends
    const spanEnd = html.indexOf('</span>', htmlPos)
    if (spanEnd === -1) return false
    
    let spanTextEnd = textPos
    i = htmlPos
    while (i < spanEnd) {
      if (html[i] === '<') {
        const tagEnd = html.indexOf('>', i)
        if (tagEnd === -1) break
        i = tagEnd + 1
      } else {
        spanTextEnd++
        i++
      }
    }
    
    // Span crosses start if it starts before and ends after
    return textPos < start && spanTextEnd > start
  }

  // Check if content has actual tab notation (G|---, G----, e|---, e----, |---, etc.)
  hasTabNotation(text) {
    // Match lines starting with string letter + | or -, OR lines starting directly with |
    // OR lines that start with dashes/numbers (tab continuation)
    const tabLinePattern = /^[A-Ga-g]#?[\|\-]/m
    const pipeOnlyPattern = /^\|[\-0-9]/m
    const dashLinePattern = /^[\-0-9]{3,}/m // Lines starting with 3+ dashes/numbers
    return tabLinePattern.test(text) || pipeOnlyPattern.test(text) || dashLinePattern.test(text)
  }

  wrapTabBlock(html, originalText, containerWidth, preElement) {
    const lines = html.split('\n')
    const textLines = originalText.split('\n')
    
    const charWidth = this.measureCharWidth(preElement)
    const availableWidth = containerWidth - 32
    const charsPerLine = Math.floor(availableWidth / charWidth)
    
    if (charsPerLine <= 0 || charsPerLine >= this.maxLineLength(textLines)) {
      return html
    }
    
    const result = []
    let i = 0
    let lastWasTabGroup = false
    
    while (i < lines.length) {
      const groupInfo = this.getTabGroupWithHeader(textLines, i)
      
      if (groupInfo.tabGroupSize > 0) {
        // Add spacing before this tab group if there was a previous tab group
        if (lastWasTabGroup && result.length > 0 && result[result.length - 1] !== '') {
          result.push('')
        }
        
        const htmlGroup = lines.slice(i, i + groupInfo.totalSize)
        const textGroup = textLines.slice(i, i + groupInfo.totalSize)
        
        const wrappedGroup = this.wrapTabGroup(htmlGroup, textGroup, charsPerLine)
        result.push(...wrappedGroup)
        
        i += groupInfo.totalSize
        lastWasTabGroup = true
      } else {
        // Non-tab line - add it and reset the tab group flag
        if (textLines[i].trim() !== '') {
          lastWasTabGroup = false
        }
        result.push(lines[i])
        i++
      }
    }
    
    return result.join('\n')
  }

  getTabGroupWithHeader(lines, startIndex) {
    const tabLinePattern = /^([A-Ga-g]#?)[\|\-]/
    const pipeOnlyPattern = /^\|[\-0-9]/
    const dashLinePattern = /^[\-0-9]{3,}/ // Lines starting with 3+ dashes/numbers (tab continuation)
    
    // Helper to check if a line is any kind of tab line
    const isTabLine = (line) => tabLinePattern.test(line) || pipeOnlyPattern.test(line) || dashLinePattern.test(line)
    
    let headerLines = 0
    let searchIndex = startIndex
    
    while (searchIndex < lines.length) {
      const line = lines[searchIndex]
      if (isTabLine(line)) {
        break
      }
      let hasUpcomingTab = false
      for (let look = searchIndex + 1; look < Math.min(searchIndex + 3, lines.length); look++) {
        if (isTabLine(lines[look])) {
          hasUpcomingTab = true
          break
        }
      }
      if (hasUpcomingTab && line.trim() !== '') {
        headerLines++
        searchIndex++
      } else {
        break
      }
    }
    
    const seenStrings = new Set()
    let tabGroupSize = 0
    let isPipeOnlyGroup = false
    
    for (let i = searchIndex; i < lines.length; i++) {
      const line = lines[i]
      const match = line.match(tabLinePattern)
      const isPipeOnly = pipeOnlyPattern.test(line)
      const isDashLine = dashLinePattern.test(line)
      
      if (match) {
        // Standard tab line with string letter (e|---, G|---, etc.)
        const stringName = match[1].toUpperCase()
        const isDuplicateE = seenStrings.has(stringName) && stringName === 'E'
        const isAllowedDuplicate = isDuplicateE && tabGroupSize === 5
        
        if (seenStrings.has(stringName) && !isAllowedDuplicate) {
          break
        }
        
        if (!isAllowedDuplicate) {
          seenStrings.add(stringName)
        }
        tabGroupSize++
      } else if (isPipeOnly || isDashLine) {
        // Pipe-only tab line (|---, |3-5-7, etc.) or dash-only continuation line
        isPipeOnlyGroup = true
        tabGroupSize++
        
        // For tabs without string letters, we need to detect natural groupings
        // Bass tabs have 4 strings, guitar has 6. Some tabs show two measures side-by-side (8 or 12 lines)
        // Keep adding lines as long as they're tab content
        // Stop when: empty line, text line, or we've hit a reasonable limit
        if (tabGroupSize >= 4) {
          const nextLine = lines[i + 1]
          const isNextLineTab = nextLine && (pipeOnlyPattern.test(nextLine) || dashLinePattern.test(nextLine))
          
          // Stop if next line is not a tab line
          if (!isNextLineTab) {
            break
          }
          
          // Also stop at multiples of 4 or 6 if the pattern changes (e.g., from | lines to - lines)
          // This handles tabs with two measures side by side
          if ((tabGroupSize === 4 || tabGroupSize === 6 || tabGroupSize === 8 || tabGroupSize === 12)) {
            // If we're at a boundary and the next line type differs, keep going to get the full measure pair
            // But cap at reasonable limits
            if (tabGroupSize >= 12) {
              break
            }
          }
        }
      } else if (tabGroupSize > 0) {
        break
      } else {
        break
      }
    }
    
    if (tabGroupSize < 2) {
      return { headerLines: 0, tabGroupSize: 0, totalSize: 0 }
    }
    
    return { 
      headerLines, 
      tabGroupSize, 
      totalSize: headerLines + tabGroupSize 
    }
  }

  wrapTabGroup(htmlLines, textLines, charsPerLine) {
    const maxLen = Math.max(...textLines.map(l => l.length))
    
    if (maxLen <= charsPerLine) {
      // No wrapping needed, but still return with a trailing empty line for spacing between groups
      return [...htmlLines, '']
    }
    
    // Find natural break points - look for | characters that appear in most lines near the target position
    const breakPoints = this.findNaturalBreakPoints(textLines, charsPerLine, maxLen)
    
    const result = []
    let prevPos = 0
    
    for (const breakPos of breakPoints) {
      const chunk = htmlLines.map((html, idx) => {
        return this.sliceHtmlByTextPosition(html, textLines[idx], prevPos, breakPos)
      })
      const nonEmptyChunk = chunk.filter(line => line.trim() !== '')
      // No empty line between wrapped chunks - keep them close together
      result.push(...nonEmptyChunk)
      prevPos = breakPos
    }
    
    // Add remaining content after last break point
    if (prevPos < maxLen) {
      const chunk = htmlLines.map((html, idx) => {
        return this.sliceHtmlByTextPosition(html, textLines[idx], prevPos, maxLen)
      })
      const nonEmptyChunk = chunk.filter(line => line.trim() !== '')
      result.push(...nonEmptyChunk)
    }
    
    // Add trailing empty line for spacing between different tab groups
    result.push('')
    
    return result
  }
  
  findNaturalBreakPoints(textLines, charsPerLine, maxLen) {
    const breakPoints = []
    let pos = charsPerLine
    
    while (pos < maxLen) {
      // Look for a | character near the target position that appears in most lines
      let bestBreak = pos
      let foundPipeBreak = false
      
      // Search window around target position
      const searchStart = Math.max(0, pos - 10)
      const searchEnd = Math.min(maxLen, pos + 10)
      
      // Count | occurrences at each position across all lines
      const pipeCounts = {}
      for (let checkPos = searchStart; checkPos < searchEnd; checkPos++) {
        let count = 0
        for (const line of textLines) {
          if (line[checkPos] === '|') count++
        }
        if (count > 0) {
          pipeCounts[checkPos] = count
        }
      }
      
      // Find the best | position (most lines have it, closest to target)
      const pipePositions = Object.entries(pipeCounts)
        .filter(([p, c]) => c >= textLines.length / 2) // At least half the lines have |
        .sort((a, b) => {
          // Prefer positions with more pipes, then closer to target
          if (b[1] !== a[1]) return b[1] - a[1]
          return Math.abs(parseInt(a[0]) - pos) - Math.abs(parseInt(b[0]) - pos)
        })
      
      if (pipePositions.length > 0) {
        bestBreak = parseInt(pipePositions[0][0]) + 1 // Break after the |
        foundPipeBreak = true
      }
      
      breakPoints.push(bestBreak)
      pos = bestBreak + charsPerLine
    }
    
    return breakPoints
  }

  sliceHtmlByTextPosition(html, text, start, end) {
    if (!html) return ''
    if (!html.includes('<')) {
      return (html.substring(start, end) || '').trimEnd()
    }
    
    // For HTML with tags, we need to track text position separately
    let textPos = 0
    let result = ''
    let inTag = false
    let currentTag = ''
    let openTags = []
    
    for (let i = 0; i < html.length; i++) {
      const char = html[i]
      
      if (char === '<') {
        inTag = true
        currentTag = '<'
        continue
      }
      
      if (inTag) {
        currentTag += char
        if (char === '>') {
          inTag = false
          // Check if it's an opening or closing tag
          if (currentTag.startsWith('</')) {
            if (textPos > start && textPos <= end) {
              result += currentTag
            }
            openTags.pop()
          } else if (!currentTag.endsWith('/>')) {
            if (textPos >= start && textPos < end) {
              result += currentTag
            }
            // Extract tag name for tracking
            const tagMatch = currentTag.match(/<(\w+)/)
            if (tagMatch) {
              openTags.push(tagMatch[1])
            }
          }
          currentTag = ''
        }
        continue
      }
      
      // Regular character
      if (textPos >= start && textPos < end) {
        result += char
      }
      textPos++
      
      if (textPos >= end) {
        // Close any open tags
        while (openTags.length > 0) {
          result += `</${openTags.pop()}>`
        }
        break
      }
    }
    
    return result.trimEnd()
  }

  measureCharWidth(element) {
    const span = document.createElement('span')
    span.style.fontFamily = 'ui-monospace, monospace'
    span.style.fontSize = '0.875rem'
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.textContent = 'M'
    
    document.body.appendChild(span)
    const width = span.getBoundingClientRect().width
    document.body.removeChild(span)
    
    return width || 8
  }

  maxLineLength(lines) {
    return Math.max(...lines.map(l => (l || '').length), 0)
  }
}
