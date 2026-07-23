import { getLocale, getTranslations } from 'next-intl/server'
import { languages, pr, research, timeline } from '@/content/profile'
import { AssetSlot } from '../asset-slot'
import { Reveal } from '../reveal'
import { BrushUnderline } from '../motion/brush-underline'
import { InkBleedText } from '../motion/ink-bleed-text'

export async function About() {
  const t = await getTranslations('about')
  const locale = (await getLocale()) as 'ja' | 'en'
  const hasProfile = timeline.some(
    (item) =>
      item.year !== '20XX' &&
      !item.body.ja.includes('TODO') &&
      !item.body.en.includes('TODO'),
  )

  return (
    <section id="about" data-chapter className="story-chapter mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(20px,6vw,64px)] py-[clamp(90px,14vh,160px)]">
      <Reveal>
        <div className="mb-12 flex items-end gap-6">
          <h2 className="m-0 leading-none">
            <span className="font-mincho block text-[clamp(36px,6vw,72px)] font-extrabold" data-split>
              {t('title')}
            </span>
            <span className="font-display outline-text--thin mt-2 block text-[clamp(22px,3.6vw,44px)] tracking-[0.06em]">
              {t('sub')}
            </span>
            <BrushUnderline />
          </h2>
          <AssetSlot
            src="/assets/cat/cat-sit.png"
            spec="猫・おすわり（透明PNG）"
            alt=""
            className="hidden h-24 w-24 md:flex"
            imgClassName="object-contain object-bottom"
          />
        </div>
      </Reveal>

      {hasProfile ? (
        <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ol className="tl">
              {timeline.map((item) => (
                <li key={item.title.en}>
                  <span className="font-mono text-[12px] tracking-[0.2em] text-accent">
                    {item.year}
                  </span>
                  <h3 className="font-mincho m-0 mt-1 text-[18px] font-bold">
                    {item.title[locale]}
                  </h3>
                  <p className="m-0 mt-1 text-[14px] text-muted">{item.body[locale]}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col gap-7">
              <div className="border border-line bg-surface p-7">
                <h3 className="font-mincho m-0 mb-3 text-[17px] font-bold text-accent">
                  {t('prTitle')}
                </h3>
                <InkBleedText
                  as="p"
                  text={pr[locale]}
                  className="m-0 text-[14.5px] leading-[2] text-muted"
                />
              </div>

              <div className="border border-line bg-surface p-7">
                <h3 className="font-mincho m-0 mb-3 text-[17px] font-bold text-accent">
                  {t('researchTitle')}
                </h3>
                <p className="font-mincho m-0 text-[15px] font-bold leading-[1.8]">
                  {research.theme[locale]}
                </p>
                <p className="m-0 mt-3 text-[13.5px] leading-[1.9] text-muted">
                  {research.summary[locale]}
                </p>
                <p className="font-mono m-0 mt-4 border-t border-line-soft pt-3 text-[10px] tracking-[0.12em] text-muted">
                  {research.lab[locale]}
                </p>
              </div>

              <div className="border border-line bg-surface p-7">
                <h3 className="font-mincho m-0 mb-4 text-[17px] font-bold text-accent">
                  {t('qualsTitle')}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {languages.map((lang) => (
                    <li key={lang.name.en} className="flex items-baseline gap-4 text-[14px]">
                      <span className="font-mincho shrink-0 font-bold">{lang.name[locale]}</span>
                      <span className="text-muted">{lang.level[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      ) : (
        <Reveal>
          <div className="profile-ready">
            <span className="font-display outline-text--thin text-[clamp(76px,14vw,170px)] leading-none" aria-hidden="true">
              私
            </span>
            <div>
              <p className="font-mono m-0 text-[10px] tracking-[0.22em] text-accent">
                PROFILE SYSTEM / READY
              </p>
              <h3 className="font-mincho m-0 mt-3 text-[clamp(24px,4vw,42px)] font-bold">
                {t('readyTitle')}
              </h3>
              <p className="m-0 mt-3 max-w-[50ch] text-[14px] text-muted">
                {t('readyBody')}
              </p>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
