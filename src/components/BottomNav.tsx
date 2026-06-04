import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '概览', icon: 'fa-chart-pie' },
  { to: '/add', label: '记账', icon: 'fa-plus-circle' },
  { to: '/transactions', label: '流水', icon: 'fa-list' },
  { to: '/reports', label: '报表', icon: 'fa-chart-line' },
  { to: '/settings', label: '设置', icon: 'fa-gear' },
]

export function BottomNav() {
  return (
    <nav className="glass-header safe-bottom fixed right-0 bottom-0 left-0 z-50 border-t border-teal-accent/30 lg:hidden">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 px-2 text-xs ${
                isActive ? 'text-primary' : 'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]'
              }`
            }
          >
            <i className={`fa-solid ${tab.icon} text-lg`} />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
