'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

/** Count 0 -> target once the element scrolls in. Instant for reduced motion. */
function useCountUp(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    let start = 0
    const run = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(run)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          raf = requestAnimationFrame(run)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration])

  return { ref, value }
}

export type Stat = { value: number; suffix?: string; label: string }

/** A band of real, countable facts that tick up when scrolled into view. */
export function SkillStats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="skill-stats">
      {stats.map((s, i) => (
        <StatTile key={i} stat={s} />
      ))}
    </dl>
  )
}

function StatTile({ stat }: { stat: Stat }) {
  const { ref, value } = useCountUp(stat.value)
  return (
    <div className="skill-stats__tile">
      <dd className="skill-stats__num">
        <span ref={ref}>{value}</span>
        {stat.suffix ? <em className="skill-stats__suffix">{stat.suffix}</em> : null}
      </dd>
      <dt className="skill-stats__label">{stat.label}</dt>
    </div>
  )
}

/** Per-category ink meter: bar soaks to `level`% and the number counts up. */
export function SkillBar({ level, label }: { level: number; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const { ref, value } = useCountUp(level, 1100)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="skill-bar" ref={wrapRef}>
      <div className="skill-bar__head">
        <span className="skill-bar__label">{label}</span>
        <span className="skill-bar__val">
          <span ref={ref}>{value}</span>
          <em>%</em>
        </span>
      </div>
      <div className="skill-bar__track">
        <span className="skill-bar__fill" style={{ '--lv': `${level}%` } as CSSProperties} />
      </div>
    </div>
  )
}
