'use client'

import { useEffect, useRef } from 'react'

/**
 * 速度感応マーキー — award-site staple: an infinite outline-type band whose
 * speed and shear react to scroll velocity (fast scroll = the strip rushes
 * and leans). Runs its own rAF only while on screen; static text for
 * reduced motion.
 */
const CONTENT = '作品 SELECTED WORKS ・ 墨と猫 ・ KASHIN OU ・ '

export function InkMarquee() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = ref.current
    const track = root?.querySelector<HTMLElement>('.marquee__track')
    if (!root || !track) return

    let x = 0
    let last = window.scrollY
    let vel = 0
    let raf = 0
    let running = false

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const dy = window.scrollY - last
      last = window.scrollY
      vel += (Math.max(-90, Math.min(90, dy)) - vel) * 0.08
      x -= 0.7 + Math.abs(vel) * 0.06
      const half = track.scrollWidth / 2
      if (half > 0 && -x >= half) x += half
      track.style.transform = `translateX(${x}px) skewX(${(-vel * 0.09).toFixed(2)}deg)`
    }
    const start = () => {
      if (running) return
      running = true
      last = window.scrollY
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(root)

    return () => {
      io.disconnect()
      stop()
    }
  }, [])

  return (
    <div ref={ref} className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <span>{CONTENT.repeat(4)}</span>
        <span>{CONTENT.repeat(4)}</span>
      </div>
    </div>
  )
}
