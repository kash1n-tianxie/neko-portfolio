'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Html2Canvas = typeof import('html2canvas')['default']

const TRANSITION_SELECTOR = 'a[data-canvas-transition]'
const TRANSITION_MS = 720

let captureModule: Promise<Html2Canvas> | undefined

function loadCapture() {
  captureModule ??= import('html2canvas').then((module) => module.default)
  return captureModule
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function drawClawSegment(
  context: CanvasRenderingContext2D,
  from: number,
  to: number,
  width: number,
  height: number,
  scaleX: number,
  scaleY: number,
  originX: number,
  originY: number,
) {
  const reachX = width * 0.78
  const reachY = height * 0.34

  context.save()
  context.globalCompositeOperation = 'destination-out'
  context.lineCap = 'round'
  context.lineJoin = 'round'

  for (let claw = -1; claw <= 1; claw += 1) {
    const offset = claw * Math.min(58, height * 0.075)

    for (let bristle = 0; bristle < 9; bristle += 1) {
      const bristleOffset = (bristle - 4) * 2.25
      const wobbleFrom = Math.sin((from * 19) + bristle * 1.8 + claw) * 3
      const wobbleTo = Math.sin((to * 19) + bristle * 1.8 + claw) * 3
      const startX = originX - reachX + reachX * 2 * from
      const startY = originY + reachY - reachY * 2 * from + offset + bristleOffset + wobbleFrom
      const endX = originX - reachX + reachX * 2 * to
      const endY = originY + reachY - reachY * 2 * to + offset + bristleOffset + wobbleTo

      context.beginPath()
      context.moveTo(startX * scaleX, startY * scaleY)
      context.lineTo(endX * scaleX, endY * scaleY)
      context.lineWidth = (bristle % 3 === 0 ? 5.4 : 2.8) * Math.min(scaleX, scaleY)
      context.globalAlpha = bristle % 4 === 0 ? 0.58 : 0.92
      context.stroke()
    }
  }

  context.restore()
}

export function CanvasPageTransition() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const runningRef = useRef(false)
  const frameRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<'idle' | 'active' | 'leaving'>('idle')

  useEffect(() => {
    const preload = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest(TRANSITION_SELECTOR)) void loadCapture()
    }

    const navigate = async (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(TRANSITION_SELECTOR)
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin) return

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const compactViewport = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
      if (reducedMotion || compactViewport || runningRef.current) return

      event.preventDefault()
      runningRef.current = true

      const canvas = canvasRef.current
      if (!canvas) {
        runningRef.current = false
        router.push(`${destination.pathname}${destination.search}${destination.hash}`)
        return
      }

      try {
        await document.fonts.ready
        const html2canvas = await loadCapture()
        const scrollX = window.scrollX
        const scrollY = window.scrollY
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const source = await html2canvas(document.body, {
          backgroundColor: null,
          foreignObjectRendering: true,
          logging: false,
          scale: Math.min(window.devicePixelRatio, 1.5),
          useCORS: true,
          width: viewportWidth,
          height: viewportHeight,
          windowWidth: viewportWidth,
          windowHeight: viewportHeight,
          x: 0,
          y: 0,
          scrollX: -scrollX,
          scrollY: -scrollY,
        })

        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas 2D context unavailable')

        canvas.width = source.width
        canvas.height = source.height
        canvas.style.width = `${viewportWidth}px`
        canvas.style.height = `${viewportHeight}px`
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(source, 0, 0)

        const scaleX = canvas.width / viewportWidth
        const scaleY = canvas.height / viewportHeight
        const sourceRect = anchor.getBoundingClientRect()
        const originX = clamp(event.clientX || sourceRect.left + sourceRect.width / 2, viewportWidth * 0.2, viewportWidth * 0.8)
        const originY = clamp(event.clientY || sourceRect.top + sourceRect.height / 2, viewportHeight * 0.25, viewportHeight * 0.75)

        setPhase('active')
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
        router.push(`${destination.pathname}${destination.search}${destination.hash}`)

        const startedAt = performance.now()
        let previousProgress = 0

        const animate = (time: number) => {
          const elapsed = time - startedAt
          const rawProgress = clamp(elapsed / 430, 0, 1)
          const progress = easeOutCubic(rawProgress)

          drawClawSegment(
            context,
            previousProgress,
            progress,
            viewportWidth,
            viewportHeight,
            scaleX,
            scaleY,
            originX,
            originY,
          )
          previousProgress = progress

          if (rawProgress < 1) {
            frameRef.current = requestAnimationFrame(animate)
            return
          }

          setPhase('leaving')
          window.setTimeout(() => {
            setPhase('idle')
            runningRef.current = false
          }, TRANSITION_MS - 430)
        }

        frameRef.current = requestAnimationFrame(animate)
      } catch {
        setPhase('idle')
        runningRef.current = false
        router.push(`${destination.pathname}${destination.search}${destination.hash}`)
      }
    }

    document.addEventListener('pointerover', preload, { passive: true })
    document.addEventListener('click', navigate, true)

    return () => {
      document.removeEventListener('pointerover', preload)
      document.removeEventListener('click', navigate, true)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [router])

  return (
    <div className="page-transition" data-phase={phase} aria-hidden="true">
      <div className="page-transition__wash" />
      <canvas ref={canvasRef} className="page-transition__canvas" />
    </div>
  )
}
