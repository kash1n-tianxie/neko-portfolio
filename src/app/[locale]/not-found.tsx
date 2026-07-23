import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AssetSlot } from '@/components/asset-slot'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <main id="main-content" className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <AssetSlot
        src="/assets/cat/cat-lost.png"
        spec="猫・きょろきょろ迷子（透明PNG）"
        alt=""
        className="h-36 w-44"
        imgClassName="object-contain"
      />
      <p className="font-display outline-text m-0 text-[clamp(64px,14vw,140px)] leading-none">
        404
      </p>
      <h1 className="font-mincho m-0 text-[clamp(22px,4vw,34px)] font-bold">
        {t('title')}
      </h1>
      <p className="m-0 text-[14.5px] text-muted">{t('body')}</p>
      <Link href="/" className="cta mt-4">
        {t('back')}
      </Link>
    </main>
  )
}
