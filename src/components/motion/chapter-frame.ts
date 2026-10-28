export function chapterFrame(progress: number) {
  const clamp = (value: number) => Math.min(1, Math.max(0, value))
  const p = Number.isFinite(progress) ? clamp(progress) : 0
  const departure = clamp(p / 0.42)
  const arrival = clamp((p - 0.5) / 0.24)
  const slash = p <= 0.5
    ? -130 + 130 * clamp((p - 0.12) / 0.38)
    : 130 * clamp((p - 0.5) / 0.26)
  return { departure, slash, arrival, wordShift: 16 * (1 - arrival) }
}

/** A tall hero scrolls naturally first; only its last viewport becomes sticky. */
export function chapterLayout(stageHeight: number, viewportHeight: number) {
  const startOffset = Math.max(0, stageHeight - viewportHeight)
  return {
    stickyTop: startOffset === 0 ? 0 : -startOffset,
    startOffset,
    travel: viewportHeight,
    height: stageHeight + viewportHeight,
  }
}
