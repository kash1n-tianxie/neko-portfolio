'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { ThemeToggle } from './theme-toggle'
import { LocaleToggle } from './locale-toggle'

const anchors = [
  { id: 'works', key: 'works' },
  { id: 'skills', key: 'skills' },
  { id: 'about', key: 'about' },
  { id: 'contact', key: 'contact' },
] as const

export function Nav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !open) return
      setOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0.01, 0.2, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  const anchorHref = (id: string) => (pathname === '/' ? `#${id}` : `/#${id}`)

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-40">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/85 to-transparent"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between px-[clamp(20px,5vw,64px)] py-5">
        <Link
          href={pathname === '/' ? '#top' : '/#top'}
          className="flex items-center gap-3 text-ink no-underline"
          onClick={() => setOpen(false)}
          aria-label={t('home')}
        >
          <span className="font-mincho grid h-9 w-9 place-items-center rounded-[4px] bg-accent text-[19px] font-bold text-white">
            進
          </span>
          <span className="font-mincho text-[19px] font-extrabold tracking-[0.14em]">
            王家進
          </span>
        </Link>

        {/* desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {anchors.map((a) => (
            <Link
              key={a.id}
              href={anchorHref(a.id)}
              aria-current={active === a.id ? 'location' : undefined}
              data-active={active === a.id}
              className="nav-anchor"
            >
              {t(a.key)}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </nav>

        {/* mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-line"
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
        aria-hidden={!open}
        className={`fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-10 bg-bg transition-[opacity,visibility] duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {anchors.map((a, i) => (
          <Link
            key={a.id}
            href={anchorHref(a.id)}
            onClick={() => setOpen(false)}
            aria-current={active === a.id ? 'location' : undefined}
            tabIndex={open ? 0 : -1}
            className={`font-mincho text-[32px] font-bold tracking-[0.2em] text-ink no-underline transition-[opacity,transform] duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? `${i * 70 + 80}ms` : '0ms' }}
          >
            {t(a.key)}
          </Link>
        ))}
        <div
          className={`mt-4 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: open ? '320ms' : '0ms' }}
        >
          <LocaleToggle />
        </div>
      </div>
    </header>
  )
}
