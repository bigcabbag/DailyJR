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
      className={`glass-card p-5 ${hover ? '' : 'hover:!transform-none hover:!shadow-[0_8px_32px_rgba(0,0,0,0.08)]'} ${className}`}
    >
      {children}
    </div>
  )
}
