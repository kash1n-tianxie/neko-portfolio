'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import { getCurtainOutcome, getTransitionDestination } from './route-curtain'
import './route-curtain.css'

const MAX_WAIT_MS = 10000
const REVEAL_MS = 360
const TRANSITION_SELECTOR = 'a[data-canvas-transition]'

type PendingRoute = {
  originPath: string
  destinationPath: string
  waitForWorld: boolean
  startedAt: number
  readyPath: string | null
}

export function CanvasPageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const checkRouteRef = useRef<(path: string) => void>(() => {})
  const [phase, setPhase] = useState<'idle' | 'active' | 'leaving'>('idle')

  useEffect(() => {
    const root = document.documentElement
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timers = new Set<number>()
    const frames = new Set<number>()
    let pending: PendingRoute | null = null
    let running = false
    let revealing = false

    const motionDisabled = () => motionQuery.matches || root.dataset.motion === 'off'
    const clearScheduled = () => {
      timers.forEach((id) => window.clearTimeout(id))
      frames.forEach((id) => cancelAnimationFrame(id))
      timers.clear()
      frames.clear()
    }
    const after = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        callback()
      }, delay)
      timers.add(id)
    }
    const nextFrame = (callback: () => void) => {
      const id = requestAnimationFrame(() => {
        frames.delete(id)
        callback()
      })
      frames.add(id)
    }
    const reset = () => {
      clearScheduled()
      pending = null
      running = false
      revealing = false
      setPhase('idle')
    }
    const uncover = (immediate = false) => {
      if (immediate || motionDisabled()) {
        reset()
        return
      }
      if (revealing) return
      revealing = true
      clearScheduled()
      pending = null
      // Let the browser paint the rendered world frame before revealing it.
      nextFrame(() => nextFrame(() => {
        setPhase('leaving')
        after(reset, REVEAL_MS)
      }))
      // RAF can pause in a background tab; the curtain still has a finite lifetime.
      after(reset, REVEAL_MS + 500)
    }
    const check = (currentPath = window.location.pathname, failed = false) => {
      if (!pending) return
      const outcome = getCurtainOutcome({
        ...pending,
        currentPath,
        elapsedMs: performance.now() - pending.startedAt,
        timeoutMs: MAX_WAIT_MS,
        failed,
      })
      if (outcome !== 'pending') uncover(outcome !== 'ready')
    }

    checkRouteRef.current = (path) => {
      if (pending && path !== pending.originPath && path !== pending.destinationPath) {
        reset()
        return
      }
      if (pending) pending.readyPath = root.dataset.worldReady ?? pending.readyPath
      check(path)
    }

    const navigate = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest<HTMLAnchorElement>(TRANSITION_SELECTOR)
      if (!anchor) return
      const destination = getTransitionDestination({
        currentHref: window.location.href,
        href: anchor.href,
        target: anchor.target,
        download: anchor.hasAttribute('download'),
        defaultPrevented: event.defaultPrevented,
        button: event.button,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      })
      if (!destination || motionDisabled()) return

      event.preventDefault()
      event.stopPropagation()
      if (running) return
      running = true
      const destinationPath = new URL(destination, window.location.href).pathname
      pending = {
        originPath: window.location.pathname,
        destinationPath,
        waitForWorld: /\/world\/?$/.test(destinationPath),
        startedAt: performance.now(),
        readyPath: root.dataset.worldReady ?? null,
      }
      // No capture, font wait, or network dependency before the visual response.
      flushSync(() => setPhase('active'))
      after(() => uncover(true), MAX_WAIT_MS)
      try {
        router.push(destination)
      } catch {
        reset()
        window.location.assign(destination)
      }
    }
    const onWorldReady = (event: Event) => {
      if (!pending) return
      const path = (event as CustomEvent<{ pathname: string }>).detail?.pathname
      pending.readyPath = path ?? root.dataset.worldReady ?? null
      check()
    }
    const onWorldError = (event: Event) => {
      const path = (event as CustomEvent<{ pathname: string }>).detail?.pathname
      if (pending && path === pending.destinationPath) check(window.location.pathname, true)
    }
    const updateMotion = () => { if (motionDisabled()) reset() }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && running) reset() }
    const onPageHide = () => reset()
    const observer = new MutationObserver(updateMotion)
    observer.observe(root, { attributes: true, attributeFilter: ['data-motion'] })
    motionQuery.addEventListener('change', updateMotion)
    window.addEventListener('neko:motion-change', updateMotion)
    window.addEventListener('neko:world-ready', onWorldReady)
    window.addEventListener('neko:world-error', onWorldError)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', navigate, true)

    return () => {
      clearScheduled()
      checkRouteRef.current = () => {}
      observer.disconnect()
      motionQuery.removeEventListener('change', updateMotion)
      window.removeEventListener('neko:motion-change', updateMotion)
      window.removeEventListener('neko:world-ready', onWorldReady)
      window.removeEventListener('neko:world-error', onWorldError)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', navigate, true)
    }
  }, [router])

  useEffect(() => { checkRouteRef.current(pathname) }, [pathname])

  return (
    <div className="route-curtain" data-phase={phase} aria-hidden="true">
      <div className="route-curtain__ink" />
      <div className="route-curtain__paper" />
      <span className="route-curtain__mark">猫</span>
      <span className="route-curtain__index">NEXT CHAPTER / NEKO WORLD</span>
    </div>
  )
}
