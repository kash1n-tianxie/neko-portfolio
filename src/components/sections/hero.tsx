import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AssetSlot } from '../asset-slot'
import { CatCompanion } from '../motion/cat-companion'
import { Magnetic } from '../motion/magnetic'

const AWAKE_CAT_SRC = '/assets/cat/cat-awake.png'

export async function Hero() {
  const t = await getTranslations('hero')
  const worksT = await getTranslations('works')

  return (
    <section id="top" className="hero-story relative" data-hero-story>
      <div className="hero-stage sticky top-0 flex min-h-svh flex-col justify-center overflow-hidden" data-hero-stage>
        {/* Every layer is tied to the same scroll timeline in MotionProvider. */}
        <div className="hero-ink absolute inset-0" data-hero-ink aria-hidden="true" />
        <div className="hero-art absolute inset-0" data-hero-art aria-hidden="true">
          <AssetSlot
            silent
            src="/assets/ink/ink-hero.webp"
            spec=""
            className="h-full w-full object-cover opacity-70"
          />
        </div>
        <span className="hero-kanji" data-hero-kanji aria-hidden="true">
          猫
        </span>

        <div className="hero-copy relative z-10 px-[clamp(20px,6vw,90px)] pt-24 pb-16" data-hero-copy>
          <p
            className="hero-enter mb-5 text-[13px] font-semibold tracking-[0.32em] text-accent"
            data-hero-detail
          >
            {t('kicker')} · {t('role')}
          </p>
          <h1 className="hero-title m-0 leading-[0.98]" data-hero-title>
            <span
              className="hero-enter font-mincho block text-[clamp(54px,12vw,150px)] font-extrabold tracking-[0.02em]"
              style={{ animationDelay: '90ms' }}
            >
              王家進
            </span>
            <span
              className="hero-enter font-display outline-text block text-[clamp(38px,8.5vw,110px)] tracking-[0.04em]"
              style={{ animationDelay: '180ms' }}
            >
              KASHIN OU
            </span>
          </h1>
          <p
            className="hero-enter mt-7 max-w-[34ch] text-[clamp(15px,1.6vw,19px)] text-ink/85"
            style={{ animationDelay: '280ms' }}
            data-hero-detail
          >
            {t('tagline')}
          </p>

          <div
            className="hero-enter mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '380ms' }}
            data-hero-detail
          >
            <Magnetic>
              <a href="#works" className="cta">
                {t('ctaWorks')}
              </a>
            </Magnetic>
            <Magnetic>
              <Link href="/world" data-canvas-transition className="cta">
                {t('cta3d')}
                <small className="rounded-sm border border-current px-1.5 py-0.5 text-[10px] tracking-[0.14em]">
                  3D
                </small>
              </Link>
            </Magnetic>
          </div>
        </div>

        <CatCompanion bodySrc={AWAKE_CAT_SRC} className="hero-awake" />

        <div
          className="scroll-hint absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.3em] text-ink/60"
          data-hero-detail
        >
          {t('scroll')}
          <span />
        </div>

        <div
          className="hero-gate absolute inset-0 z-20 grid place-items-center"
          data-hero-gate
          aria-hidden="true"
        >
          <div className="hero-gate__ink absolute inset-0" />
          <p className="hero-gate__label relative m-0 text-center leading-none" data-hero-gate-label>
            <span className="font-mincho block text-[clamp(58px,14vw,180px)] font-extrabold">
              {worksT('title')}
            </span>
            <span className="font-display outline-text mt-3 block text-[clamp(28px,6vw,76px)] tracking-[0.08em]">
              {worksT('sub')}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
