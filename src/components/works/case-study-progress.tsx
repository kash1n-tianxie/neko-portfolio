'use client'

import { useEffect, useRef } from 'react'

export function CaseStudyProgress({ label }: { label: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
        const value = Math.round(progress * 100)
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
        if (valueRef.current) valueRef.current.textContent = `${value}%`
        rootRef.current?.setAttribute('aria-valuenow', String(value))
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={rootRef} className="case-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <span ref={barRef} className="case-progress__bar" />
      <span className="case-progress__label">
        {label}
        <span ref={valueRef}>0%</span>
      </span>
    </div>
  )
}
