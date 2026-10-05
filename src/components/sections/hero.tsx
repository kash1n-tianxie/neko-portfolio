import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AssetSlot } from '../asset-slot'
import { CatCompanion } from '../motion/cat-companion'
import { ArrowUpRightIcon } from '../ui/icons'
import './home-editorial.css'
import '../works/please-sit-experience.css'

export async function Hero() {
  const t = await getTranslations('hero')
  const ja = (await getLocale()) === 'ja'

  return (
    <section id="top" className="hero-story editorial-hero" data-hero-story>
      <div className="hero-stage editorial-hero__stage" data-hero-stage>
        <div className="hero-ink absolute inset-0" data-hero-ink aria-hidden="true" />
        <div className="hero-art absolute inset-0" data-hero-art aria-hidden="true">
          <AssetSlot silent src="/assets/ink/ink-hero.webp" spec="" className="h-full w-full object-cover" />
        </div>
        <div className="editorial-hero__grid" aria-hidden="true" />

        <div className="hero-copy editorial-hero__copy" data-hero-copy>
          <p className="editorial-eyebrow hero-enter" data-hero-detail>
            <span className="editorial-dot" aria-hidden="true" />
            KASHIN OU <span className="editorial-eyebrow__divider">/</span> CREATIVE DEVELOPER
          </p>
          <h1 className="hero-title editorial-hero__title hero-enter" data-hero-title>
            {ja ? <><span>遊びをつくる。</span><span>体験を<span className="editorial-hero__accent">つなぐ。</span></span></> : <><span>Made to play.</span><span>Built to <span className="editorial-hero__accent">connect.</span></span></>}
          </h1>
          <div className="editorial-hero__intro hero-enter" data-hero-detail>
            <p className="editorial-hero__name">王家進 <span>— KASHIN OU</span></p>
            <p>{ja ? 'ゲームの仕組みから、画面の小さな反応まで。数理と遊び心で、触れてみたくなる体験をつくっています。' : 'From game systems to the smallest response on screen. I build playful experiences through code, mathematics, and curiosity.'}</p>
          </div>
          <div className="editorial-hero__actions hero-enter" data-hero-detail>
            <a href="#works" className="cta editorial-primary">{t('ctaWorks')}<span aria-hidden="true">↓</span></a>
            <Link href="/world" data-canvas-transition className="editorial-world-link">{ja ? '猫になって、散歩する' : 'Take a walk as a cat'}<ArrowUpRightIcon className="h-4 w-4" /><span className="editorial-world-link__badge">3D</span></Link>
          </div>
        </div>

        <div className="editorial-hero__orbit" aria-hidden="true"><span /><span /></div>
        <span className="hero-kanji editorial-hero__kanji" data-hero-kanji aria-hidden="true">猫</span>
        <CatCompanion bodySrc="/assets/cat/cat-awake.png" className="hero-awake editorial-hero__cat" />
        <div className="editorial-hero__cat-caption" data-hero-detail>
          <span>YOUR GUIDE / NEKO</span>
          <span>{ja ? '目が合ったら、はじまり。' : 'A little curiosity starts here.'}</span>
        </div>

        <div className="editorial-current editorial-current--three" data-hero-detail>
          <p><span className="editorial-dot" aria-hidden="true" /> LATEST GAMES <small>{ja ? '公開・制作中の作品' : 'PLAY & DISCOVER'}</small></p>
          <a href="#featured-please-sit"><span>01</span>{ja ? 'どうぞ、おかけください。' : 'Please, Take a Seat.'}<span aria-hidden="true">↘</span></a>
          <a href="#featured-2048"><span>02</span>{ja ? '百鬼灯市' : 'Hyakki Lantern City'}<span aria-hidden="true">↘</span></a>
          <a href="#featured-tamago-exe"><span>03</span>tamago.exe<span aria-hidden="true">↘</span></a>
        </div>
      </div>
    </section>
  )
}
