import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { pleaseSitGame, pleaseSitWork } from '@/content/please-take-a-seat'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './please-sit-experience.css'

export function PleaseSitFeature({ locale }: { locale: 'ja' | 'en' }) {
  const ja = locale === 'ja'
  return (
    <div className="please-sit-feature">
      <div className="featured-works__intro">
        <p className="featured-works__eyebrow">SELECTED WORKS / 01—03</p>
        <p>{ja ? '新しい遊びを、ここから。' : 'New worlds to discover.'}</p>
      </div>
      <article id="featured-please-sit" className="please-sit-feature__card" aria-labelledby="please-sit-feature-title">
        <div className="please-sit-feature__topline">
          <span>01 <span>/ FEATURED GAME</span></span>
          <span>{ja ? '無料ブラウザ版' : 'FREE BROWSER GAME'} · v{pleaseSitGame.version}</span>
        </div>
        <div className="please-sit-feature__copy">
          <p className="please-sit-kicker">PLEASE, TAKE A SEAT.</p>
          <h3 id="please-sit-feature-title"><span>どうぞ、</span><br /><em>おかけください。</em></h3>
          <p className="please-sit-feature__summary">{pleaseSitWork.summary[locale]}</p>
          <Link href={`/works/${pleaseSitGame.slug}`} className="featured-work__action">
            {ja ? '作品を見る・遊ぶ' : 'Explore & play'}<ArrowUpRightIcon className="h-5 w-5" />
          </Link>
          <p className="please-sit-feature__note">{ja ? '10の短い場面。日本語版のゲームと、企画書を掲載しています。' : 'Ten short scenes. Play the Japanese game and read the design document.'}</p>
        </div>
        <div className="please-sit-feature__visual">
          <Link href={`/works/${pleaseSitGame.slug}`} aria-label={ja ? 'どうぞ、おかけください。の作品ページへ' : 'Explore Please, Take a Seat.'}>
            <Image src={pleaseSitGame.cover} alt={ja ? 'どうぞ、おかけください。実際のゲーム画面' : 'Actual scenes from Please, Take a Seat.'} width={1152} height={720} sizes="(max-width: 767px) 90vw, 55vw" />
          </Link>
          <p>ACTUAL GAMEPLAY <span>／ 10 SHORT SCENES</span></p>
        </div>
      </article>
    </div>
  )
}
