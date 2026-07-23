'use client'

import { useEffect } from 'react'

/**
 * Motion layer L3: Lenis smooth scroll + one scroll-driven world timeline.
 * Everything here is a post-LCP enhancement, dynamically imported so it
 * never touches the first-load bundle. Skipped entirely for
 * prefers-reduced-motion — the site stays fully readable without it.
 *
 * Targets:
 *  - Hero: watching cat -> ink gate
 *  - [data-chapter]: subtle shared-camera entrance
 *  - [data-split]: per-character masked ink reveal
 */
export function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('motion-ready')

    let disposed = false
    let cleanup: (() => void) | undefined

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
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      // wait for the mincho webfont so SplitText measures real glyphs
      await document.fonts.ready
      if (disposed) return

      const ctx = gsap.context(() => {
        const hero = document.querySelector<HTMLElement>('[data-hero-story]')
        if (hero) {
          const awake = hero.querySelector<HTMLElement>('.hero-awake')
          const title = hero.querySelector<HTMLElement>('[data-hero-title]')
          const details = hero.querySelectorAll<HTMLElement>('[data-hero-detail]')
          const art = hero.querySelector<HTMLElement>('[data-hero-art]')
          const ink = hero.querySelector<HTMLElement>('[data-hero-ink]')
          const kanji = hero.querySelector<HTMLElement>('[data-hero-kanji]')
          const gate = hero.querySelector<HTMLElement>('[data-hero-gate]')
          const gateLabel = hero.querySelector<HTMLElement>('[data-hero-gate-label]')

          gsap.set(gate, { autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' })
          gsap.set(gateLabel, { autoAlpha: 0, yPercent: 28 })

          const heroTl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.85,
              invalidateOnRefresh: true,
            },
          })

          heroTl
            .to(art, { scale: 1.055, xPercent: -1, duration: 0.58 }, 0.12)
            .to(ink, { scale: 1.08, rotate: 0.8, duration: 0.58 }, 0.12)
            .to(kanji, { xPercent: -5, yPercent: -3, rotate: -1.2, duration: 0.48 }, 0.2)
            .to(details, { autoAlpha: 0, y: -20, duration: 0.18, stagger: 0.016 }, 0.48)
            .to(title, { scale: 0.82, yPercent: -14, xPercent: -1, duration: 0.22 }, 0.48)
            .to(awake, { autoAlpha: 0, xPercent: 24, yPercent: 10, scale: 0.9, duration: 0.22 }, 0.5)
            .to(gate, { autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.22 }, 0.72)
            .to(gateLabel, { autoAlpha: 1, yPercent: 0, duration: 0.14, ease: 'power3.out' }, 0.84)
        }

        document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((chapter) => {
          gsap.fromTo(
            chapter,
            { y: 76, scale: 0.985, autoAlpha: 0.58 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: chapter,
                start: 'top 92%',
                end: 'top 38%',
                scrub: 0.7,
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

      cleanup = () => {
        ctx.revert()
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    })()

    return () => {
      disposed = true
      cleanup?.()
      document.documentElement.classList.remove('motion-ready')
    }
  }, [])

  return null
}
