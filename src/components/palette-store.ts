'use client'

import { useSyncExternalStore } from 'react'
import { readPalette, resolvePalette, savePalette, type Palette } from './palette-preference'

const CHANGE_EVENT = 'neko:palette-change'
// Locale navigation may replace html attributes; the DOM is only a projection.
let sessionPalette: Palette | undefined
let wipe: HTMLElement | null = null
let wipeAnimation: Animation | null = null

export function getPalette(): Palette {
  if (typeof document === 'undefined') return 'blue-yellow'
  sessionPalette ??= readPalette(key => localStorage.getItem(key), document.documentElement.dataset.palette)
  return sessionPalette
}

/** Restore after navigation without persisting or replaying the selection wipe. */
export function reconcilePalette() {
  const palette = getPalette()
  const root = document.documentElement
  const changed = root.dataset.palette !== palette || root.dataset.theme !== undefined
  root.dataset.palette = palette
  delete root.dataset.theme
  if (changed) window.dispatchEvent(new Event(CHANGE_EVENT))
}

function clearWipe() {
  wipeAnimation?.cancel()
  wipeAnimation = null
  wipe?.remove()
  wipe = null
}

function playWipe() {
  clearWipe()
  if (document.documentElement.dataset.motion === 'off'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const slash = document.createElement('div')
  slash.className = 'palette-wipe'
  slash.setAttribute('aria-hidden', 'true')
  document.body.appendChild(slash)
  if (typeof slash.animate !== 'function') { slash.remove(); return }
  wipe = slash
  const animation = slash.animate([
    { transform: 'translate3d(-180%, 0, 0) skewX(-18deg)', opacity: 0 },
    { opacity: 1, offset: 0.18 },
    { opacity: 1, offset: 0.7 },
    { transform: 'translate3d(500%, 0, 0) skewX(-18deg)', opacity: 0 },
  ], { duration: 340, easing: 'cubic-bezier(.3,0,.3,1)' })
  wipeAnimation = animation
  animation.onfinish = () => { if (wipe === slash) clearWipe() }
}

export function setPalette(palette: Palette) {
  if (palette === getPalette()) {
    reconcilePalette()
    return
  }
  // Apply synchronously: an interrupted animation can never restore an older selection.
  sessionPalette = palette
  document.documentElement.dataset.palette = palette
  delete document.documentElement.dataset.theme
  savePalette((key, value) => localStorage.setItem(key, value), palette)
  window.dispatchEvent(new Event(CHANGE_EVENT))
  playWipe()
}

function subscribePalette(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== 'neko-palette' && event.key !== 'neko-theme' && event.key !== null) return
    clearWipe()
    try {
      const saved = event.key === null ? null : event.key === 'neko-palette'
        ? event.newValue : localStorage.getItem('neko-palette')
      const legacy = saved !== null || event.key === null ? null : event.key === 'neko-theme'
        ? event.newValue : localStorage.getItem('neko-theme')
      sessionPalette = resolvePalette(saved, legacy)
    } catch { /* Unreadable storage must not erase the live session selection. */ }
    reconcilePalette()
    notify()
  }
  const onMotion = () => {
    if (document.documentElement.dataset.motion === 'off'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) clearWipe()
  }
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  window.addEventListener(CHANGE_EVENT, notify)
  window.addEventListener('storage', onStorage)
  window.addEventListener('neko:motion-change', onMotion)
  media.addEventListener('change', onMotion)
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify)
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('neko:motion-change', onMotion)
    media.removeEventListener('change', onMotion)
  }
}

export function usePalette() {
  const palette = useSyncExternalStore(subscribePalette, getPalette, () => 'blue-yellow' as Palette)
  return [palette, setPalette] as const
}
