export function TechStackChips({
  items,
  className = '',
}: {
  items: string[]
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <ul className={`m-0 flex list-none flex-wrap gap-2 p-0 ${className}`} aria-label="Technology stack">
      {items.map((item) => (
        <li
          key={item}
          className="font-mono rounded-full border border-line bg-bg/35 px-3 py-1 text-[10px] tracking-[0.08em] text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
