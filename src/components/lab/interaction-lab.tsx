'use client'

import { useEffect, useRef, useState } from 'react'

export type InteractionLabLabels = {
  eyebrow: string
  title: string
  body: string
  pointerTitle: string
  pointerBody: string
  sealTitle: string
  sealBody: string
  sealAction: string
  motionTitle: string
  motionBody: string
  motionOn: string
  motionOff: string
}

export function InteractionLab({ labels }: { labels: InteractionLabLabels }) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const [stamped, setStamped] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const moveInk = (event: React.PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current
    if (!field || reducedMotion) return
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = field.getBoundingClientRect()
      field.style.setProperty('--lab-x', `${event.clientX - rect.left}px`)
      field.style.setProperty('--lab-y', `${event.clientY - rect.top}px`)
    })
  }

  return (
    <div className="interaction-lab">
      <div className="interaction-lab__intro">
        <p className="font-mono m-0 text-[10px] tracking-[0.22em] text-accent">
          {labels.eyebrow}
        </p>
        <h3 className="font-mincho m-0 mt-3 text-[clamp(24px,3.5vw,40px)] font-bold">
          {labels.title}
        </h3>
        <p className="m-0 mt-3 max-w-[52ch] text-[14px] text-muted">{labels.body}</p>
      </div>

      <div className="interaction-lab__grid">
        <div
          ref={fieldRef}
          onPointerMove={moveInk}
          className="lab-card lab-card--ink"
        >
          <span className="lab-card__index">01</span>
          <div>
            <h4 className="font-mincho m-0 text-[17px] font-bold">{labels.pointerTitle}</h4>
            <p className="m-0 mt-2 text-[12.5px] text-muted">{labels.pointerBody}</p>
          </div>
          <span className="lab-ink-orbit" aria-hidden="true" />
        </div>

        <button
          type="button"
          aria-pressed={stamped}
          onClick={() => setStamped((value) => !value)}
          className="lab-card lab-card--button text-left"
        >
          <span className="lab-card__index">02</span>
          <div>
            <h4 className="font-mincho m-0 text-[17px] font-bold">{labels.sealTitle}</h4>
            <p className="m-0 mt-2 text-[12.5px] text-muted">{labels.sealBody}</p>
          </div>
          <span className="lab-seal" data-stamped={stamped} aria-hidden="true">進</span>
          <span className="font-mono text-[9px] tracking-[0.16em] text-muted">
            {labels.sealAction}
          </span>
        </button>

        <div className="lab-card">
          <span className="lab-card__index">03</span>
          <div>
            <h4 className="font-mincho m-0 text-[17px] font-bold">{labels.motionTitle}</h4>
            <p className="m-0 mt-2 text-[12.5px] text-muted">{labels.motionBody}</p>
          </div>
          <span className="motion-status" data-off={reducedMotion}>
            <span aria-hidden="true" />
            {reducedMotion ? labels.motionOff : labels.motionOn}
          </span>
        </div>
      </div>
    </div>
  )
}
