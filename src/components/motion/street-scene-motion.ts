import type { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger'
import { streetSceneFrame } from './street-scene-frame'
import './street-scene-motion.css'

/** Only decorative paint moves. Headings, links and media stay in normal document flow. */
export function installStreetSceneMotion(ScrollTrigger: typeof ScrollTriggerPlugin) {
  const cleanups: Array<() => void> = []
  document.querySelectorAll<HTMLElement>('.manga-home [data-street-scene]').forEach(scene => {
    const properties = ['--street-drift-x', '--street-drift-y'] as const
    const previous = properties.map(name => [name, scene.style.getPropertyValue(name)] as const)
    const render = (progress: number) => {
      const frame = streetSceneFrame(progress, window.innerWidth)
      scene.style.setProperty(properties[0], `${frame.x}px`)
      scene.style.setProperty(properties[1], `${frame.y}px`)
    }
    const trigger = ScrollTrigger.create({
      trigger: scene,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => render(self.progress),
      onRefresh: self => render(self.progress),
    })
    render(trigger.progress)
    cleanups.push(() => {
      trigger.kill()
      for (const [name, value] of previous) {
        if (value) scene.style.setProperty(name, value)
        else scene.style.removeProperty(name)
      }
    })
  })
  return () => cleanups.reverse().forEach(cleanup => cleanup())
}
