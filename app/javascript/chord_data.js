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
  "C/G": { frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0] },
  "D": { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  "D/F#": { frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 1, 3, 2] },
  "E": { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  "F": { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barreAt: 1 },
  "G": { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  "G/B": { frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 3] },
  "A": { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "A/F#": { frets: [2, 2, 4, 4, 3, 2], fingers: [1, 1, 3, 4, 2, 1], barreAt: 2 },
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
  "Em7/B": { frets: [-1, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
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
  "Eadd2/B": { frets: [-1, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
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
  
  // More variations / Slash chords
  "C/G": { frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0] },
  "D/F#": { frets: [2, -1, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
  "G/B": { frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 2] },
  "Am/G": { frets: [3, 0, 2, 2, 1, 0], fingers: [3, 0, 2, 3, 1, 0] },
  "Am/E": { frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  "Gmaj7/B": { frets: [-1, 2, 0, 0, 0, 2], fingers: [0, 1, 0, 0, 0, 2] },
  "F/A": { frets: [-1, 0, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1] },
  "A/C#": { frets: [-1, 4, 2, 2, 2, 0], fingers: [0, 4, 1, 1, 1, 0], startFret: 2 },
  "C/E": { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  "E/G#": { frets: [4, 2, 2, 1, 0, 0], fingers: [4, 2, 3, 1, 0, 0] },
  "G/F#": { frets: [2, 2, 0, 0, 0, 3], fingers: [1, 2, 0, 0, 0, 3] },
  "Am/C": { frets: [-1, 3, 2, 2, 1, 0], fingers: [0, 3, 2, 3, 1, 0] },
  "C/B": { frets: [-1, 2, 2, 0, 1, 0], fingers: [0, 2, 3, 0, 1, 0] },
  "A/E": { frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "F/C": { frets: [-1, 3, 3, 2, 1, 1], fingers: [0, 3, 4, 2, 1, 1] },
  "Em/D": { frets: [-1, -1, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0] },
  "D/A": { frets: [-1, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  "Bm/A": { frets: [-1, 0, 4, 4, 3, 2], fingers: [0, 0, 3, 4, 2, 1], startFret: 2 },
  "G/F": { frets: [1, 2, 0, 0, 0, 3], fingers: [1, 2, 0, 0, 0, 3] },
  "G/A": { frets: [-1, 0, 0, 0, 0, 3], fingers: [0, 0, 0, 0, 0, 1] },
  "Dm/C": { frets: [-1, 3, 0, 2, 3, 1], fingers: [0, 3, 0, 2, 4, 1] },
  "D/B": { frets: [-1, 2, 0, 2, 3, 2], fingers: [0, 1, 0, 2, 4, 3] },
  "Em/B": { frets: [-1, 2, 2, 0, 0, 0], fingers: [0, 1, 2, 0, 0, 0] },
  "D/E": { frets: [0, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  "F/G": { frets: [3, 3, 3, 2, 1, 1], fingers: [3, 3, 4, 2, 1, 1] },
  "Em/A": { frets: [-1, 0, 2, 0, 0, 0], fingers: [0, 0, 1, 0, 0, 0] },
  "Em/G": { frets: [3, 2, 2, 0, 0, 0], fingers: [3, 1, 2, 0, 0, 0] },
  "G/E": { frets: [0, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 2] },
  "Gm/Bb": { frets: [-1, 1, 3, 3, 3, 3], fingers: [0, 1, 2, 3, 4, 4], barreAt: 3 },
  "Bb/D": { frets: [-1, -1, 0, 3, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  "C/D": { frets: [-1, -1, 0, 0, 1, 0], fingers: [0, 0, 0, 0, 1, 0] },
  "F/E": { frets: [0, 3, 3, 2, 1, 1], fingers: [0, 3, 4, 2, 1, 1] },
  "D/G": { frets: [3, -1, 0, 2, 3, 2], fingers: [2, 0, 0, 1, 3, 1] },
  "Asus2/B": { frets: [-1, 2, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
  "Am7/G": { frets: [3, 0, 2, 0, 1, 0], fingers: [3, 0, 2, 0, 1, 0] },
  "Cm7/Bb": { frets: [-1, 1, 3, 1, 4, 3], fingers: [0, 1, 2, 1, 4, 3], barreAt: 1 },
  "A5/G": { frets: [3, 0, 2, 2, -1, -1], fingers: [2, 0, 1, 1, 0, 0] },
  
  // Minor 7th chords (extended)
  "F#m7": { frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "C#m7": { frets: [-1, 4, 6, 4, 5, 4], fingers: [0, 1, 3, 1, 2, 1], barreAt: 4, startFret: 4 },
  "G#m7": { frets: [4, 6, 4, 4, 4, 4], fingers: [1, 3, 1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "D#m7": { frets: [-1, 6, 8, 6, 7, 6], fingers: [0, 1, 3, 1, 2, 1], barreAt: 6, startFret: 6 },
  "Ebm7": { frets: [-1, 6, 8, 6, 7, 6], fingers: [0, 1, 3, 1, 2, 1], barreAt: 6, startFret: 6 },
  "Dbm7": { frets: [-1, 4, 6, 4, 5, 4], fingers: [0, 1, 3, 1, 2, 1], barreAt: 4, startFret: 4 },
  "Abm7": { frets: [4, 6, 4, 4, 4, 4], fingers: [1, 3, 1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "A#m7": { frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 3, 1, 2, 1], barreAt: 1 },
  "Bbm7": { frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 3, 1, 2, 1], barreAt: 1 },
  
  // 6th chords
  "G6": { frets: [3, 2, 0, 0, 0, 0], fingers: [2, 1, 0, 0, 0, 0] },
  "A6": { frets: [-1, 0, 2, 2, 2, 2], fingers: [0, 0, 1, 1, 1, 1] },
  "D6": { frets: [-1, -1, 0, 2, 0, 2], fingers: [0, 0, 0, 1, 0, 2] },
  "F6": { frets: [1, 3, 3, 2, 3, 1], fingers: [1, 2, 3, 1, 4, 1], barreAt: 1 },
  "E6": { frets: [0, 2, 2, 1, 2, 0], fingers: [0, 2, 3, 1, 4, 0] },
  "C6": { frets: [-1, 3, 2, 2, 1, 0], fingers: [0, 4, 2, 3, 1, 0] },
  "B6": { frets: [-1, 2, 4, 4, 4, 4], fingers: [0, 1, 2, 3, 3, 3], barreAt: 4, startFret: 2 },
  
  // Minor 6th chords
  "Cm6": { frets: [-1, 3, 1, 2, 1, 3], fingers: [0, 3, 1, 2, 1, 4] },
  "Dm6": { frets: [-1, -1, 0, 2, 0, 1], fingers: [0, 0, 0, 2, 0, 1] },
  "Em6": { frets: [0, 2, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },
  "Fm6": { frets: [1, 3, 3, 1, 3, 1], fingers: [1, 2, 3, 1, 4, 1], barreAt: 1 },
  "Gm6": { frets: [3, -1, 2, 3, 3, 3], fingers: [2, 0, 1, 3, 3, 3] },
  "Am6": { frets: [-1, 0, 2, 2, 1, 2], fingers: [0, 0, 2, 3, 1, 4] },
  "Bm6": { frets: [-1, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3] },
  
  // 9th chords
  "C9": { frets: [-1, 3, 2, 3, 3, 3], fingers: [0, 2, 1, 3, 4, 4] },
  "C#9": { frets: [-1, 4, 3, 4, 4, 4], fingers: [0, 2, 1, 3, 4, 4], startFret: 3 },
  "Db9": { frets: [-1, 4, 3, 4, 4, 4], fingers: [0, 2, 1, 3, 4, 4], startFret: 3 },
  "D9": { frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 2, 1, 0] },
  "D#9": { frets: [-1, -1, 1, 3, 2, 1], fingers: [0, 0, 1, 3, 2, 1], barreAt: 1 },
  "Eb9": { frets: [-1, -1, 1, 3, 2, 1], fingers: [0, 0, 1, 3, 2, 1], barreAt: 1 },
  "E9": { frets: [0, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3] },
  "F9": { frets: [1, 0, 1, 0, 1, 1], fingers: [1, 0, 2, 0, 3, 4] },
  "F#9": { frets: [2, 1, 2, 1, 2, 2], fingers: [2, 1, 3, 1, 4, 4], barreAt: 1 },
  "G9": { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
  "G#9": { frets: [4, 3, 1, 1, 1, 2], fingers: [4, 3, 1, 1, 1, 2], barreAt: 1, startFret: 3 },
  "Ab9": { frets: [4, 3, 1, 1, 1, 2], fingers: [4, 3, 1, 1, 1, 2], barreAt: 1, startFret: 3 },
  "A9": { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0] },
  "A#9": { frets: [-1, 1, 0, 1, 1, 1], fingers: [0, 1, 0, 2, 3, 4] },
  "Bb9": { frets: [-1, 1, 0, 1, 1, 1], fingers: [0, 1, 0, 2, 3, 4] },
  "B9": { frets: [-1, 2, 1, 2, 2, 2], fingers: [0, 2, 1, 3, 3, 3] },
  
  // Minor 9th chords
  "Em9": { frets: [0, 2, 0, 0, 0, 2], fingers: [0, 1, 0, 0, 0, 2] },
  "Am9": { frets: [-1, 0, 2, 4, 1, 0], fingers: [0, 0, 2, 4, 1, 0] },
  "Dm9": { frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 3, 1, 0] },
  "Bm9": { frets: [-1, 2, 0, 2, 2, 2], fingers: [0, 1, 0, 2, 3, 4] },
  "Fm9": { frets: [1, 3, 1, 1, 1, 3], fingers: [1, 3, 1, 1, 1, 4], barreAt: 1 },
  "Gm9": { frets: [3, 5, 3, 3, 3, 5], fingers: [1, 3, 1, 1, 1, 4], barreAt: 3, startFret: 3 },
  "Cm9": { frets: [-1, 3, 1, 3, 3, 3], fingers: [0, 2, 1, 3, 3, 3] },
  
  // Sus4 chords (extended)
  "Bsus4": { frets: [-1, 2, 4, 4, 5, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "F#sus4": { frets: [2, 4, 4, 4, 2, 2], fingers: [1, 2, 3, 4, 1, 1], barreAt: 2, startFret: 2 },
  "C#sus4": { frets: [-1, 4, 6, 6, 7, 4], fingers: [0, 1, 2, 3, 4, 1], barreAt: 4, startFret: 4 },
  "Bbsus4": { frets: [-1, 1, 3, 3, 4, 1], fingers: [0, 1, 2, 3, 4, 1], barreAt: 1 },
  "Ebsus4": { frets: [-1, 6, 8, 8, 9, 6], fingers: [0, 1, 2, 3, 4, 1], barreAt: 6, startFret: 6 },
  "Absus4": { frets: [4, 6, 6, 6, 4, 4], fingers: [1, 2, 3, 4, 1, 1], barreAt: 4, startFret: 4 },
  
  // 7sus4 chords
  "E7sus4": { frets: [0, 2, 0, 2, 0, 0], fingers: [0, 1, 0, 2, 0, 0] },
  "A7sus4": { frets: [-1, 0, 2, 0, 3, 0], fingers: [0, 0, 1, 0, 2, 0] },
  "D7sus4": { frets: [-1, -1, 0, 2, 1, 3], fingers: [0, 0, 0, 2, 1, 3] },
  "G7sus4": { frets: [3, 2, 0, 0, 1, 1], fingers: [3, 2, 0, 0, 1, 1] },
  "B7sus4": { frets: [-1, 2, 4, 2, 5, 2], fingers: [0, 1, 3, 1, 4, 1], barreAt: 2, startFret: 2 },
  "C7sus4": { frets: [-1, 3, 3, 3, 1, 1], fingers: [0, 2, 3, 4, 1, 1], barreAt: 1 },
  "F7sus4": { frets: [1, 3, 1, 3, 1, 1], fingers: [1, 3, 1, 4, 1, 1], barreAt: 1 },
  
  // Add9 chords (extended)
  "Fadd9": { frets: [1, 0, 3, 0, 1, 1], fingers: [1, 0, 4, 0, 2, 3] },
  "Eadd9": { frets: [0, 2, 2, 1, 0, 2], fingers: [0, 2, 3, 1, 0, 4] },
  "Badd9": { frets: [-1, 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1], barreAt: 2, startFret: 2 },
  "F#add9": { frets: [2, -1, 4, 3, 2, 2], fingers: [1, 0, 4, 3, 1, 1], barreAt: 2, startFret: 2 },
  "Bbadd9": { frets: [-1, 1, 0, 3, 1, 1], fingers: [0, 1, 0, 4, 2, 3] },
  
  // Madd9 chords (minor add9)
  "Emadd9": { frets: [0, 2, 4, 0, 0, 0], fingers: [0, 1, 3, 0, 0, 0] },
  "Amadd9": { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  "Dmadd9": { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "F#madd9": { frets: [2, 0, 4, 2, 2, 2], fingers: [1, 0, 4, 2, 2, 2], barreAt: 2, startFret: 2 },
  "Bmadd9": { frets: [-1, 2, 0, 2, 2, 2], fingers: [0, 1, 0, 2, 3, 4] },
  "Cmadd9": { frets: [-1, 3, 1, 0, 3, 3], fingers: [0, 2, 1, 0, 3, 4] },
  
  // Major 7th (extended)
  "Ebmaj7": { frets: [-1, 6, 8, 7, 8, 6], fingers: [0, 1, 3, 2, 4, 1], barreAt: 6, startFret: 6 },
  "Abmaj7": { frets: [4, 6, 5, 5, 4, 4], fingers: [1, 4, 2, 3, 1, 1], barreAt: 4, startFret: 4 },
  "Bbmaj7": { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 4, 1], barreAt: 1 },
  "Dbmaj7": { frets: [-1, 4, 6, 5, 6, 4], fingers: [0, 1, 3, 2, 4, 1], barreAt: 4, startFret: 4 },
  "A#maj7": { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 4, 1], barreAt: 1 },
  "G#maj7": { frets: [4, 6, 5, 5, 4, 4], fingers: [1, 4, 2, 3, 1, 1], barreAt: 4, startFret: 4 },
  
  // Major 9th chords
  "Cmaj9": { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] },
  "Dmaj9": { frets: [-1, -1, 0, 2, 2, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "Emaj9": { frets: [0, 2, 1, 1, 0, 2], fingers: [0, 2, 1, 1, 0, 3] },
  "Fmaj9": { frets: [0, 0, 3, 0, 1, 0], fingers: [0, 0, 3, 0, 1, 0] },
  "Gmaj9": { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 1, 0, 0, 0, 2] },
  "Amaj9": { frets: [-1, 0, 2, 1, 0, 0], fingers: [0, 0, 2, 1, 0, 0] },
  "Bbmaj9": { frets: [-1, 1, 0, 2, 1, 1], fingers: [0, 1, 0, 3, 2, 2] },
  "Ebmaj9": { frets: [-1, 6, 5, 7, 6, 6], fingers: [0, 2, 1, 4, 3, 3], startFret: 5 },
  
  // Power chords (extended)
  "F#5": { frets: [2, 4, 4, -1, -1, -1], fingers: [1, 3, 4, 0, 0, 0], startFret: 2 },
  "Bb5": { frets: [-1, 1, 3, 3, -1, -1], fingers: [0, 1, 3, 4, 0, 0] },
  "C#5": { frets: [-1, 4, 6, 6, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 4 },
  "C#5/G#": { frets: [4, 4, 6, 6, -1, -1], fingers: [1, 1, 3, 4, 0, 0], startFret: 4 },
  "A5/G#": { frets: [4, 0, 2, 2, -1, -1], fingers: [3, 0, 1, 2, 0, 0] },
  "D5/A": { frets: [-1, 0, 0, 2, 3, -1], fingers: [0, 0, 0, 1, 2, 0] },
  "E5/B": { frets: [-1, 2, 2, 4, 5, -1], fingers: [0, 1, 1, 3, 4, 0], startFret: 2 },
  "G5/D": { frets: [-1, -1, 0, 0, 3, 3], fingers: [0, 0, 0, 0, 1, 2] },
  "G#5": { frets: [4, 6, 6, -1, -1, -1], fingers: [1, 3, 4, 0, 0, 0], startFret: 4 },
  "Eb5": { frets: [-1, 6, 8, 8, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 6 },
  "Ab5": { frets: [4, 6, 6, -1, -1, -1], fingers: [1, 3, 4, 0, 0, 0], startFret: 4 },
  "Db5": { frets: [-1, 4, 6, 6, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 4 },
  "D#5": { frets: [-1, 6, 8, 8, -1, -1], fingers: [0, 1, 3, 4, 0, 0], startFret: 6 },
  
  // 2 chords (add2/add9 no 3rd)
  "G2": { frets: [3, 0, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 3, 4] },
  "D2": { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "E2": { frets: [0, 2, 4, 4, 0, 0], fingers: [0, 1, 3, 4, 0, 0] },
  "A2": { frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  "C2": { frets: [-1, 3, 0, 0, 1, 0], fingers: [0, 3, 0, 0, 1, 0] },
  "B2": { frets: [-1, 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1], barreAt: 2, startFret: 2 },
  
  // Add4 / Sus variations
  "Cadd4": { frets: [-1, 3, 3, 0, 1, 0], fingers: [0, 2, 3, 0, 1, 0] },
  "Gadd2": { frets: [3, 0, 0, 0, 0, 3], fingers: [2, 0, 0, 0, 0, 3] },
  "Cadd2": { frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 3, 0] },
  "G4": { frets: [3, 3, 0, 0, 1, 3], fingers: [2, 3, 0, 0, 1, 4] },
  "D4": { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  "B4": { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "Gsus": { frets: [3, 2, 0, 0, 1, 3], fingers: [3, 2, 0, 0, 1, 4] },
  "Esus": { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
  "E7sus": { frets: [0, 2, 0, 2, 0, 0], fingers: [0, 1, 0, 2, 0, 0] },
  
  // 6/9 chords
  "D6/9": { frets: [-1, -1, 0, 2, 0, 0], fingers: [0, 0, 0, 1, 0, 0] },
  "C6add9": { frets: [-1, 3, 2, 2, 3, 0], fingers: [0, 2, 1, 1, 3, 0] },
  "F6/9": { frets: [1, 0, 0, 0, 1, 1], fingers: [1, 0, 0, 0, 2, 3] },
  "G6/9": { frets: [3, 2, 0, 0, 0, 0], fingers: [2, 1, 0, 0, 0, 0] },
  "A6/9": { frets: [-1, 0, 4, 4, 2, 2], fingers: [0, 0, 3, 4, 1, 2], startFret: 2 },
  
  // 9sus4 / D9sus4 etc
  "D9sus4": { frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 2, 1, 0] },
  "A9sus4": { frets: [-1, 0, 2, 0, 0, 0], fingers: [0, 0, 1, 0, 0, 0] },
  "E9sus4": { frets: [0, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3] },
  
  // 11th chords
  "F#m11": { frets: [2, 2, 2, 2, 2, 2], fingers: [1, 1, 1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "F#m7add11": { frets: [2, 4, 2, 2, 0, 0], fingers: [1, 4, 2, 3, 0, 0], startFret: 2 },
  "Dm11": { frets: [-1, -1, 0, 0, 1, 1], fingers: [0, 0, 0, 0, 1, 2] },
  "Am11": { frets: [-1, 0, 0, 0, 1, 0], fingers: [0, 0, 0, 0, 1, 0] },
  "Em11": { frets: [0, 0, 0, 0, 0, 0], fingers: [0, 0, 0, 0, 0, 0] },
  
  // 7b5 / m7b5 (half-diminished)
  "Bm7b5": { frets: [-1, 2, 3, 2, 3, -1], fingers: [0, 1, 3, 2, 4, 0] },
  "Am7b5": { frets: [-1, 0, 1, 0, 1, 0], fingers: [0, 0, 1, 0, 2, 0] },
  "Em7b5": { frets: [0, 1, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 4, 0] },
  "F#m7b5": { frets: [2, -1, 2, 2, 1, -1], fingers: [2, 0, 3, 4, 1, 0] },
  "C#m7b5": { frets: [-1, 4, 5, 4, 5, -1], fingers: [0, 1, 3, 2, 4, 0], startFret: 4 },
  "Gm7b5": { frets: [3, -1, 3, 3, 2, -1], fingers: [2, 0, 3, 4, 1, 0] },
  "Dm7b5": { frets: [-1, -1, 0, 1, 1, 1], fingers: [0, 0, 0, 1, 1, 1] },
  "D#m7b5": { frets: [-1, 6, 7, 6, 7, -1], fingers: [0, 1, 3, 2, 4, 0], startFret: 6 },
  "D#m7-5": { frets: [-1, 6, 7, 6, 7, -1], fingers: [0, 1, 3, 2, 4, 0], startFret: 6 },
  "Ebm7b5": { frets: [-1, 6, 7, 6, 7, -1], fingers: [0, 1, 3, 2, 4, 0], startFret: 6 },
  "B-5": { frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0], startFret: 2 },
  
  // Augmented variations
  "Bbaug": { frets: [-1, 1, 0, 3, 3, 2], fingers: [0, 1, 0, 3, 4, 2] },
  "Ebaug": { frets: [-1, -1, 1, 0, 0, 3], fingers: [0, 0, 1, 0, 0, 4] },
  "Abaug": { frets: [4, 3, 2, 1, 1, 0], fingers: [4, 3, 2, 1, 1, 0] },
  
  // Special voicings
  "Fmaj7#11": { frets: [1, 0, 2, 2, 0, 0], fingers: [1, 0, 2, 3, 0, 0] },
  "AbM7": { frets: [4, 6, 5, 5, 4, 4], fingers: [1, 4, 2, 3, 1, 1], barreAt: 4, startFret: 4 },
  "DM7": { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1] },
  "FM7": { frets: [1, -1, 2, 2, 1, 0], fingers: [1, 0, 3, 4, 2, 0] },
  "GM7": { frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, 0, 0, 0, 3] },
  
  // Missing guitar-only chords
  "D#7": { frets: [-1, 6, 8, 6, 8, 6], fingers: [0, 1, 3, 1, 4, 1], barreAt: 6, startFret: 6 },
  "Gdim7": { frets: [3, 4, 3, 4, -1, -1], fingers: [1, 3, 2, 4, 0, 0] },
  "F#maj7": { frets: [2, 4, 3, 3, 2, 2], fingers: [1, 4, 2, 3, 1, 1], barreAt: 2, startFret: 2 },
  "Cm7b5": { frets: [-1, 3, 4, 3, 4, -1], fingers: [0, 1, 3, 2, 4, 0] },
  "A#7": { frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 3, 1, 4, 1], barreAt: 1 },
  
  // More slash chords
  "G/D": { frets: [-1, -1, 0, 0, 0, 3], fingers: [0, 0, 0, 0, 0, 3] },
  "Cmaj7/E": { frets: [0, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] },
  "B/A": { frets: [-1, 0, 4, 4, 4, 4], fingers: [0, 0, 1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Bm/F#": { frets: [2, 2, 4, 4, 3, 2], fingers: [1, 1, 3, 4, 2, 1], barreAt: 2, startFret: 2 },
  "Dm/F": { frets: [1, -1, 3, 2, 3, 1], fingers: [1, 0, 3, 2, 4, 1] },
  "Fm7/Ab": { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Dm/A": { frets: [-1, 0, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  "D/C": { frets: [-1, 3, 0, 2, 3, 2], fingers: [0, 3, 0, 1, 4, 2] },
  "Dsus4/F#": { frets: [2, -1, 0, 2, 3, 3], fingers: [1, 0, 0, 2, 3, 4] },
  "B/D#": { frets: [-1, 6, 4, 4, 4, 4], fingers: [0, 3, 1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Bm/D": { frets: [-1, -1, 0, 4, 3, 2], fingers: [0, 0, 0, 4, 3, 1] },
  "Cm/Eb": { frets: [-1, 6, 5, 5, 4, 3], fingers: [0, 4, 2, 3, 1, 1], startFret: 3 },
  "Eb/G": { frets: [3, 6, 5, 3, 4, 3], fingers: [1, 4, 3, 1, 2, 1], barreAt: 3, startFret: 3 },
  "Eb/Bb": { frets: [-1, 1, 1, 3, 4, 3], fingers: [0, 1, 1, 2, 4, 3] },
  "F#5/C#": { frets: [-1, 4, 4, -1, -1, -1], fingers: [0, 1, 2, 0, 0, 0], startFret: 4 },
  "B/C": { frets: [-1, 3, 4, 4, 4, 4], fingers: [0, 1, 2, 3, 3, 3], barreAt: 4, startFret: 3 },
  "F7/A": { frets: [-1, 0, 1, 2, 1, 1], fingers: [0, 0, 1, 3, 2, 2] },
  "Cm/G": { frets: [3, 3, 5, 5, 4, 3], fingers: [1, 1, 3, 4, 2, 1], barreAt: 3, startFret: 3 },
  "G/C": { frets: [-1, 3, 0, 0, 0, 3], fingers: [0, 2, 0, 0, 0, 3] },
  "Bbm/Db": { frets: [-1, 4, 3, 3, 2, 1], fingers: [0, 4, 2, 3, 1, 1] },
  "Bb/F": { frets: [1, 1, 3, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barreAt: 1 },
  "Em/F#": { frets: [2, 2, 2, 0, 0, 0], fingers: [1, 2, 3, 0, 0, 0] },
  "Dsus4/G": { frets: [3, -1, 0, 2, 3, 3], fingers: [2, 0, 0, 1, 3, 4] },
  "Cmaj7/G": { frets: [3, 3, 2, 0, 0, 0], fingers: [2, 3, 1, 0, 0, 0] },
  "Am/D": { frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 2, 1, 0] },
  "D7/F#": { frets: [2, -1, 0, 2, 1, 2], fingers: [2, 0, 0, 3, 1, 4] },
  "Cadd4/G": { frets: [3, 3, 3, 0, 1, 0], fingers: [2, 3, 4, 0, 1, 0] },
  "Bsus4/F#": { frets: [2, 2, 4, 4, 5, 2], fingers: [1, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "Bsus4/A": { frets: [-1, 0, 4, 4, 5, 2], fingers: [0, 0, 2, 3, 4, 1], startFret: 2 },
  "C/F": { frets: [1, 3, 2, 0, 1, 0], fingers: [1, 4, 2, 0, 1, 0] },
  "D/Bb": { frets: [-1, 1, 0, 2, 3, 2], fingers: [0, 1, 0, 2, 4, 3] },
  "F#m/B": { frets: [-1, 2, 4, 2, 2, 2], fingers: [0, 1, 3, 1, 1, 1], barreAt: 2, startFret: 2 },
  "C#7sus4": { frets: [-1, 4, 6, 4, 7, 4], fingers: [0, 1, 3, 1, 4, 1], barreAt: 4, startFret: 4 },
  "C#/F": { frets: [1, 4, 3, 1, 2, 1], fingers: [1, 4, 3, 1, 2, 1], barreAt: 1 },
  "C#/E#": { frets: [-1, -1, 1, 1, 2, 1], fingers: [0, 0, 1, 1, 2, 1] },
  "A/G#": { frets: [4, 0, 2, 2, 2, 0], fingers: [4, 0, 1, 2, 3, 0] },
  "D9/F#": { frets: [2, 0, 0, 2, 1, 0], fingers: [2, 0, 0, 3, 1, 0] },
  "Am/B": { frets: [-1, 2, 2, 2, 1, 0], fingers: [0, 2, 3, 4, 1, 0] },
  "D7/A": { frets: [-1, 0, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
  "F#5/E": { frets: [0, -1, 4, 4, 2, 2], fingers: [0, 0, 3, 4, 1, 1], startFret: 2 },
  "Em/Eb": { frets: [-1, -1, 1, 0, 0, 0], fingers: [0, 0, 1, 0, 0, 0] },
  "A5/F": { frets: [1, 0, 2, 2, -1, -1], fingers: [1, 0, 2, 3, 0, 0] },
  "Dsus2/E": { frets: [0, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "C#m/E": { frets: [0, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], startFret: 4 },
  
  // Diminished chords (extended)
  "G#dim": { frets: [4, 5, 6, 4, -1, -1], fingers: [1, 2, 3, 1, 0, 0], startFret: 4 },
  "F#dim": { frets: [2, 3, 4, 2, -1, -1], fingers: [1, 2, 3, 1, 0, 0], startFret: 2 },
  "Edim": { frets: [0, 1, 2, 0, -1, -1], fingers: [0, 1, 2, 0, 0, 0] },
  "Ddim": { frets: [-1, -1, 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2] },
  "Cdim": { frets: [-1, 3, 4, 2, 4, 2], fingers: [0, 2, 3, 1, 4, 1] },
  "Bdim": { frets: [-1, 2, 3, 1, 3, 1], fingers: [0, 2, 3, 1, 4, 1] },
  "Abdim": { frets: [4, 5, 6, 4, -1, -1], fingers: [1, 2, 3, 1, 0, 0], startFret: 4 },
  
  // 6th chords (extended)
  "F#6": { frets: [2, 4, 4, 3, 4, 2], fingers: [1, 2, 3, 1, 4, 1], barreAt: 2, startFret: 2 },
  "Eb6": { frets: [-1, 6, 5, 5, 5, 6], fingers: [0, 2, 1, 1, 1, 3], barreAt: 5, startFret: 5 },
  "Bb6": { frets: [-1, 1, 3, 3, 3, 3], fingers: [0, 1, 2, 3, 3, 3], barreAt: 3 },
  "C#m6": { frets: [-1, 4, 2, 3, 2, 4], fingers: [0, 3, 1, 2, 1, 4], startFret: 2 },
  
  // Sus aliases (for compatibility)
  "Asus": { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "Dsus": { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  "Csus": { frets: [-1, 3, 3, 0, 1, 1], fingers: [0, 2, 3, 0, 1, 1] },
  
  // Major aliases (for compatibility)
  "Cmaj": { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  "AM": { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "CM7": { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] },
  "CM7/G": { frets: [3, 3, 2, 0, 0, 0], fingers: [2, 3, 1, 0, 0, 0] },
  "BbM7": { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 4, 1], barreAt: 1 },
  "EbM7": { frets: [-1, 6, 8, 7, 8, 6], fingers: [0, 1, 3, 2, 4, 1], barreAt: 6, startFret: 6 },
  "AbMaj7": { frets: [4, 6, 5, 5, 4, 4], fingers: [1, 4, 2, 3, 1, 1], barreAt: 4, startFret: 4 },
  "DbMaj7": { frets: [-1, 4, 6, 5, 6, 4], fingers: [0, 1, 3, 2, 4, 1], barreAt: 4, startFret: 4 },
  "D#maj7": { frets: [-1, 6, 8, 7, 8, 6], fingers: [0, 1, 3, 2, 4, 1], barreAt: 6, startFret: 6 },
  
  // 11th and 13th chords
  "Bm11": { frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3] },
  "E11": { frets: [0, 0, 0, 1, 0, 0], fingers: [0, 0, 0, 1, 0, 0] },
  "C13": { frets: [-1, 3, 2, 3, 3, 5], fingers: [0, 2, 1, 3, 3, 4] },
  "B13": { frets: [-1, 2, 1, 2, 2, 4], fingers: [0, 2, 1, 3, 3, 4] },
  
  // Sus2 chords (extended)
  "G#sus2": { frets: [4, 6, 6, 3, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barreAt: 4, startFret: 3 },
  "Bsus2": { frets: [-1, 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1], barreAt: 2, startFret: 2 },
  "C#sus2": { frets: [-1, 4, 6, 6, 4, 4], fingers: [0, 1, 3, 4, 1, 1], barreAt: 4, startFret: 4 },
  "Ebsus2": { frets: [-1, 6, 8, 8, 6, 6], fingers: [0, 1, 3, 4, 1, 1], barreAt: 6, startFret: 6 },
  
  // 3 and 4 chords (variant names)
  "G3": { frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4] },
  "B3": { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "A3": { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "E4": { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
  
  // Augmented variants
  "G+": { frets: [3, 2, 1, 0, 0, 3], fingers: [3, 2, 1, 0, 0, 4] },
  
  // Power chord variants
  "A#5": { frets: [-1, 1, 3, 3, -1, -1], fingers: [0, 1, 3, 4, 0, 0] },
  
  // Complex voicings from tabs
  "Emb6": { frets: [0, 2, 2, 0, 1, 0], fingers: [0, 2, 3, 0, 1, 0] },
  "Dmin7": { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1] },
  "Aaddb6": { frets: [-1, 0, 2, 2, 2, 2], fingers: [0, 0, 1, 1, 1, 1] },
  "GmMaj7": { frets: [3, 5, 4, 3, 3, 3], fingers: [1, 4, 2, 1, 1, 1], barreAt: 3, startFret: 3 },
  "Emaj7sus4": { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0] },
  "Em7add4": { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  "Cmaj7#11": { frets: [-1, 3, 2, 0, 0, 1], fingers: [0, 3, 2, 0, 0, 1] },
  "C7sus2": { frets: [-1, 3, 0, 3, 1, 0], fingers: [0, 2, 0, 3, 1, 0] },
  "D6sus2": { frets: [-1, -1, 0, 2, 0, 0], fingers: [0, 0, 0, 1, 0, 0] },
  "G6sus2": { frets: [3, 0, 0, 0, 0, 0], fingers: [1, 0, 0, 0, 0, 0] },
  "G6/F#": { frets: [2, 2, 0, 0, 0, 0], fingers: [1, 2, 0, 0, 0, 0] },
  "D/Db": { frets: [-1, 4, 0, 2, 3, 2], fingers: [0, 4, 0, 1, 3, 2] },
  "Cadd4/F": { frets: [1, 3, 3, 0, 1, 0], fingers: [1, 3, 4, 0, 2, 0] },
  "Dmaj9/F#": { frets: [2, 0, 0, 2, 2, 0], fingers: [1, 0, 0, 2, 3, 0] },
  "Em9/A": { frets: [-1, 0, 2, 0, 0, 2], fingers: [0, 0, 1, 0, 0, 2] },
  "C#M9": { frets: [-1, 4, 3, 4, 4, 4], fingers: [0, 2, 1, 3, 3, 3], startFret: 3 },
  "D#M9": { frets: [-1, 6, 5, 6, 6, 6], fingers: [0, 2, 1, 3, 3, 3], startFret: 5 },
  "Abadd9": { frets: [4, 6, 3, 5, 4, 4], fingers: [2, 4, 1, 3, 2, 2], startFret: 3 },
  "C#m9": { frets: [-1, 4, 4, 4, 4, 4], fingers: [0, 1, 1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Gbm6/Ab": { frets: [4, 6, 4, 6, -1, -1], fingers: [1, 3, 2, 4, 0, 0], startFret: 4 },
  "Fm#": { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barreAt: 1 },
  "H": { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "Bm7-5": { frets: [-1, 2, 3, 2, 3, -1], fingers: [0, 1, 3, 2, 4, 0] },
  "C#(b5)": { frets: [-1, 4, 5, 5, 6, -1], fingers: [0, 1, 2, 2, 3, 0], startFret: 4 },
  
  // Additional commonly used chords
  "C/Bb": { frets: [-1, 1, 2, 0, 1, 0], fingers: [0, 1, 2, 0, 1, 0] },
  "Dadd4/F#": { frets: [2, -1, 0, 2, 3, 3], fingers: [1, 0, 0, 2, 3, 4] },
  "A#dim": { frets: [-1, 1, 2, 0, 2, 0], fingers: [0, 1, 3, 0, 4, 0] },
  "DbM7": { frets: [-1, 4, 6, 5, 6, 4], fingers: [0, 1, 3, 2, 4, 1], barreAt: 4, startFret: 4 },
  "G7M": { frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, 0, 0, 0, 3] },
  "B/F#": { frets: [2, 2, 4, 4, 4, 2], fingers: [1, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "Bbdim/Db": { frets: [-1, 4, 2, 3, 2, -1], fingers: [0, 4, 1, 3, 2, 0], startFret: 2 },
  "Dadd9/F#": { frets: [2, 0, 0, 2, 3, 0], fingers: [1, 0, 0, 2, 3, 0] },
  "A6/C#": { frets: [-1, 4, 2, 2, 2, 2], fingers: [0, 4, 1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "Dadd4": { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  "D5/F#": { frets: [2, -1, 0, 2, 3, -1], fingers: [1, 0, 0, 2, 3, 0] },
  "Am/F#": { frets: [2, 0, 2, 2, 1, 0], fingers: [2, 0, 3, 4, 1, 0] },
  "G7/C": { frets: [-1, 3, 0, 0, 0, 1], fingers: [0, 3, 0, 0, 0, 1] },
  "A9/G#": { frets: [4, 0, 2, 1, 2, 0], fingers: [4, 0, 2, 1, 3, 0] },
  "D/C#": { frets: [-1, 4, 0, 2, 3, 2], fingers: [0, 4, 0, 1, 3, 2] },
  "Dmaj7/C#": { frets: [-1, 4, 0, 2, 2, 2], fingers: [0, 4, 0, 1, 1, 1] },
  "EM7": { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0] },
  "G13": { frets: [3, 2, 0, 0, 0, 0], fingers: [2, 1, 0, 0, 0, 0] },
  "Ab/Gb": { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barreAt: 4, startFret: 4 },
  "Bsus": { frets: [-1, 2, 4, 4, 5, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "G5/F#": { frets: [2, -1, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 3, 4] },
  "Bb(add#11)": { frets: [-1, 1, 3, 3, 3, 2], fingers: [0, 1, 2, 3, 4, 2] },
  "Bm7add11": { frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 1, 0, 2, 0, 3] },
  "F#m7add11/E": { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
  "B/E": { frets: [0, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "C#dim": { frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], startFret: 3 },
  "Gm/A": { frets: [-1, 0, 5, 3, 3, 3], fingers: [0, 0, 4, 1, 2, 3] },
  "Fmaj13": { frets: [1, 0, 0, 0, 1, 0], fingers: [1, 0, 0, 0, 2, 0] },
  "E/B": { frets: [-1, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  "C#dim7": { frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], startFret: 3 },
  "Amaj7/C#": { frets: [-1, 4, 2, 1, 2, 0], fingers: [0, 4, 2, 1, 3, 0] },
  "G11": { frets: [3, 3, 0, 0, 1, 1], fingers: [2, 3, 0, 0, 1, 1] },
  "Fmaj7/C": { frets: [-1, 3, 3, 2, 1, 0], fingers: [0, 3, 4, 2, 1, 0] },
  "B/G": { frets: [3, 2, 4, 4, 4, 2], fingers: [2, 1, 3, 3, 3, 1], barreAt: 2, startFret: 2 },
  "Gm7/Bb": { frets: [-1, 1, 3, 0, 3, 3], fingers: [0, 1, 2, 0, 3, 4] },
  "Bb3": { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barreAt: 1 },
  "F#3": { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barreAt: 2, startFret: 2 },
  "Ab/Bb": { frets: [-1, 1, 1, 1, 4, 4], fingers: [0, 1, 1, 1, 3, 4], barreAt: 1 },
  "F#m/E": { frets: [0, 2, 4, 2, 2, 2], fingers: [0, 1, 4, 2, 2, 2], barreAt: 2, startFret: 2 },
  "C#m/B": { frets: [-1, 2, 4, 6, 5, 4], fingers: [0, 1, 2, 4, 3, 1], startFret: 2 },
  "C#m/A#": { frets: [-1, 1, 4, 6, 5, 4], fingers: [0, 1, 2, 4, 3, 1], startFret: 1 },
  "C#maj7": { frets: [-1, 4, 3, 5, 4, 4], fingers: [0, 2, 1, 4, 3, 3], startFret: 3 },
  "Db(add9)": { frets: [-1, 4, 3, 1, 4, 4], fingers: [0, 3, 2, 1, 4, 4], startFret: 1 },
  "Dm/B": { frets: [-1, 2, 3, 2, 3, 1], fingers: [0, 2, 3, 1, 4, 1] },
  "Csus/E": { frets: [0, 3, 3, 0, 1, 0], fingers: [0, 3, 4, 0, 1, 0] },
  "Db/F": { frets: [1, 4, 3, 1, 1, 1], fingers: [1, 4, 3, 1, 1, 1], barreAt: 1 },
  "D#dim": { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] },
  "A/B": { frets: [-1, 2, 2, 2, 2, 0], fingers: [0, 1, 1, 1, 1, 0], barreAt: 2 },
  "E3": { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  "F#/A#": { frets: [-1, 1, 4, 3, 2, 2], fingers: [0, 1, 4, 3, 2, 2] },
  "E7/G#": { frets: [4, 2, 0, 1, 0, 0], fingers: [4, 2, 0, 1, 0, 0] },
  "F#dim7": { frets: [2, 3, 1, 2, -1, -1], fingers: [2, 4, 1, 3, 0, 0] },
  "AbM7/C": { frets: [-1, 3, 1, 1, 0, 3], fingers: [0, 3, 1, 2, 0, 4] },
  "Gb9": { frets: [2, 1, 2, 1, 2, 2], fingers: [2, 1, 3, 1, 4, 4], barreAt: 1 },
  "Bbmaj7/A": { frets: [-1, 0, 3, 2, 3, 1], fingers: [0, 0, 3, 2, 4, 1] },
  "E7b9": { frets: [0, 2, 0, 1, 3, 1], fingers: [0, 2, 0, 1, 4, 1] },
  "F9/A": { frets: [-1, 0, 1, 0, 1, 1], fingers: [0, 0, 1, 0, 2, 3] },
  "AM7": { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0] },
  "A4": { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] },
  "Emin7": { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  "A/Ab": { frets: [4, 0, 2, 2, 2, 0], fingers: [4, 0, 1, 2, 3, 0] },
  "C#add9": { frets: [-1, 4, 3, 1, 4, 4], fingers: [0, 3, 2, 1, 4, 4], startFret: 1 },
  "G#dim7": { frets: [4, 5, 3, 4, -1, -1], fingers: [2, 4, 1, 3, 0, 0], startFret: 3 },
  "B11/A": { frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  "Em/C#": { frets: [-1, 4, 2, 0, 0, 0], fingers: [0, 3, 1, 0, 0, 0] },
  "Ammaj7": { frets: [-1, 0, 2, 1, 1, 0], fingers: [0, 0, 3, 1, 2, 0] },
  "A7/C#": { frets: [-1, 4, 2, 0, 2, 0], fingers: [0, 4, 1, 0, 2, 0] },
  "C(add9)": { frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 3, 0] },
  "Dm/G": { frets: [3, -1, 0, 2, 3, 1], fingers: [3, 0, 0, 2, 4, 1] },
  "Em(add9)": { frets: [0, 2, 4, 0, 0, 2], fingers: [0, 1, 3, 0, 0, 2] },
  "Bm/E": { frets: [0, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], startFret: 2 },
  "C#m11": { frets: [-1, 4, 4, 4, 4, 4], fingers: [0, 1, 1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "D2/F#": { frets: [2, -1, 0, 2, 3, 0], fingers: [1, 0, 0, 2, 3, 0] },
  "Dmaj7/E": { frets: [0, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1] },
  "Em7#5": { frets: [0, 3, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  "F#(b5)": { frets: [2, -1, 4, 3, 1, -1], fingers: [2, 0, 4, 3, 1, 0] },
  "G5/E": { frets: [0, -1, 0, 0, 3, 3], fingers: [0, 0, 0, 0, 2, 3] },
  "Dm7/A": { frets: [-1, 0, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1] },
  "E/F#": { frets: [2, 2, 2, 1, 0, 0], fingers: [2, 3, 4, 1, 0, 0] },
  "Dsus2/A": { frets: [-1, 0, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "Bdim/D": { frets: [-1, -1, 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2] },
  "Ab/C": { frets: [-1, 3, 1, 1, 1, 4], fingers: [0, 2, 1, 1, 1, 4], barreAt: 1 },
  "Cm/Bb": { frets: [-1, 1, 1, 0, 1, 3], fingers: [0, 1, 1, 0, 2, 4] },
  "G7sus": { frets: [3, 2, 0, 0, 1, 1], fingers: [3, 2, 0, 0, 1, 1] },
  "Dmaj/G": { frets: [3, -1, 0, 2, 3, 2], fingers: [2, 0, 0, 1, 3, 1] },
  "Bbadd#11": { frets: [-1, 1, 3, 3, 3, 2], fingers: [0, 1, 2, 3, 4, 2] },
  "Cm/A": { frets: [-1, 0, 1, 0, 1, 3], fingers: [0, 0, 1, 0, 2, 4] },
  "G6/B": { frets: [-1, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  "Dadd11/A": { frets: [-1, 0, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  "E/D": { frets: [-1, -1, 0, 1, 0, 0], fingers: [0, 0, 0, 1, 0, 0] },
  "G#7sus2": { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], barreAt: 4, startFret: 4 },
  "BM7": { frets: [-1, 2, 4, 3, 4, 2], fingers: [0, 1, 3, 2, 4, 1], barreAt: 2, startFret: 2 },
  "Dmaj7/F#": { frets: [2, -1, 0, 2, 2, 2], fingers: [1, 0, 0, 2, 2, 2] },
  "Dbdim": { frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], startFret: 3 },
  "F#m6": { frets: [2, 4, 2, 2, 2, -1], fingers: [1, 3, 1, 1, 1, 0], barreAt: 2, startFret: 2 },
  "F#7b9": { frets: [2, 1, 2, 0, 2, 0], fingers: [2, 1, 3, 0, 4, 0] },
  "Eb/F": { frets: [1, 1, 1, 3, 4, 3], fingers: [1, 1, 1, 2, 4, 3], barreAt: 1 },
  "Gsus2/B": { frets: [-1, 2, 0, 0, 3, 0], fingers: [0, 1, 0, 0, 2, 0] },
  
  // Additional missing chords
  "Gmadd9": { frets: [3, 5, 3, 3, 3, 5], fingers: [1, 3, 1, 1, 1, 4], barreAt: 3, startFret: 3 },
  "F#/C#": { frets: [-1, 4, 4, 3, 2, 2], fingers: [0, 3, 4, 2, 1, 1], startFret: 2 },
  "G#/C": { frets: [-1, 3, 1, 1, 1, 4], fingers: [0, 3, 1, 1, 1, 4], barreAt: 1 },
  "C#/G#": { frets: [4, 4, 6, 6, 6, 4], fingers: [1, 1, 2, 3, 4, 1], barreAt: 4, startFret: 4 },
  
  // Slash chords from tabs
  "A/G": { frets: [3, 0, 2, 2, 2, 0], fingers: [3, 0, 1, 1, 1, 0] },
  "Am/F": { frets: [1, 0, 2, 2, 1, 0], fingers: [1, 0, 3, 4, 2, 0] },
  "Am/F#": { frets: [2, 0, 2, 2, 1, 0], fingers: [2, 0, 3, 4, 1, 0] },
  "Am/G": { frets: [3, 0, 2, 2, 1, 0], fingers: [3, 0, 2, 4, 1, 0] },
  "B/A": { frets: [-1, 0, 4, 4, 4, 2], fingers: [0, 0, 2, 3, 4, 1], startFret: 2 },
  "B/E": { frets: [0, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], startFret: 2 },
  "B/F#": { frets: [2, 2, 4, 4, 4, 2], fingers: [1, 1, 2, 3, 4, 1], barreAt: 2, startFret: 2 },
  "Bm/A": { frets: [-1, 0, 4, 4, 3, 2], fingers: [0, 0, 3, 4, 2, 1], startFret: 2 },
  "Bm/G": { frets: [3, 2, 4, 4, 3, 2], fingers: [2, 1, 4, 4, 3, 1], startFret: 2 },
  "C/A": { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  "C/B": { frets: [-1, 2, 2, 0, 1, 0], fingers: [0, 2, 3, 0, 1, 0] },
  "C/Bb": { frets: [-1, 1, 2, 0, 1, 0], fingers: [0, 1, 3, 0, 2, 0] },
  "C/E": { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  "C/F": { frets: [1, 3, 2, 0, 1, 0], fingers: [1, 4, 2, 0, 1, 0] },
  "C/G": { frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0] },
  "D/E": { frets: [0, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  "D/F#": { frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
  "D/G": { frets: [3, 0, 0, 2, 3, 2], fingers: [2, 0, 0, 1, 3, 1] },
  "Dm/A": { frets: [-1, 0, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  "Dm/F": { frets: [1, 0, 0, 2, 3, 1], fingers: [1, 0, 0, 2, 4, 1] },
  "Dm/G": { frets: [3, 0, 0, 2, 3, 1], fingers: [3, 0, 0, 1, 2, 1] },
  "E/G#": { frets: [4, 2, 2, 1, 0, 0], fingers: [4, 2, 3, 1, 0, 0] },
  "E7/D": { frets: [-1, -1, 0, 1, 0, 0], fingers: [0, 0, 0, 1, 0, 0] },
  "Em/B": { frets: [-1, 2, 2, 0, 0, 0], fingers: [0, 1, 2, 0, 0, 0] },
  "F/A": { frets: [-1, 0, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], barreAt: 1 },
  "F/Bb": { frets: [-1, 1, 3, 2, 1, 1], fingers: [0, 1, 4, 2, 1, 1], barreAt: 1 },
  "F/C": { frets: [-1, 3, 3, 2, 1, 1], fingers: [0, 3, 4, 2, 1, 1], barreAt: 1 },
  "F/E": { frets: [0, 0, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], barreAt: 1 },
  "F/G": { frets: [3, 0, 3, 2, 1, 1], fingers: [3, 0, 4, 2, 1, 1], barreAt: 1 },
  "G/A": { frets: [-1, 0, 0, 0, 0, 3], fingers: [0, 0, 0, 0, 0, 3] },
  "G/B": { frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 2] },
  "G/C": { frets: [-1, 3, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 2] },
  "G/D": { frets: [-1, -1, 0, 0, 0, 3], fingers: [0, 0, 0, 0, 0, 3] },
  "G/F#": { frets: [2, 2, 0, 0, 0, 3], fingers: [1, 2, 0, 0, 0, 3] },
  "Gm/Bb": { frets: [-1, 1, 3, 3, 3, 3], fingers: [0, 1, 2, 3, 4, 4], barreAt: 3, startFret: 1 },
  "Gm/D": { frets: [-1, -1, 0, 3, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  "Dsus/Bb": { frets: [-1, 1, 0, 2, 3, 3], fingers: [0, 1, 0, 2, 3, 4] },
  
  // Add variations
  "C2": { frets: [-1, 3, 0, 0, 1, 0], fingers: [0, 3, 0, 0, 1, 0] },
  "G2": { frets: [3, 0, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 2, 3] },
  "Bb2": { frets: [-1, 1, 3, 3, 1, 1], fingers: [0, 1, 3, 4, 1, 1], barreAt: 1 },
  "Bb3": { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barreAt: 1 },
  "D5": { frets: [-1, -1, 0, 2, 3, -1], fingers: [0, 0, 0, 1, 2, 0] },
  "G5": { frets: [3, -1, 0, 0, 3, 3], fingers: [1, 0, 0, 0, 2, 3] },
  "G11": { frets: [3, 0, 0, 2, 1, 1], fingers: [3, 0, 0, 2, 1, 1] },
  "G6/C": { frets: [-1, 3, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  
  // Complex add chords
  "Cadd11/G": { frets: [3, 3, 0, 0, 1, 0], fingers: [2, 3, 0, 0, 1, 0] },
  "Csus2add6/G": { frets: [3, 3, 0, 2, 1, 0], fingers: [2, 3, 0, 4, 1, 0] },
  "Am7add11": { frets: [-1, 0, 0, 0, 1, 0], fingers: [0, 0, 0, 0, 1, 0] },
  "Amadd11": { frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  "Dadd4add9": { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  "Fadd9/C": { frets: [-1, 3, 3, 2, 1, 0], fingers: [0, 3, 4, 2, 1, 0] },
  "Fmaj7b5/E": { frets: [0, 0, 3, 2, 1, 0], fingers: [0, 0, 4, 2, 1, 0] },
  "Gb(b5)": { frets: [2, -1, 3, 3, 1, 2], fingers: [1, 0, 3, 4, 1, 2], startFret: 1 },
  "Gsus": { frets: [3, 2, 0, 0, 1, 3], fingers: [3, 2, 0, 0, 1, 4] },
  "D#dim7": { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] },
}

export const UKULELE_CHORDS = {
  // Major chords
  "C": { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  "D": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "D/F#": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "E": { frets: [1, 4, 0, 2], fingers: [1, 4, 0, 2] },
  "F": { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  "G": { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  "G/B": { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  "A": { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  "A/F#": { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
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
  
  // Suspended chords
  "Asus4": { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "Dsus4": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "Esus4": { frets: [2, 4, 0, 2], fingers: [1, 3, 0, 2] },
  "Gsus4": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "Csus4": { frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
  "Fsus4": { frets: [3, 0, 1, 1], fingers: [3, 0, 1, 2] },
  "Bsus4": { frets: [4, 4, 2, 2], fingers: [3, 4, 1, 1], barreAt: 2, startFret: 2 },
  "F#sus4": { frets: [4, 1, 2, 2], fingers: [4, 1, 2, 3] },
  "C#sus4": { frets: [1, 1, 2, 4], fingers: [1, 1, 2, 4] },
  "Bbsus4": { frets: [3, 3, 1, 1], fingers: [3, 4, 1, 1], barreAt: 1 },
  "Ebsus4": { frets: [3, 3, 4, 1], fingers: [2, 3, 4, 1] },
  "Absus4": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  
  // Asus2 and sus2 chords
  "Asus2": { frets: [2, 4, 0, 2], fingers: [1, 3, 0, 2] },
  "Dsus2": { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "Esus2": { frets: [4, 4, 0, 2], fingers: [2, 3, 0, 1] },
  "Gsus2": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "Csus2": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "Fsus2": { frets: [0, 0, 1, 0], fingers: [0, 0, 1, 0] },
  
  // Slash chords
  "Gmaj7/B": { frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  "F/A": { frets: [2, 0, 1, 3], fingers: [2, 0, 1, 4] },
  "C/G": { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  "G/B": { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  "Am/G": { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  "Am/E": { frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  "D/F#": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "A/C#": { frets: [2, 1, 0, 4], fingers: [2, 1, 0, 4] },
  "C/E": { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  "Em/D": { frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  "Em/B": { frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  "Em/G": { frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  "C#m/B": { frets: [1, 1, 4, 2], fingers: [1, 1, 4, 2] },
  "C#m/A#": { frets: [1, 1, 4, 1], fingers: [1, 1, 4, 1] },
  
  // Minor 7th (extended)
  "F#m7": { frets: [2, 1, 2, 2], fingers: [2, 1, 3, 4] },
  "C#m7": { frets: [1, 1, 0, 2], fingers: [1, 2, 0, 4] },
  "G#m7": { frets: [4, 3, 4, 4], fingers: [2, 1, 3, 4] },
  "D#m7": { frets: [3, 3, 2, 4], fingers: [2, 3, 1, 4] },
  "Ebm7": { frets: [3, 3, 2, 4], fingers: [2, 3, 1, 4] },
  "Dbm7": { frets: [1, 1, 0, 2], fingers: [1, 2, 0, 4] },
  "Abm7": { frets: [4, 3, 4, 4], fingers: [2, 1, 3, 4] },
  "A#m7": { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barreAt: 1 },
  "Bbm7": { frets: [1, 1, 1, 1], fingers: [1, 1, 1, 1], barreAt: 1 },
  
  // 6th chords
  "C6": { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  "G6": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "A6": { frets: [2, 4, 2, 4], fingers: [1, 3, 2, 4] },
  "D6": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "F6": { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  "E6": { frets: [1, 1, 0, 2], fingers: [1, 2, 0, 4] },
  
  // Minor 6th chords
  "Am6": { frets: [2, 0, 2, 0], fingers: [1, 0, 2, 0] },
  "Dm6": { frets: [2, 2, 1, 2], fingers: [2, 3, 1, 4] },
  "Em6": { frets: [0, 1, 0, 2], fingers: [0, 1, 0, 2] },
  "Cm6": { frets: [2, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "Gm6": { frets: [0, 2, 0, 1], fingers: [0, 2, 0, 1] },
  "Fm6": { frets: [1, 2, 1, 3], fingers: [1, 2, 1, 4] },
  
  // 9th chords
  "C9": { frets: [0, 2, 0, 1], fingers: [0, 2, 0, 1] },
  "C#9": { frets: [1, 3, 1, 2], fingers: [1, 3, 1, 2], barreAt: 1 },
  "Db9": { frets: [1, 3, 1, 2], fingers: [1, 3, 1, 2], barreAt: 1 },
  "D9": { frets: [2, 4, 2, 3], fingers: [1, 3, 1, 2] },
  "D#9": { frets: [3, 5, 3, 4], fingers: [1, 3, 1, 2], startFret: 3 },
  "Eb9": { frets: [3, 5, 3, 4], fingers: [1, 3, 1, 2], startFret: 3 },
  "E9": { frets: [1, 2, 2, 2], fingers: [1, 2, 3, 4] },
  "F9": { frets: [0, 0, 1, 0], fingers: [0, 0, 1, 0] },
  "F#9": { frets: [1, 1, 2, 1], fingers: [1, 1, 3, 1], barreAt: 1 },
  "Gb9": { frets: [1, 1, 2, 1], fingers: [1, 1, 3, 1], barreAt: 1 },
  "G9": { frets: [2, 2, 1, 2], fingers: [2, 3, 1, 4] },
  "G#9": { frets: [3, 3, 2, 3], fingers: [2, 3, 1, 4], startFret: 3 },
  "Ab9": { frets: [3, 3, 2, 3], fingers: [2, 3, 1, 4], startFret: 3 },
  "A9": { frets: [0, 1, 0, 2], fingers: [0, 1, 0, 2] },
  "A#9": { frets: [1, 2, 1, 3], fingers: [1, 2, 1, 4], barreAt: 1 },
  "Bb9": { frets: [1, 2, 1, 3], fingers: [1, 2, 1, 4], barreAt: 1 },
  "B9": { frets: [2, 3, 2, 4], fingers: [1, 2, 1, 4], barreAt: 2, startFret: 2 },
  
  // Minor 9th chords
  "Am9": { frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  "Dm9": { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  "Em9": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "Cm9": { frets: [3, 3, 3, 5], fingers: [1, 1, 1, 3], barreAt: 3, startFret: 3 },
  "Gm9": { frets: [0, 2, 1, 1], fingers: [0, 3, 1, 2] },
  "Fm9": { frets: [0, 5, 4, 3], fingers: [0, 4, 3, 2], startFret: 3 },
  "Bm9": { frets: [4, 2, 2, 4], fingers: [3, 1, 2, 4], startFret: 2 },
  
  // 7sus4 chords
  "A7sus4": { frets: [0, 2, 0, 0], fingers: [0, 1, 0, 0] },
  "D7sus4": { frets: [2, 2, 3, 3], fingers: [1, 1, 2, 3] },
  "E7sus4": { frets: [2, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "G7sus4": { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  "B7sus4": { frets: [4, 4, 2, 2], fingers: [3, 4, 1, 1], barreAt: 2, startFret: 2 },
  "C7sus4": { frets: [0, 0, 1, 1], fingers: [0, 0, 1, 2] },
  "F7sus4": { frets: [3, 0, 1, 1], fingers: [3, 0, 1, 2] },
  
  // Add9 chords
  "Cadd9": { frets: [0, 2, 0, 3], fingers: [0, 2, 0, 4] },
  "Gadd9": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "Aadd9": { frets: [2, 1, 0, 2], fingers: [2, 1, 0, 3] },
  "Dadd9": { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "Eadd9": { frets: [1, 4, 2, 2], fingers: [1, 4, 2, 3] },
  "Fadd9": { frets: [0, 0, 1, 0], fingers: [0, 0, 1, 0] },
  "Badd9": { frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1], startFret: 2 },
  
  // Madd9 chords (minor add9)
  "Amadd9": { frets: [2, 0, 0, 2], fingers: [1, 0, 0, 2] },
  "Emadd9": { frets: [0, 4, 3, 4], fingers: [0, 2, 1, 3] },
  "Dmadd9": { frets: [2, 2, 1, 2], fingers: [2, 3, 1, 4] },
  "Bmadd9": { frets: [4, 2, 4, 2], fingers: [3, 1, 4, 1], barreAt: 2, startFret: 2 },
  
  // Major 7th extended
  "Ebmaj7": { frets: [3, 3, 3, 5], fingers: [1, 1, 1, 3], barreAt: 3, startFret: 3 },
  "Abmaj7": { frets: [5, 3, 3, 3], fingers: [3, 1, 1, 1], barreAt: 3, startFret: 3 },
  "Bbmaj7": { frets: [3, 2, 1, 0], fingers: [3, 2, 1, 0] },
  "Dbmaj7": { frets: [1, 1, 1, 3], fingers: [1, 1, 1, 3], barreAt: 1 },
  "A#maj7": { frets: [3, 2, 1, 0], fingers: [3, 2, 1, 0] },
  "G#maj7": { frets: [5, 3, 3, 3], fingers: [3, 1, 1, 1], barreAt: 3, startFret: 3 },
  "F#maj7": { frets: [3, 1, 1, 1], fingers: [4, 1, 1, 1], barreAt: 1 },
  
  // Major 9th chords
  "Cmaj9": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "Gmaj9": { frets: [0, 2, 2, 0], fingers: [0, 1, 2, 0] },
  "Amaj9": { frets: [1, 1, 0, 2], fingers: [1, 2, 0, 4] },
  "Dmaj9": { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  "Fmaj9": { frets: [0, 0, 1, 2], fingers: [0, 0, 1, 2] },
  "Bbmaj9": { frets: [3, 2, 1, 0], fingers: [3, 2, 1, 0] },
  
  // Diminished chords
  "Cdim": { frets: [0, 3, 2, 3], fingers: [0, 2, 1, 3] },
  "Ddim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Edim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Fdim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Gdim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Adim": { frets: [2, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "Bdim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  
  // Diminished 7th chords
  "Cdim7": { frets: [2, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "Ddim7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Edim7": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Fdim7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Gdim7": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Adim7": { frets: [2, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "Bdim7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  
  // Augmented chords
  "Caug": { frets: [1, 0, 0, 3], fingers: [1, 0, 0, 4] },
  "Daug": { frets: [3, 2, 2, 5], fingers: [2, 1, 1, 4], startFret: 2 },
  "Eaug": { frets: [1, 0, 0, 3], fingers: [1, 0, 0, 4] },
  "Faug": { frets: [2, 1, 1, 0], fingers: [3, 1, 2, 0] },
  "Gaug": { frets: [0, 3, 3, 2], fingers: [0, 2, 3, 1] },
  "Aaug": { frets: [2, 1, 1, 4], fingers: [2, 1, 1, 4] },
  "Baug": { frets: [0, 3, 3, 2], fingers: [0, 2, 3, 1] },
  
  // 11th chords
  "Am11": { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  "Dm11": { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  "Em11": { frets: [0, 2, 0, 0], fingers: [0, 1, 0, 0] },
  "Gm11": { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  
  // m7b5 (half-diminished)
  "Am7b5": { frets: [2, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "Bm7b5": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "Cm7b5": { frets: [3, 3, 3, 4], fingers: [1, 1, 1, 2], barreAt: 3, startFret: 3 },
  "Dm7b5": { frets: [1, 2, 1, 3], fingers: [1, 2, 1, 4] },
  "Em7b5": { frets: [0, 3, 3, 2], fingers: [0, 2, 3, 1] },
  "F#m7b5": { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0] },
  "Gm7b5": { frets: [0, 1, 1, 1], fingers: [0, 1, 1, 1], barreAt: 1 },
  "C#m7b5": { frets: [0, 4, 4, 4], fingers: [0, 1, 2, 3] },
  "D#m7b5": { frets: [2, 3, 2, 4], fingers: [1, 2, 1, 4] },
  "D#m7-5": { frets: [2, 3, 2, 4], fingers: [1, 2, 1, 4] },
  "Ebm7b5": { frets: [2, 3, 2, 4], fingers: [1, 2, 1, 4] },
  "B-5": { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  
  // Sharp/flat sevenths
  "C#7": { frets: [1, 1, 1, 2], fingers: [1, 1, 1, 2], barreAt: 1 },
  "Db7": { frets: [1, 1, 1, 2], fingers: [1, 1, 1, 2], barreAt: 1 },
  "D#7": { frets: [3, 3, 3, 4], fingers: [1, 1, 1, 2], barreAt: 3, startFret: 3 },
  "Eb7": { frets: [3, 3, 3, 4], fingers: [1, 1, 1, 2], barreAt: 3, startFret: 3 },
  "F#7": { frets: [3, 1, 2, 4], fingers: [2, 1, 1, 4] },
  "Gb7": { frets: [3, 1, 2, 4], fingers: [2, 1, 1, 4] },
  "G#7": { frets: [1, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "Ab7": { frets: [1, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "A#7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Bb7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  
  // Power chords (note: ukulele power chords are less common but requested)
  "A5": { frets: [2, 4, -1, -1], fingers: [1, 3, 0, 0] },
  "D5": { frets: [2, 2, 3, -1], fingers: [1, 1, 2, 0] },
  "E5": { frets: [4, 4, 0, -1], fingers: [2, 3, 0, 0] },
  "G5": { frets: [0, 2, 3, -1], fingers: [0, 1, 2, 0] },
  "B5": { frets: [4, 4, 0, -1], fingers: [2, 3, 0, 0] },
  "C5": { frets: [0, 0, 3, 3], fingers: [0, 0, 1, 2] },
  "F5": { frets: [2, 0, 3, -1], fingers: [1, 0, 2, 0] },
  "F#5": { frets: [3, 1, 4, -1], fingers: [2, 1, 3, 0] },
  "Bb5": { frets: [3, 2, 4, -1], fingers: [2, 1, 3, 0] },
  "C#5": { frets: [1, 1, 4, -1], fingers: [1, 1, 3, 0], barreAt: 1 },
  "C#5/G#": { frets: [4, 1, 4, -1], fingers: [3, 1, 4, 0] },
  "A5/G#": { frets: [4, 0, 2, -1], fingers: [3, 0, 1, 0] },
  "D5/A": { frets: [2, 2, 0, -1], fingers: [2, 3, 0, 0] },
  "E5/B": { frets: [4, 4, 0, -1], fingers: [2, 3, 0, 0] },
  "G5/D": { frets: [0, 2, 3, -1], fingers: [0, 1, 2, 0] },
  "G#5": { frets: [4, 3, 4, -1], fingers: [2, 1, 3, 0] },
  "Eb5": { frets: [3, 3, 4, -1], fingers: [1, 2, 3, 0] },
  
  // Additional slash chords
  "E/G#": { frets: [4, 4, 0, 2], fingers: [3, 4, 0, 1] },
  "Am/C": { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  "C/D": { frets: [2, 0, 0, 3], fingers: [2, 0, 0, 3] },
  "Bb/D": { frets: [-1, 2, 1, 1], fingers: [0, 3, 1, 2] },
  "C/B": { frets: [4, 0, 0, 3], fingers: [3, 0, 0, 2] },
  "A/E": { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  "F/C": { frets: [0, 0, 1, 0], fingers: [0, 0, 1, 0] },
  "D/A": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "Bm/A": { frets: [4, 2, 2, 0], fingers: [4, 1, 2, 0] },
  "G/A": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "G/F": { frets: [2, 2, 3, 2], fingers: [1, 1, 2, 1], barreAt: 2, startFret: 2 },
  "Dm/C": { frets: [0, 2, 1, 0], fingers: [0, 2, 1, 0] },
  "D/G": { frets: [0, 2, 2, 0], fingers: [0, 1, 2, 0] },
  "D/B": { frets: [4, 2, 2, 0], fingers: [4, 1, 2, 0] },
  "D/E": { frets: [4, 2, 2, 0], fingers: [4, 1, 2, 0] },
  "Asus2/B": { frets: [4, 4, 0, 2], fingers: [2, 3, 0, 1] },
  "Em/A": { frets: [2, 4, 3, 2], fingers: [1, 4, 3, 2] },
  "F/G": { frets: [0, 0, 1, 0], fingers: [0, 0, 1, 0] },
  "G/F#": { frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  
  // Additional voicings
  "G2": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "Fmaj7#11": { frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3] },
  "F#m7add11": { frets: [2, 4, 2, 0], fingers: [1, 3, 2, 0] },
  "F#madd9": { frets: [2, 1, 2, 2], fingers: [2, 1, 3, 4] },
  "Cadd4": { frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
  "G4": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "B4": { frets: [4, 4, 4, 4], fingers: [1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Gadd2": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "B2": { frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1], startFret: 2 },
  "D2": { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "D6/9": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "F#m11": { frets: [2, 1, 2, 4], fingers: [2, 1, 3, 4] },
  "Cadd2": { frets: [0, 2, 0, 3], fingers: [0, 2, 0, 4] },
  "Gsus": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "E7sus": { frets: [2, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "FM7": { frets: [2, 4, 1, 0], fingers: [2, 4, 1, 0] },
  "Am7/G": { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  "F6/9": { frets: [0, 0, 1, 2], fingers: [0, 0, 1, 2] },
  "GM7": { frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  "DM7": { frets: [2, 2, 2, 4], fingers: [1, 1, 1, 3] },
  
  // Additional missing chords
  "Gmadd9": { frets: [0, 2, 1, 3], fingers: [0, 2, 1, 4] },
  "F#/C#": { frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1], barreAt: 1 },
  "G#/C": { frets: [5, 3, 4, 3], fingers: [4, 1, 2, 1], barreAt: 3, startFret: 3 },
  "C#/G#": { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barreAt: 1 },
  "F#/A#": { frets: [3, 1, 2, 4], fingers: [2, 1, 1, 4] },
  "B/D#": { frets: [4, 3, 2, 2], fingers: [4, 3, 1, 1], barreAt: 2, startFret: 2 },
  "B/F#": { frets: [4, 3, 2, 2], fingers: [4, 3, 1, 1], barreAt: 2, startFret: 2 },
  "E/B": { frets: [4, 4, 0, 2], fingers: [2, 3, 0, 1] },
  "C#/F": { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], barreAt: 1 },
  "Eb/G": { frets: [0, 3, 3, 1], fingers: [0, 2, 3, 1] },
  "Eb/Bb": { frets: [1, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "G/D": { frets: [2, 2, 3, 0], fingers: [1, 2, 3, 0] },
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
  
  // Slash chords (bass note different from root)
  "Gmaj7/B": { notes: ["B", "D", "F#", "G"], semitones: [0, 3, 6, 8] },
  "C/G": { notes: ["G", "C", "E"], semitones: [0, 5, 9] },
  "D/F#": { notes: ["F#", "A", "D"], semitones: [0, 3, 8] },
  "G/B": { notes: ["B", "D", "G"], semitones: [0, 3, 8] },
  "Am/G": { notes: ["G", "A", "C", "E"], semitones: [0, 2, 5, 9] },
  "Am/E": { notes: ["E", "A", "C"], semitones: [0, 5, 8] },
  "F/A": { notes: ["A", "C", "F"], semitones: [0, 3, 8] },
  "A/C#": { notes: ["C#", "E", "A"], semitones: [0, 3, 8] },
  "C/E": { notes: ["E", "G", "C"], semitones: [0, 3, 8] },
  "E/G#": { notes: ["G#", "B", "E"], semitones: [0, 3, 8] },
  "G/F#": { notes: ["F#", "G", "B", "D"], semitones: [0, 1, 5, 8] },
  "Am/C": { notes: ["C", "E", "A"], semitones: [0, 4, 9] },
  "C/B": { notes: ["B", "C", "E", "G"], semitones: [0, 1, 5, 8] },
  "A/E": { notes: ["E", "A", "C#"], semitones: [0, 5, 9] },
  "F/C": { notes: ["C", "F", "A"], semitones: [0, 5, 9] },
  "Em/D": { notes: ["D", "E", "G", "B"], semitones: [0, 2, 5, 9] },
  "D/A": { notes: ["A", "D", "F#"], semitones: [0, 5, 9] },
  "Bm/A": { notes: ["A", "B", "D", "F#"], semitones: [0, 2, 5, 9] },
  "G/F": { notes: ["F", "G", "B", "D"], semitones: [0, 2, 6, 9] },
  "G/A": { notes: ["A", "B", "D", "G"], semitones: [0, 2, 5, 10] },
  "Dm/C": { notes: ["C", "D", "F", "A"], semitones: [0, 2, 5, 9] },
  "D/B": { notes: ["B", "D", "F#", "A"], semitones: [0, 3, 7, 10] },
  "Em/B": { notes: ["B", "E", "G"], semitones: [0, 5, 8] },
  "D/E": { notes: ["E", "D", "F#", "A"], semitones: [0, 9, 1, 5] },
  "F/G": { notes: ["G", "A", "C", "F"], semitones: [0, 2, 5, 10] },
  "Em/A": { notes: ["A", "E", "G", "B"], semitones: [0, 7, 10, 2] },
  "Em/G": { notes: ["G", "E", "B"], semitones: [0, 9, 5] },
  "G/E": { notes: ["E", "G", "B", "D"], semitones: [0, 3, 7, 10] },
  "Gm/Bb": { notes: ["Bb", "D", "G"], semitones: [0, 4, 9] },
  "Bb/D": { notes: ["D", "F", "Bb"], semitones: [0, 3, 8] },
  "C/D": { notes: ["D", "E", "G", "C"], semitones: [0, 2, 5, 10] },
  "F/E": { notes: ["E", "F", "A", "C"], semitones: [0, 1, 5, 8] },
  "D/G": { notes: ["G", "A", "D", "F#"], semitones: [0, 2, 7, 11] },
  "Asus2/B": { notes: ["B", "A", "E"], semitones: [0, 10, 5] },
  "Am7/G": { notes: ["G", "A", "C", "E"], semitones: [0, 2, 5, 9] },
  "Cm7/Bb": { notes: ["Bb", "C", "Eb", "G"], semitones: [0, 2, 5, 9] },
  "A5/G": { notes: ["G", "A", "E"], semitones: [0, 2, 9] },
  
  // Minor 7th extended
  "F#m7": { notes: ["F#", "A", "C#", "E"], semitones: [0, 3, 7, 10] },
  "C#m7": { notes: ["C#", "E", "G#", "B"], semitones: [0, 3, 7, 10] },
  "G#m7": { notes: ["G#", "B", "D#", "F#"], semitones: [0, 3, 7, 10] },
  "D#m7": { notes: ["D#", "F#", "A#", "C#"], semitones: [0, 3, 7, 10] },
  "Ebm7": { notes: ["Eb", "Gb", "Bb", "Db"], semitones: [0, 3, 7, 10] },
  "Dbm7": { notes: ["Db", "E", "Ab", "B"], semitones: [0, 3, 7, 10] },
  "Abm7": { notes: ["Ab", "B", "Eb", "Gb"], semitones: [0, 3, 7, 10] },
  "A#m7": { notes: ["A#", "C#", "F", "G#"], semitones: [0, 3, 7, 10] },
  "Bbm7": { notes: ["Bb", "Db", "F", "Ab"], semitones: [0, 3, 7, 10] },
  
  // 6th chords
  "C6": { notes: ["C", "E", "G", "A"], semitones: [0, 4, 7, 9] },
  "G6": { notes: ["G", "B", "D", "E"], semitones: [0, 4, 7, 9] },
  "A6": { notes: ["A", "C#", "E", "F#"], semitones: [0, 4, 7, 9] },
  "D6": { notes: ["D", "F#", "A", "B"], semitones: [0, 4, 7, 9] },
  "F6": { notes: ["F", "A", "C", "D"], semitones: [0, 4, 7, 9] },
  "E6": { notes: ["E", "G#", "B", "C#"], semitones: [0, 4, 7, 9] },
  "B6": { notes: ["B", "D#", "F#", "G#"], semitones: [0, 4, 7, 9] },
  
  // Minor 6th chords
  "Am6": { notes: ["A", "C", "E", "F#"], semitones: [0, 3, 7, 9] },
  "Dm6": { notes: ["D", "F", "A", "B"], semitones: [0, 3, 7, 9] },
  "Em6": { notes: ["E", "G", "B", "C#"], semitones: [0, 3, 7, 9] },
  "Cm6": { notes: ["C", "Eb", "G", "A"], semitones: [0, 3, 7, 9] },
  "Gm6": { notes: ["G", "Bb", "D", "E"], semitones: [0, 3, 7, 9] },
  "Fm6": { notes: ["F", "Ab", "C", "D"], semitones: [0, 3, 7, 9] },
  "Bm6": { notes: ["B", "D", "F#", "G#"], semitones: [0, 3, 7, 9] },
  
  // 9th chords (dominant 9th)
  "C9": { notes: ["C", "E", "G", "Bb", "D"], semitones: [0, 4, 7, 10, 14] },
  "C#9": { notes: ["C#", "F", "G#", "B", "D#"], semitones: [0, 4, 7, 10, 14] },
  "Db9": { notes: ["Db", "F", "Ab", "B", "Eb"], semitones: [0, 4, 7, 10, 14] },
  "D9": { notes: ["D", "F#", "A", "C", "E"], semitones: [0, 4, 7, 10, 14] },
  "D#9": { notes: ["D#", "G", "A#", "C#", "F"], semitones: [0, 4, 7, 10, 14] },
  "Eb9": { notes: ["Eb", "G", "Bb", "Db", "F"], semitones: [0, 4, 7, 10, 14] },
  "E9": { notes: ["E", "G#", "B", "D", "F#"], semitones: [0, 4, 7, 10, 14] },
  "F9": { notes: ["F", "A", "C", "Eb", "G"], semitones: [0, 4, 7, 10, 14] },
  "F#9": { notes: ["F#", "A#", "C#", "E", "G#"], semitones: [0, 4, 7, 10, 14] },
  "Gb9": { notes: ["Gb", "Bb", "Db", "E", "Ab"], semitones: [0, 4, 7, 10, 14] },
  "G9": { notes: ["G", "B", "D", "F", "A"], semitones: [0, 4, 7, 10, 14] },
  "G#9": { notes: ["G#", "C", "D#", "F#", "A#"], semitones: [0, 4, 7, 10, 14] },
  "Ab9": { notes: ["Ab", "C", "Eb", "Gb", "Bb"], semitones: [0, 4, 7, 10, 14] },
  "A9": { notes: ["A", "C#", "E", "G", "B"], semitones: [0, 4, 7, 10, 14] },
  "A#9": { notes: ["A#", "D", "F", "G#", "C"], semitones: [0, 4, 7, 10, 14] },
  "Bb9": { notes: ["Bb", "D", "F", "Ab", "C"], semitones: [0, 4, 7, 10, 14] },
  "B9": { notes: ["B", "D#", "F#", "A", "C#"], semitones: [0, 4, 7, 10, 14] },
  
  // Minor 9th chords
  "Am9": { notes: ["A", "C", "E", "G", "B"], semitones: [0, 3, 7, 10, 14] },
  "Dm9": { notes: ["D", "F", "A", "C", "E"], semitones: [0, 3, 7, 10, 14] },
  "Em9": { notes: ["E", "G", "B", "D", "F#"], semitones: [0, 3, 7, 10, 14] },
  "Cm9": { notes: ["C", "Eb", "G", "Bb", "D"], semitones: [0, 3, 7, 10, 14] },
  "Gm9": { notes: ["G", "Bb", "D", "F", "A"], semitones: [0, 3, 7, 10, 14] },
  "Fm9": { notes: ["F", "Ab", "C", "Eb", "G"], semitones: [0, 3, 7, 10, 14] },
  "Bm9": { notes: ["B", "D", "F#", "A", "C#"], semitones: [0, 3, 7, 10, 14] },
  
  // 7sus4 chords
  "A7sus4": { notes: ["A", "D", "E", "G"], semitones: [0, 5, 7, 10] },
  "D7sus4": { notes: ["D", "G", "A", "C"], semitones: [0, 5, 7, 10] },
  "E7sus4": { notes: ["E", "A", "B", "D"], semitones: [0, 5, 7, 10] },
  "G7sus4": { notes: ["G", "C", "D", "F"], semitones: [0, 5, 7, 10] },
  "B7sus4": { notes: ["B", "E", "F#", "A"], semitones: [0, 5, 7, 10] },
  "C7sus4": { notes: ["C", "F", "G", "Bb"], semitones: [0, 5, 7, 10] },
  "F7sus4": { notes: ["F", "Bb", "C", "Eb"], semitones: [0, 5, 7, 10] },
  
  // Madd9 chords (minor add9)
  "Amadd9": { notes: ["A", "C", "E", "B"], semitones: [0, 3, 7, 14] },
  "Emadd9": { notes: ["E", "G", "B", "F#"], semitones: [0, 3, 7, 14] },
  "Dmadd9": { notes: ["D", "F", "A", "E"], semitones: [0, 3, 7, 14] },
  "Bmadd9": { notes: ["B", "D", "F#", "C#"], semitones: [0, 3, 7, 14] },
  "Cmadd9": { notes: ["C", "Eb", "G", "D"], semitones: [0, 3, 7, 14] },
  "F#madd9": { notes: ["F#", "A", "C#", "G#"], semitones: [0, 3, 7, 14] },
  
  // Major 7th extended
  "Ebmaj7": { notes: ["Eb", "G", "Bb", "D"], semitones: [0, 4, 7, 11] },
  "Abmaj7": { notes: ["Ab", "C", "Eb", "G"], semitones: [0, 4, 7, 11] },
  "Bbmaj7": { notes: ["Bb", "D", "F", "A"], semitones: [0, 4, 7, 11] },
  "Dbmaj7": { notes: ["Db", "F", "Ab", "C"], semitones: [0, 4, 7, 11] },
  "A#maj7": { notes: ["A#", "D", "F", "A"], semitones: [0, 4, 7, 11] },
  "G#maj7": { notes: ["G#", "C", "D#", "G"], semitones: [0, 4, 7, 11] },
  "F#maj7": { notes: ["F#", "A#", "C#", "F"], semitones: [0, 4, 7, 11] },
  
  // Major 9th chords
  "Cmaj9": { notes: ["C", "E", "G", "B", "D"], semitones: [0, 4, 7, 11, 14] },
  "Gmaj9": { notes: ["G", "B", "D", "F#", "A"], semitones: [0, 4, 7, 11, 14] },
  "Amaj9": { notes: ["A", "C#", "E", "G#", "B"], semitones: [0, 4, 7, 11, 14] },
  "Dmaj9": { notes: ["D", "F#", "A", "C#", "E"], semitones: [0, 4, 7, 11, 14] },
  "Fmaj9": { notes: ["F", "A", "C", "E", "G"], semitones: [0, 4, 7, 11, 14] },
  "Bbmaj9": { notes: ["Bb", "D", "F", "A", "C"], semitones: [0, 4, 7, 11, 14] },
  "Ebmaj9": { notes: ["Eb", "G", "Bb", "D", "F"], semitones: [0, 4, 7, 11, 14] },
  "Emaj9": { notes: ["E", "G#", "B", "D#", "F#"], semitones: [0, 4, 7, 11, 14] },
  
  // Diminished 7th chords
  "Cdim7": { notes: ["C", "Eb", "Gb", "A"], semitones: [0, 3, 6, 9] },
  "Ddim7": { notes: ["D", "F", "Ab", "B"], semitones: [0, 3, 6, 9] },
  "Edim7": { notes: ["E", "G", "Bb", "Db"], semitones: [0, 3, 6, 9] },
  "Fdim7": { notes: ["F", "Ab", "B", "D"], semitones: [0, 3, 6, 9] },
  "Gdim7": { notes: ["G", "Bb", "Db", "E"], semitones: [0, 3, 6, 9] },
  "Adim7": { notes: ["A", "C", "Eb", "Gb"], semitones: [0, 3, 6, 9] },
  "Bdim7": { notes: ["B", "D", "F", "Ab"], semitones: [0, 3, 6, 9] },
  
  // m7b5 (half-diminished) chords
  "Am7b5": { notes: ["A", "C", "Eb", "G"], semitones: [0, 3, 6, 10] },
  "Bm7b5": { notes: ["B", "D", "F", "A"], semitones: [0, 3, 6, 10] },
  "Cm7b5": { notes: ["C", "Eb", "Gb", "Bb"], semitones: [0, 3, 6, 10] },
  "Dm7b5": { notes: ["D", "F", "Ab", "C"], semitones: [0, 3, 6, 10] },
  "Em7b5": { notes: ["E", "G", "Bb", "D"], semitones: [0, 3, 6, 10] },
  "F#m7b5": { notes: ["F#", "A", "C", "E"], semitones: [0, 3, 6, 10] },
  "Gm7b5": { notes: ["G", "Bb", "Db", "F"], semitones: [0, 3, 6, 10] },
  "C#m7b5": { notes: ["C#", "E", "G", "B"], semitones: [0, 3, 6, 10] },
  "D#m7b5": { notes: ["D#", "F#", "A", "C#"], semitones: [0, 3, 6, 10] },
  "D#m7-5": { notes: ["D#", "F#", "A", "C#"], semitones: [0, 3, 6, 10] },
  "Ebm7b5": { notes: ["Eb", "Gb", "A", "Db"], semitones: [0, 3, 6, 10] },
  "B-5": { notes: ["B", "D#", "F"], semitones: [0, 4, 6] },
  
  // 11th chords
  "Am11": { notes: ["A", "C", "E", "G", "D"], semitones: [0, 3, 7, 10, 17] },
  "Dm11": { notes: ["D", "F", "A", "C", "G"], semitones: [0, 3, 7, 10, 17] },
  "Em11": { notes: ["E", "G", "B", "D", "A"], semitones: [0, 3, 7, 10, 17] },
  "Gm11": { notes: ["G", "Bb", "D", "F", "C"], semitones: [0, 3, 7, 10, 17] },
  "F#m11": { notes: ["F#", "A", "C#", "E", "B"], semitones: [0, 3, 7, 10, 17] },
  "F#m7add11": { notes: ["F#", "A", "C#", "E", "B"], semitones: [0, 3, 7, 10, 17] },
  
  // 2 chords (add9 without 3rd)
  "G2": { notes: ["G", "A", "D"], semitones: [0, 2, 7] },
  "D2": { notes: ["D", "E", "A"], semitones: [0, 2, 7] },
  "E2": { notes: ["E", "F#", "B"], semitones: [0, 2, 7] },
  "A2": { notes: ["A", "B", "E"], semitones: [0, 2, 7] },
  "C2": { notes: ["C", "D", "G"], semitones: [0, 2, 7] },
  "B2": { notes: ["B", "C#", "F#"], semitones: [0, 2, 7] },
  
  // Add4 / Sus variations
  "Cadd4": { notes: ["C", "E", "F", "G"], semitones: [0, 4, 5, 7] },
  "Gadd2": { notes: ["G", "A", "B", "D"], semitones: [0, 2, 4, 7] },
  "Cadd2": { notes: ["C", "D", "E", "G"], semitones: [0, 2, 4, 7] },
  "G4": { notes: ["G", "C", "D"], semitones: [0, 5, 7] },
  "D4": { notes: ["D", "G", "A"], semitones: [0, 5, 7] },
  "B4": { notes: ["B", "E", "F#"], semitones: [0, 5, 7] },
  "Gsus": { notes: ["G", "C", "D"], semitones: [0, 5, 7] },
  "Esus": { notes: ["E", "A", "B"], semitones: [0, 5, 7] },
  "E7sus": { notes: ["E", "A", "B", "D"], semitones: [0, 5, 7, 10] },
  
  // 6/9 chords
  "D6/9": { notes: ["D", "F#", "A", "B", "E"], semitones: [0, 4, 7, 9, 14] },
  "C6add9": { notes: ["C", "E", "G", "A", "D"], semitones: [0, 4, 7, 9, 14] },
  "F6/9": { notes: ["F", "A", "C", "D", "G"], semitones: [0, 4, 7, 9, 14] },
  "G6/9": { notes: ["G", "B", "D", "E", "A"], semitones: [0, 4, 7, 9, 14] },
  "A6/9": { notes: ["A", "C#", "E", "F#", "B"], semitones: [0, 4, 7, 9, 14] },
  
  // 9sus4 chords
  "D9sus4": { notes: ["D", "G", "A", "C", "E"], semitones: [0, 5, 7, 10, 14] },
  "A9sus4": { notes: ["A", "D", "E", "G", "B"], semitones: [0, 5, 7, 10, 14] },
  "E9sus4": { notes: ["E", "A", "B", "D", "F#"], semitones: [0, 5, 7, 10, 14] },
  
  // Power chords (5 chords)
  "F#5": { notes: ["F#", "C#"], semitones: [0, 7] },
  "Bb5": { notes: ["Bb", "F"], semitones: [0, 7] },
  "C#5": { notes: ["C#", "G#"], semitones: [0, 7] },
  "C#5/G#": { notes: ["G#", "C#"], semitones: [0, 5] },
  "A5/G#": { notes: ["G#", "A"], semitones: [0, 2] },
  "D5/A": { notes: ["A", "D"], semitones: [0, 5] },
  "E5/B": { notes: ["B", "E"], semitones: [0, 5] },
  "G5/D": { notes: ["D", "G"], semitones: [0, 5] },
  "G#5": { notes: ["G#", "D#"], semitones: [0, 7] },
  "Eb5": { notes: ["Eb", "Bb"], semitones: [0, 7] },
  "Ab5": { notes: ["Ab", "Eb"], semitones: [0, 7] },
  "Db5": { notes: ["Db", "Ab"], semitones: [0, 7] },
  "D#5": { notes: ["D#", "A#"], semitones: [0, 7] },
  "C5": { notes: ["C", "G"], semitones: [0, 7] },
  "D5": { notes: ["D", "A"], semitones: [0, 7] },
  "E5": { notes: ["E", "B"], semitones: [0, 7] },
  "F5": { notes: ["F", "C"], semitones: [0, 7] },
  "G5": { notes: ["G", "D"], semitones: [0, 7] },
  "A5": { notes: ["A", "E"], semitones: [0, 7] },
  "B5": { notes: ["B", "F#"], semitones: [0, 7] },
  
  // 7b5 chords
  "Bm7b5": { notes: ["B", "D", "F", "A"], semitones: [0, 3, 6, 10] },
  
  // Augmented chords
  "Bbaug": { notes: ["Bb", "D", "F#"], semitones: [0, 4, 8] },
  "Ebaug": { notes: ["Eb", "G", "B"], semitones: [0, 4, 8] },
  "Abaug": { notes: ["Ab", "C", "E"], semitones: [0, 4, 8] },
  
  // Special voicings
  "Fmaj7#11": { notes: ["F", "A", "C", "E", "B"], semitones: [0, 4, 7, 11, 18] },
  "AbM7": { notes: ["Ab", "C", "Eb", "G"], semitones: [0, 4, 7, 11] },
  "DM7": { notes: ["D", "F#", "A", "C#"], semitones: [0, 4, 7, 11] },
  "FM7": { notes: ["F", "A", "C", "E"], semitones: [0, 4, 7, 11] },
  "GM7": { notes: ["G", "B", "D", "F#"], semitones: [0, 4, 7, 11] },
  
  // Missing piano-only chords
  "Bsus4": { notes: ["B", "E", "F#"], semitones: [0, 5, 7] },
  "Fadd9": { notes: ["F", "A", "C", "G"], semitones: [0, 4, 7, 14] },
  "Eadd9": { notes: ["E", "G#", "B", "F#"], semitones: [0, 4, 7, 14] },
  "Bbsus4": { notes: ["Bb", "Eb", "F"], semitones: [0, 5, 7] },
  "D#7": { notes: ["D#", "G", "A#", "C#"], semitones: [0, 4, 7, 10] },
  "F#sus4": { notes: ["F#", "B", "C#"], semitones: [0, 5, 7] },
  "F#add9": { notes: ["F#", "A#", "C#", "G#"], semitones: [0, 4, 7, 14] },
  "Absus4": { notes: ["Ab", "Db", "Eb"], semitones: [0, 5, 7] },
  "Badd9": { notes: ["B", "D#", "F#", "C#"], semitones: [0, 4, 7, 14] },
  "C#sus4": { notes: ["C#", "F#", "G#"], semitones: [0, 5, 7] },
  "A#7": { notes: ["A#", "D", "F", "G#"], semitones: [0, 4, 7, 10] },
  
  // More slash chords
  "G/D": { notes: ["D", "G", "B"], semitones: [0, 5, 9] },
  "Cmaj7/E": { notes: ["E", "G", "B", "C"], semitones: [0, 3, 7, 8] },
  "B/A": { notes: ["A", "B", "D#", "F#"], semitones: [0, 2, 6, 9] },
  "Bm/F#": { notes: ["F#", "B", "D"], semitones: [0, 5, 8] },
  "Dm/F": { notes: ["F", "A", "D"], semitones: [0, 4, 9] },
  "Fm7/Ab": { notes: ["Ab", "C", "Eb", "F"], semitones: [0, 4, 7, 9] },
  "Dm/A": { notes: ["A", "D", "F"], semitones: [0, 5, 8] },
  "D/C": { notes: ["C", "D", "F#", "A"], semitones: [0, 2, 6, 9] },
  "Dsus4/F#": { notes: ["F#", "G", "A", "D"], semitones: [0, 1, 3, 8] },
  "B/D#": { notes: ["D#", "F#", "B"], semitones: [0, 3, 8] },
  "Bm/D": { notes: ["D", "F#", "B"], semitones: [0, 4, 9] },
  "Cm/Eb": { notes: ["Eb", "G", "C"], semitones: [0, 4, 9] },
  "Eb/G": { notes: ["G", "Bb", "Eb"], semitones: [0, 3, 8] },
  "Eb/Bb": { notes: ["Bb", "Eb", "G"], semitones: [0, 5, 9] },
  "F#5/C#": { notes: ["C#", "F#"], semitones: [0, 5] },
  "B/C": { notes: ["C", "D#", "F#", "B"], semitones: [0, 4, 7, 12] },
  "F7/A": { notes: ["A", "C", "Eb", "F"], semitones: [0, 3, 6, 8] },
  "Cm/G": { notes: ["G", "C", "Eb"], semitones: [0, 5, 8] },
  "G/C": { notes: ["C", "G", "B", "D"], semitones: [0, 7, 11, 14] },
  "Bbm/Db": { notes: ["Db", "F", "Bb"], semitones: [0, 4, 9] },
  "Bb/F": { notes: ["F", "Bb", "D"], semitones: [0, 5, 9] },
  "Em/F#": { notes: ["F#", "E", "G", "B"], semitones: [0, 10, 13, 17] },
  "Dsus4/G": { notes: ["G", "A", "D"], semitones: [0, 2, 7] },
  "Cmaj7/G": { notes: ["G", "B", "C", "E"], semitones: [0, 4, 5, 9] },
  "Am/D": { notes: ["D", "A", "C", "E"], semitones: [0, 7, 10, 14] },
  "D7/F#": { notes: ["F#", "A", "C", "D"], semitones: [0, 3, 6, 8] },
  "Cadd4/G": { notes: ["G", "C", "E", "F"], semitones: [0, 5, 9, 10] },
  "Bsus4/F#": { notes: ["F#", "B", "E"], semitones: [0, 5, 10] },
  "Bsus4/A": { notes: ["A", "B", "E", "F#"], semitones: [0, 2, 7, 9] },
  "C/F": { notes: ["F", "G", "C", "E"], semitones: [0, 2, 7, 11] },
  "D/Bb": { notes: ["Bb", "D", "F#", "A"], semitones: [0, 4, 8, 11] },
  "F#m/B": { notes: ["B", "C#", "F#", "A"], semitones: [0, 2, 7, 10] },
  
  // 6th chords extended
  "F#6": { notes: ["F#", "A#", "C#", "D#"], semitones: [0, 4, 7, 9] },
  "Eb6": { notes: ["Eb", "G", "Bb", "C"], semitones: [0, 4, 7, 9] },
  "Bb6": { notes: ["Bb", "D", "F", "G"], semitones: [0, 4, 7, 9] },
  "C#m6": { notes: ["C#", "E", "G#", "A#"], semitones: [0, 3, 7, 9] },
  
  // Major aliases (for compatibility)
  "Cmaj": { notes: ["C", "E", "G"], semitones: [0, 4, 7] },
  "AM": { notes: ["A", "C#", "E"], semitones: [0, 4, 7] },
  "CM7": { notes: ["C", "E", "G", "B"], semitones: [0, 4, 7, 11] },
  "CM7/G": { notes: ["G", "B", "C", "E"], semitones: [0, 4, 5, 9] },
  "BbM7": { notes: ["Bb", "D", "F", "A"], semitones: [0, 4, 7, 11] },
  "EbM7": { notes: ["Eb", "G", "Bb", "D"], semitones: [0, 4, 7, 11] },
  "AbMaj7": { notes: ["Ab", "C", "Eb", "G"], semitones: [0, 4, 7, 11] },
  "DbMaj7": { notes: ["Db", "F", "Ab", "C"], semitones: [0, 4, 7, 11] },
  "D#maj7": { notes: ["D#", "G", "A#", "D"], semitones: [0, 4, 7, 11] },
  
  // Sus aliases (for compatibility)
  "Asus": { notes: ["A", "D", "E"], semitones: [0, 5, 7] },
  "Dsus": { notes: ["D", "G", "A"], semitones: [0, 5, 7] },
  "Csus": { notes: ["C", "F", "G"], semitones: [0, 5, 7] },
  
  // Diminished chords extended
  "G#dim": { notes: ["G#", "B", "D"], semitones: [0, 3, 6] },
  "F#dim": { notes: ["F#", "A", "C"], semitones: [0, 3, 6] },
  "Abdim": { notes: ["Ab", "B", "D"], semitones: [0, 3, 6] },
  
  // 11th and 13th chords
  "Bm11": { notes: ["B", "D", "F#", "A", "E"], semitones: [0, 3, 7, 10, 17] },
  "E11": { notes: ["E", "G#", "B", "D", "A"], semitones: [0, 4, 7, 10, 17] },
  "C13": { notes: ["C", "E", "G", "Bb", "A"], semitones: [0, 4, 7, 10, 21] },
  "B13": { notes: ["B", "D#", "F#", "A", "G#"], semitones: [0, 4, 7, 10, 21] },
  
  // Sus2 chords extended
  "G#sus2": { notes: ["G#", "A#", "D#"], semitones: [0, 2, 7] },
  "Bsus2": { notes: ["B", "C#", "F#"], semitones: [0, 2, 7] },
  "C#sus2": { notes: ["C#", "D#", "G#"], semitones: [0, 2, 7] },
  "Ebsus2": { notes: ["Eb", "F", "Bb"], semitones: [0, 2, 7] },
  
  // Augmented variants
  "G+": { notes: ["G", "B", "D#"], semitones: [0, 4, 8] },
  
  // Power chord variants
  "A#5": { notes: ["A#", "F"], semitones: [0, 7] },
  
  // Complex voicings from tabs
  "Emb6": { notes: ["E", "G", "B", "C#"], semitones: [0, 3, 7, 9] },
  "Dmin7": { notes: ["D", "F", "A", "C"], semitones: [0, 3, 7, 10] },
  "Aaddb6": { notes: ["A", "C#", "E", "F#"], semitones: [0, 4, 7, 9] },
  "GmMaj7": { notes: ["G", "Bb", "D", "F#"], semitones: [0, 3, 7, 11] },
  "Emaj7sus4": { notes: ["E", "A", "B", "D#"], semitones: [0, 5, 7, 11] },
  "Em7add4": { notes: ["E", "G", "A", "B", "D"], semitones: [0, 3, 5, 7, 10] },
  "Cmaj7#11": { notes: ["C", "E", "G", "B", "F#"], semitones: [0, 4, 7, 11, 18] },
  "C7sus2": { notes: ["C", "D", "G", "Bb"], semitones: [0, 2, 7, 10] },
  "D6sus2": { notes: ["D", "E", "A", "B"], semitones: [0, 2, 7, 9] },
  "G6sus2": { notes: ["G", "A", "D", "E"], semitones: [0, 2, 7, 9] },
  "G6/F#": { notes: ["F#", "G", "B", "D", "E"], semitones: [0, 1, 5, 8, 10] },
  "D/Db": { notes: ["Db", "D", "F#", "A"], semitones: [0, 1, 5, 8] },
  "Cadd4/F": { notes: ["F", "G", "C", "E"], semitones: [0, 2, 7, 11] },
  "Dmaj9/F#": { notes: ["F#", "A", "C#", "E"], semitones: [0, 3, 7, 10] },
  "Em9/A": { notes: ["A", "E", "G", "B", "D", "F#"], semitones: [0, 7, 10, 14, 17, 21] },
  "C#M9": { notes: ["C#", "F", "G#", "C", "D#"], semitones: [0, 4, 7, 11, 14] },
  "D#M9": { notes: ["D#", "G", "A#", "D", "F"], semitones: [0, 4, 7, 11, 14] },
  "Abadd9": { notes: ["Ab", "C", "Eb", "Bb"], semitones: [0, 4, 7, 14] },
  "C#m9": { notes: ["C#", "E", "G#", "B", "D#"], semitones: [0, 3, 7, 10, 14] },
  "Gbm6/Ab": { notes: ["Ab", "Gb", "A", "Db", "Eb"], semitones: [0, 9, 12, 16, 19] },
  "Fm#": { notes: ["F", "A", "C"], semitones: [0, 4, 7] },
  "H": { notes: ["B", "D#", "F#"], semitones: [0, 4, 7] },
  "Bm7-5": { notes: ["B", "D", "F", "A"], semitones: [0, 3, 6, 10] },
  "C#(b5)": { notes: ["C#", "F", "G"], semitones: [0, 4, 6] },
  
  // 3 and 4 chords (variant names - usually same as maj or sus4)
  "G3": { notes: ["G", "B", "D"], semitones: [0, 4, 7] },
  "B3": { notes: ["B", "D#", "F#"], semitones: [0, 4, 7] },
  "A3": { notes: ["A", "C#", "E"], semitones: [0, 4, 7] },
  "E4": { notes: ["E", "A", "B"], semitones: [0, 5, 7] },
  
  // 7sus4 extended
  "C#7sus4": { notes: ["C#", "F#", "G#", "B"], semitones: [0, 5, 7, 10] },
  
  // Other slash chords
  "C#/F": { notes: ["F", "G#", "C#"], semitones: [0, 4, 8] },
  "C#/E#": { notes: ["E#", "G#", "C#"], semitones: [0, 3, 8] },
  "A/G#": { notes: ["G#", "A", "C#", "E"], semitones: [0, 1, 5, 8] },
  "D9/F#": { notes: ["F#", "A", "C", "E"], semitones: [0, 3, 6, 10] },
  "Am/B": { notes: ["B", "A", "C", "E"], semitones: [0, 10, 13, 17] },
  "D7/A": { notes: ["A", "C", "D", "F#"], semitones: [0, 3, 5, 9] },
  "F#5/E": { notes: ["E", "F#", "C#"], semitones: [0, 2, 9] },
  "Em/Eb": { notes: ["Eb", "E", "G", "B"], semitones: [0, 1, 4, 8] },
  "A5/F": { notes: ["F", "A", "E"], semitones: [0, 4, 11] },
  "Dsus2/E": { notes: ["E", "A", "D"], semitones: [0, 5, 10] },
  "C#m/E": { notes: ["E", "G#", "C#"], semitones: [0, 4, 9] },
  
  // Additional commonly used chords
  "C/Bb": { notes: ["Bb", "C", "E", "G"], semitones: [0, 2, 6, 9] },
  "Dadd4/F#": { notes: ["F#", "A", "D", "G"], semitones: [0, 3, 8, 13] },
  "A#dim": { notes: ["A#", "C#", "E"], semitones: [0, 3, 6] },
  "DbM7": { notes: ["Db", "F", "Ab", "C"], semitones: [0, 4, 7, 11] },
  "G7M": { notes: ["G", "B", "D", "F#"], semitones: [0, 4, 7, 11] },
  "B/F#": { notes: ["F#", "B", "D#"], semitones: [0, 5, 9] },
  "Bbdim/Db": { notes: ["Db", "Bb", "E"], semitones: [0, 9, 16] },
  "Dadd9/F#": { notes: ["F#", "A", "D", "E"], semitones: [0, 3, 8, 11] },
  "A6/C#": { notes: ["C#", "E", "F#", "A"], semitones: [0, 3, 6, 9] },
  "Dadd4": { notes: ["D", "F#", "G", "A"], semitones: [0, 4, 5, 7] },
  "D5/F#": { notes: ["F#", "A", "D"], semitones: [0, 3, 8] },
  "Am/F#": { notes: ["F#", "A", "C", "E"], semitones: [0, 3, 6, 10] },
  "G7/C": { notes: ["C", "B", "D", "F", "G"], semitones: [0, 11, 14, 17, 19] },
  "A9/G#": { notes: ["G#", "A", "C#", "E", "B"], semitones: [0, 1, 5, 8, 14] },
  "D/C#": { notes: ["C#", "D", "F#", "A"], semitones: [0, 1, 5, 8] },
  "Dmaj7/C#": { notes: ["C#", "D", "F#", "A"], semitones: [0, 1, 5, 8] },
  "EM7": { notes: ["E", "G#", "B", "D#"], semitones: [0, 4, 7, 11] },
  "G13": { notes: ["G", "B", "D", "F", "E"], semitones: [0, 4, 7, 10, 21] },
  "Ab/Gb": { notes: ["Gb", "Ab", "C", "Eb"], semitones: [0, 2, 6, 9] },
  "Bsus": { notes: ["B", "E", "F#"], semitones: [0, 5, 7] },
  "G5/F#": { notes: ["F#", "G", "D"], semitones: [0, 1, 8] },
  "Bb(add#11)": { notes: ["Bb", "D", "E", "F"], semitones: [0, 4, 6, 7] },
  "Bm7add11": { notes: ["B", "D", "E", "F#", "A"], semitones: [0, 3, 5, 7, 10] },
  "F#m7add11/E": { notes: ["E", "F#", "A", "B", "C#"], semitones: [0, 2, 5, 7, 10] },
  "B/E": { notes: ["E", "B", "D#", "F#"], semitones: [0, 7, 11, 14] },
  "C#dim": { notes: ["C#", "E", "G"], semitones: [0, 3, 6] },
  "Gm/A": { notes: ["A", "Bb", "D", "G"], semitones: [0, 1, 5, 10] },
  "Fmaj13": { notes: ["F", "A", "C", "E", "D"], semitones: [0, 4, 7, 11, 21] },
  "E/B": { notes: ["B", "E", "G#"], semitones: [0, 5, 9] },
  "C#dim7": { notes: ["C#", "E", "G", "Bb"], semitones: [0, 3, 6, 9] },
  "Amaj7/C#": { notes: ["C#", "E", "G#", "A"], semitones: [0, 3, 7, 8] },
  "G11": { notes: ["G", "B", "D", "F", "C"], semitones: [0, 4, 7, 10, 17] },
  "Fmaj7/C": { notes: ["C", "E", "F", "A"], semitones: [0, 4, 5, 9] },
  "B/G": { notes: ["G", "B", "D#", "F#"], semitones: [0, 4, 8, 11] },
  "Gm7/Bb": { notes: ["Bb", "D", "F", "G"], semitones: [0, 4, 7, 9] },
  "Bb3": { notes: ["Bb", "D", "F"], semitones: [0, 4, 7] },
  "F#3": { notes: ["F#", "A#", "C#"], semitones: [0, 4, 7] },
  "Ab/Bb": { notes: ["Bb", "Ab", "C", "Eb"], semitones: [0, 10, 14, 17] },
  "F#m/E": { notes: ["E", "F#", "A", "C#"], semitones: [0, 2, 5, 10] },
  "C#m/B": { notes: ["B", "C#", "E", "G#"], semitones: [0, 2, 5, 10] },
  "C#m/A#": { notes: ["A#", "C#", "E", "G#"], semitones: [0, 3, 6, 11] },
  "C#maj7": { notes: ["C#", "F", "G#", "C"], semitones: [0, 4, 7, 11] },
  "Db(add9)": { notes: ["Db", "F", "Ab", "Eb"], semitones: [0, 4, 7, 14] },
  "Dm/B": { notes: ["B", "D", "F", "A"], semitones: [0, 3, 6, 10] },
  "Csus/E": { notes: ["E", "F", "G", "C"], semitones: [0, 1, 3, 8] },
  "Db/F": { notes: ["F", "Ab", "Db"], semitones: [0, 4, 8] },
  "D#dim": { notes: ["D#", "F#", "A"], semitones: [0, 3, 6] },
  "A/B": { notes: ["B", "A", "C#", "E"], semitones: [0, 10, 14, 17] },
  "E3": { notes: ["E", "G#", "B"], semitones: [0, 4, 7] },
  "F#/A#": { notes: ["A#", "C#", "F#"], semitones: [0, 3, 8] },
  "E7/G#": { notes: ["G#", "B", "D", "E"], semitones: [0, 3, 6, 8] },
  "F#dim7": { notes: ["F#", "A", "C", "Eb"], semitones: [0, 3, 6, 9] },
  "AbM7/C": { notes: ["C", "Eb", "G", "Ab"], semitones: [0, 4, 8, 9] },
  "Gb9": { notes: ["Gb", "Bb", "Db", "E", "Ab"], semitones: [0, 4, 7, 10, 14] },
  "Bbmaj7/A": { notes: ["A", "Bb", "D", "F"], semitones: [0, 1, 5, 8] },
  "E7b9": { notes: ["E", "G#", "B", "D", "F"], semitones: [0, 4, 7, 10, 13] },
  "F9/A": { notes: ["A", "C", "Eb", "F", "G"], semitones: [0, 3, 6, 8, 10] },
  "AM7": { notes: ["A", "C#", "E", "G#"], semitones: [0, 4, 7, 11] },
  "A4": { notes: ["A", "D", "E"], semitones: [0, 5, 7] },
  "Emin7": { notes: ["E", "G", "B", "D"], semitones: [0, 3, 7, 10] },
  "A/Ab": { notes: ["Ab", "A", "C#", "E"], semitones: [0, 1, 5, 8] },
  "C#add9": { notes: ["C#", "F", "G#", "D#"], semitones: [0, 4, 7, 14] },
  "G#dim7": { notes: ["G#", "B", "D", "F"], semitones: [0, 3, 6, 9] },
  "B11/A": { notes: ["A", "B", "D#", "E", "F#"], semitones: [0, 2, 6, 7, 9] },
  "Em/C#": { notes: ["C#", "E", "G", "B"], semitones: [0, 3, 6, 10] },
  "Ammaj7": { notes: ["A", "C", "E", "G#"], semitones: [0, 3, 7, 11] },
  "A7/C#": { notes: ["C#", "E", "G", "A"], semitones: [0, 3, 6, 8] },
  "C(add9)": { notes: ["C", "D", "E", "G"], semitones: [0, 2, 4, 7] },
  "Dm/G": { notes: ["G", "A", "D", "F"], semitones: [0, 2, 7, 10] },
  "Em(add9)": { notes: ["E", "F#", "G", "B"], semitones: [0, 2, 3, 7] },
  "Bm/E": { notes: ["E", "B", "D", "F#"], semitones: [0, 7, 10, 14] },
  "C#m11": { notes: ["C#", "E", "F#", "G#", "B"], semitones: [0, 3, 5, 7, 10] },
  "D2/F#": { notes: ["F#", "A", "D", "E"], semitones: [0, 3, 8, 11] },
  "Dmaj7/E": { notes: ["E", "D", "F#", "A", "C#"], semitones: [0, 10, 14, 17, 21] },
  "Em7#5": { notes: ["E", "G", "B#", "D"], semitones: [0, 3, 8, 10] },
  "F#(b5)": { notes: ["F#", "A#", "C"], semitones: [0, 4, 6] },
  "G5/E": { notes: ["E", "G", "D"], semitones: [0, 3, 10] },
  "Dm7/A": { notes: ["A", "C", "D", "F"], semitones: [0, 3, 5, 8] },
  "E/F#": { notes: ["F#", "G#", "B", "E"], semitones: [0, 2, 5, 10] },
  "Dsus2/A": { notes: ["A", "D", "E"], semitones: [0, 5, 7] },
  "Bdim/D": { notes: ["D", "B", "F"], semitones: [0, 9, 15] },
  "Ab/C": { notes: ["C", "Eb", "Ab"], semitones: [0, 4, 9] },
  "Cm/Bb": { notes: ["Bb", "C", "Eb", "G"], semitones: [0, 2, 5, 9] },
  "G7sus": { notes: ["G", "C", "D", "F"], semitones: [0, 5, 7, 10] },
  "Dmaj/G": { notes: ["G", "A", "D", "F#"], semitones: [0, 2, 7, 11] },
  "Bbadd#11": { notes: ["Bb", "D", "E", "F"], semitones: [0, 4, 6, 7] },
  "Cm/A": { notes: ["A", "C", "Eb", "G"], semitones: [0, 3, 6, 10] },
  "G6/B": { notes: ["B", "D", "E", "G"], semitones: [0, 3, 5, 8] },
  "Dadd11/A": { notes: ["A", "D", "F#", "G"], semitones: [0, 5, 9, 10] },
  "E/D": { notes: ["D", "E", "G#", "B"], semitones: [0, 2, 6, 9] },
  "G#7sus2": { notes: ["G#", "A#", "D#", "F#"], semitones: [0, 2, 7, 10] },
  "BM7": { notes: ["B", "D#", "F#", "A#"], semitones: [0, 4, 7, 11] },
  "Dmaj7/F#": { notes: ["F#", "A", "C#", "D"], semitones: [0, 3, 7, 8] },
  "Dbdim": { notes: ["Db", "E", "G"], semitones: [0, 3, 6] },
  "F#m6": { notes: ["F#", "A", "C#", "D#"], semitones: [0, 3, 7, 9] },
  "F#7b9": { notes: ["F#", "A#", "C#", "E", "G"], semitones: [0, 4, 7, 10, 13] },
  "Eb/F": { notes: ["F", "G", "Bb", "Eb"], semitones: [0, 2, 5, 10] },
  "Gsus2/B": { notes: ["B", "A", "D", "G"], semitones: [0, 10, 15, 20] },
  
  // Additional missing chords
  "Gmadd9": { notes: ["G", "A", "Bb", "D"], semitones: [0, 2, 3, 7] },
  "F#/C#": { notes: ["C#", "F#", "A#"], semitones: [0, 5, 9] },
  "G#/C": { notes: ["C", "D#", "G#"], semitones: [0, 4, 9] },
  "C#/G#": { notes: ["G#", "C#", "F"], semitones: [0, 5, 9] },
  
  // Slash chords from tabs
  "A/G": { notes: ["G", "A", "C#", "E"], semitones: [0, 2, 6, 9] },
  "Am/F": { notes: ["F", "A", "C", "E"], semitones: [0, 4, 7, 11] },
  "Am/F#": { notes: ["F#", "A", "C", "E"], semitones: [0, 3, 6, 10] },
  "Am/G": { notes: ["G", "A", "C", "E"], semitones: [0, 2, 5, 9] },
  "B/A": { notes: ["A", "B", "D#", "F#"], semitones: [0, 2, 6, 9] },
  "B/E": { notes: ["E", "B", "D#", "F#"], semitones: [0, 7, 11, 14] },
  "B/F#": { notes: ["F#", "B", "D#"], semitones: [0, 5, 9] },
  "Bm/A": { notes: ["A", "B", "D", "F#"], semitones: [0, 2, 5, 9] },
  "Bm/G": { notes: ["G", "B", "D", "F#"], semitones: [0, 4, 7, 11] },
  "C/A": { notes: ["A", "C", "E", "G"], semitones: [0, 3, 7, 10] },
  "C/B": { notes: ["B", "C", "E", "G"], semitones: [0, 1, 5, 8] },
  "C/Bb": { notes: ["Bb", "C", "E", "G"], semitones: [0, 2, 6, 9] },
  "C/E": { notes: ["E", "G", "C"], semitones: [0, 3, 8] },
  "C/F": { notes: ["F", "G", "C", "E"], semitones: [0, 2, 7, 11] },
  "C/G": { notes: ["G", "C", "E"], semitones: [0, 5, 9] },
  "D/E": { notes: ["E", "D", "F#", "A"], semitones: [0, 10, 14, 17] },
  "D/F#": { notes: ["F#", "A", "D"], semitones: [0, 3, 8] },
  "D/G": { notes: ["G", "A", "D", "F#"], semitones: [0, 2, 7, 11] },
  "Dm/A": { notes: ["A", "D", "F"], semitones: [0, 5, 8] },
  "Dm/F": { notes: ["F", "A", "D"], semitones: [0, 4, 9] },
  "Dm/G": { notes: ["G", "A", "D", "F"], semitones: [0, 2, 7, 10] },
  "E/G#": { notes: ["G#", "B", "E"], semitones: [0, 3, 8] },
  "E7/D": { notes: ["D", "E", "G#", "B"], semitones: [0, 2, 6, 9] },
  "Em/B": { notes: ["B", "E", "G"], semitones: [0, 5, 8] },
  "F/A": { notes: ["A", "C", "F"], semitones: [0, 3, 8] },
  "F/Bb": { notes: ["Bb", "C", "F", "A"], semitones: [0, 2, 7, 11] },
  "F/C": { notes: ["C", "F", "A"], semitones: [0, 5, 9] },
  "F/E": { notes: ["E", "F", "A", "C"], semitones: [0, 1, 5, 8] },
  "F/G": { notes: ["G", "A", "C", "F"], semitones: [0, 2, 5, 10] },
  "G/A": { notes: ["A", "B", "D", "G"], semitones: [0, 2, 5, 10] },
  "G/B": { notes: ["B", "D", "G"], semitones: [0, 3, 8] },
  "G/C": { notes: ["C", "D", "G", "B"], semitones: [0, 2, 7, 11] },
  "G/D": { notes: ["D", "G", "B"], semitones: [0, 5, 9] },
  "G/F#": { notes: ["F#", "G", "B", "D"], semitones: [0, 1, 5, 8] },
  "Gm/Bb": { notes: ["Bb", "D", "G"], semitones: [0, 4, 9] },
  "Gm/D": { notes: ["D", "G", "Bb"], semitones: [0, 5, 8] },
  "Dsus/Bb": { notes: ["Bb", "D", "G", "A"], semitones: [0, 4, 9, 11] },
  
  // Add variations
  "C2": { notes: ["C", "D", "E", "G"], semitones: [0, 2, 4, 7] },
  "G2": { notes: ["G", "A", "B", "D"], semitones: [0, 2, 4, 7] },
  "Bb2": { notes: ["Bb", "C", "D", "F"], semitones: [0, 2, 4, 7] },
  "D5": { notes: ["D", "A"], semitones: [0, 7] },
  "G5": { notes: ["G", "D"], semitones: [0, 7] },
  "G11": { notes: ["G", "A", "B", "C", "D", "F"], semitones: [0, 2, 4, 5, 7, 10] },
  "G6/C": { notes: ["C", "D", "E", "G", "B"], semitones: [0, 2, 4, 7, 11] },
  
  // Complex add chords
  "Cadd11/G": { notes: ["G", "C", "E", "F"], semitones: [0, 5, 9, 10] },
  "Csus2add6/G": { notes: ["G", "A", "C", "D"], semitones: [0, 2, 5, 7] },
  "Am7add11": { notes: ["A", "C", "D", "E", "G"], semitones: [0, 3, 5, 7, 10] },
  "Amadd11": { notes: ["A", "C", "D", "E"], semitones: [0, 3, 5, 7] },
  "Dadd4add9": { notes: ["D", "E", "F#", "G", "A"], semitones: [0, 2, 4, 5, 7] },
  "Fadd9/C": { notes: ["C", "F", "G", "A"], semitones: [0, 5, 7, 9] },
  "Fmaj7b5/E": { notes: ["E", "F", "A", "B"], semitones: [0, 1, 5, 7] },
  "Gb(b5)": { notes: ["Gb", "Bb", "C"], semitones: [0, 4, 6] },
  "Gsus": { notes: ["G", "C", "D"], semitones: [0, 5, 7] },
  "D#dim7": { notes: ["D#", "F#", "A", "C"], semitones: [0, 3, 6, 9] },
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
  "D/F#": { frets: [2, 2, 4, 0], fingers: [1, 1, 3, 0] },
  "E": { frets: [1, 0, 2, 4], fingers: [1, 0, 2, 4] },
  "F": { frets: [3, 1, 2, 3], fingers: [3, 1, 2, 4] },
  "G": { frets: [0, 2, 0, 4], fingers: [0, 1, 0, 3] },
  "G/B": { frets: [0, 2, 0, 4], fingers: [0, 1, 0, 3] },
  "A": { frets: [2, 2, 4, 2], fingers: [1, 1, 3, 1], barreAt: 2 },
  "A/F#": { frets: [2, 2, 4, 2], fingers: [1, 1, 3, 1], barreAt: 2 },
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
  
  // Suspended chords
  "Asus4": { frets: [2, 2, 4, 3], fingers: [1, 1, 3, 2] },
  "Dsus4": { frets: [2, 2, 5, 0], fingers: [1, 1, 3, 0] },
  "Esus4": { frets: [1, 0, 2, 5], fingers: [1, 0, 2, 4] },
  "Gsus4": { frets: [0, 2, 0, 5], fingers: [0, 1, 0, 4] },
  "Csus4": { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  "Fsus4": { frets: [3, 1, 3, 3], fingers: [2, 1, 3, 4] },
  "Bsus4": { frets: [4, 4, 4, 5], fingers: [1, 1, 1, 2], barreAt: 4, startFret: 4 },
  "F#sus4": { frets: [4, 2, 4, 4], fingers: [2, 1, 3, 4] },
  "C#sus4": { frets: [1, 3, 4, 5], fingers: [1, 2, 3, 4] },
  "Bbsus4": { frets: [3, 3, 5, 4], fingers: [1, 1, 3, 2], barreAt: 3, startFret: 3 },
  
  // Sus2 chords
  "Asus2": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "Dsus2": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "Esus2": { frets: [1, 0, 2, 2], fingers: [1, 0, 2, 3] },
  "Gsus2": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "Csus2": { frets: [0, 0, 3, 3], fingers: [0, 0, 1, 2] },
  "Fsus2": { frets: [3, 0, 2, 3], fingers: [2, 0, 1, 3] },
  
  // Slash chords
  "Gmaj7/B": { frets: [0, 2, 0, 3], fingers: [0, 1, 0, 2] },
  "F/A": { frets: [2, 1, 2, 3], fingers: [2, 1, 3, 4] },
  "C/G": { frets: [0, 2, 3, 3], fingers: [0, 1, 2, 3] },
  "G/B": { frets: [0, 2, 0, 4], fingers: [0, 1, 0, 3] },
  "Am/G": { frets: [0, 2, 4, 0], fingers: [0, 1, 3, 0] },
  "Am/E": { frets: [2, 2, 4, 0], fingers: [1, 1, 3, 0] },
  "D/F#": { frets: [4, 2, 4, 0], fingers: [3, 1, 4, 0] },
  "A/C#": { frets: [4, 2, 4, 2], fingers: [3, 1, 4, 1], barreAt: 2, startFret: 2 },
  "C/E": { frets: [1, 2, 3, 3], fingers: [1, 2, 3, 4] },
  "Em/D": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "Em/B": { frets: [4, 2, 3, 0], fingers: [3, 1, 2, 0] },
  "Em/G": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  
  // Minor 7th extended
  "F#m7": { frets: [2, 3, 2, 5], fingers: [1, 2, 1, 4] },
  "C#m7": { frets: [1, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "G#m7": { frets: [1, 3, 3, 4], fingers: [1, 2, 3, 4] },
  "D#m7": { frets: [3, 3, 3, 1], fingers: [2, 3, 4, 1] },
  "Ebm7": { frets: [3, 3, 3, 1], fingers: [2, 3, 4, 1] },
  "Dbm7": { frets: [1, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "Abm7": { frets: [1, 3, 3, 4], fingers: [1, 2, 3, 4] },
  "A#m7": { frets: [3, 3, 4, 1], fingers: [2, 2, 3, 1] },
  "Bbm7": { frets: [3, 3, 4, 1], fingers: [2, 2, 3, 1] },
  
  // 6th chords
  "C6": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "G6": { frets: [0, 0, 0, 4], fingers: [0, 0, 0, 3] },
  "A6": { frets: [2, 4, 4, 2], fingers: [1, 3, 4, 1], barreAt: 2, startFret: 2 },
  "D6": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "F6": { frets: [3, 1, 2, 0], fingers: [3, 1, 2, 0] },
  "E6": { frets: [1, 0, 2, 2], fingers: [1, 0, 2, 3] },
  
  // Minor 6th chords
  "Am6": { frets: [2, 4, 4, 0], fingers: [1, 3, 4, 0] },
  "Dm6": { frets: [1, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "Em6": { frets: [2, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "Cm6": { frets: [0, 1, 3, 3], fingers: [0, 1, 2, 3] },
  "Gm6": { frets: [0, 0, 3, 3], fingers: [0, 0, 1, 2] },
  "Fm6": { frets: [1, 1, 2, 3], fingers: [1, 1, 2, 4] },
  
  // 9th chords
  "C9": { frets: [3, 1, 2, 2], fingers: [4, 1, 2, 3] },
  "C#9": { frets: [4, 2, 3, 3], fingers: [4, 1, 2, 3], startFret: 3 },
  "Db9": { frets: [4, 2, 3, 3], fingers: [4, 1, 2, 3], startFret: 3 },
  "D9": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "D#9": { frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1], barreAt: 3, startFret: 3 },
  "Eb9": { frets: [3, 3, 3, 3], fingers: [1, 1, 1, 1], barreAt: 3, startFret: 3 },
  "E9": { frets: [1, 2, 0, 0], fingers: [1, 2, 0, 0] },
  "F9": { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0] },
  "F#9": { frets: [3, 2, 3, 1], fingers: [3, 2, 4, 1], startFret: 2 },
  "Gb9": { frets: [3, 2, 3, 1], fingers: [3, 2, 4, 1], startFret: 2 },
  "G9": { frets: [0, 1, 2, 3], fingers: [0, 1, 2, 4] },
  "G#9": { frets: [1, 2, 3, 4], fingers: [1, 2, 3, 4], startFret: 3 },
  "Ab9": { frets: [1, 2, 3, 4], fingers: [1, 2, 3, 4], startFret: 3 },
  "A9": { frets: [2, 0, 3, 2], fingers: [1, 0, 3, 2] },
  "A#9": { frets: [3, 1, 4, 3], fingers: [2, 1, 4, 3], startFret: 2 },
  "Bb9": { frets: [3, 1, 4, 3], fingers: [2, 1, 4, 3], startFret: 2 },
  "B9": { frets: [4, 2, 5, 4], fingers: [2, 1, 4, 3], startFret: 3 },
  
  // Minor 9th chords
  "Am9": { frets: [2, 0, 4, 0], fingers: [1, 0, 3, 0] },
  "Dm9": { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "Em9": { frets: [2, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "Cm9": { frets: [3, 3, 3, 5], fingers: [1, 1, 1, 3], barreAt: 3, startFret: 3 },
  "Gm9": { frets: [0, 2, 2, 5], fingers: [0, 1, 2, 4] },
  "Bm9": { frets: [4, 4, 4, 6], fingers: [1, 1, 1, 3], barreAt: 4, startFret: 4 },
  
  // 7sus4 chords
  "A7sus4": { frets: [2, 2, 3, 3], fingers: [1, 1, 2, 3] },
  "D7sus4": { frets: [2, 2, 4, 0], fingers: [1, 1, 3, 0] },
  "E7sus4": { frets: [1, 2, 2, 0], fingers: [1, 2, 3, 0] },
  "G7sus4": { frets: [0, 1, 0, 5], fingers: [0, 1, 0, 4] },
  "B7sus4": { frets: [4, 4, 5, 5], fingers: [1, 1, 2, 3], barreAt: 4, startFret: 4 },
  "C7sus4": { frets: [3, 1, 3, 0], fingers: [2, 1, 3, 0] },
  "F7sus4": { frets: [2, 1, 3, 3], fingers: [1, 1, 2, 3] },
  
  // Add9 chords
  "Cadd9": { frets: [0, 0, 3, 3], fingers: [0, 0, 1, 2] },
  "Gadd9": { frets: [0, 2, 2, 4], fingers: [0, 1, 1, 3] },
  "Aadd9": { frets: [2, 4, 4, 0], fingers: [1, 3, 4, 0] },
  "Dadd9": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "Eadd9": { frets: [1, 0, 4, 4], fingers: [1, 0, 3, 4] },
  "Fadd9": { frets: [3, 0, 2, 3], fingers: [2, 0, 1, 3] },
  "Badd9": { frets: [4, 4, 6, 4], fingers: [1, 1, 3, 1], barreAt: 4, startFret: 4 },
  
  // Madd9 chords (minor add9)
  "Amadd9": { frets: [2, 0, 4, 0], fingers: [1, 0, 3, 0] },
  "Emadd9": { frets: [2, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "Dmadd9": { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  "Bmadd9": { frets: [4, 4, 4, 6], fingers: [1, 1, 1, 3], barreAt: 4, startFret: 4 },
  
  // Major 7th extended
  "Ebmaj7": { frets: [3, 3, 4, 0], fingers: [1, 2, 3, 0] },
  "Abmaj7": { frets: [1, 3, 0, 4], fingers: [1, 2, 0, 4] },
  "Bbmaj7": { frets: [3, 3, 4, 2], fingers: [2, 3, 4, 1], startFret: 2 },
  "Dbmaj7": { frets: [1, 3, 3, 3], fingers: [1, 2, 3, 4] },
  "A#maj7": { frets: [3, 3, 4, 2], fingers: [2, 3, 4, 1], startFret: 2 },
  "G#maj7": { frets: [1, 3, 0, 4], fingers: [1, 2, 0, 4] },
  "F#maj7": { frets: [4, 2, 3, 3], fingers: [4, 1, 2, 3] },
  
  // Major 9th chords
  "Cmaj9": { frets: [0, 0, 3, 2], fingers: [0, 0, 2, 1] },
  "Gmaj9": { frets: [0, 2, 2, 3], fingers: [0, 1, 2, 3] },
  "Amaj9": { frets: [2, 4, 3, 0], fingers: [1, 3, 2, 0] },
  "Dmaj9": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "Fmaj9": { frets: [0, 0, 2, 2], fingers: [0, 0, 1, 2] },
  "Bbmaj9": { frets: [3, 3, 3, 5], fingers: [1, 1, 1, 3], barreAt: 3, startFret: 3 },
  
  // Diminished chords
  "Cdim": { frets: [2, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "Ddim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Edim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Fdim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Gdim": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Adim": { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  "Bdim": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  
  // Diminished 7th chords
  "Cdim7": { frets: [2, 3, 2, 3], fingers: [1, 3, 2, 4] },
  "Ddim7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Edim7": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Fdim7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  "Gdim7": { frets: [0, 1, 0, 1], fingers: [0, 1, 0, 2] },
  "Adim7": { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  "Bdim7": { frets: [1, 2, 1, 2], fingers: [1, 3, 2, 4] },
  
  // Augmented chords
  "Caug": { frets: [0, 3, 3, 4], fingers: [0, 1, 2, 3] },
  "Daug": { frets: [3, 2, 4, 1], fingers: [3, 2, 4, 1] },
  "Eaug": { frets: [1, 0, 2, 5], fingers: [1, 0, 2, 4] },
  "Faug": { frets: [3, 1, 3, 4], fingers: [2, 1, 3, 4] },
  "Gaug": { frets: [0, 3, 0, 4], fingers: [0, 2, 0, 3] },
  "Aaug": { frets: [2, 3, 4, 3], fingers: [1, 2, 4, 3] },
  "Baug": { frets: [4, 5, 6, 5], fingers: [1, 2, 4, 3], startFret: 4 },
  
  // 11th chords
  "Am11": { frets: [0, 2, 4, 0], fingers: [0, 1, 3, 0] },
  "Dm11": { frets: [1, 2, 3, 0], fingers: [1, 2, 3, 0] },
  "Em11": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "Gm11": { frets: [0, 2, 3, 5], fingers: [0, 1, 2, 4] },
  
  // m7b5 (half-diminished)
  "Am7b5": { frets: [2, 3, 4, 0], fingers: [1, 2, 3, 0] },
  "Bm7b5": { frets: [4, 5, 6, 4], fingers: [1, 2, 3, 1], barreAt: 4, startFret: 4 },
  "Cm7b5": { frets: [3, 4, 5, 3], fingers: [1, 2, 3, 1], barreAt: 3, startFret: 3 },
  "Dm7b5": { frets: [1, 2, 0, 1], fingers: [1, 2, 0, 1] },
  "Em7b5": { frets: [2, 3, 3, 0], fingers: [1, 2, 3, 0] },
  "F#m7b5": { frets: [2, 3, 2, 5], fingers: [1, 2, 1, 4] },
  "Gm7b5": { frets: [0, 1, 3, 3], fingers: [0, 1, 2, 3] },
  "C#m7b5": { frets: [0, 4, 5, 4], fingers: [0, 1, 3, 2] },
  "D#m7b5": { frets: [2, 3, 5, 3], fingers: [1, 2, 4, 3] },
  "D#m7-5": { frets: [2, 3, 5, 3], fingers: [1, 2, 4, 3] },
  "Ebm7b5": { frets: [2, 3, 5, 3], fingers: [1, 2, 4, 3] },
  "B-5": { frets: [4, 5, 0, 0], fingers: [1, 2, 0, 0] },
  
  // Power chords (root and fifth only)
  "A5": { frets: [2, 2, -1, -1], fingers: [1, 2, 0, 0] },
  "D5": { frets: [2, 2, 4, -1], fingers: [1, 1, 3, 0] },
  "E5": { frets: [2, 2, 3, -1], fingers: [1, 1, 2, 0] },
  "G5": { frets: [0, 2, 0, -1], fingers: [0, 1, 0, 0] },
  "B5": { frets: [4, 4, 6, -1], fingers: [1, 1, 3, 0], barreAt: 4, startFret: 4 },
  "C5": { frets: [0, 2, 3, -1], fingers: [0, 1, 2, 0] },
  "F5": { frets: [3, 1, 2, -1], fingers: [3, 1, 2, 0] },
  "F#5": { frets: [4, 2, 3, -1], fingers: [3, 1, 2, 0] },
  "Bb5": { frets: [3, 3, 5, -1], fingers: [1, 1, 3, 0], barreAt: 3, startFret: 3 },
  "C#5": { frets: [1, 3, 4, -1], fingers: [1, 2, 3, 0] },
  "C#5/G#": { frets: [4, 3, 4, -1], fingers: [3, 2, 4, 0] },
  "A5/G#": { frets: [4, 0, 2, -1], fingers: [3, 0, 1, 0] },
  "D5/A": { frets: [2, 2, 0, -1], fingers: [2, 3, 0, 0] },
  "E5/B": { frets: [4, 4, 0, -1], fingers: [2, 3, 0, 0] },
  "G5/D": { frets: [0, 2, 0, -1], fingers: [0, 1, 0, 0] },
  "G#5": { frets: [1, 3, 1, -1], fingers: [1, 3, 1, 0] },
  "Eb5": { frets: [3, 3, 5, -1], fingers: [1, 1, 3, 0], barreAt: 3, startFret: 3 },
  
  // Additional slash chords
  "E/G#": { frets: [1, 0, 2, 4], fingers: [1, 0, 2, 4] },
  "Am/C": { frets: [0, 2, 4, 0], fingers: [0, 1, 3, 0] },
  "C/D": { frets: [2, 2, 3, 3], fingers: [1, 1, 2, 3] },
  "Bb/D": { frets: [0, 3, 5, 3], fingers: [0, 1, 3, 2] },
  "C/B": { frets: [4, 2, 3, 3], fingers: [3, 1, 2, 2] },
  "A/E": { frets: [2, 2, 4, 2], fingers: [1, 1, 3, 1], barreAt: 2, startFret: 2 },
  "F/C": { frets: [0, 1, 2, 3], fingers: [0, 1, 2, 3] },
  "D/A": { frets: [2, 2, 4, 0], fingers: [1, 1, 3, 0] },
  "Bm/A": { frets: [2, 4, 6, 4], fingers: [1, 2, 4, 3], startFret: 2 },
  "G/A": { frets: [2, 2, 0, 4], fingers: [1, 2, 0, 4] },
  "G/F": { frets: [1, 2, 0, 4], fingers: [1, 2, 0, 4] },
  "Dm/C": { frets: [0, 2, 2, 0], fingers: [0, 1, 2, 0] },
  "D/G": { frets: [0, 2, 4, 0], fingers: [0, 1, 3, 0] },
  "D/B": { frets: [4, 2, 4, 0], fingers: [3, 1, 4, 0] },
  "D/E": { frets: [2, 2, 4, 2], fingers: [1, 1, 3, 1], barreAt: 2, startFret: 2 },
  "Asus2/B": { frets: [4, 2, 3, 0], fingers: [3, 1, 2, 0] },
  "Em/A": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  "F/G": { frets: [0, 1, 2, 3], fingers: [0, 1, 2, 3] },
  "G/F#": { frets: [4, 2, 0, 4], fingers: [3, 1, 0, 4] },
  "C#m/B": { frets: [4, 4, 5, 4], fingers: [1, 1, 2, 1], barreAt: 4, startFret: 4 },
  "C#m/A#": { frets: [3, 4, 5, 4], fingers: [1, 2, 3, 2], startFret: 3 },
  
  // Additional voicings
  "G2": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "Fmaj7#11": { frets: [3, 1, 2, 2], fingers: [4, 1, 2, 3] },
  "F#m7add11": { frets: [2, 3, 2, 0], fingers: [1, 3, 2, 0] },
  "F#madd9": { frets: [2, 3, 3, 0], fingers: [1, 2, 3, 0] },
  "Cadd4": { frets: [0, 2, 3, 4], fingers: [0, 1, 2, 3] },
  "G4": { frets: [0, 2, 0, 5], fingers: [0, 1, 0, 4] },
  "B4": { frets: [4, 4, 4, 4], fingers: [1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "Gadd2": { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  "B2": { frets: [4, 4, 4, 4], fingers: [1, 1, 1, 1], barreAt: 4, startFret: 4 },
  "D2": { frets: [2, 2, 2, 0], fingers: [1, 1, 1, 0] },
  "D6/9": { frets: [2, 2, 2, 2], fingers: [1, 1, 1, 1], barreAt: 2, startFret: 2 },
  "F#m11": { frets: [2, 3, 2, 5], fingers: [1, 2, 1, 4] },
  "Cadd2": { frets: [0, 0, 3, 3], fingers: [0, 0, 1, 2] },
  "Gsus": { frets: [0, 2, 0, 5], fingers: [0, 1, 0, 4] },
  "E7sus": { frets: [1, 2, 2, 0], fingers: [1, 2, 3, 0] },
  "FM7": { frets: [3, 1, 2, 2], fingers: [4, 1, 2, 3] },
  "Am7/G": { frets: [0, 2, 3, 0], fingers: [0, 1, 2, 0] },
  "F6/9": { frets: [3, 0, 2, 0], fingers: [2, 0, 1, 0] },
  "GM7": { frets: [0, 2, 0, 3], fingers: [0, 1, 0, 2] },
  "DM7": { frets: [2, 2, 3, 0], fingers: [1, 1, 2, 0] },
  
  // Additional missing chords
  "Gmadd9": { frets: [0, 2, 3, 5], fingers: [0, 1, 2, 4] },
  "F#/C#": { frets: [4, 2, 3, 4], fingers: [3, 1, 2, 4] },
  "G#/C": { frets: [0, 3, 1, 5], fingers: [0, 2, 1, 4] },
  "C#/G#": { frets: [1, 3, 4, 4], fingers: [1, 2, 3, 4] },
  "F#/A#": { frets: [4, 2, 3, 1], fingers: [4, 2, 3, 1] },
  "B/D#": { frets: [4, 4, 6, 4], fingers: [1, 1, 3, 1], barreAt: 4, startFret: 4 },
  "B/F#": { frets: [4, 4, 6, 4], fingers: [1, 1, 3, 1], barreAt: 4, startFret: 4 },
  "E/B": { frets: [4, 0, 2, 4], fingers: [2, 0, 1, 3] },
  "C#/F": { frets: [1, 3, 4, 1], fingers: [1, 2, 3, 1], barreAt: 1 },
  "Eb/G": { frets: [0, 3, 1, 3], fingers: [0, 2, 1, 3] },
  "Eb/Bb": { frets: [3, 3, 1, 3], fingers: [2, 3, 1, 4] },
  "G/D": { frets: [0, 2, 0, 0], fingers: [0, 1, 0, 0] },
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
  result = result.replace(/7M/g, 'maj7')
  
  // Remove 'maj' suffix when it's just major (not maj7) - Cmaj → C
  result = result.replace(/maj(?!7)/g, '')
  
  // Remove parentheses - (add9) becomes add9, (9) becomes 9
  result = result.replace(/\(([^)]+)\)/g, '$1')
  
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

// Array of note names for transposition (using sharps as default)
export const CHROMATIC_NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const CHROMATIC_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Determine if a chord name uses flats (to maintain consistency when transposing)
export function usesFlats(chordName) {
  if (!chordName) return false
  const root = getChordRoot(chordName)
  return root && root.includes('b')
}

export function isMinor(chordName) {
  if (!chordName) return false
  // Check if the chord contains 'm' but not 'maj' (to avoid false positives with maj7, etc.)
  return chordName.includes('m') && !chordName.includes('maj')
}

// Transpose a single chord name by a number of semitones
export function transposeChord(chordName, semitones) {
  if (!chordName || semitones === 0) return chordName
  
  // Handle slash chords (e.g., Am/G)
  if (chordName.includes('/')) {
    const [main, bass] = chordName.split('/')
    const transposedMain = transposeChord(main, semitones)
    const transposedBass = transposeChord(bass, semitones)
    return `${transposedMain}/${transposedBass}`
  }
  
  const root = getChordRoot(chordName)
  if (!root) return chordName
  
  // Get the suffix (everything after the root note)
  const suffix = chordName.slice(root.length)
  
  // Determine which chromatic scale to use based on original chord
  const useFlats = usesFlats(chordName)
  const chromaticNotes = useFlats ? CHROMATIC_NOTES_FLAT : CHROMATIC_NOTES_SHARP
  
  // Find the current semitone value of the root
  const currentSemitone = NOTE_SEMITONES[root]
  if (currentSemitone === undefined) return chordName
  
  // Calculate the new semitone value (wrap around using modulo)
  let newSemitone = (currentSemitone + semitones) % 12
  if (newSemitone < 0) newSemitone += 12
  
  // Get the new root note
  const newRoot = chromaticNotes[newSemitone]
  
  return newRoot + suffix
}

// Get the key signature from the first chord or most common root
export function detectKey(chords) {
  if (!chords || chords.length === 0) return 'C'
  
  // Simple heuristic: use the first chord's root as the key
  const firstChord = chords[0]
  const root = getChordRoot(firstChord)
  return root || 'C'
}

// Get all 12 possible keys for the key selector
export function getAllKeys() {
  return [
    { value: 'C', label: 'C' },
    { value: 'C#', label: 'C# / Db' },
    { value: 'D', label: 'D' },
    { value: 'D#', label: 'D# / Eb' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'F#', label: 'F# / Gb' },
    { value: 'G', label: 'G' },
    { value: 'G#', label: 'G# / Ab' },
    { value: 'A', label: 'A' },
    { value: 'A#', label: 'A# / Bb' },
    { value: 'B', label: 'B' }
  ]
}

// Calculate semitone difference between two keys
export function getSemitonesBetweenKeys(fromKey, toKey) {
  const fromSemitone = NOTE_SEMITONES[fromKey]
  const toSemitone = NOTE_SEMITONES[toKey]
  
  if (fromSemitone === undefined || toSemitone === undefined) return 0
  
  let diff = toSemitone - fromSemitone
  // Normalize to -6 to +5 range for shortest path
  if (diff > 6) diff -= 12
  if (diff < -6) diff += 12
  
  return diff
}

