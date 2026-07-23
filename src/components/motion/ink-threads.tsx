'use client'

import { useEffect, useRef } from 'react'

/**
 * 墨糸 — a light-weight flowing ink background (React Bits "Threads" idea, hand
 * rolled so it adds no dependency and no WebGL). A handful of horizontal
 * strands drift and undulate on a 2D canvas, drawn in the live theme ink
 * colour at low opacity. Runs its own rAF only while on screen and only for
 * motion-OK, non-touch viewports; otherwise it renders nothing.
 */
export function InkThreads({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement ?? canvas
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0

    const readColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#f0ede4'
    let ink = readColor()

    const STRANDS = 7
    const strands = Array.from({ length: STRANDS }, (_, i) => ({
      base: (i + 0.5) / STRANDS,
      amp: 0.03 + Math.random() * 0.05,
      freq: 1.1 + Math.random() * 1.4,
      speed: 0.06 + Math.random() * 0.09,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.05 + Math.random() * 0.07,
    }))

    const resize = () => {
      const r = parent.getBoundingClientRect()
      w = r.width
      h = r.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ink = readColor()
    }
    resize()

    let raf = 0
    let running = false
    let t = 0
    const draw = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      for (const s of strands) {
        ctx.beginPath()
        for (let x = 0; x <= w; x += 14) {
          const y =
            h * s.base +
            Math.sin(x / w * Math.PI * s.freq + t * s.speed * 6 + s.phase) * h * s.amp +
            Math.sin(x / w * Math.PI * s.freq * 2.3 + t * s.speed * 3) * h * s.amp * 0.35
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = ink
        ctx.globalAlpha = s.alpha
        ctx.lineWidth = 1.4
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    )
    io.observe(parent)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={`ink-threads ${className}`} aria-hidden="true" />
}
