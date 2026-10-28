import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowUpRightIcon } from '../ui/icons'
import { Reveal } from '../reveal'
import './home-editorial.css'

/** A light invitation; the playable pixel town only loads on /world. */
export async function WorldInvitation() {
  const ja = (await getLocale()) === 'ja'
  return (
    <section id="explore" className="world-invitation" aria-labelledby="world-invitation-title">
      <Reveal>
        <div className="world-invitation__frame">
          <div className="world-invitation__copy">
            <div className="world-invitation__kicker"><span className="editorial-dot" aria-hidden="true" /> ANOTHER WAY TO EXPLORE</div>
            <h2 id="world-invitation-title">{ja ? <>少し、<br />寄り道しませんか。</> : <>A small detour.<br />A different view.</>}</h2>
            <p>{ja ? '小さな猫になって、ピクセルの町をのんびりお散歩。住民に話しかけたり、池で釣りをしたり。町にかくれた6つの作品の便りを見つけて、手帳に集めよう。' : 'Become a little cat and wander through a cozy pixel town. Meet the neighbors, fish at the pond, and collect six project stories in your journal.'}</p>
            <Link href="/world" className="cta" data-canvas-transition>{ja ? 'ねこの町へ' : 'Enter the town'}<ArrowUpRightIcon className="h-4 w-4" /></Link>
            <div className="world-invitation__meta"><span>PIXEL TOWN / INTERACTIVE</span><span>{ja ? 'キーボード・タッチ対応' : 'KEYBOARD & TOUCH'}</span></div>
          </div>
          <div className="world-invitation__art" aria-hidden="true">
            <div className="world-invitation__art-label"><span>NEKO TOWN</span><span>7 LITTLE DISCOVERIES</span></div>
            <Image className="world-invitation__pixel-map" src="/assets/world/pixel-town.png" alt="" width={768} height={512} unoptimized />
            <span className="world-invitation__art-note">A SMALL TOWN. A LITTLE CURIOSITY.</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
