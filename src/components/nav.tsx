'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { ThemeToggle } from './theme-toggle'
import { LocaleToggle } from './locale-toggle'
import { resolveMotionPreference } from './motion/motion-preference'
import { homeNavigation } from '@/content/site-navigation'
import { reconcilePalette } from './palette-store'
import './nav-manga.css'

const anchors = homeNavigation

export function Nav() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const savedMotionRef = useRef<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [systemReduced, setSystemReduced] = useState(false)

  useLayoutEffect(() => {
    reconcilePalette()
  }, [locale, pathname])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    try {
      savedMotionRef.current = localStorage.getItem('neko-motion')
    } catch { /* The in-session control still works when storage is unavailable. */ }

    const sync = () => {
      const reduced = resolveMotionPreference(savedMotionRef.current, media.matches)
      setReducedMotion(reduced)
      setSystemReduced(media.matches)
      document.documentElement.dataset.motion = reduced ? 'off' : 'on'
      window.dispatchEvent(new CustomEvent('neko:motion-change', { detail: { reduced } }))
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'neko-motion' && event.key !== null) return
      savedMotionRef.current = event.key === null ? null : event.newValue
      sync()
    }
    sync()
    media.addEventListener('change', sync)
    window.addEventListener('storage', onStorage)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    if (!drawer) return
    const previousOverflow = document.body.style.overflow
    const trigger = menuButtonRef.current
    document.body.style.overflow = 'hidden'
    const focusable = () => Array.from(drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), [tabindex="0"]',
    ))
    drawer.querySelector<HTMLElement>('nav a')?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const items = focusable()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !drawer.contains(event.target)) {
        focusable()[0]?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 960px)')
    const onResize = () => {
      if (desktop.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocus)
    desktop.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocus)
      desktop.removeEventListener('change', onResize)
      if (trigger?.getClientRects().length) trigger.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (pathname !== '/') {
      setActive('')
      return
    }

    const sections = anchors
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    if (sections.length === 0) return

    const visibleSections = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio)
          else visibleSections.delete(entry.target.id)
        }
        const visible = [...visibleSections].sort((a, b) => b[1] - a[1])[0]
        // A return above Works has no intersecting chapter; do not retain Contact.
        setActive(visible?.[0] ?? '')
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0.01, 0.2, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  const anchorHref = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`)
  const ja = locale === 'ja'
  const toggleMotion = () => {
    const system = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (system) return
    const saved = reducedMotion ? 'on' : 'off'
    savedMotionRef.current = saved
    try { localStorage.setItem('neko-motion', saved) } catch { /* Session only. */ }
    const reduced = resolveMotionPreference(saved, system)
    setReducedMotion(reduced)
    document.documentElement.dataset.motion = reduced ? 'off' : 'on'
    window.dispatchEvent(new CustomEvent('neko:motion-change', { detail: { reduced } }))
  }
  const motionButton = (
    <button
      type="button"
      className="manga-motion-toggle"
      aria-label={ja ? 'モーションを抑える' : 'Reduce motion'}
      aria-pressed={reducedMotion}
      disabled={systemReduced}
      title={systemReduced
        ? (ja ? '端末の設定でモーションが抑制されています' : 'Reduced motion is enabled in your system settings')
        : undefined}
      onClick={toggleMotion}
    >
      <span aria-hidden="true">{ja ? '動き' : 'MOTION'} {reducedMotion ? 'OFF' : 'ON'}</span>
    </button>
  )

  return (
    <header className="site-nav manga-nav fixed inset-x-0 top-0 z-40">
      <div className="manga-nav-bar">
        <Link
          href={pathname === '/' ? '#top' : '/#top'}
          className="manga-nav-identity flex items-center gap-3 text-ink no-underline"
          onClick={() => { setOpen(false); setActive('') }}
          aria-label={t('home')}
        >
          <span className="manga-nav-stamp font-mincho grid h-10 w-10 place-items-center text-[20px] font-bold">
            進
          </span>
          <span className="font-mincho text-[19px] font-extrabold tracking-[0.14em]">
            王家進
          </span>
        </Link>

        {/* desktop */}
        <nav className="manga-nav-desktop" aria-label={ja ? 'メインナビゲーション' : 'Main navigation'}>
          {anchors.map((a, i) => (
            <Link
              key={a.id}
              href={anchorHref(a.id)}
              aria-current={active === a.id ? 'location' : undefined}
              data-active={active === a.id}
              onClick={() => setActive(a.id)}
              className="nav-anchor"
            >
              <span className="manga-nav-index" aria-hidden="true">0{i + 1}</span>
              {t(a.key)}
            </Link>
          ))}
          <div className="manga-nav-controls">
            <LocaleToggle />
            <ThemeToggle />
            {motionButton}
          </div>
        </nav>

        {/* mobile controls */}
        <div className="manga-nav-mobile-controls">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
            className="manga-menu-toggle relative grid h-11 w-11 place-items-center border border-line"
          >
            <span
              className={`absolute h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? 'rotate-45' : '-translate-y-[5px]'
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-ink transition-all duration-300 ${
                open ? '-rotate-45' : 'translate-y-[5px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        id="mobile-navigation"
        data-lenis-prevent
        ref={drawerRef}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label={ja ? 'ナビゲーションメニュー' : 'Navigation menu'}
        aria-hidden={!open}
        inert={!open}
        data-open={open}
        className="manga-nav-drawer"
      >
        <button
          type="button"
          className="manga-menu-close"
          aria-label={t('closeMenu')}
          onClick={() => setOpen(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
        <p className="manga-drawer-caption" aria-hidden="true">INDEX / 目次</p>
        <nav aria-label={ja ? 'メインナビゲーション' : 'Main navigation'}>
        {anchors.map((a, i) => (
          <Link
            key={a.id}
            href={anchorHref(a.id)}
            onClick={() => { setOpen(false); setActive(a.id) }}
            aria-current={active === a.id ? 'location' : undefined}
            data-active={active === a.id}
            tabIndex={open ? 0 : -1}
            className="manga-drawer-link font-mincho"
          >
            <span className="manga-nav-index" aria-hidden="true">0{i + 1}</span>
            {t(a.key)}
          </Link>
        ))}
        </nav>
        <div className="manga-nav-controls" onClick={(event) => {
          if ((event.target as HTMLElement).closest('a[href]')) setOpen(false)
        }}>
          <LocaleToggle />
          <ThemeToggle />
          {motionButton}
        </div>
      </div>
    </header>
  )
}
