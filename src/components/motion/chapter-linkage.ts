import type { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger'
import { chapterLinkageFrame } from './chapter-linkage-frame'
import './chapter-linkage.css'

type ChapterLinkageOptions = {
  ScrollTrigger: typeof ScrollTriggerPlugin
  root?: ParentNode
}

/** Install inside the homepage's GSAP context; call the returned cleanup on exit. */
export function installChapterLinkage({ ScrollTrigger, root = document }: ChapterLinkageOptions) {
  const disposers: Array<() => void> = []
  const titles = root.querySelectorAll<HTMLElement>('.manga-home [data-chapter] h2[data-chapter-title]')

  titles.forEach((title, index) => {
    // The wrapper stays still: measuring the transformed h2 would move the trigger
    // itself on refresh. Its old one-time reveal is replaced by reversible motion.
    const anchor = title.closest<HTMLElement>('.reveal') ?? title.parentElement
    if (!anchor || anchor.classList.contains('chapter-linkage-anchor')) return

    const motif = document.createElement('div')
    motif.className = 'chapter-linkage-motif'
    motif.setAttribute('aria-hidden', 'true')
    const number = document.createElement('span')
    number.textContent = String(index + 1).padStart(2, '0')
    motif.append(number)
    anchor.append(motif)
    anchor.classList.add('chapter-linkage-anchor')
    title.classList.add('chapter-linked-title')

    const properties = [
      '--chapter-title-x', '--chapter-title-y', '--chapter-title-rotate',
      '--chapter-motif-x', '--chapter-motif-y', '--chapter-motif-rotate', '--chapter-motif-opacity',
    ] as const
    const previous = properties.map(property => ({
      property,
      value: anchor.style.getPropertyValue(property),
      priority: anchor.style.getPropertyPriority(property),
    }))

    const render = (progress: number) => {
      const frame = chapterLinkageFrame(progress, window.innerWidth)
      const values = [
        `${frame.headingX}px`, `${frame.headingY}px`, `${frame.headingRotate}deg`,
        `${frame.motifX}px`, `${frame.motifY}px`, `${frame.motifRotate}deg`, String(frame.motifOpacity),
      ]
      properties.forEach((property, i) => anchor.style.setProperty(property, values[i]))
    }

    const trigger = ScrollTrigger.create({
      trigger: anchor,
      start: 'top 92%',
      end: 'top 38%',
      onUpdate: self => render(self.progress),
      onRefresh: self => render(self.progress),
    })
    render(trigger.progress)

    disposers.push(() => {
      trigger.kill()
      motif.remove()
      anchor.classList.remove('chapter-linkage-anchor')
      title.classList.remove('chapter-linked-title')
      for (const { property, value, priority } of previous) {
        if (value) anchor.style.setProperty(property, value, priority)
        else anchor.style.removeProperty(property)
      }
    })
  })

  return () => disposers.reverse().forEach(dispose => dispose())
}
