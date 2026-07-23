'use client'

import { useEffect, useRef } from 'react'

/**
 * 磁吸 — the classic award-site magnetic element: it leans toward the
 * pointer while hovered and springs back on leave. Fine pointers only.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!fine || reduce || !el) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={`magnetic ${className}`}>
      {children}
    </div>
  )
}
