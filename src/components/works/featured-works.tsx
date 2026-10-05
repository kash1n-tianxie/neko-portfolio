'use client'

import { useEffect, useRef, type PointerEvent } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { featuredWorks } from '@/content/featured-works'
import { ArrowUpRightIcon } from '@/components/ui/icons'

function NumberStudy() {
  return (
    <div className="featured-number-study" aria-hidden="true">
      <span className="featured-number-study__axis featured-number-study__axis--x" />
      <span className="featured-number-study__axis featured-number-study__axis--y" />
      <div className="featured-number-study__tiles">
        <span className="featured-number-study__tile featured-number-study__tile--two">2</span>
        <span className="featured-number-study__tile featured-number-study__tile--four">4</span>
        <span className="featured-number-study__tile featured-number-study__tile--eight">8</span>
        <span className="featured-number-study__tile featured-number-study__tile--goal">2048</span>
      </div>
      <span className="featured-number-study__coordinate">01 / NUMBER STUDY</span>
    </div>
  )
}

function EggStudy() {
  return (
    <div className="featured-egg-study" aria-hidden="true">
      <svg viewBox="0 0 480 420" fill="none" className="featured-egg-study__drawing">
        <ellipse cx="240" cy="230" rx="193" ry="73" className="featured-egg-study__orbit" transform="rotate(-22 240 230)" />
        <ellipse cx="240" cy="230" rx="174" ry="60" className="featured-egg-study__orbit" transform="rotate(24 240 230)" />
        <path d="M240 66C188 66 141 175 141 240C141 306 181 351 240 351C299 351 339 306 339 240C339 175 292 66 240 66Z" className="featured-egg-study__shell" />
        <path d="M240 66C206 89 188 160 188 240C188 303 207 342 240 351M240 66C274 89 292 160 292 240C292 303 273 342 240 351M240 66V351M151 190C196 212 284 212 329 190M141 249C184 269 296 269 339 249M155 302C197 315 283 315 325 302" className="featured-egg-study__contour" />
        <path d="M116 240H132M348 240H364M240 41V56M240 361V376" className="featured-egg-study__guides" />
        <circle cx="397" cy="186" r="4" className="featured-egg-study__point" />
      </svg>
      <span className="featured-egg-study__coordinate">02 / FORM STUDY</span>
    </div>
  )
}

export function FeaturedWorks({ locale }: { locale: 'ja' | 'en' }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.featured-work'))
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = false

    const render = () => {
      frame = 0
      if (!visible || motion.matches) return
      const viewport = window.innerHeight
      const positions = cards.map((card) => card.getBoundingClientRect())
      cards.forEach((card, index) => {
        const rect = positions[index]
        const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)))
        card.style.setProperty('--read-progress', String(progress))
        card.style.setProperty('--art-shift', `${(0.5 - progress) * 28}px`)
      })
    }
    const queue = () => {
      if (!frame && visible && !motion.matches) frame = window.requestAnimationFrame(render)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      queue()
    }, { rootMargin: '120px' })
    const resetMotion = () => {
      cards.forEach((card) => {
        card.style.removeProperty('--art-shift')
        card.style.removeProperty('--read-progress')
        card.style.removeProperty('--spot-x')
        card.style.removeProperty('--spot-y')
      })
      queue()
    }

    observer.observe(root)
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    motion.addEventListener('change', resetMotion)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      motion.removeEventListener('change', resetMotion)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div ref={rootRef} className="featured-works">
      <div className="featured-works__intro">
        <p className="featured-works__eyebrow">SELECTED WORKS / 01—02</p>
        <p>{locale === 'ja' ? '新しい遊びを、ここから。' : 'New worlds to discover.'}</p>
      </div>
      {featuredWorks.map((work) => (
        <article
          key={work.id}
          id={`featured-${work.id}`}
          className={`featured-work featured-work--${work.id}${work.status === 'LIVE' ? ' featured-work--released' : ''}`}
          aria-labelledby={`featured-title-${work.id}`}
          onPointerMove={followPointer}
        >
          <div className="featured-work__topline">
            <span className="featured-work__index">{work.index}<span> / FEATURED GAME</span></span>
            <span className="featured-work__status"><span aria-hidden="true" />{work.status === 'LIVE' ? work.releaseLabel[locale] : locale === 'ja' ? '制作中' : 'IN DEVELOPMENT'}</span>
          </div>
          <div className="featured-work__copy">
            <p className="featured-work__category">{work.category}</p>
            <h3 id={`featured-title-${work.id}`} className="featured-work__title">{work.title}</h3>
            <p className="featured-work__summary">{work.summary[locale]}</p>
            {work.slug && (
              <Link href={`/works/${work.slug}`} className="featured-work__action">
                {locale === 'ja' ? '作品を見る・遊ぶ' : 'Explore & play'}
                <ArrowUpRightIcon className="h-5 w-5" />
              </Link>
            )}
            <div className="featured-work__note">
              <span className="featured-work__note-mark" aria-hidden="true">＋</span>
              <p>{work.note[locale]}</p>
            </div>
          </div>
          <div className="featured-work__visual">
            <div className="featured-work__art">
              {work.cover && work.slug ? (
                <Link href={`/works/${work.slug}`} className="featured-work__cover" aria-label={locale === 'ja' ? `${work.title}の作品紹介とゲームへ` : `Explore and play ${work.title}`}>
                  <Image src={work.cover} alt={work.coverAlt[locale]} width={1408} height={1117} sizes="(max-width: 767px) 90vw, 55vw" />
                </Link>
              ) : work.id === '2048' ? <NumberStudy /> : <EggStudy />}
            </div>
            <p className="featured-work__visual-label">
              <span>{work.cover ? work.visualLabel : 'VISUAL IN PREPARATION'}</span>
              <span>{work.cover ? (locale === 'ja' ? '実際のゲーム画面と遊び方は作品ページへ' : 'Real screenshots and how to play on the project page') : (locale === 'ja' ? '仮ビジュアル / 実際のゲーム画面ではありません' : 'Placeholder study / not gameplay')}</span>
            </p>
          </div>
          <div className="featured-work__read-line" aria-hidden="true"><span /></div>
        </article>
      ))}
    </div>
  )
}
