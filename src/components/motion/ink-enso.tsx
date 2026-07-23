/**
 * 円相 (ensō) — the single open brush-circle of zen painting, here a quiet
 * signature flourish behind the Contact heading (縁 = connection). One open
 * path with a slight overshoot; MotionProvider draws it with DrawSVGPlugin
 * when it scrolls in (`[data-enso-path]`). Static full circle without JS.
 * Server component.
 */
export function InkEnso({ className = '' }: { className?: string }) {
  return (
    <span className={`ink-enso ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          className="ink-enso__path"
          data-enso-path
          d="M135 41 C 92 17, 42 31, 29 79 C 17 125, 45 173, 100 177 C 156 181, 189 137, 178 90 C 170 53, 139 35, 118 32"
        />
      </svg>
    </span>
  )
}
