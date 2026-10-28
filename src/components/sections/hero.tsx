import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CatCompanion } from '../motion/cat-companion'
import { ChapterTransition } from '../motion/chapter-transition'
import { ThemeCards } from '../theme-toggle'
import { WorldEntryContent } from './world-entry'
import './world-entry.css'

/** Generated paint alpha is tinted by theme; typography and controls remain real HTML. */
function TitleGraphics() {
  return (
    <div className="manga-hero__scenery" aria-hidden="true">
      <div className="manga-hero__paper-slice" />
      <div className="manga-hero__red" data-hero-slab>
        <span className="manga-hero__splash" />
      </div>
      <svg className="manga-hero__speedlines" viewBox="0 0 1440 800" preserveAspectRatio="none"><path d="M0 708 1440 237M0 724 1440 249M0 737 1440 257M164 0 1169 800M196 0 1191 800" /></svg>
      <span className="manga-hero__outline">PLAY</span>
      <span className="manga-hero__halftone" />
      <span className="manga-hero__star">✦</span>
    </div>
  )
}

export async function Hero() {
  const ja = (await getLocale()) === 'ja'
  const latest = [
    ['nyanko-home', ja ? 'にゃんこホーム' : 'Nyanko Home'],
    ['meme-clash', 'MEME CLASH'],
    ['park-master', 'PARK MASTER'],
    ['please-sit', ja ? 'どうぞ、おかけください。' : 'Please, Take a Seat.'],
    ['2048', ja ? '百鬼灯市' : 'Hyakki Lantern City'],
    ['tamago-exe', 'TAMAGO.exe'],
  ]
  return (
    <section id="top" className="manga-hero" data-manga-hero>
      <div className="manga-hero__stage">
        <TitleGraphics />
        <div className="manga-hero__layout" data-hero-scene>
          <div className="manga-hero__portrait-column">
            <div className="manga-hero__visual" data-hero-cat-scene>
              <span className="manga-cat-orbit" aria-hidden="true" />
              <CatCompanion className="manga-cat" />
              <span className="manga-cat-cross" aria-hidden="true">＋</span>
              <span className="manga-cat-label">YOUR GUIDE / NEKO</span>
            </div>
          </div>
          <div className="manga-hero__copy" data-hero-copy>
            <p className="manga-eyebrow"><span />KASHIN OU / CREATIVE DEVELOPER</p>
            <div className="manga-title-lockup">
              <h1 className="manga-hero__title" data-hero-title><span>KASHIN</span><strong>OU <i aria-hidden="true">×</i> PLAY</strong></h1>
              <p className="manga-hero__tagline">{ja ? '遊びをつくる。体験をつなぐ。' : 'MADE TO PLAY. BUILT TO CONNECT.'}</p>
            </div>
            <div className="manga-game-menu">
              <a className="manga-game-menu__primary" href="#works"><span aria-hidden="true">▶</span><b>SELECT WORKS</b><small>{ja ? '作品を見る' : 'MY PROJECTS'}</small><span aria-hidden="true">↗</span></a>
              <Link href="/world" className="world-entry--compact" data-canvas-transition><WorldEntryContent ja={ja} compact /></Link>
              <a href="#contact"><span aria-hidden="true">＋</span><b>LET’S TALK</b><small>{ja ? '連絡する' : 'GET IN TOUCH'}</small><span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="manga-hero__theme-dock">
            <p className="manga-theme-caption">CHOOSE YOUR VIBE <span>{ja ? '世界の色を選ぼう' : 'MAKE IT YOURS'}</span></p>
            <ThemeCards />
          </div>
          <div className="manga-latest">
            <p><span /> NOW PLAYING <small>{ja ? '公開中の作品' : 'PLAY & DISCOVER'}</small></p>
            {latest.map(([id, label], index) => <a key={id} href={`#featured-${id}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b><i aria-hidden="true">↗</i></a>)}
          </div>
        </div>
        <ChapterTransition ja={ja} />
      </div>
    </section>
  )
}
