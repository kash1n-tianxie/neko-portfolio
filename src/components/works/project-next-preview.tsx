import { Link } from '@/i18n/navigation'
import type { Work } from '@/content/works'
import { ArrowRightIcon } from '../ui/icons'

export function ProjectNextPreview({
  currentSlug,
  works,
  label,
  fallbackLabel,
}: {
  currentSlug: string
  works: Work[]
  label: string
  fallbackLabel: string
}) {
  if (works.length < 2) {
    return (
      <Link href="/#works" className="next-project">
        <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{fallbackLabel}</span>
        <strong className="font-mincho mt-2 text-[clamp(24px,4vw,44px)]">Selected Works</strong>
        <ArrowRightIcon className="h-7 w-7" />
      </Link>
    )
  }

  const currentIndex = works.findIndex((work) => work.slug === currentSlug)
  const next = works[(currentIndex + 1) % works.length]

  return (
    <Link href={`/works/${next.slug}`} className="next-project">
      <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{label}</span>
      <strong className="font-mincho mt-2 text-[clamp(24px,4vw,44px)]">{next.title}</strong>
      <ArrowRightIcon className="h-7 w-7" />
    </Link>
  )
}
