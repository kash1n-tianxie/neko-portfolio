/** Absolute scroll position, not an autoplay animation; reversing scroll reverses paint. */
export function streetSceneFrame(progress: number, viewportWidth: number) {
  if (!Number.isFinite(progress)) return { x: 0, y: 0 }
  const p = Math.min(1, Math.max(0, progress)) * 2 - 1
  const compact = !Number.isFinite(viewportWidth) || viewportWidth <= 650
  return { x: p * (compact ? 18 : 44), y: p === 0 ? 0 : -p * (compact ? 14 : 28) }
}
