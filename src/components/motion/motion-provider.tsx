'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'
import { chapterFrame, chapterLayout } from './chapter-frame'
import { installChapterLinkage } from './chapter-linkage'
import { installStreetSceneMotion } from './street-scene-motion'
import { useReducedMotion } from './use-reduced-motion'

/**
 * Progressive motion: native-sticky manga chapter cut + normal document scrolling.
 * Everything here is a post-LCP enhancement, dynamically imported so it
 * never touches the first-load bundle. Skipped entirely for
 * prefers-reduced-motion — the site stays fully readable without it.
 *
 * Targets:
 *  - Hero: reversible diagonal cut, keeping the watching cat unchanged
 *  - [data-chapter]: reversible heading + local red graphic entrance
 *  - [data-split]: per-character masked ink reveal
 */
export function MotionProvider() {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

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
      // Our cut fills the actual viewport, including after mobile browser chrome
      // changes height. Use ScrollTrigger's debounced resize refresh in that case.
      ScrollTrigger.config({ ignoreMobileResize: false })

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

      const ctx = gsap.context(() => {})
      disposers.push(() => ctx.revert())
      ctx.add(() => {
        const hero = document.querySelector<HTMLElement>('[data-manga-hero]')
        if (hero) {
          const scene = hero.querySelector<HTMLElement>('[data-hero-scene]')
          const stage = hero.querySelector<HTMLElement>('.manga-hero__stage')
          if (stage) {
            // All window sizes get the cut. Tall content is read in normal flow
            // before its final viewport sticks; no menu or cat is cropped away.
            const measure = () => {
              const layout = chapterLayout(stage.offsetHeight, window.innerHeight)
              hero.style.setProperty('--hero-height', `${layout.height}px`)
              hero.style.setProperty('--hero-sticky-top', `${layout.stickyTop}px`)
              hero.style.setProperty('--cut-height', `${window.innerHeight}px`)
              return layout
            }
            hero.setAttribute('data-scroll-cut', '')
            measure()
            const render = (progress: number) => {
              const frame = chapterFrame(progress)
              hero.style.setProperty('--hero-departure', String(frame.departure))
              hero.style.setProperty('--cut-x', `${frame.slash}%`)
              hero.style.setProperty('--cut-arrival', String(frame.arrival))
              hero.style.setProperty('--cut-word-shift', `${frame.wordShift}%`)
              if (scene) scene.inert = frame.departure === 1
            }
            const trigger = ScrollTrigger.create({
              trigger: hero,
              start: () => `top+=${measure().startOffset} top`,
              end: () => `+=${window.innerHeight}`,
              invalidateOnRefresh: true,
              onRefreshInit: measure,
              onUpdate: (self) => render(self.progress),
              onRefresh: (self) => render(self.progress),
            })
            render(trigger.progress)
            // Font/image changes and window resizing must remeasure the stage.
            let lastHeight = stage.offsetHeight
            const observer = new ResizeObserver(() => {
              if (lastHeight === stage.offsetHeight) return
              lastHeight = stage.offsetHeight
              ScrollTrigger.refresh()
            })
            observer.observe(stage)
            disposers.push(() => {
              observer.disconnect()
              trigger.kill()
              hero.removeAttribute('data-scroll-cut')
              for (const property of ['--hero-height', '--hero-sticky-top', '--cut-height', '--hero-departure', '--cut-x', '--cut-arrival', '--cut-word-shift']) hero.style.removeProperty(property)
              if (scene) scene.inert = false
            })
          }
        }

        disposers.push(installChapterLinkage({ ScrollTrigger }))
        disposers.push(installStreetSceneMotion(ScrollTrigger))

        document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          // Chapter headings share a reversible local timeline. A one-shot
          // character mask here would hide or fight their reverse entrance.
          if (el.closest('.manga-home [data-chapter-title]')) return
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
