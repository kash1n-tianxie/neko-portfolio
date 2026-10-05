import { Link } from '@/i18n/navigation'
import type { Work } from '@/content/works'
import { ArrowRightIcon, ArrowUpRightIcon } from '../ui/icons'
import { TechStackChips } from './tech-stack-chips'

type ProjectCardLabels = {
  viewCase: string
  demo: string
  itch: string
  repo: string
  status: Record<NonNullable<Work['status']>, string>
}

export function ProjectCard({
  work,
  locale,
  index,
  labels,
  compact = false,
}: {
  work: Work
  locale: 'ja' | 'en'
  index: number
  labels: ProjectCardLabels
  compact?: boolean
}) {
  const status = work.status ?? 'IN_PROGRESS'

  return (
    <article className={`project-card group${compact ? ' project-card--compact' : ''}`}>
      <Link
        href={`/works/${work.slug}`}
        className="project-card__media"
        aria-label={`${work.title} — ${labels.viewCase}`}
        data-canvas-transition
      >
        <picture className="project-card__cover">
          <source media="(prefers-reduced-motion: reduce)" srcSet={work.thumbnail} />
          <img
            src={work.coverGif ?? work.thumbnail}
            alt=""
            width="720"
            height="480"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <span className="project-card__number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="project-card__status">
          <span aria-hidden="true" />
          {labels.status[status]}
        </span>
      </Link>

      <div className="project-card__body">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
            {work.tag} / {work.year}
          </span>
          {work.role && !compact && (
            <span className="text-right text-[11px] text-muted">{work.role[locale]}</span>
          )}
        </div>

        <h3 className="project-card__title font-mincho m-0 mt-3 text-[clamp(22px,3vw,32px)] font-bold leading-tight">
          <Link href={`/works/${work.slug}`} className="text-ink no-underline" data-canvas-transition>
            {work.title}
          </Link>
        </h3>
        <p className="project-card__summary m-0 mt-3 max-w-[58ch] text-[14px] leading-[1.85] text-muted">
          {work.summary[locale]}
        </p>
        <TechStackChips items={compact ? (work.tech ?? []).slice(0, 3) : (work.tech ?? [])} className="mt-5" />

        <div className="project-card__actions mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line-soft pt-5">
          <Link
            href={`/works/${work.slug}`}
            className="project-card__link text-ink"
            data-canvas-transition
          >
            {labels.viewCase}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          {work.links?.demo && (
            <a
              href={work.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link text-muted hover:text-ink"
            >
              {labels.demo}
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
          {work.links?.itch && (
            <a
              href={work.links.itch}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link text-muted hover:text-ink"
            >
              {labels.itch}
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
          {work.links?.repo && (
            <a
              href={work.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link text-muted hover:text-ink"
            >
              {labels.repo}
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
