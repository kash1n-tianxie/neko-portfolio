/**
 * 集中線 — manga speed lines that burst from a panel's edges on hover.
 * Pure SVG + CSS (see .speedlines in globals); rendered inside each koma.
 */
const LINES = [
  // [x1, y1, x2, y2] in a 100x100 viewBox, radiating outward from the frame
  [8, 6, -4, -6],
  [30, 3, 26, -9],
  [70, 3, 74, -9],
  [93, 7, 104, -5],
  [97, 30, 109, 26],
  [97, 72, 109, 76],
  [92, 94, 103, 105],
  [68, 97, 72, 109],
  [28, 97, 24, 109],
  [7, 93, -4, 104],
  [3, 68, -9, 72],
  [3, 28, -9, 24],
] as const

export function SpeedLines() {
  return (
    <svg
      className="speedlines"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {LINES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={{ transitionDelay: `${(i % 4) * 30}ms` }}
        />
      ))}
    </svg>
  )
}
