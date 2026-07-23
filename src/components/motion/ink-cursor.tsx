'use client'

import { useEffect } from 'react'

/**
 * 墨染光标 — ink-brush cursor (ported & refined from portfolio v1).
 * A slender blade of ink follows the pointer, stretching with speed and
 * leaving a fading brush trail; over interactive elements it gathers into
 * a dense ink dot; clicks splash. Theme-aware (reads --ink live).
 * Desktop fine-pointers only; disabled for reduced motion.
 */
export function InkCursor() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const canvas = document.createElement('canvas')
    canvas.className = 'ink-cursor-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')!
    document.documentElement.classList.add('ink-cursor-active')

    let ink = '240,237,228'
    const readInk = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
      // #rrggbb -> "r,g,b"
      if (v.startsWith('#') && v.length === 7) {
        ink = `${parseInt(v.slice(1, 3), 16)},${parseInt(v.slice(3, 5), 16)},${parseInt(v.slice(5, 7), 16)}`
      }
    }
    readInk()
    const themeObserver = new MutationObserver(readInk)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const pos = { x: w / 2, y: h / 2 }
    const target = { x: w / 2, y: h / 2 }
    const trail: { x: number; y: number }[] = []
    type Splash = { x: number; y: number; life: number; parts: { a: number; len: number; wob: number }[] }
    const splashes: Splash[] = []
    let hovering = false
    let visible = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      visible = true
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      hovering = !!t?.closest?.('a, button, [data-cursor], input, textarea, label, summary')
    }
    const onDown = (e: MouseEvent) => {
      splashes.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        parts: Array.from({ length: 8 }, () => ({
          a: Math.random() * Math.PI * 2,
          len: 7 + Math.random() * 18,
          wob: (Math.random() - 0.5) * 0.7,
        })),
      })
    }
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) visible = false
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseout', onOut, { passive: true })

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const px = pos.x
      const py = pos.y
      pos.x += (target.x - pos.x) * 0.35
      pos.y += (target.y - pos.y) * 0.35
      const vx = pos.x - px
      const vy = pos.y - py
      const speed = Math.hypot(vx, vy)

      trail.push({ x: pos.x, y: pos.y })
      if (trail.length > 20) trail.shift()

      ctx.clearRect(0, 0, w, h)
      if (!visible) return

      if (trail.length > 2 && !hovering) {
        ctx.lineCap = 'round'
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1]
          const b = trail[i]
          const f = i / trail.length
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.lineWidth = 0.8 + f * (2.4 + Math.min(speed, 42) * 0.2)
          ctx.strokeStyle = `rgba(${ink},${0.05 + f * 0.2})`
          ctx.stroke()
        }
      }

      ctx.save()
      ctx.translate(pos.x, pos.y)
      if (hovering) {
        ctx.beginPath()
        ctx.arc(0, 0, 8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ink},0.92)`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(0, 0, 15, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${ink},0.3)`
        ctx.lineWidth = 1.4
        ctx.stroke()
      } else {
        ctx.rotate(Math.atan2(vy, vx))
        const half = Math.min(18 + speed * 1.9, 68)
        const ww = 3.4 + Math.min(speed, 28) * 0.08
        const grad = ctx.createLinearGradient(-half, 0, half, 0)
        grad.addColorStop(0, `rgba(${ink},0)`)
        grad.addColorStop(0.5, `rgba(${ink},0.95)`)
        grad.addColorStop(1, `rgba(${ink},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(-half, 0)
        ctx.quadraticCurveTo(0, -ww, half, 0)
        ctx.quadraticCurveTo(0, ww, -half, 0)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(0, 0, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ink},0.95)`
        ctx.fill()
      }
      ctx.restore()

      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i]
        s.life -= 0.05
        if (s.life <= 0) {
          splashes.splice(i, 1)
          continue
        }
        const e = 1 - s.life
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.lineCap = 'round'
        for (const p of s.parts) {
          const r = e * p.len
          ctx.beginPath()
          ctx.moveTo(Math.cos(p.a) * r * 0.3, Math.sin(p.a) * r * 0.3)
          ctx.lineTo(Math.cos(p.a + p.wob) * r, Math.sin(p.a + p.wob) * r)
          ctx.lineWidth = 2.4 * s.life
          ctx.strokeStyle = `rgba(${ink},${0.8 * s.life})`
          ctx.stroke()
        }
        ctx.restore()
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      themeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseout', onOut)
      document.documentElement.classList.remove('ink-cursor-active')
      canvas.remove()
    }
  }, [])

  return null
}
