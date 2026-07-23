import { getLocale, getTranslations } from 'next-intl/server'
import { skills } from '@/content/profile'
import { works } from '@/content/works'
import { Reveal } from '../reveal'
import { TechStackChips } from '../works/tech-stack-chips'
import { InteractionLab } from '../lab/interaction-lab'
import { BrushUnderline } from '../motion/brush-underline'
import { SkillStats, SkillBar } from './skill-motion'

export async function Skills() {
  const t = await getTranslations('skills')
  const locale = (await getLocale()) as 'ja' | 'en'

  const techCount = skills.reduce((sum, cat) => sum + cat.items.length, 0)
  const stats = [
    {
      value: new Date().getFullYear() - 2022,
      suffix: locale === 'ja' ? '年' : 'yr',
      label: locale === 'ja' ? '制作年数' : 'Years building',
    },
    { value: works.length, suffix: '', label: locale === 'ja' ? '公開作品' : 'Projects' },
    { value: 3, suffix: '', label: locale === 'ja' ? 'リリースしたゲーム' : 'Games shipped' },
    { value: techCount, suffix: '', label: locale === 'ja' ? '使用技術' : 'Technologies' },
  ]

  return (
    <section id="skills" data-chapter className="story-chapter scroll-mt-20 border-t border-line-soft bg-surface/40">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,6vw,64px)] py-[clamp(90px,14vh,160px)]">
        <Reveal>
          <h2 className="m-0 mb-12 leading-none">
            <span className="font-mincho block text-[clamp(36px,6vw,72px)] font-extrabold" data-split>
              {t('title')}
            </span>
            <span className="font-display outline-text--thin mt-2 block text-[clamp(22px,3.6vw,44px)] tracking-[0.06em]">
              {t('sub')}
            </span>
            <BrushUnderline />
          </h2>
        </Reveal>

        <Reveal>
          <SkillStats stats={stats} />
        </Reveal>

        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {skills.map((cat, i) => (
            <Reveal key={cat.category.en} delay={i * 60}>
              <div className="skill-card relative h-full border border-line bg-surface p-7">
                <span className="font-display outline-text--thin absolute top-4 right-5 text-[32px] leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-mincho m-0 mb-4 text-[19px] font-bold">
                  {cat.category[locale]}
                </h3>
                <SkillBar level={cat.level} label={locale === 'ja' ? '習熟度' : 'Proficiency'} />
                <div className="mt-5">
                  <TechStackChips items={cat.items.map((item) => item.name)} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12">
          <InteractionLab
            labels={{
              eyebrow: t('lab.eyebrow'),
              title: t('lab.title'),
              body: t('lab.body'),
              pointerTitle: t('lab.pointerTitle'),
              pointerBody: t('lab.pointerBody'),
              sealTitle: t('lab.sealTitle'),
              sealBody: t('lab.sealBody'),
              sealAction: t('lab.sealAction'),
              motionTitle: t('lab.motionTitle'),
              motionBody: t('lab.motionBody'),
              motionOn: t('lab.motionOn'),
              motionOff: t('lab.motionOff'),
            }}
          />
        </Reveal>
      </div>
    </section>
  )
}
