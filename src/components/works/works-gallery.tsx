'use client'

import { useMemo, useState } from 'react'
import type { Work } from '@/content/works'
import { ProjectCard } from './project-card'

const filters = ['ALL', 'WEB', 'GAME', 'TOOL'] as const
type Filter = (typeof filters)[number]

type WorksGalleryLabels = {
  filters: Record<Filter, string>
  resultCount: string
  emptyTitle: string
  emptyBody: string
  viewCase: string
  demo: string
  itch: string
  repo: string
  status: Record<NonNullable<Work['status']>, string>
}

export function WorksGallery({
  works,
  locale,
  labels,
}: {
  works: Work[]
  locale: 'ja' | 'en'
  labels: WorksGalleryLabels
}) {
  const [active, setActive] = useState<Filter>('ALL')
  const filtered = useMemo(
    () => (active === 'ALL' ? works : works.filter((work) => work.tag === active)),
    [active, works],
  )

  return (
    <div>
      <div className="works-toolbar">
        <div className="works-filters" role="group" aria-label="Project filter">
          {filters.map((filter) => {
            const count =
              filter === 'ALL' ? works.length : works.filter((work) => work.tag === filter).length
            return (
              <button
                key={filter}
                type="button"
                className="works-filter"
                data-active={active === filter}
                aria-pressed={active === filter}
                onClick={() => setActive(filter)}
                disabled={works.length === 0}
              >
                {labels.filters[filter]}
                <span>{String(count).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>
        <p className="font-mono m-0 text-[10px] tracking-[0.14em] text-muted" aria-live="polite">
          {filtered.length} {labels.resultCount}
        </p>
      </div>

      {works.length === 0 ? (
        <div className="works-empty" role="status">
          <span className="works-empty__index" aria-hidden="true">00</span>
          <div>
            <p className="font-mono m-0 text-[10px] tracking-[0.22em] text-accent">
              ARCHIVE SYSTEM / READY
            </p>
            <h3 className="font-mincho m-0 mt-3 text-[clamp(24px,4vw,42px)] font-bold">
              {labels.emptyTitle}
            </h3>
            <p className="m-0 mt-3 max-w-[50ch] text-[14px] text-muted">
              {labels.emptyBody}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {filtered.map((work) => (
            <ProjectCard
              key={work.slug}
              work={work}
              locale={locale}
              index={works.indexOf(work)}
              labels={{
                viewCase: labels.viewCase,
                demo: labels.demo,
                itch: labels.itch,
                repo: labels.repo,
                status: labels.status,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
