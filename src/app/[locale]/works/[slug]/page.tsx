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
  const caseStudyLabels = isPleaseSit
    ? locale === 'ja'
      ? ['座るだけ、から会議室へ', '触ったときの反応を増やす', '広げたあと、薄くなった手応え', '操作の途中に、相手の返事を戻す']
      : ['From chairs to a meeting room', 'Giving movement a response', 'What expanding the scenes left behind', 'Bringing responses back into play']
    : [t('problem'), t('challenge'), t('solution'), t('result')]
  const statusLabel = work.releaseLabel?.[locale] ?? (work.status === 'LIVE'
    ? t('statusLive')
    : work.status === 'ARCHIVED'
      ? t('statusArchived')
      : t('statusProgress'))

  return (
    <main id="main-content" className={`case-study${isHyakki ? ' case-study--hyakki' : ''}${isPleaseSit ? ' case-study--please-sit' : ''}`}>
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
                  {isPleaseSit ? <><span>どうぞ、</span><br /><span>おかけください。</span></> : work.title}
                </h1>
                {isHyakki && <p className="hyakki-subtitle">HYAKKI LANTERN CITY / 2048 × AUTO DEFENSE</p>}
                <p className="m-0 mt-7 max-w-[62ch] text-[clamp(16px,2vw,20px)] leading-[1.9] text-muted">
                  {work.summary[locale]}
                </p>
              </div>

              <dl className="case-meta">
                <div>
                  <dt>{t('role')}</dt>
                  <dd>{work.role?.[locale] ?? t('pending')}</dd>
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
                {isPleaseSit && <a href="#play" className="cta">{locale === 'ja' ? 'ブラウザで遊ぶ' : 'Play in browser'}<span aria-hidden="true">↓</span></a>}
                {isPleaseSit && <a href={pleaseSitGame.designPdf} download className="cta">{locale === 'ja' ? '企画書（PDF）' : 'Design document (PDF)'}<span aria-hidden="true">↓</span></a>}
                {isHyakki && <a href="#play" className="cta">{locale === 'ja' ? '無料体験版を遊ぶ' : 'Try the free demo'}<span aria-hidden="true">↓</span></a>}
                {isTamago && <a href="#play" className="cta">{locale === 'ja' ? '新版を遊ぶ' : 'Play the new version'}<span aria-hidden="true">↓</span></a>}
                {isTamago && <a href={tamagoGame.designPdf} download className="cta">{locale === 'ja' ? '企画書（PDF）' : 'Design document (PDF)'}<span aria-hidden="true">↓</span></a>}
                {work.links.demo && (
                  <a href={work.links.demo} target="_blank" rel="noopener noreferrer" className="cta">
                    {t('liveDemo')} <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {work.links.itch && (
                  <a href={work.links.itch} target="_blank" rel="noopener noreferrer" className="cta">
                    {isHyakki ? (locale === 'ja' ? 'itch.ioで遊ぶ・ダウンロード' : 'Play or download on itch.io') : isTamago ? (locale === 'ja' ? 'itch.io（旧バージョン）' : 'Earlier version on itch.io') : t('itch')} <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {work.links.repo && (
                  <a href={work.links.repo} target="_blank" rel="noopener noreferrer" className="cta">
                    GitHub <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
                {work.links.video && (
                  <a href={work.links.video} target="_blank" rel="noopener noreferrer" className="cta">
                    {t('video')} <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            <div className="case-cover">
              <picture>
                <source media="(prefers-reduced-motion: reduce)" srcSet={work.thumbnail} />
                <img
                  src={work.coverGif ?? work.thumbnail}
                  alt={`${work.title} — ${work.summary[locale]}`}
                  width={isPleaseSit ? 1152 : isHyakki ? 1440 : 1200}
                  height={isPleaseSit ? 720 : isHyakki ? 900 : 800}
                  decoding="async"
                />
              </picture>
              <span aria-hidden="true">{isPleaseSit ? 'ACTUAL GAMEPLAY / v1.0.0' : isHyakki ? 'ACTUAL GAMEPLAY / v0.6.0' : isTamago ? 'ACTUAL GAMEPLAY / v4' : `PROJECT / ${work.year}`}</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-[clamp(20px,6vw,64px)] py-[clamp(80px,12vw,150px)]">
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
