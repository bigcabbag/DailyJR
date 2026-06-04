import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '概览', icon: 'fa-chart-pie' },
  { to: '/add', label: '记一笔', icon: 'fa-plus-circle' },
  { to: '/transactions', label: '流水', icon: 'fa-list' },
  { to: '/reports', label: '报表', icon: 'fa-chart-line' },
  { to: '/settings', label: '设置', icon: 'fa-gear' },
]

export function NavTabs() {
  return (
    <nav className="mx-auto hidden max-w-6xl gap-1 px-4 pt-2 pb-3 lg:flex lg:px-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `ripple-btn flex min-h-12 min-w-[5.5rem] flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : 'bg-white/40 text-[var(--color-text-light)] hover:bg-white/60 dark:bg-white/10 dark:text-[var(--color-text-dark)] dark:hover:bg-white/15'
            }`
          }
        >
          <i className={`fa-solid ${tab.icon}`} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
