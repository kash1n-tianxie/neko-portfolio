'use client'

import { useEffect, useId, useRef, type CSSProperties } from 'react'
import type { Palette } from '../palette-preference'
import { catArt, gazeVector } from './cat-art'
import { useReducedMotion } from './use-reduced-motion'
import './cat-companion.css'

/** One complete outfit + registered, independently clipped eyes. Also used by portrait cards. */
export function CatArt({ palette }: { palette: Palette }) {
  const id = useId().replaceAll(':', '')
  const art = catArt[palette]
  return (
    <div className="cat-art" data-cat-palette={palette} aria-hidden="true">
      {/* Both outfits eagerly load; root palette selects a fully registered layer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art.src} width={1024} height={1024} alt="" loading="eager" decoding="async" className="cat-art__image" />
      <svg viewBox="0 0 1024 1024" className="cat-art__eyes" aria-hidden="true">
        <defs>{art.eyes.map((eye, index) => <clipPath id={`${id}-eye-${index}`} key={index}><path d={eye.clip} /></clipPath>)}</defs>
        {art.eyes.map((eye, index) => (
          <g key={index} clipPath={`url(#${id}-eye-${index})`}>
            <g className="cat-art__gaze" style={{ '--eye-travel-x': `${eye.travelX}px`, '--eye-travel-y': `${eye.travelY}px` } as CSSProperties}>
              <ellipse cx={eye.x} cy={eye.y} rx="29" ry="34" fill="#151820" />
              <ellipse cx={eye.x} cy={eye.y} rx="24.5" ry="30" fill={art.iris} />
              <ellipse cx={eye.x} cy={eye.y} rx="18.5" ry="27" fill="#101218" />
              <ellipse cx={eye.x - 9} cy={eye.y - 16} rx="6" ry="8" fill="#fffdf6" opacity=".96" />
              <circle cx={eye.x + 10} cy={eye.y + 13} r="2.8" fill="#fffdf6" opacity=".65" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}

export function CatCompanion({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return
    const reset = () => {
      cancelAnimationFrame(raf.current)
      el.style.removeProperty('--look-x')
      el.style.removeProperty('--look-y')
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const bounds = el.getBoundingClientRect()
        const offset = gazeVector(event.clientX - bounds.left - bounds.width * .494, event.clientY - bounds.top - bounds.height * .3585)
        el.style.setProperty('--look-x', String(offset.x))
        el.style.setProperty('--look-y', String(offset.y))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      reset()
    }
  }, [reducedMotion])

  return <div ref={ref} className={`cat-companion ${className}`} aria-hidden="true"><CatArt palette="blue-yellow" /><CatArt palette="red-black" /></div>
}
