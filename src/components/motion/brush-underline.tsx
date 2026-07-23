/**
 * 一筆の下線 — a sumi brush stroke under section headings. Two overlapping
 * paths (an ink wash + a shorter accent tip) that MotionProvider draws with
 * GSAP DrawSVGPlugin on scroll-in (`[data-brush-path]`). With no JS / reduced
 * motion the paths simply render whole, so it degrades to a static stroke.
 * Server component — pure markup, no client cost.
 */
export function BrushUnderline({ className = '' }: { className?: string }) {
  return (
    <span className={`brush-underline ${className}`} aria-hidden="true">
      <svg viewBox="0 0 240 14" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          className="brush-underline__wash"
          data-brush-path
          d="M3 8.4 C 46 3.2, 92 12, 138 7.1 C 180 3.4, 214 9.2, 237 5.8"
        />
        <path
          className="brush-underline__tip"
          data-brush-path
          d="M3 8.6 C 28 5.6, 55 9.4, 82 7.2"
        />
      </svg>
    </span>
  )
}
