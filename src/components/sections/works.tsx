import { getLocale, getTranslations } from 'next-intl/server'
import { works, githubUrl, featuredWorkSlugs } from '@/content/works'
import { Reveal } from '../reveal'
import { WorksGallery } from '../works/works-gallery'
import { ArrowUpRightIcon } from '../ui/icons'
import { FeaturedWorks } from '../works/featured-works'
import { PleaseSitFeature } from '../works/please-sit-feature'
import { NyankoHomeFeature } from '../works/nyanko-home-feature'
import { ParkMasterFeature } from '../works/park-master-feature'
import { MemeClashFeature } from '../works/meme-clash-feature'
import { PortfolioSiteFeature } from '../works/portfolio-site-feature'
import '../works/works-showcase.css'
import '../works/street-works.css'

const workSelect = [
  { id: 'featured-kashin-ink', title: 'KASHIN.INK' },
  { id: 'featured-nyanko-home', title: 'NYANKO HOME' },
  { id: 'featured-meme-clash', title: 'MEME CLASH' },
  { id: 'featured-park-master', title: 'PARK MASTER' },
  { id: 'featured-please-sit', title: 'TAKE A SEAT' },
  { id: 'featured-2048', title: 'HYAKKI LANTERN' },
  { id: 'featured-tamago-exe', title: 'TAMAGO.exe' },
] as const

export async function Works() {
  const t = await getTranslations('works')
  const locale = (await getLocale()) as 'ja' | 'en'

  return (
    <section id="works" data-chapter className="story-chapter street-works" aria-labelledby="street-works-title">
      <div className="street-works__scenery" aria-hidden="true">
        <span className="street-works__serial">PLAY / CREATE / REPEAT</span>
      </div>
      <div className="street-works__inner">
      <Reveal>
        <header className="street-works__header" data-street-scene>
          <span className="street-works__paint" data-street-paint aria-hidden="true" />
          <p className="street-works__eyebrow"><span>01 / THE PLAYLIST</span><span>SELECTED WORKS — {String(workSelect.length).padStart(2, '0')}</span></p>
          <h2 id="street-works-title" data-chapter-title className="street-works__title">
            <span>SELECT</span>
            <strong>WORKS<span aria-hidden="true">↙</span></strong>
            <span className="sr-only">{t('title')}</span>
          </h2>
          <div className="street-works__lead">
            <p>{locale === 'ja' ? '気になる世界から、飛び込もう。' : 'Pick a world. Jump right in.'}</p>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="street-works__github">
              {t('github')}<ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </div>
        </header>
      </Reveal>

      <nav className="street-works__select" aria-label={locale === 'ja' ? `注目の${workSelect.length}作品へ移動` : 'Jump to a featured project'}>
        {workSelect.map((work, index) => (
          <a key={work.id} href={`#${work.id}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{work.title}</strong>
            <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
          </a>
        ))}
      </nav>

      <div className="street-works__selection">
        <PortfolioSiteFeature locale={locale} />
        <NyankoHomeFeature locale={locale} index={2} hideIntro />
        <MemeClashFeature locale={locale} index={3} />
        <ParkMasterFeature locale={locale} index={4} />
        <PleaseSitFeature locale={locale} index={5} hideIntro />
        <FeaturedWorks locale={locale} indexOffset={5} hideIntro />
      </div>

      <div className="works-archive-heading">
        <div>
          <p className="works-archive-heading__label">SIDE B / MORE EXPLORATIONS</p>
          <h3>{locale === 'ja' ? 'このほかにも、小さな実験を。' : 'And a few more experiments.'}</h3>
        </div>
        <p>{locale === 'ja' ? 'ゲーム、Web、研究。つくりながら、広げてきたこと。' : 'Games, the web, and research. Ideas explored through making.'}</p>
      </div>

      <Reveal delay={40}>
        <WorksGallery
          works={works.filter((work) => !featuredWorkSlugs.some((slug) => slug === work.slug))}
          locale={locale}
          compact
          indexOffset={featuredWorkSlugs.length}
          labels={{
            filters: {
              ALL: t('filterAll'),
              WEB: t('filterWeb'),
              GAME: t('filterGame'),
              TOOL: t('filterTool'),
            },
            resultCount: t('resultCount'),
            emptyTitle: t('emptyTitle'),
            emptyBody: t('emptyBody'),
            viewCase: t('viewCase'),
            demo: t('demo'),
            itch: t('itch'),
            repo: t('repo'),
            status: {
              LIVE: t('statusLive'),
              IN_PROGRESS: t('statusProgress'),
              ARCHIVED: t('statusArchived'),
            },
          }}
        />
      </Reveal>
      </div>
    </section>
  )
}
