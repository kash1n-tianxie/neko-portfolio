'use client'

import { useEffect, useRef, type ElementType } from 'react'

/**
 * 滲み — ink-bleed prose reveal (React Bits "Blur Text" idea, retuned for
 * sumi). Text is split into short phrases that fade up from a soft blur,
 * staggered, as the block scrolls into view — like ink soaking into washi.
 * Splits Japanese on 、。／ spaces so it works for both ja and en. Instant
 * for reduced motion. IntersectionObserver only, no rAF.
 */
export function InkBleedText({
  text,
  className = '',
  as: Tag = 'p',
}: {
  text: string
  className?: string
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // keep trailing delimiter with its phrase; drop empty fragments
  const phrases = text.split(/(?<=[、。，,.！!？?\s])/).filter((s) => s.length > 0)

  return (
    <Tag ref={ref} className={`ink-bleed ${className}`}>
      {phrases.map((phrase, i) => (
        <span
          key={i}
          className="ink-bleed__w"
          style={{ transitionDelay: `${Math.min(i * 55, 620)}ms` }}
        >
          {phrase}
        </span>
      ))}
    </Tag>
  )
}
