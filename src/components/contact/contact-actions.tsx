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
    <div className="street-contact__actions">
      {email ? (
        <a href={`mailto:${email}`} className="street-contact__card street-contact__card--email">
          <span className="street-contact__card-top">
            <span className="street-contact__channel">01 / SAY HELLO</span>
            <MailIcon className="street-contact__icon" />
          </span>
          <span className="street-contact__card-heading">
            <strong>E-MAIL</strong>
            <ArrowUpRightIcon className="street-contact__arrow" />
          </span>
          <span className="street-contact__card-bottom">
            <span className="street-contact__action-label">{labels.email}</span>
            <span className="street-contact__address">{email}</span>
          </span>
        </a>
      ) : (
        <div className="street-contact__card street-contact__card--unavailable" aria-disabled="true">
          <span className="street-contact__card-top">
            <span className="street-contact__channel">01 / E-MAIL</span>
            <MailIcon className="street-contact__icon" />
          </span>
          <span className="street-contact__card-heading">
            <strong>E-MAIL</strong>
            <span aria-hidden="true">—</span>
          </span>
          <span className="street-contact__card-bottom">
            <span className="street-contact__action-label">{labels.email}</span>
            <span className="street-contact__address">{labels.emailPreparing}</span>
          </span>
        </div>
      )}

      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="street-contact__card street-contact__card--github"
      >
        <span className="street-contact__card-top">
          <span className="street-contact__channel">02 / THE SOURCE</span>
          <GithubIcon className="street-contact__icon" />
        </span>
        <span className="street-contact__card-heading">
          <strong>{labels.github}</strong>
          <ArrowUpRightIcon className="street-contact__arrow" />
        </span>
        <span className="street-contact__card-bottom">
          <span className="street-contact__action-label">{labels.githubMeta}</span>
        </span>
      </a>
    </div>
  )
}
