import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { works } from '@/content/works'
import { Footer } from '@/components/sections/footer'
import { ArrowUpRightIcon } from '@/components/ui/icons'
import { CaseStudyProgress } from '@/components/works/case-study-progress'
import { ImageLightbox } from '@/components/works/image-lightbox'
import { ProjectNextPreview } from '@/components/works/project-next-preview'
import { TechStackChips } from '@/components/works/tech-stack-chips'
import { HyakkiCredits, HyakkiExperience } from '@/components/works/hyakki-experience'
import { TamagoExperience } from '@/components/works/tamago-experience'
import { tamagoGame } from '@/content/tamago'
import { PleaseSitExperience } from '@/components/works/please-sit-experience'
import { pleaseSitGame } from '@/content/please-take-a-seat'
import { nyankoHomeGame } from '@/content/nyanko-home'
import { parkMasterProject } from '@/content/park-master'
import { memeClashGame } from '@/content/meme-clash'
import { MemeClashExperience } from '@/components/works/meme-clash-experience'
import { AnimatedWorkCover } from '@/components/works/animated-work-cover'
import { portfolioSite, portfolioSiteSectionLabels } from '@/content/portfolio-site'
import '@/components/works/park-master-feature.css'
import '@/components/works/nyanko-home.css'
import '@/components/works/portfolio-site.css'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    works.map((work) => ({ locale, slug: work.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const work = works.find((item) => item.slug === slug)
  if (!work) return {}
  const language = locale === 'en' ? 'en' : 'ja'
  if (work.slug === memeClashGame.slug) {
    const title = 'ミーム大乱闘 — MEME CLASH | Kashin Ou'
    const canonical = `https://kashin.ink/${language === 'en' ? 'en/' : ''}works/${memeClashGame.slug}`
    const cover = `https://kashin.ink${memeClashGame.cover}`
    return {
      title, description: work.summary[language],
      alternates: { canonical, languages: { ja: `https://kashin.ink/works/${memeClashGame.slug}`, en: `https://kashin.ink/en/works/${memeClashGame.slug}` } },
      openGraph: { title, description: work.summary[language], url: canonical, type: 'website', images: [{ url: cover, width: 1280, height: 720, alt: 'ミーム大乱闘 — MEME CLASH v0.39.0' }] },
      twitter: { card: 'summary_large_image', title, description: work.summary[language], images: [cover] },
    }
  }
  if (work.slug === parkMasterProject.slug) {
    const title = `${language === 'ja' ? 'Park Master マップ拡張企画' : 'Park Master Map Expansion Proposal'} | Kashin Ou`
    const canonical = `https://kashin.ink/${language === 'en' ? 'en/' : ''}works/${work.slug}`
    const cover = `https://kashin.ink${parkMasterProject.cover}`
    return {
      title, description: work.summary[language],
      alternates: { canonical, languages: { ja: 'https://kashin.ink/works/park-master', en: 'https://kashin.ink/en/works/park-master' } },
      openGraph: { title, description: work.summary[language], url: canonical, type: 'website', images: [{ url: cover, width: 1280, height: 720, alt: 'Park Master — interactive map expansion proposal' }] },
      twitter: { card: 'summary_large_image', title, description: work.summary[language], images: [cover] },
    }
  }
  if (work.slug === nyankoHomeGame.slug) {
    const title = `にゃんこホーム${language === 'en' ? ' — Nyanko Home' : ''} | Kashin Ou`
    const canonical = `https://kashin.ink/${language === 'en' ? 'en/' : ''}works/${nyankoHomeGame.slug}`
    const cover = `https://kashin.ink${nyankoHomeGame.cover}`
    return {
      title, description: work.summary[language],
      alternates: { canonical, languages: { ja: `https://kashin.ink/works/${nyankoHomeGame.slug}`, en: `https://kashin.ink/en/works/${nyankoHomeGame.slug}` } },
      openGraph: { title, description: work.summary[language], url: canonical, type: 'website', images: [{ url: cover, width: 1280, height: 720, alt: 'にゃんこホーム — Nyanko Home' }] },
      twitter: { card: 'summary_large_image', title, description: work.summary[language], images: [cover] },
    }
  }
  if (work.slug === pleaseSitGame.slug) {
    const title = `${language === 'ja' ? 'どうぞ、おかけください。' : 'Please, Take a Seat.'} | Kashin Ou`
    const canonical = `https://kashin.ink/${language === 'en' ? 'en/' : ''}works/${pleaseSitGame.slug}`
    const cover = `https://kashin.ink${pleaseSitGame.cover}`
    return {
      title, description: work.summary[language],
      alternates: { canonical, languages: { ja: `https://kashin.ink/works/${pleaseSitGame.slug}`, en: `https://kashin.ink/en/works/${pleaseSitGame.slug}` } },
      openGraph: { title, description: work.summary[language], url: canonical, type: 'website', images: [{ url: cover, width: 1152, height: 720, alt: 'どうぞ、おかけください。 — Please, Take a Seat.' }] },
      twitter: { card: 'summary_large_image', title, description: work.summary[language], images: [cover] },
    }
  }
  if (work.slug === 'hyakki-lantern') {
    const title = `${language === 'en' ? 'Hyakki Lantern City (百鬼灯市)' : '百鬼灯市'} | Kashin Ou`
    const canonical = `https://kashin.ink/${language === 'en' ? 'en/' : ''}works/hyakki-lantern`
    return {
      title,
      description: work.summary[language],
      alternates: { canonical, languages: { ja: 'https://kashin.ink/works/hyakki-lantern', en: 'https://kashin.ink/en/works/hyakki-lantern' } },
      openGraph: { title, description: work.summary[language], url: canonical, type: 'website', images: [{ url: 'https://kashin.ink/assets/works/hyakki-lantern/cover.webp', width: 1408, height: 1117, alt: '百鬼灯市 — Hyakki Lantern City' }] },
      twitter: { card: 'summary_large_image', title, description: work.summary[language], images: ['https://kashin.ink/assets/works/hyakki-lantern/cover.webp'] },
    }
  }
  if (work.slug === tamagoGame.slug) {
    const title = 'TAMAGO.exe | Kashin Ou'
    const canonical = `https://kashin.ink/${language === 'en' ? 'en/' : ''}works/tamago-exe`
    const cover = `https://kashin.ink${tamagoGame.cover}`
    return {
      title, description: work.summary[language],
      alternates: { canonical, languages: { ja: 'https://kashin.ink/works/tamago-exe', en: 'https://kashin.ink/en/works/tamago-exe' } },
      openGraph: { title, description: work.summary[language], url: canonical, type: 'website', images: [{ url: cover, width: 1152, height: 768, alt: 'TAMAGO.exe — actual gameplay' }] },
      twitter: { card: 'summary_large_image', title, description: work.summary[language], images: [cover] },
    }
  }
  return {
    title: `${work.title} | Kashin Ou`,
    description: work.summary[language],
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale = rawLocale === 'en' ? 'en' : 'ja'
  setRequestLocale(locale)
  const t = await getTranslations('caseStudy')
  const work = works.find((item) => item.slug === slug)
  if (!work) notFound()
  const isHyakki = work.slug === 'hyakki-lantern'
  const isTamago = work.slug === tamagoGame.slug
  const isPleaseSit = work.slug === pleaseSitGame.slug
  const isNyankoHome = work.slug === nyankoHomeGame.slug
  const isParkMaster = work.slug === parkMasterProject.slug
  const isMemeClash = work.slug === memeClashGame.slug
  const isPortfolioSite = work.slug === portfolioSite.slug
  const caseStudyLabels = isPortfolioSite
    ? portfolioSiteSectionLabels[locale]
    : isParkMaster
    ? locale === 'ja'
      ? ['操作を増やさず、遊びを変える', '地形を避けるだけで終わらせない', '企画を、触って理解できる形に', 'つくったものと、これから確かめること']
      : ['Change the play, keep the input', 'Make the terrain matter', 'A proposal you can understand by playing', 'What is built, and what comes next']
    : isNyankoHome
    ? locale === 'ja'
      ? ['月を取り戻しに、出発。', '戦いの前に、ひと工夫。', '干物とおもちゃで、戦い方が変わる。', 'ここぞの一手は、ネコをクリック。']
      : ['Bring the moon home.', 'Make a plan before the next battle.', 'Fish and toys change the way you fight.', 'Click a cat when the moment is right.']
    : isPleaseSit
    ? locale === 'ja'
      ? ['座るだけ、から会議室へ', '触ったときの反応を増やす', '広げたあと、薄くなった手応え', '押す順番と向きに、考える余地を']
      : ['From chairs to a meeting room', 'Giving movement a response', 'What expanding the scenes left behind', 'Making order and direction matter']
    : [t('problem'), t('challenge'), t('solution'), t('result')]
  const statusLabel = work.releaseLabel?.[locale] ?? (work.status === 'LIVE'
    ? t('statusLive')
    : work.status === 'ARCHIVED'
      ? t('statusArchived')
      : t('statusProgress'))

  return (
    <main id="main-content" className={`case-study${isHyakki ? ' case-study--hyakki' : ''}${isPleaseSit ? ' case-study--please-sit' : ''}${isNyankoHome ? ' case-study--nyanko-home' : ''}${isParkMaster ? ' case-study--park-master' : ''}${isMemeClash ? ' case-study--meme-clash' : ''}${isPortfolioSite ? ' case-study--portfolio-site' : ''}`}>
      <CaseStudyProgress label={t('progress')} />

      <article>
        <header className="case-hero">
          <div className="mx-auto max-w-[1180px] px-[clamp(20px,6vw,64px)] pt-36 pb-20">
            <Link href="/#works" className="case-back">
              <span aria-hidden="true">←</span>
              {t('back')}
            </Link>

            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="font-mono m-0 text-[11px] tracking-[0.22em] text-accent">
                  {work.tag} / {work.year}
                </p>
                <h1 className="case-title font-mincho m-0 mt-5 max-w-[16ch] text-[clamp(44px,9vw,108px)] font-extrabold leading-[0.95]">
                  {isPleaseSit ? <><span>どうぞ、</span><br /><span>おかけください。</span></> : isParkMaster ? <><span>Park Master</span><br /><span>{locale === 'ja' ? 'マップ拡張企画' : 'Map Expansion'}</span></> : work.title}
                </h1>
                {isHyakki && <p className="hyakki-subtitle">HYAKKI LANTERN CITY / 2048 × AUTO DEFENSE</p>}
                {isNyankoHome && <p className="font-mono mt-5 text-[11px] tracking-[0.12em] text-accent">NYANKO HOME / CATS & DRIED FISH</p>}
                <p className="m-0 mt-7 max-w-[62ch] text-[clamp(16px,2vw,20px)] leading-[1.9] text-muted">
                  {work.summary[locale]}
                </p>
              </div>

              <dl className="case-meta">
                <div>
                  <dt>{isNyankoHome ? (locale === 'ja' ? 'ジャンル' : 'Genre') : t('role')}</dt>
                  <dd>{isNyankoHome ? (locale === 'ja' ? 'チーム構築 × 2D防衛' : 'Team building × 2D defense') : work.role?.[locale] ?? t('pending')}</dd>
                </div>
                <div>
                  <dt>{t('status')}</dt>
                  <dd>{statusLabel}</dd>
                </div>
                <div>
                  <dt>{t('stack')}</dt>
                  <dd><TechStackChips items={work.tech ?? []} /></dd>
                </div>
              </dl>
            </div>

            {(work.links?.demo || work.links?.itch || work.links?.repo || work.links?.video) && (
              <div className="mt-10 flex flex-wrap gap-3">
                {isMemeClash && <a href="#play" className="cta">{locale === 'ja' ? '体験版を遊ぶ' : 'Play the demo'}<span aria-hidden="true">↓</span></a>}
                {isParkMaster && <a href={parkMasterProject.pdfUrl} target="_blank" rel="noopener noreferrer" className="cta">{locale === 'ja' ? '企画書（PDF）を読む' : 'Read the proposal (PDF)'}<ArrowUpRightIcon className="h-4 w-4" /></a>}
                {isPleaseSit && <a href="#play" className="cta">{locale === 'ja' ? 'ブラウザで遊ぶ' : 'Play in browser'}<span aria-hidden="true">↓</span></a>}
                {isPleaseSit && <a href={pleaseSitGame.designPdf} download className="cta">{locale === 'ja' ? '企画書（PDF）' : 'Design document (PDF)'}<span aria-hidden="true">↓</span></a>}
                {isHyakki && <a href="#play" className="cta">{locale === 'ja' ? '無料体験版を遊ぶ' : 'Try the free demo'}<span aria-hidden="true">↓</span></a>}
                {isTamago && <a href="#play" className="cta">{locale === 'ja' ? '新版を遊ぶ' : 'Play the new version'}<span aria-hidden="true">↓</span></a>}
                {isTamago && <a href={tamagoGame.designPdf} download className="cta">{locale === 'ja' ? '企画書（PDF）' : 'Design document (PDF)'}<span aria-hidden="true">↓</span></a>}
                {work.links.demo && (
                  <a href={work.links.demo} target="_blank" rel="noopener noreferrer" className="cta">
                    {isPortfolioSite ? (locale === 'ja' ? 'サイトのトップへ' : 'Visit the homepage') : isParkMaster ? (locale === 'ja' ? 'Web企画書を体験する' : 'Play the interactive proposal') : t('liveDemo')} <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {work.links.itch && (
                  <a href={work.links.itch} target="_blank" rel="noopener noreferrer" className="cta">
                    {isNyankoHome ? (locale === 'ja' ? 'itch.ioで遊ぶ' : 'Play on itch.io') : isHyakki ? (locale === 'ja' ? 'itch.ioで遊ぶ・ダウンロード' : 'Play or download on itch.io') : isTamago ? (locale === 'ja' ? 'itch.io（旧バージョン）' : 'Earlier version on itch.io') : t('itch')} <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {work.links.repo && (
                  <a href={work.links.repo} target="_blank" rel="noopener noreferrer" className="cta">
                    GitHub <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {isPortfolioSite && <Link href={portfolioSite.worldPath} className="cta" data-canvas-transition>{locale === 'ja' ? 'ピクセルの街を歩く' : 'Walk the pixel town'}<ArrowUpRightIcon className="h-4 w-4" /></Link>}
                {work.links.video && (
                  <a href={work.links.video} target="_blank" rel="noopener noreferrer" className="cta">
                    {t('video')} <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            <div className="case-cover">
              {isPortfolioSite || isMemeClash || isParkMaster || isNyankoHome ? <AnimatedWorkCover
                src={work.coverGif}
                fallback={work.thumbnail}
                alt={`${work.title} — ${work.summary[locale]}`}
                width={isMemeClash ? 960 : isParkMaster ? 944 : 1280}
                height={isPortfolioSite || isParkMaster ? 800 : 720}
                sizes="(max-width: 1180px) 90vw, 1180px"
              /> : <picture>
                <source media="(prefers-reduced-motion: reduce)" srcSet={work.thumbnail} />
                <img
                  src={work.coverGif ?? work.thumbnail}
                  alt={`${work.title} — ${work.summary[locale]}`}
                  width={isMemeClash || isParkMaster || isNyankoHome ? 1280 : isPleaseSit ? 1152 : isHyakki ? 1440 : 1200}
                  height={isMemeClash || isParkMaster || isNyankoHome || isPleaseSit ? 720 : isHyakki ? 900 : 800}
                  decoding="async"
                />
              </picture>}
              <span aria-hidden="true">{work.coverCaption?.[locale] ?? (isPleaseSit ? `ACTUAL GAMEPLAY / v${pleaseSitGame.version}` : isHyakki ? 'ACTUAL GAMEPLAY / v0.6.0' : isTamago ? 'ACTUAL GAMEPLAY / v4' : `PROJECT / ${work.year}`)}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-[clamp(20px,6vw,64px)] py-[clamp(80px,12vw,150px)]">
          {isMemeClash && <MemeClashExperience locale={locale} />}
          {isPleaseSit && <PleaseSitExperience locale={locale} />}
          {isHyakki && <HyakkiExperience locale={locale} />}
          {isTamago && <TamagoExperience locale={locale} />}
          {work.caseStudy ? (
            <>
              {work.caseStudy.highlights && work.caseStudy.highlights.length > 0 && (
                <ul className="case-highlights" aria-label={t('highlights')}>
                  {work.caseStudy.highlights.map((highlight, index) => (
                    <li key={highlight[locale]}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{highlight[locale]}</strong>
                    </li>
                  ))}
                </ul>
              )}

              <div className="case-sections">
                {[
                  ['01', caseStudyLabels[0], work.caseStudy.problem[locale]],
                  ['02', caseStudyLabels[1], work.caseStudy.challenge[locale]],
                  ['03', caseStudyLabels[2], work.caseStudy.solution[locale]],
                  ['04', caseStudyLabels[3], work.caseStudy.result[locale]],
                ].map(([index, title, body]) => (
                  <section key={index} className="case-section">
                    <span className="case-section__index">{index}</span>
                    <div>
                      <h2 className="font-mincho m-0 text-[clamp(26px,4vw,46px)] font-bold">{title}</h2>
                      <p className="m-0 mt-5 max-w-[70ch] whitespace-pre-line text-[15px] leading-[2] text-muted">
                        {body}
                      </p>
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <section className="case-ready">
              <p className="font-mono m-0 text-[10px] tracking-[0.22em] text-accent">
                CASE STUDY / READY
              </p>
              <h2 className="font-mincho m-0 mt-3 text-[clamp(28px,4vw,48px)] font-bold">
                {t('readyTitle')}
              </h2>
              <p className="m-0 mt-4 max-w-[56ch] text-[14px] text-muted">{t('readyBody')}</p>
            </section>
          )}

          {work.gallery && work.gallery.length > 0 && (
            <section className="mt-24" aria-labelledby="gallery-title">
              <h2 id="gallery-title" className="font-mincho text-[clamp(26px,4vw,46px)]">
                {t('gallery')}
              </h2>
              <ImageLightbox
                items={work.gallery}
                locale={locale}
                closeLabel={t('close')}
                openLabel={t('openImage')}
              />
            </section>
          )}

          {isHyakki && <div className="mt-24"><HyakkiCredits locale={locale} /></div>}

          {isNyankoHome && (
            <div className="nyanko-home-play">
              <p>{locale === 'ja' ? '日本語ではじめる、ネコたちの月探し。' : 'Join the cats on their search for the moon.'}<br />{locale === 'ja' ? 'v0.4.0 · 日本語／簡体字中国語' : 'v0.4.0 · Japanese / Simplified Chinese'}</p>
              <a href={nyankoHomeGame.itchUrl} target="_blank" rel="noopener noreferrer" className="cta">{locale === 'ja' ? 'itch.ioで遊ぶ' : 'Play on itch.io'}<ArrowUpRightIcon className="h-4 w-4" /></a>
            </div>
          )}

          <div className="mt-24">
            <ProjectNextPreview
              currentSlug={work.slug}
              works={works}
              label={t('next')}
              fallbackLabel={t('back')}
            />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
