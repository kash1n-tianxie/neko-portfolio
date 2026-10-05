'use client'

import { useEffect, useState } from 'react'
import { usePathname } from '@/i18n/navigation'

/**
 * Motion layer L3: Lenis smooth scroll + one scroll-driven world timeline.
 * Everything here is a post-LCP enhancement, dynamically imported so it
 * never touches the first-load bundle. Skipped entirely for
 * prefers-reduced-motion — the site stays fully readable without it.
 *
 * Targets:
 *  - Hero: watching cat and restrained artwork parallax
 *  - [data-chapter]: subtle shared-camera entrance
 *  - [data-split]: per-character masked ink reveal
 */
export function MotionProvider() {
  const pathname = usePathname()
  const [reducedMotion, setReducedMotion] = useState(true)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (pathname === '/world' || reducedMotion) return
    document.documentElement.classList.add('motion-ready')

    let disposed = false
    const disposers: Array<() => void> = []
    const cleanup = () => {
      if (disposed) return
      disposed = true
      for (const dispose of disposers.reverse()) dispose()
      document.documentElement.classList.remove('motion-ready')
    }

    ;(async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }] =
        await Promise.all([
          import('lenis'),
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('gsap/SplitText'),
          import('gsap/DrawSVGPlugin'),
        ])
      if (disposed) return

      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin)

      const lenis = new Lenis({ lerp: 0.12, anchors: true })
      disposers.push(() => lenis.destroy())
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      disposers.push(() => gsap.ticker.remove(tick))
      gsap.ticker.lagSmoothing(0)

      // wait for the mincho webfont so SplitText measures real glyphs
      await document.fonts.ready
      if (disposed) return

      const media = gsap.matchMedia()
      disposers.push(() => media.revert())
      const ctx = gsap.context(() => {})
      disposers.push(() => ctx.revert())
      ctx.add(() => {
        const hero = document.querySelector<HTMLElement>('[data-hero-story]')
        if (hero) {
          const awake = hero.querySelector<HTMLElement>('.hero-awake')
          const title = hero.querySelector<HTMLElement>('[data-hero-title]')
          const details = hero.querySelectorAll<HTMLElement>('[data-hero-detail]')
          const art = hero.querySelector<HTMLElement>('[data-hero-art]')
          const ink = hero.querySelector<HTMLElement>('[data-hero-ink]')
          const kanji = hero.querySelector<HTMLElement>('[data-hero-kanji]')
          // Keep the short desktop departure local to the artwork. Mobile scrolls normally.
          media.add('(min-width: 768px)', () => {
            const heroTl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            })

            heroTl
              .to(art, { scale: 1.04, duration: 1 }, 0)
              .to(ink, { autoAlpha: 0.65, duration: 1 }, 0)
              .to(kanji, { yPercent: -4, duration: 1 }, 0)
              .to(details, { autoAlpha: 0.5, y: -8, duration: 0.5 }, 0.5)
              .to(title, { y: -18, duration: 1 }, 0)
              .to(awake, { y: -12, scale: 0.97, duration: 1 }, 0)
          })
        }

        // Animate headings, never a whole long chapter or footer: transforms distort
        // scroll limits and can leave the footer unreachable with smooth scrolling.
        document.querySelectorAll<HTMLElement>('[data-chapter] > div > h2').forEach((chapter) => {
          gsap.fromTo(
            chapter,
            { y: 18, autoAlpha: 0.7 },
            {
              y: 0,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top 92%',
                end: 'top 38%',
                scrub: 0.4,
              },
            },
          )
        })

        document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          const split = new SplitText(el, { type: 'chars', mask: 'chars' })
          gsap.from(split.chars, {
            yPercent: 112,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        // 一筆 — brush underlines drawn stroke-by-stroke on scroll-in
        document.querySelectorAll<SVGElement>('.brush-underline').forEach((svg) => {
          const paths = svg.querySelectorAll<SVGPathElement>('[data-brush-path]')
          gsap.fromTo(
            paths,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              autoRound: false,
              visibility: 'visible',
              duration: 0.9,
              ease: 'power2.out',
              stagger: 0.12,
              scrollTrigger: { trigger: svg, start: 'top 90%', once: true },
            },
          )
        })

        // 円相 — the ensō circle drawn as one continuous brush pass
        document.querySelectorAll<SVGPathElement>('[data-enso-path]').forEach((path) => {
          gsap.fromTo(
            path,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              visibility: 'visible',
              duration: 1.6,
              ease: 'power1.inOut',
              scrollTrigger: { trigger: path, start: 'top 88%', once: true },
            },
          )
        })

        ScrollTrigger.refresh()
      })
    })().catch(() => {
      // Failed optional enhancements must restore the readable static page.
      cleanup()
    })

    return cleanup
  }, [pathname, reducedMotion])

  return null
}
