'use client'

import { useEffect, useRef } from 'react'

/**
 * 分镜感应 — pointer effects over the works grid:
 *  - an ink spotlight follows the pointer (--mx/--my, visual in CSS)
 *  - each koma panel tilts in 3D toward the pointer (award-site tilt card),
 *    springing flat when the pointer leaves. Mouse only; reduced-motion off.
 */
export function SpotlightGrid({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const activeKoma = useRef<HTMLElement | null>(null)
  const enabled = useRef(true)

  useEffect(() => {
    enabled.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const resetKoma = () => {
    if (activeKoma.current) {
      activeKoma.current.style.transform = ''
      activeKoma.current = null
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse' || !enabled.current) return
    const { clientX, clientY, target } = e
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${clientX - r.left}px`)
      el.style.setProperty('--my', `${clientY - r.top}px`)
      el.classList.add('spotlight--on')

      const koma = (target as HTMLElement).closest?.('.koma') as HTMLElement | null
      if (koma !== activeKoma.current) resetKoma()
      if (koma && el.contains(koma)) {
        const k = koma.getBoundingClientRect()
        const px = (clientX - k.left) / k.width - 0.5
        const py = (clientY - k.top) / k.height - 0.5
        koma.style.transform =
          `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-3px)`
        activeKoma.current = koma
      }
    })
  }

  const onPointerLeave = () => {
    cancelAnimationFrame(raf.current)
    ref.current?.classList.remove('spotlight--on')
    resetKoma()
  }

  return (
    <div
      ref={ref}
      className={`spotlight ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  )
}
