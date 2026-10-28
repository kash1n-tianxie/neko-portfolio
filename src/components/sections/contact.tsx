import { getTranslations } from 'next-intl/server'
import { email } from '@/content/profile'
import { githubUrl } from '@/content/works'
import { Reveal } from '../reveal'
import { ContactActions } from '../contact/contact-actions'
import '../contact/street-contact.css'

export async function Contact() {
  const t = await getTranslations('contact')

  return (
    <section
      id="contact"
      data-chapter
      data-street-scene
      aria-labelledby="contact-title"
      className="story-chapter street-contact"
    >
      <div className="street-contact__paint" aria-hidden="true">
        <span data-street-paint className="street-contact__spray street-contact__spray--large" />
        <span data-street-paint className="street-contact__spray street-contact__spray--edge" />
        <span className="street-contact__stripes" />
      </div>

      <div className="street-contact__layout">
        <Reveal className="street-contact__intro">
          <p className="street-contact__eyebrow">
            <span>02</span>
            {t('sub')}
            <span aria-hidden="true">↗</span>
          </p>
          <h2 id="contact-title" data-chapter-title className="street-contact__title">
            <span>LET’S</span>
            <strong>TALK.</strong>
          </h2>
          <p className="street-contact__lead">{t('lead')}</p>
        </Reveal>

        <Reveal className="street-contact__links" delay={80}>
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
