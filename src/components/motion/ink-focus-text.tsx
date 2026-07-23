'use client'

import { useEffect, useRef } from 'react'

/**
 * 近接集墨 — proximity "ink focus" (React Bits "Variable Proximity" idea).
 * Each glyph is an outline by default; characters near the pointer fill with
 * ink and lift slightly, as if the brush gathers where you look. Per-char
 * intensity is written to a `--f` custom property; the paint lives in CSS.
 * Desktop fine-pointers only; static outline for touch / reduced motion.
 */
export function InkFocusText({
  text,
  className = '',
  radius = 130,
}: {
  text: string
  className?: string
  radius?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    const chars = Array.from(el.querySelectorAll<HTMLElement>('[data-fc]'))
    let raf = 0
    let px = -9999
    let py = -9999

    const tick = () => {
      raf = 0
      for (const c of chars) {
        const r = c.getBoundingClientRect()
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py)
        const f = Math.max(0, 1 - d / radius)
        c.style.setProperty('--f', f.toFixed(3))
      }
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const reset = () => {
      px = py = -9999
      for (const c of chars) c.style.setProperty('--f', '0')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', reset)
      cancelAnimationFrame(raf)
    }
  }, [text, radius])

  return (
    <span ref={ref} className={`ink-focus ${className}`} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-fc aria-hidden="true" className="ink-focus__c">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
