import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Reveal } from '../reveal'
import { WorldEntryContent } from './world-entry'
import './world-entry.css'
import './street-world.css'

/** An optional side quest; the pixel-town game loads only on /world. */
export async function WorldInvitation() {
  const ja = (await getLocale()) === 'ja'
  return (
    <aside id="explore" className="street-world" aria-labelledby="world-invitation-title">
      <Reveal>
        <Link href="/world" className="street-world__portal" data-canvas-transition>
          <WorldEntryContent ja={ja} />
        </Link>
      </Reveal>
    </aside>
  )
}
