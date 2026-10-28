import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowUpRightIcon } from '../ui/icons'
import { Reveal } from '../reveal'
import './street-world.css'

/** An optional side quest; the pixel-town game loads only on /world. */
export async function WorldInvitation() {
  const ja = (await getLocale()) === 'ja'
  return (
    <aside id="explore" className="street-world" aria-labelledby="world-invitation-title">
      <Reveal>
        <Link href="/world" className="street-world__portal" data-canvas-transition>
          <span className="street-world__paint" aria-hidden="true" />
          <span className="street-world__index">BONUS STAGE / PIXEL TOWN</span>
          <div className="street-world__title">
            <h2 id="world-invitation-title">SIDE <span>QUEST</span></h2>
            <p>{ja ? 'この画面の、向こう側へ。' : 'Step beyond the screen.'}</p>
          </div>
          <div className="street-world__action">
            <span>{ja ? '小さな猫になって、町を冒険しよう。' : 'Explore a cozy pixel town as a curious little cat.'}</span>
            <b>ENTER THE WORLD <ArrowUpRightIcon /></b>
            <small>{ja ? 'キーボード・タッチ対応' : 'KEYBOARD & TOUCH'}</small>
          </div>
        </Link>
      </Reveal>
    </aside>
  )
}
