/** Shared artwork and real HTML copy; the enclosing locale-aware link owns navigation. */
export function WorldEntryContent({ ja, compact = false }: { ja: boolean; compact?: boolean }) {
  const cue = ja ? 'クリックして冒険する' : 'CLICK TO EXPLORE'
  const artwork = (
    <span className="world-entry__art" aria-hidden="true">
      {/* Keep this generated pixel illustration in its original colors. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/world/pixel-world-invitation.webp" alt="" width={768} height={512} loading={compact ? 'eager' : 'lazy'} decoding="async" />
      {!compact && <span className="world-entry__art-note">A LITTLE WORLD, A LITTLE WONDER.</span>}
    </span>
  )

  if (compact) {
    return (
      <>
        {artwork}
        <span className="world-entry__preview-copy">
          <b>PIXEL WORLD</b>
          <span className="world-entry__cue">{cue}</span>
        </span>
        <span className="world-entry__arrow" aria-hidden="true">↗</span>
      </>
    )
  }

  return (
    <>
      {artwork}
      <div className="street-world__copy">
        <span className="street-world__index">EXPLORE / PIXEL WORLD</span>
        <h2 id="world-invitation-title">NEKO <span>TOWN</span></h2>
        <p className="street-world__invitation">{ja ? '小さな猫になって、町を冒険しよう。' : 'A little cat. A whole town to discover.'}</p>
        <p className="street-world__description">{ja ? '気になる路地へ、池のほとりへ。作品の向こうに、小さな寄り道を。' : 'Wander the lanes, pause by the pond, and find a little wonder beyond the work.'}</p>
        <span className="street-world__action"><b className="world-entry__cue">{cue}</b><span className="world-entry__arrow" aria-hidden="true">↗</span></span>
        <small className="street-world__controls">{ja ? 'キーボード・タッチ対応 / インストール不要' : 'KEYBOARD & TOUCH / NO DOWNLOAD'}</small>
      </div>
    </>
  )
}
