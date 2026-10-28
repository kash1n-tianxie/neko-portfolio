'use client'

import { useSyncExternalStore } from 'react'
import { useLocale } from 'next-intl'
import type { PixelPalette } from './pixel/world-types'

const STORAGE_KEY = 'neko-pixel-palette'
const CHANGE_EVENT = 'neko:pixel-palette-change'
let sessionPalette: PixelPalette | undefined

export function resolvePixelPalette(saved: string | null, theme?: string): PixelPalette {
  if (saved === 'blue-yellow' || saved === 'red-black') return saved
  return theme === 'yoru' ? 'red-black' : 'blue-yellow'
}

export function getPixelPalette(): PixelPalette {
  if (typeof document === 'undefined') return 'blue-yellow'
  if (sessionPalette === undefined) {
    let saved: string | null = null
    try { saved = localStorage.getItem(STORAGE_KEY) } catch { /* Private mode still permits a session choice. */ }
    sessionPalette = resolvePixelPalette(saved, document.documentElement.dataset.theme)
  }
  return sessionPalette
}

export function setPixelPalette(palette: PixelPalette) {
  sessionPalette = palette
  try { localStorage.setItem(STORAGE_KEY, palette) } catch { /* Keep the live session choice if storage is unavailable. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribePixelPalette(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    sessionPalette = resolvePixelPalette(event.newValue, document.documentElement.dataset.theme)
    notify()
  }
  window.addEventListener(CHANGE_EVENT, notify)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify)
    window.removeEventListener('storage', onStorage)
  }
}

export function usePixelPalette() {
  const palette = useSyncExternalStore(subscribePixelPalette, getPixelPalette, () => 'blue-yellow' as PixelPalette)
  return [palette, setPixelPalette] as const
}

const LABELS = {
  en: { 'blue-yellow': 'blue and yellow', 'red-black': 'red and black' },
  ja: { 'blue-yellow': '青と黄', 'red-black': '赤と黒' },
} as const

/** Town-only colors: never changes the portfolio theme or its saved preference. */
export function PixelPaletteToggle() {
  const [palette, selectPalette] = usePixelPalette()
  const ja = useLocale() === 'ja'
  const current = LABELS[ja ? 'ja' : 'en'][palette]
  return (
    <button type="button" className="palette-toggle"
      aria-label={ja ? `町の配色を切り替える：現在 ${current}` : `Change town palette: currently ${current}`}
      title={ja ? '町の配色を切り替える' : 'Change town palette'}
      onClick={() => selectPalette(getPixelPalette() === 'blue-yellow' ? 'red-black' : 'blue-yellow')}>
      <span className="palette-toggle__swatch" data-palette-preview={palette} aria-hidden="true" />
      <span className="palette-toggle__label" aria-hidden="true">{palette === 'blue-yellow' ? 'B / Y' : 'R / B'}</span>
    </button>
  )
}
