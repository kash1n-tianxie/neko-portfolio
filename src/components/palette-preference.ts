export type Palette = 'blue-yellow' | 'red-black'

export function resolvePalette(saved: unknown, legacy: unknown, session?: unknown): Palette {
  if (session === 'blue-yellow' || session === 'red-black') return session
  if (saved === 'blue-yellow' || saved === 'red-black') return saved
  if (saved === null && legacy === 'yoru') return 'red-black'
  return 'blue-yellow'
}

export function nextPalette(palette: Palette): Palette {
  return palette === 'blue-yellow' ? 'red-black' : 'blue-yellow'
}

export function readPalette(read: (key: string) => string | null, session?: unknown): Palette {
  try {
    const saved = read('neko-palette')
    return resolvePalette(saved, saved === null ? read('neko-theme') : null, session)
  } catch {
    return resolvePalette(null, null, session)
  }
}

export function savePalette(write: (key: string, value: string) => unknown, palette: Palette): void {
  try { write('neko-palette', palette) } catch { /* The root remains the in-session source of truth. */ }
}

// Serialize the same self-contained resolver used by the controls, not a second set of rules.
export const PALETTE_PREPAINT_SCRIPT = `(()=>{const resolve=${resolvePalette.toString()};let palette='blue-yellow';try{const saved=localStorage.getItem('neko-palette');palette=resolve(saved,saved===null?localStorage.getItem('neko-theme'):null);localStorage.setItem('neko-palette',palette)}catch{}document.documentElement.dataset.palette=palette;delete document.documentElement.dataset.theme})()`
