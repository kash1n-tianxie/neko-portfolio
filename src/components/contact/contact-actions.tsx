import { Magnetic } from '../motion/magnetic'
import { ArrowUpRightIcon, GithubIcon, MailIcon } from '../ui/icons'

export type ContactActionLabels = {
  email: string
  emailPreparing: string
  github: string
  githubMeta: string
}

export function ContactActions({
  email,
  githubUrl,
  labels,
}: {
  email: string
  githubUrl: string
  labels: ContactActionLabels
}) {
  return (
    <div className="contact-actions">
      <Magnetic className="h-full">
        {email ? (
          <a href={`mailto:${email}`} className="contact-action contact-action--primary h-full">
            <span className="contact-action__icon" aria-hidden="true">
              <MailIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="font-mincho block text-[16px] font-bold text-white">
                {labels.email}
              </span>
              <span className="font-mono mt-1 block truncate text-[10px] tracking-[0.08em] text-white/70">
                {email}
              </span>
            </span>
            <ArrowUpRightIcon className="ml-auto h-5 w-5 text-white" />
          </a>
        ) : (
          <div className="contact-action contact-action--disabled h-full" aria-disabled="true">
            <span className="contact-action__icon" aria-hidden="true">
              <MailIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="font-mincho block text-[16px] font-bold">{labels.email}</span>
              <span className="font-mono mt-1 block text-[10px] tracking-[0.08em] text-muted">
                {labels.emailPreparing}
              </span>
            </span>
            <span className="contact-action__arrow" aria-hidden="true">—</span>
          </div>
        )}
      </Magnetic>

      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-action"
      >
        <span className="contact-action__icon" aria-hidden="true">
          <GithubIcon className="h-5 w-5" />
        </span>
        <span>
          <span className="font-mincho block text-[16px] font-bold">{labels.github}</span>
          <span className="font-mono mt-1 block text-[10px] tracking-[0.08em] text-muted">
            {labels.githubMeta}
          </span>
        </span>
        <ArrowUpRightIcon className="ml-auto h-5 w-5" />
      </a>

    </div>
  )
}
