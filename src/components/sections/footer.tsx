import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer data-chapter className="story-chapter border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-[clamp(20px,6vw,64px)] py-8 text-[12px] tracking-[0.14em] text-muted">
        <span>
          {t('rights')} · {t('affiliation')}
        </span>
        <a
          href="#top"
          className="text-muted no-underline transition-colors hover:text-accent"
        >
          {t('top')} ↑
        </a>
      </div>
    </footer>
  )
}
