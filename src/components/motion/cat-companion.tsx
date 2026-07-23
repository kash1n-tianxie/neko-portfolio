'use client'

import { useEffect, useRef } from 'react'

/** The blank-eyed cat art with two CSS pupils that follow the pointer. */
export function CatCompanion({
  bodySrc,
  className = '',
}: {
  bodySrc: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const bounds = el.getBoundingClientRect()
        const centerX = bounds.left + bounds.width / 2
        const centerY = bounds.top + bounds.height * 0.32
        const dx = event.clientX - centerX
        const dy = event.clientY - centerY
        const distance = Math.hypot(dx, dy) || 1
        const reach = Math.min(distance / 240, 1)
        el.style.setProperty('--px', `${(dx / distance) * reach * 38}%`)
        el.style.setProperty('--py', `${(dy / distance) * reach * 38}%`)
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div ref={ref} className={`cat-companion ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bodySrc} alt="" className="h-full w-full object-contain object-bottom" />
      <span className="cat-companion__pupil cat-companion__pupil--l" />
      <span className="cat-companion__pupil cat-companion__pupil--r" />
    </div>
  )
}
