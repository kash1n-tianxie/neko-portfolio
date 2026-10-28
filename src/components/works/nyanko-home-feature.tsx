import { AnimatedWorkCover } from './animated-work-cover'
import { Link } from '@/i18n/navigation'
import { nyankoHomeGame, nyankoHomeWork } from '@/content/nyanko-home'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './nyanko-home.css'

export function NyankoHomeFeature({ locale, index = 1, hideIntro = false }: { locale: 'ja' | 'en'; index?: number; hideIntro?: boolean }) {
  const ja = locale === 'ja'
  return (
    <div className="nyanko-home-feature">
      {!hideIntro && <div className="featured-works__intro">
        <p className="featured-works__eyebrow">SELECTED WORKS / 01—06</p>
        <p>{ja ? '新しい遊びを、ここから。' : 'New worlds to discover.'}</p>
      </div>}
      <article id="featured-nyanko-home" className="featured-work featured-work--released featured-work--nyanko-home" aria-labelledby="nyanko-home-feature-title">
        <div className="featured-work__topline">
          <span className="featured-work__index">{String(index).padStart(2, '0')}<span>/ FEATURED GAME</span></span>
          <span className="featured-work__status"><span aria-hidden="true" />v{nyankoHomeGame.version}</span>
        </div>
        <div className="featured-work__copy">
          <p className="featured-work__category">NYANKO HOME / CATS & DRIED FISH</p>
          <h3 id="nyanko-home-feature-title" className="featured-work__title" lang="ja">にゃんこ<br />ホーム</h3>
          <p className="featured-work__summary">{nyankoHomeWork.summary[locale]}</p>
          <Link href={`/works/${nyankoHomeGame.slug}`} className="featured-work__action">
            {ja ? '作品を見る・遊ぶ' : 'Explore & play'}<ArrowUpRightIcon className="h-5 w-5" />
          </Link>
          <div className="featured-work__note">
            <span className="featured-work__note-mark" aria-hidden="true">＋</span>
            <p>{ja ? '日本語版をitch.ioで公開中。干物を合成し、仲間を増やして、盗まれた月を取り戻そう。' : 'Available on itch.io in Japanese and Simplified Chinese. Merge fish, recruit cats, and bring the moon home.'}</p>
          </div>
        </div>
        <div className="featured-work__visual">
          <Link href={`/works/${nyankoHomeGame.slug}`} className="featured-work__cover" aria-label={ja ? 'にゃんこホームの作品紹介へ' : 'Explore Nyanko Home'}>
            <AnimatedWorkCover src={nyankoHomeGame.coverGif} fallback={nyankoHomeGame.cover} alt={ja ? 'にゃんこホーム。ネコと干物で家財の敵を迎え撃つ防衛ゲーム' : 'Nyanko Home: cats and dried fish defend against household enemies'} width={1280} height={720} sizes="(max-width: 767px) 90vw, 55vw" />
          </Link>
          <p className="featured-work__visual-label"><span>{nyankoHomeWork.coverCaption?.[locale]}</span><span>{ja ? '6匹のネコ、月ひとつ。' : 'Six cats. One missing moon.'}</span></p>
        </div>
      </article>
    </div>
  )
}
