import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '概览', icon: 'fa-chart-pie' },
  { to: '/add', label: '记账', icon: 'fa-plus' },
  { to: '/transactions', label: '流水', icon: 'fa-list' },
  { to: '/reports', label: '报表', icon: 'fa-chart-line' },
  { to: '/settings', label: '设置', icon: 'fa-gear' },
]

export function BottomNav() {
  return (
    <nav className="editorial-header safe-bottom fixed right-0 bottom-0 left-0 z-50 border-t-2 border-[var(--color-ink)] lg:hidden dark:border-[#fafafa]">
      <div className="flex justify-around bg-[var(--color-paper-elevated)] py-1 dark:bg-[var(--color-paper-elevated-dark)]">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex min-h-12 min-w-12 cursor-pointer flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold uppercase tracking-wide ${
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-ink-muted)] dark:text-zinc-400'
              }`
            }
          >
            <i className={`fa-solid ${tab.icon} text-base`} />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
