import { getTranslations } from 'next-intl/server'
import { email } from '@/content/profile'
import { githubUrl } from '@/content/works'
import { Reveal } from '../reveal'
import { ContactActions } from '../contact/contact-actions'
import { BrushUnderline } from '../motion/brush-underline'
import { InkEnso } from '../motion/ink-enso'
import { InkFocusText } from '../motion/ink-focus-text'
import { InkThreads } from '../motion/ink-threads'

export async function Contact() {
  const t = await getTranslations('contact')

  return (
    <section
      id="contact"
      data-chapter
      className="story-chapter overflow-hidden border-t border-line-soft bg-surface/40"
    >
      <InkThreads className="contact-threads" />
      <div className="relative z-10 mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(20px,6vw,64px)] py-[clamp(90px,14vh,160px)]">
        <Reveal>
          <h2 className="relative isolate m-0 mb-6 leading-none">
            <InkEnso className="contact-enso" />
            <span className="font-mincho block text-[clamp(36px,6vw,72px)] font-extrabold" data-split>
              {t('title')}
            </span>
            <InkFocusText
              text={t('sub')}
              className="font-display mt-2 block text-[clamp(22px,3.6vw,44px)] tracking-[0.06em]"
            />
            <BrushUnderline />
          </h2>
          <p className="mb-10 max-w-[46ch] text-[15px] text-muted">{t('lead')}</p>
        </Reveal>

        <Reveal delay={80}>
          <ContactActions
            email={email}
            githubUrl={githubUrl}
            labels={{
              email: t('emailAction'),
              emailPreparing: t('emailUnset'),
              github: t('github'),
              githubMeta: t('githubMeta'),
            }}
          />
        </Reveal>
      </div>
    </section>
  )
}
