// Chord data for guitar, ukulele, and piano
// Guitar: 6 strings (E-A-D-G-B-e), frets 0-5 typically shown
// Ukulele: 4 strings (G-C-E-A), frets 0-5 typically shown
// Piano: shows which keys to press

// Fingering format for guitar/ukulele: array of fret numbers for each string
// -1 = muted string (x), 0 = open string (o)
// barreAt: fret number for barre chord (optional)
// startFret: first fret shown (for chords higher up the neck)

export const GUITAR_CHORDS = {
  // Major chords
  "C": { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  "D": { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  "E": { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  "F": { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barreAt: 1 },
  "G": { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  "A": { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "B": { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  
  // Minor chords
  "Cm": { frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barreAt: 3, startFret: 3 },
  "Dm": { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  "Em": { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  "Fm": { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barreAt: 1 },
  "Gm": { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barreAt: 3, startFret: 3 },
  "Am": { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  "Bm": { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barreAt: 2, startFret: 2 },
  
  // Seventh chords
  "C7": { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
  "D7": { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
  "E7": { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  "F7": { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], barreAt: 1 },
  "G7": { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
  "A7": { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0] },
  "B7": { frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
  
  // Major seventh chords
  "Cmaj7": { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] },
  "Dmaj7": { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1] },
  "Emaj7": { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0] },
  "Fmaj7": { frets: [1, -1, 2, 2, 1, 0], fingers: [1, 0, 3, 4, 2, 0] },
  "Gmaj7": { frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, 0, 0, 0, 3] },
  "Amaj7": { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0] },
  "Bmaj7": { frets: [-1, 2, 4, 3, 4, 2], fingers: [0, 1, 3, 2, 4, 1], barreAt: 2, startFret: 2 },
  
  // Minor seventh chords
  "Cm7": { frets: [-1, 3, 5, 3, 4, 3], fingers: [0, 1, 3, 1, 2, 1], barreAt: 3, startFret: 3 },
  "Dm7": { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1] },
  "Em7": { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  "Fm7": { frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1], barreAt: 1 },
  "Gm7": { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], barreAt: 3, startFret: 3 },
  "Am7": { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  "Bm7": { frets: [-1, 2, 4, 2, 3, 2], fingers: [0, 1, 3, 1, 2, 1], barreAt: 2, startFret: 2 },
  
  // Suspended chords
  "Csus2": { frets: [-1, 3, 0, 0, 1, 0], fingers: [0, 3, 0, 0, 1, 0] },
  "Csus4": { frets: [-1, 3, 3, 0, 1, 1], fingers: [0, 2, 3, 0, 1, 1] },
  "Dsus2": { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "Dsus4": { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  "Esus2": { frets: [0, 2, 4, 4, 0, 0], fingers: [0, 1, 3, 4, 0, 0] },
  "Esus4": { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
  "Fsus2": { frets: [-1, -1, 3, 0, 1, 1], fingers: [0, 0, 3, 0, 1, 2] },
  "Fsus4": { frets: [1, 3, 3, 3, 1, 1], fingers: [1, 2, 3, 4, 1, 1], barreAt: 1 },
  "Gsus2": { frets: [3, 0, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 3, 4] },
  "Gsus4": { frets: [3, 3, 0, 0, 1, 3], fingers: [2, 3, 0, 0, 1, 4] },
  "Asus2": { frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  "Asus4": { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] },
  
  // Add9 chords
  "Cadd9": { frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 3, 0] },
  "Dadd9": { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "Eadd9": { frets: [0, 2, 2, 1, 0, 2], fingers: [0, 2, 3, 1, 0, 4] },
  "Fadd9": { frets: [1, 0, 3, 2, 1, 0], fingers: [1, 0, 4, 3, 2, 0] },
  "Gadd9": { frets: [3, 2, 0, 2, 0, 3], fingers: [2, 1, 0, 3, 0, 4] },
  "Aadd9": { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  
  // Diminished chords
  "Cdim": { frets: [-1, 3, 4, 2, 4, 2], fingers: [0, 2, 3, 1, 4, 1], startFret: 2 },
  "Ddim": { frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2] },
  "Edim": { frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },
  "Fdim": { frets: [1, 2, 3, 1, -1, -1], fingers: [1, 2, 3, 1, 0, 0] },
  "Gdim": { frets: [3, 4, 5, 3, -1, -1], fingers: [1, 2, 3, 1, 0, 0], startFret: 3 },
  "Adim": { frets: [-1, 0, 1, 2, 1, -1], fingers: [0, 0, 1, 3, 2, 0] },
  "Bdim": { frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0], startFret: 2 },
  
  // Augmented chords
  "Caug": { frets: [-1, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0] },
  "Daug": { frets: [-1, -1, 0, 3, 3, 2], fingers: [0, 0, 0, 2, 3, 1] },
  "Eaug": { frets: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0] },
  "Faug": { frets: [1, -1, 3, 2, 2, -1], fingers: [1, 0, 4, 2, 3, 0] },
  "Gaug": { frets: [3, 2, 1, 0, 0, 3], fingers: [3, 2, 1, 0, 0, 4] },
  "Aaug": { frets: [-1, 0, 3, 2, 2, 1], fingers: [0, 0, 4, 2, 3, 1] },
  "Baug": { frets: [-1, 2, 1, 0, 0, 3], fingers: [0, 2, 1, 0, 0, 3] },
  
  // Power chords
  "C5": { frets: [-1, 3, 5, 5, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 3 },
  "D5": { frets: [-1, -1, 0, 2, 3, -1], fingers: [0, 0, 0, 1, 2, 0] },
  "E5": { frets: [0, 2, 2, -1, -1, -1], fingers: [0, 1, 2, 0, 0, 0] },
  "F5": { frets: [1, 3, 3, -1, -1, -1], fingers: [1, 3, 4, 0, 0, 0] },
  "G5": { frets: [3, 5, 5, -1, -1, -1], fingers: [1, 3, 4, 0, 0, 0], startFret: 3 },
  "A5": { frets: [-1, 0, 2, 2, -1, -1], fingers: [0, 0, 1, 2, 0, 0] },
  "B5": { frets: [-1, 2, 4, 4, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 2 },
  
  // Sharp/Flat variants (using both notations)
  "C#": { frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 3, 3, 3, 1], barreAt: 4, startFret: 4 },
  "Db": { frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 3, 3, 3, 1], barreAt: 4, startFret: 4 },
  "D#": { frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 3, 3, 3, 1], barreAt: 6, startFret: 6 },
  "Eb": { frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 3, 3, 3, 1], barreAt: 6, startFret: 6 },
  "F#": { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barreAt: 2, startFret: 2 },
  "Gb": { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barreAt: 2, startFret: 2 },
  "G#": { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barreAt: 4, startFret: 4 },
  "Ab": { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barreAt: 4, startFret: 4 },
  "A#": { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 3, 3, 3, 1], barreAt: 1 },
  "Bb": { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 3, 3, 3, 1], barreAt: 1 },
  
  // Sharp/Flat minor variants
  "C#m": { frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], barreAt: 4, startFret: 4 },
  "Dbm": { frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], barreAt: 4, startFret: 4 },
  "D#m": { frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1], barreAt: 6, startFret: 6 },
  "Ebm": { frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1], barreAt: 6, startFret: 6 },
  "F#m": { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barreAt: 2, startFret: 2 },
  "Gbm": { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barreAt: 2, startFret: 2 },
  "G#m": { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Abm": { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barreAt: 4, startFret: 4 },
  "A#m": { frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], barreAt: 1 },
  "Bbm": { frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], barreAt: 1 },
  
  // Sharp/Flat seventh variants
  "C#7": { frets: [-1, 4, 6, 4, 6, 4], fingers: [0, 1, 3, 1, 4, 1], barreAt: 4, startFret: 4 },
  "Db7": { frets: [-1, 4, 6, 4, 6, 4], fingers: [0, 1, 3, 1, 4, 1], barreAt: 4, startFret: 4 },
  "Eb7": { frets: [-1, 6, 8, 6, 8, 6], fingers: [0, 1, 3, 1, 4, 1], barreAt: 6, startFret: 6 },
  "F#7": { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barreAt: 2, startFret: 2 },
  "Gb7": { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barreAt: 2, startFret: 2 },
  "G#7": { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], barreAt: 4, startFret: 4 },
  "Ab7": { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], barreAt: 4, startFret: 4 },
  "Bb7": { frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 3, 1, 4, 1], barreAt: 1 },
  
  // More variations
  "C/G": { frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0] },
  "D/F#": { frets: [2, -1, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
  "G/B": { frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 2] },
  "Am/G": { frets: [3, 0, 2, 2, 1, 0], fingers: [3, 0, 2, 3, 1, 0] },
  "Am/E": { frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
}

export const UKULELE_CHORDS = {
  // Major chords
  "C": { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  "D": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "E": { frets: [1, 4, 0, 2], fingers: [1, 4, 0, 2] },
  "F": { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  "G": { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  "A": { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  "B": { frets: [4, 3, 2, 2], fingers: [4, 3, 1, 1], barreAt: 2, startFret: 2 },
  
  // Minor chords
  "Cm": { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  "Dm": { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  "Em": { frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  "Fm": { frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4] },
  "Gm": { frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1] },
  "Am": { frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  "Bm": { frets: [4, 2, 2, 2], fingers: [4, 1, 1, 1], barreAt: 2, startFret: 2 },
  
  // Seventh chords
  "C7": { frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },
  "D7": { frets: [2, 2, 2, 3], fingers: [1, 1, 1, 2] },
  "E7": { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "F7": { frets: [2, 3, 1, 0], fingers: [2, 3, 1, 0] },
  "G7": { frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
  "A7": { frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },
  "B7": { frets: [2, 3, 2, 2], fingers: [1, 4, 2, 3] },
  
  // Major seventh chords
  "Cmaj7": { frets: [0, 0, 0, 2], fingers: [0, 0, 0, 1] },
  "Dmaj7": { frets: [2, 2, 2, 4], fingers: [1, 1, 1, 3] },
  "Emaj7": { frets: [1, 3, 0, 2], fingers: [1, 3, 0, 2] },
  "Fmaj7": { frets: [2, 4, 1, 0], fingers: [2, 4, 1, 0] },
  "Gmaj7": { frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  "Amaj7": { frets: [1, 1, 0, 0], fingers: [1, 2, 0, 0] },
  "Bmaj7": { frets: [3, 3, 2, 2], fingers: [3, 4, 1, 1], barreAt: 2, startFret: 2 },
  
  // Minor seventh chords
  "Cm7": { frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1], barreAt: 3 },
  "Dm7": { frets: [2, 2, 1, 3], fingers: [2, 3, 1, 4] },
  "Em7": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "Fm7": { frets: [1, 3, 1, 3], fingers: [1, 3, 2, 4] },
  "Gm7": { frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  "Am7": { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  "Bm7": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  
  // Sharp/Flat variants
  "C#": { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barreAt: 1 },
  "Db": { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barreAt: 1 },
  "D#": { frets: [3, 3, 3, 1], fingers: [2, 3, 4, 1] },
  "Eb": { frets: [3, 3, 3, 1], fingers: [2, 3, 4, 1] },
  "F#": { frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1], barreAt: 1 },
  "Gb": { frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1], barreAt: 1 },
  "G#": { frets: [5, 3, 4, 3], fingers: [4, 1, 2, 1], barreAt: 3, startFret: 3 },
  "Ab": { frets: [5, 3, 4, 3], fingers: [4, 1, 2, 1], barreAt: 3, startFret: 3 },
  "A#": { frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], barreAt: 1 },
  "Bb": { frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], barreAt: 1 },
  
  // Sharp/Flat minor variants
  "C#m": { frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
  "Dbm": { frets: [1, 1, 0, 4], fingers: [1, 2, 0, 4] },
  "D#m": { frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1] },
  "Ebm": { frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1] },
  "F#m": { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0] },
  "Gbm": { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0] },
  "G#m": { frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1] },
  "Abm": { frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1] },
  "A#m": { frets: [3, 1, 1, 1], fingers: [4, 1, 1, 1], barreAt: 1 },
  "Bbm": { frets: [3, 1, 1, 1], fingers: [4, 1, 1, 1], barreAt: 1 },
}

// Piano chords - array of semitones from root (0 = root)
// We'll display them visually on a keyboard
export const PIANO_CHORDS = {
  // Major chords (root, major third, perfect fifth)
  "C": { notes: ["C", "E", "G"], semitones: [0, 4, 7] },
  "D": { notes: ["D", "F#", "A"], semitones: [0, 4, 7] },
  "E": { notes: ["E", "G#", "B"], semitones: [0, 4, 7] },
  "F": { notes: ["F", "A", "C"], semitones: [0, 4, 7] },
  "G": { notes: ["G", "B", "D"], semitones: [0, 4, 7] },
  "A": { notes: ["A", "C#", "E"], semitones: [0, 4, 7] },
  "B": { notes: ["B", "D#", "F#"], semitones: [0, 4, 7] },
  
  // Minor chords (root, minor third, perfect fifth)
  "Cm": { notes: ["C", "Eb", "G"], semitones: [0, 3, 7] },
  "Dm": { notes: ["D", "F", "A"], semitones: [0, 3, 7] },
  "Em": { notes: ["E", "G", "B"], semitones: [0, 3, 7] },
  "Fm": { notes: ["F", "Ab", "C"], semitones: [0, 3, 7] },
  "Gm": { notes: ["G", "Bb", "D"], semitones: [0, 3, 7] },
  "Am": { notes: ["A", "C", "E"], semitones: [0, 3, 7] },
  "Bm": { notes: ["B", "D", "F#"], semitones: [0, 3, 7] },
  
  // Seventh chords
  "C7": { notes: ["C", "E", "G", "Bb"], semitones: [0, 4, 7, 10] },
  "D7": { notes: ["D", "F#", "A", "C"], semitones: [0, 4, 7, 10] },
  "E7": { notes: ["E", "G#", "B", "D"], semitones: [0, 4, 7, 10] },
  "F7": { notes: ["F", "A", "C", "Eb"], semitones: [0, 4, 7, 10] },
  "G7": { notes: ["G", "B", "D", "F"], semitones: [0, 4, 7, 10] },
  "A7": { notes: ["A", "C#", "E", "G"], semitones: [0, 4, 7, 10] },
  "B7": { notes: ["B", "D#", "F#", "A"], semitones: [0, 4, 7, 10] },
  
  // Major seventh chords
  "Cmaj7": { notes: ["C", "E", "G", "B"], semitones: [0, 4, 7, 11] },
  "Dmaj7": { notes: ["D", "F#", "A", "C#"], semitones: [0, 4, 7, 11] },
  "Emaj7": { notes: ["E", "G#", "B", "D#"], semitones: [0, 4, 7, 11] },
  "Fmaj7": { notes: ["F", "A", "C", "E"], semitones: [0, 4, 7, 11] },
  "Gmaj7": { notes: ["G", "B", "D", "F#"], semitones: [0, 4, 7, 11] },
  "Amaj7": { notes: ["A", "C#", "E", "G#"], semitones: [0, 4, 7, 11] },
  "Bmaj7": { notes: ["B", "D#", "F#", "A#"], semitones: [0, 4, 7, 11] },
  
  // Minor seventh chords
  "Cm7": { notes: ["C", "Eb", "G", "Bb"], semitones: [0, 3, 7, 10] },
  "Dm7": { notes: ["D", "F", "A", "C"], semitones: [0, 3, 7, 10] },
  "Em7": { notes: ["E", "G", "B", "D"], semitones: [0, 3, 7, 10] },
  "Fm7": { notes: ["F", "Ab", "C", "Eb"], semitones: [0, 3, 7, 10] },
  "Gm7": { notes: ["G", "Bb", "D", "F"], semitones: [0, 3, 7, 10] },
  "Am7": { notes: ["A", "C", "E", "G"], semitones: [0, 3, 7, 10] },
  "Bm7": { notes: ["B", "D", "F#", "A"], semitones: [0, 3, 7, 10] },
  
  // Suspended chords
  "Csus2": { notes: ["C", "D", "G"], semitones: [0, 2, 7] },
  "Csus4": { notes: ["C", "F", "G"], semitones: [0, 5, 7] },
  "Dsus2": { notes: ["D", "E", "A"], semitones: [0, 2, 7] },
  "Dsus4": { notes: ["D", "G", "A"], semitones: [0, 5, 7] },
  "Esus2": { notes: ["E", "F#", "B"], semitones: [0, 2, 7] },
  "Esus4": { notes: ["E", "A", "B"], semitones: [0, 5, 7] },
  "Fsus2": { notes: ["F", "G", "C"], semitones: [0, 2, 7] },
  "Fsus4": { notes: ["F", "Bb", "C"], semitones: [0, 5, 7] },
  "Gsus2": { notes: ["G", "A", "D"], semitones: [0, 2, 7] },
  "Gsus4": { notes: ["G", "C", "D"], semitones: [0, 5, 7] },
  "Asus2": { notes: ["A", "B", "E"], semitones: [0, 2, 7] },
  "Asus4": { notes: ["A", "D", "E"], semitones: [0, 5, 7] },
  
  // Add9 chords
  "Cadd9": { notes: ["C", "E", "G", "D"], semitones: [0, 4, 7, 14] },
  "Dadd9": { notes: ["D", "F#", "A", "E"], semitones: [0, 4, 7, 14] },
  "Gadd9": { notes: ["G", "B", "D", "A"], semitones: [0, 4, 7, 14] },
  "Aadd9": { notes: ["A", "C#", "E", "B"], semitones: [0, 4, 7, 14] },
  
  // Diminished chords
  "Cdim": { notes: ["C", "Eb", "Gb"], semitones: [0, 3, 6] },
  "Ddim": { notes: ["D", "F", "Ab"], semitones: [0, 3, 6] },
  "Edim": { notes: ["E", "G", "Bb"], semitones: [0, 3, 6] },
  "Fdim": { notes: ["F", "Ab", "B"], semitones: [0, 3, 6] },
  "Gdim": { notes: ["G", "Bb", "Db"], semitones: [0, 3, 6] },
  "Adim": { notes: ["A", "C", "Eb"], semitones: [0, 3, 6] },
  "Bdim": { notes: ["B", "D", "F"], semitones: [0, 3, 6] },
  
  // Augmented chords
  "Caug": { notes: ["C", "E", "G#"], semitones: [0, 4, 8] },
  "Daug": { notes: ["D", "F#", "A#"], semitones: [0, 4, 8] },
  "Eaug": { notes: ["E", "G#", "C"], semitones: [0, 4, 8] },
  "Faug": { notes: ["F", "A", "C#"], semitones: [0, 4, 8] },
  "Gaug": { notes: ["G", "B", "D#"], semitones: [0, 4, 8] },
  "Aaug": { notes: ["A", "C#", "F"], semitones: [0, 4, 8] },
  "Baug": { notes: ["B", "D#", "G"], semitones: [0, 4, 8] },
  
  // Sharp/Flat major variants
  "C#": { notes: ["C#", "F", "G#"], semitones: [0, 4, 7] },
  "Db": { notes: ["Db", "F", "Ab"], semitones: [0, 4, 7] },
  "D#": { notes: ["D#", "G", "A#"], semitones: [0, 4, 7] },
  "Eb": { notes: ["Eb", "G", "Bb"], semitones: [0, 4, 7] },
  "F#": { notes: ["F#", "A#", "C#"], semitones: [0, 4, 7] },
  "Gb": { notes: ["Gb", "Bb", "Db"], semitones: [0, 4, 7] },
  "G#": { notes: ["G#", "C", "D#"], semitones: [0, 4, 7] },
  "Ab": { notes: ["Ab", "C", "Eb"], semitones: [0, 4, 7] },
  "A#": { notes: ["A#", "D", "F"], semitones: [0, 4, 7] },
  "Bb": { notes: ["Bb", "D", "F"], semitones: [0, 4, 7] },
  
  // Sharp/Flat minor variants
  "C#m": { notes: ["C#", "E", "G#"], semitones: [0, 3, 7] },
  "Dbm": { notes: ["Db", "E", "Ab"], semitones: [0, 3, 7] },
  "D#m": { notes: ["D#", "F#", "A#"], semitones: [0, 3, 7] },
  "Ebm": { notes: ["Eb", "Gb", "Bb"], semitones: [0, 3, 7] },
  "F#m": { notes: ["F#", "A", "C#"], semitones: [0, 3, 7] },
  "Gbm": { notes: ["Gb", "A", "Db"], semitones: [0, 3, 7] },
  "G#m": { notes: ["G#", "B", "D#"], semitones: [0, 3, 7] },
  "Abm": { notes: ["Ab", "B", "Eb"], semitones: [0, 3, 7] },
  "A#m": { notes: ["A#", "C#", "F"], semitones: [0, 3, 7] },
  "Bbm": { notes: ["Bb", "Db", "F"], semitones: [0, 3, 7] },
  
  // Sharp/Flat seventh variants
  "C#7": { notes: ["C#", "F", "G#", "B"], semitones: [0, 4, 7, 10] },
  "Db7": { notes: ["Db", "F", "Ab", "B"], semitones: [0, 4, 7, 10] },
  "Eb7": { notes: ["Eb", "G", "Bb", "Db"], semitones: [0, 4, 7, 10] },
  "F#7": { notes: ["F#", "A#", "C#", "E"], semitones: [0, 4, 7, 10] },
  "Gb7": { notes: ["Gb", "Bb", "Db", "E"], semitones: [0, 4, 7, 10] },
  "G#7": { notes: ["G#", "C", "D#", "F#"], semitones: [0, 4, 7, 10] },
  "Ab7": { notes: ["Ab", "C", "Eb", "Gb"], semitones: [0, 4, 7, 10] },
  "Bb7": { notes: ["Bb", "D", "F", "Ab"], semitones: [0, 4, 7, 10] },
}

// Note name to semitone offset (from C)
export const NOTE_SEMITONES = {
  "C": 0, "C#": 1, "Db": 1,
  "D": 2, "D#": 3, "Eb": 3,
  "E": 4,
  "F": 5, "F#": 6, "Gb": 6,
  "G": 7, "G#": 8, "Ab": 8,
  "A": 9, "A#": 10, "Bb": 10,
  "B": 11
}

// Cavaquinho: 4 strings (D-G-B-D tuning, most common in Brazil)
// Strings from left to right in diagrams: D(low) - G - B - D(high)
export const CAVAQUINHO_CHORDS = {
  // Major chords (based on standard Brazilian cavaquinho chord chart)
  "C": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "D": { frets: [2, 2, 4, 0], fingers: [1, 1, 3, 0] },
  "E": { frets: [1, 0, 2, 4], fingers: [1, 0, 2, 4] },
  "F": { frets: [3, 1, 2, 3], fingers: [3, 1, 2, 4] },
  "G": { frets: [0, 2, 0, 4], fingers: [0, 1, 0, 3] },
  "A": { frets: [2, 2, 4, 2], fingers: [1, 1, 3, 1], barreAt: 2 },
  "B": { frets: [4, 4, 4, 4], fingers: [1, 1, 1, 1], barreAt: 4, startFret: 4 },
  
  // Minor chords
  "Cm": { frets: [3, 3, 5, 3], fingers: [1, 1, 3, 1], barreAt: 3, startFret: 3 },
  "Dm": { frets: [1, 2, 2, 0], fingers: [1, 2, 3, 0] },
  "Em": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "Fm": { frets: [1, 3, 3, 4], fingers: [1, 2, 3, 4] },
  "Gm": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "Am": { frets: [2, 2, 4, 0], fingers: [1, 1, 3, 0] },
  "Bm": { frets: [4, 4, 6, 4], fingers: [1, 1, 3, 1], barreAt: 4, startFret: 4 },
  
  // Seventh chords
  "C7": { frets: [3, 1, 2, 0], fingers: [3, 1, 2, 0] },
  "D7": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "E7": { frets: [1, 2, 2, 0], fingers: [1, 2, 3, 0] },
  "F7": { frets: [2, 1, 2, 3], fingers: [2, 1, 3, 4] },
  "G7": { frets: [0, 1, 0, 3], fingers: [0, 1, 0, 3] },
  "A7": { frets: [2, 2, 3, 2], fingers: [1, 1, 2, 1], barreAt: 2 },
  "B7": { frets: [4, 4, 5, 4], fingers: [1, 1, 2, 1], barreAt: 4, startFret: 4 },
  
  // Major seventh chords
  "Cmaj7": { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  "Dmaj7": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "Emaj7": { frets: [1, 0, 2, 3], fingers: [1, 0, 2, 4] },
  "Fmaj7": { frets: [3, 1, 2, 2], fingers: [4, 1, 2, 3] },
  "Gmaj7": { frets: [0, 2, 0, 3], fingers: [0, 1, 0, 2] },
  "Amaj7": { frets: [2, 2, 3, 2], fingers: [1, 1, 2, 1], barreAt: 2 },
  "Bmaj7": { frets: [4, 4, 4, 3], fingers: [2, 3, 4, 1], startFret: 3 },
  
  // Minor seventh chords
  "Cm7": { frets: [3, 3, 4, 3], fingers: [1, 1, 2, 1], barreAt: 3, startFret: 3 },
  "Dm7": { frets: [1, 2, 1, 0], fingers: [1, 2, 1, 0] },
  "Em7": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "Fm7": { frets: [1, 3, 2, 4], fingers: [1, 3, 2, 4] },
  "Gm7": { frets: [0, 2, 2, 3], fingers: [0, 1, 2, 3] },
  "Am7": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "Bm7": { frets: [4, 4, 5, 4], fingers: [1, 1, 2, 1], barreAt: 4, startFret: 4 },
  
  // Sharp/flat major variants
  "C#": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "Db": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "D#": { frets: [3, 3, 5, 1], fingers: [2, 2, 4, 1] },
  "Eb": { frets: [3, 3, 5, 1], fingers: [2, 2, 4, 1] },
  "F#": { frets: [4, 2, 3, 4], fingers: [3, 1, 2, 4] },
  "Gb": { frets: [4, 2, 3, 4], fingers: [3, 1, 2, 4] },
  "G#": { frets: [1, 3, 1, 5], fingers: [1, 2, 1, 4] },
  "Ab": { frets: [1, 3, 1, 5], fingers: [1, 2, 1, 4] },
  "A#": { frets: [3, 3, 5, 3], fingers: [1, 1, 3, 1], barreAt: 3, startFret: 3 },
  "Bb": { frets: [3, 3, 5, 3], fingers: [1, 1, 3, 1], barreAt: 3, startFret: 3 },
  
  // Sharp/flat minor variants
  "C#m": { frets: [1, 3, 4, 3], fingers: [1, 2, 4, 3] },
  "Dbm": { frets: [1, 3, 4, 3], fingers: [1, 2, 4, 3] },
  "D#m": { frets: [3, 3, 4, 1], fingers: [2, 3, 4, 1] },
  "Ebm": { frets: [3, 3, 4, 1], fingers: [2, 3, 4, 1] },
  "F#m": { frets: [2, 3, 3, 5], fingers: [1, 2, 3, 4] },
  "Gbm": { frets: [2, 3, 3, 5], fingers: [1, 2, 3, 4] },
  "G#m": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "Abm": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "A#m": { frets: [3, 3, 5, 1], fingers: [2, 2, 4, 1] },
  "Bbm": { frets: [3, 3, 5, 1], fingers: [2, 2, 4, 1] },
  
  // Sharp/flat seventh variants
  "C#7": { frets: [4, 2, 3, 1], fingers: [4, 2, 3, 1] },
  "Db7": { frets: [4, 2, 3, 1], fingers: [4, 2, 3, 1] },
  "D#7": { frets: [3, 3, 4, 1], fingers: [2, 2, 3, 1] },
  "Eb7": { frets: [3, 3, 4, 1], fingers: [2, 2, 3, 1] },
  "F#7": { frets: [3, 2, 3, 4], fingers: [2, 1, 3, 4] },
  "Gb7": { frets: [3, 2, 3, 4], fingers: [2, 1, 3, 4] },
  "G#7": { frets: [1, 2, 1, 4], fingers: [1, 2, 1, 4] },
  "Ab7": { frets: [1, 2, 1, 4], fingers: [1, 2, 1, 4] },
  "A#7": { frets: [3, 3, 4, 3], fingers: [1, 1, 2, 1], barreAt: 3, startFret: 3 },
  "Bb7": { frets: [3, 3, 4, 3], fingers: [1, 1, 2, 1], barreAt: 3, startFret: 3 },
}

// Get chord data for a given chord name and instrument
export function getChordData(chordName, instrument = 'guitar') {
  // Normalize chord name - handle variations
  const normalized = normalizeChordName(chordName)
  
  switch (instrument) {
    case 'guitar':
      return GUITAR_CHORDS[normalized] || null
    case 'ukulele':
      return UKULELE_CHORDS[normalized] || null
    case 'cavaquinho':
      return CAVAQUINHO_CHORDS[normalized] || null
    case 'piano':
      return PIANO_CHORDS[normalized] || null
    default:
      return null
  }
}

// Normalize chord names to handle common variations
function normalizeChordName(chord) {
  if (!chord) return chord
  
  // Trim whitespace
  chord = chord.trim()
  
  // Common normalizations
  const normalizations = {
    'min': 'm',
    'minor': 'm',
    'maj': '',
    'major': '',
    'sus': 'sus',
    'add': 'add',
    'dim': 'dim',
    'aug': 'aug',
    '+': 'aug',
    '°': 'dim',
    'M7': 'maj7',
    'Δ7': 'maj7',
    'Δ': 'maj7',
  }
  
  // Apply normalizations but be careful with order
  let result = chord
  
  // Replace 'min' with 'm' (but not 'dim')
  result = result.replace(/min(?!or)(?!7)/, 'm')
  result = result.replace(/minor/, 'm')
  
  // Handle special symbols
  result = result.replace(/\+/g, 'aug')
  result = result.replace(/°/g, 'dim')
  result = result.replace(/Δ7?/g, 'maj7')
  result = result.replace(/M7/g, 'maj7')
  
  return result
}

// Check if a chord exists in the dictionary for any instrument
export function chordExists(chordName) {
  const normalized = normalizeChordName(chordName)
  return !!(GUITAR_CHORDS[normalized] || UKULELE_CHORDS[normalized] || CAVAQUINHO_CHORDS[normalized] || PIANO_CHORDS[normalized])
}

// Get the root note from a chord name
export function getChordRoot(chordName) {
  if (!chordName) return null
  
  const match = chordName.match(/^([A-Ga-g][#b]?)/)
  if (match) {
    let root = match[1]
    // Capitalize the note letter
    return root.charAt(0).toUpperCase() + root.slice(1)
  }
  return null
}

