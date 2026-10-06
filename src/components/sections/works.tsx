import { getLocale, getTranslations } from 'next-intl/server'
import { works, githubUrl } from '@/content/works'
import { Reveal } from '../reveal'
import { WorksGallery } from '../works/works-gallery'
import { BrushUnderline } from '../motion/brush-underline'
import { ArrowUpRightIcon } from '../ui/icons'
import { FeaturedWorks } from '../works/featured-works'
import { PleaseSitFeature } from '../works/please-sit-feature'
import '../works/works-showcase.css'

export async function Works() {
  const t = await getTranslations('works')
  const locale = (await getLocale()) as 'ja' | 'en'

  return (
    <section id="works" data-chapter className="story-chapter mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(20px,6vw,64px)] py-[clamp(90px,14vh,160px)]">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="m-0 leading-none">
            <span className="font-mincho block text-[clamp(36px,6vw,72px)] font-extrabold" data-split>
              {t('title')}
            </span>
            <span className="font-display outline-text--thin mt-2 block text-[clamp(22px,3.6vw,44px)] tracking-[0.06em]">
              {t('sub')}
            </span>
            <BrushUnderline />
          </h2>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold tracking-[0.14em] text-ink underline decoration-line underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
          >
            {t('github')}
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </div>
      </Reveal>

      <PleaseSitFeature locale={locale} />
      <FeaturedWorks locale={locale} indexOffset={1} hideIntro />

      <div className="works-archive-heading">
        <div>
          <p className="works-archive-heading__label">MORE EXPLORATIONS</p>
          <h3>{locale === 'ja' ? 'このほかにも、小さな実験を。' : 'And a few more experiments.'}</h3>
        </div>
        <p>{locale === 'ja' ? 'ゲーム、Web、研究。つくりながら、広げてきたこと。' : 'Games, the web, and research. Ideas explored through making.'}</p>
      </div>

      <Reveal delay={40}>
        <WorksGallery
          works={works.filter((work) => !['please-take-a-seat', 'tamago-exe', 'hyakki-lantern'].includes(work.slug))}
          locale={locale}
          compact
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
    </section>
  )
}
