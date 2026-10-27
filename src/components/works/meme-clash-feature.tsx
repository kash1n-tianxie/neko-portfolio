import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { memeClashGame, memeClashWork } from '@/content/meme-clash'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './please-sit-experience.css'
import './meme-clash.css'

export function MemeClashFeature({ locale, index = 2 }: { locale: 'ja' | 'en'; index?: number }) {
  const ja = locale === 'ja'
  return (
    <div className="please-sit-feature meme-clash-feature">
      <article id="featured-meme-clash" className="please-sit-feature__card" aria-labelledby="meme-clash-feature-title">
        <div className="please-sit-feature__topline">
          <span>{String(index).padStart(2, '0')} <span>/ FEATURED GAME</span></span>
          <span>{ja ? '制作中・無料体験版' : 'IN DEVELOPMENT · FREE DEMO'} · v{memeClashGame.version}</span>
        </div>
        <div className="please-sit-feature__copy">
          <p className="please-sit-kicker">MEME CLASH / 2D FIGHTING</p>
          <h3 id="meme-clash-feature-title">ミーム大乱闘<span className="meme-clash-feature__punctuation" aria-hidden="true">？！</span></h3>
          <p className="please-sit-feature__summary">{memeClashWork.summary[locale]}</p>
          <Link href={`/works/${memeClashGame.slug}`} className="featured-work__action">
            {ja ? '作品を見る・遊ぶ' : 'Explore & play'}<ArrowUpRightIcon className="h-5 w-5" />
          </Link>
          <p className="please-sit-feature__note">{ja ? '日本語版・PCキーボード操作。初回読み込みは約500 MB。まずはトレーニングで一撃ずつ。' : 'Japanese interface. Desktop keyboard required. Initial download: about 500 MB. Start one move at a time in training.'}</p>
        </div>
        <div className="please-sit-feature__visual">
          <Link href={`/works/${memeClashGame.slug}`} aria-label={ja ? 'ミーム大乱闘の作品ページへ' : 'Explore MEME CLASH'}>
            <Image src={memeClashGame.cover} alt={ja ? 'ミーム大乱闘 v0.39.0の実際のタイトル画面' : 'The actual title screen of MEME CLASH v0.39.0'} width={1280} height={720} sizes="(max-width: 767px) 90vw, 55vw" />
          </Link>
          <p>ACTUAL GAME CAPTURE <span>／ v{memeClashGame.version}</span></p>
        </div>
      </article>
    </div>
  )
}
