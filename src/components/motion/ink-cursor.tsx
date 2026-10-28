'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useReducedMotion } from './use-reduced-motion'

/** Small local feedback around links. Native cursor and text selection remain intact. */
export function InkCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const ring = ref.current
    if (!ring || pathname === '/world' || reducedMotion) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let raf = 0
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let started = false
    const draw = () => {
      raf = 0
      x += (tx - x) * 0.32
      y += (ty - y) * 0.32
      ring.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(draw)
    }
    const move = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType !== 'mouse') return
      tx = event.clientX
      ty = event.clientY
      if (!started) { x = tx; y = ty; started = true }
      const interactive = (event.target as Element)?.closest('a,button,summary')
      ring.dataset.active = interactive ? 'true' : 'false'
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const hide = () => { ring.dataset.active = 'false' }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    document.addEventListener('visibilitychange', hide)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      document.removeEventListener('visibilitychange', hide)
      hide()
    }
  }, [pathname, reducedMotion])

  return <div ref={ref} className="ink-cursor-ring" aria-hidden="true" data-html2canvas-ignore />
}
