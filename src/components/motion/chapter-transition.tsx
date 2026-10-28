/** Decorative only: the destination remains ordinary, accessible HTML below. */
export function ChapterTransition({ ja }: { ja: boolean }) {
  return (
    <div className="manga-cut" aria-hidden="true">
      <div className="manga-cut__arrival" data-cut-arrival>
        <span className="manga-cut__kicker">01 / NEXT CHAPTER</span>
        <div className="manga-cut__word" data-cut-word><span>SELECTED</span><strong>WORKS<span>↘</span></strong></div>
        <p>{ja ? 'つくったものに、会いにいこう。' : 'Meet the things I make.'}</p>
        <span className="manga-cut__scroll">KEEP SCROLLING ↓</span>
      </div>
      <div className="manga-cut__slash" data-cut-slash><span>LET’S PLAY.</span></div>
    </div>
  )
}
