import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({
  children,
  className = '',
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`editorial-card p-5 md:p-6 ${hover ? '' : 'no-hover'} ${className}`}
    >
      {children}
    </div>
  )
}
