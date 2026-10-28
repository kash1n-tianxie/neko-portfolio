import { AnimatedWorkCover } from './animated-work-cover'
import { Link } from '@/i18n/navigation'
import { portfolioSite, portfolioSiteWork } from '@/content/portfolio-site'
import { featuredWorkSlugs } from '@/content/works'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import './portfolio-site.css'

export function PortfolioSiteFeature({ locale }: { locale: 'ja' | 'en' }) {
  const ja = locale === 'ja'
  return (
    <div className="portfolio-site-feature">
      <div className="featured-works__intro">
        <p className="featured-works__eyebrow">SELECTED WORKS / 01—{String(featuredWorkSlugs.length).padStart(2, '0')}</p>
        <p>{ja ? '新しい遊びを、ここから。' : 'New worlds to discover.'}</p>
      </div>
      <article id="featured-kashin-ink" className="featured-work featured-work--released featured-work--portfolio-site" aria-labelledby="portfolio-site-feature-title">
        <div className="featured-work__topline">
          <span className="featured-work__index">01<span>/ FEATURED WEB</span></span>
          <span className="featured-work__status"><span aria-hidden="true" />{ja ? '公開中 / このサイト' : 'LIVE / THIS WEBSITE'}</span>
        </div>
        <div className="featured-work__copy">
          <p className="featured-work__category">PORTFOLIO / DESIGN × PLAY</p>
          <h3 id="portfolio-site-feature-title" className="featured-work__title">KASHIN.<wbr />INK</h3>
          <p className="featured-work__summary">{portfolioSiteWork.summary[locale]}</p>
          <Link href={`/works/${portfolioSite.slug}`} className="featured-work__action">
            {ja ? 'このサイトの制作を読む' : 'Read how this site was made'}<ArrowUpRightIcon className="h-5 w-5" />
          </Link>
          <div className="featured-work__note">
            <span className="featured-work__note-mark" aria-hidden="true">＋</span>
            <p>{ja ? 'デザインも、寄り道も、ポートフォリオの一部に。AI支援による実装・アート制作を含め、意図と選択を紹介します。' : 'Design and detours are part of the portfolio. Explore the intentions and choices, including AI-assisted implementation and art production.'}</p>
          </div>
          <div className="portfolio-site-feature__links">
            <a href={portfolioSite.repoUrl} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRightIcon className="h-4 w-4" /></a>
            <a href={portfolioSite.liveUrl}>{ja ? 'サイトのトップへ' : 'Visit the homepage'}<ArrowUpRightIcon className="h-4 w-4" /></a>
            <Link href={portfolioSite.worldPath} data-canvas-transition>{ja ? 'ピクセルの街を歩く' : 'Walk the pixel town'}<ArrowUpRightIcon className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="featured-work__visual">
          <Link href={`/works/${portfolioSite.slug}`} className="featured-work__cover" aria-label={ja ? 'KASHIN.INKの制作紹介へ' : 'Explore the KASHIN.INK case study'}>
            <AnimatedWorkCover src={portfolioSiteWork.coverGif} fallback={portfolioSiteWork.thumbnail} alt={ja ? 'KASHIN.INKの実際のサイト画面。二つの配色とピクセルの街' : 'Actual KASHIN.INK site views: two palettes and the pixel town'} width={1280} height={800} sizes="(max-width: 767px) 90vw, 55vw" />
          </Link>
          <p className="featured-work__visual-label"><span>{portfolioSiteWork.coverCaption?.[locale]}</span><span>{ja ? '見る。触る。少し、寄り道。' : 'Look. Interact. Take a detour.'}</span></p>
        </div>
      </article>
    </div>
  )
}
