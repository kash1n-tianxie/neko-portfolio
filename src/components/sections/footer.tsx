import { getTranslations } from 'next-intl/server'
import '../contact/street-contact.css'

export async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="street-footer">
      <div className="street-footer__inner">
        <span className="street-footer__brand" aria-hidden="true">NEKO / PORTFOLIO</span>
        <span className="street-footer__rights">{t('rights')}</span>
        <a href="#top" className="street-footer__top">
          {t('top')} <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  )
}
