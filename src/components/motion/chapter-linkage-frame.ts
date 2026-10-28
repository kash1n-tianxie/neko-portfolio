/** A single local scroll frame for the real heading and its nearby decoration. */
export function chapterLinkageFrame(progress: number, viewportWidth: number) {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 1
  const width = Number.isFinite(viewportWidth) ? Math.max(320, viewportWidth) : 320
  const remaining = 1 - p
  const compact = width <= 600

  return {
    headingX: Math.min(96, Math.max(24, width * 0.075)) * remaining,
    headingY: (compact ? 44 : 68) * remaining,
    headingRotate: remaining === 0 ? 0 : -3 * remaining,
    motifX: (compact ? 36 : 80) * remaining,
    motifY: remaining === 0 ? 0 : -(compact ? 30 : 58) * remaining,
    motifRotate: 6 - 14 * p,
    motifOpacity: 0.34 + 0.2 * p,
  }
}
