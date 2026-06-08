interface SectionHeaderProps {
  kicker?: string
  title: string
  subtitle?: string
}

export function SectionHeader({ kicker, title, subtitle }: SectionHeaderProps) {
  return (
    <header className="magazine-section-header mb-6">
      {kicker ? <p className="magazine-kicker">{kicker}</p> : null}
      <h2 className="magazine-display">{title}</h2>
      {subtitle ? <p className="magazine-deck">{subtitle}</p> : null}
      <hr className="magazine-rule" />
    </header>
  )
}
