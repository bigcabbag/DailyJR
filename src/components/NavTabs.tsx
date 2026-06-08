import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '概览' },
  { to: '/add', label: '记一笔' },
  { to: '/transactions', label: '流水' },
  { to: '/reports', label: '报表' },
  { to: '/settings', label: '设置' },
]

export function NavTabs() {
  return (
    <nav className="mx-auto hidden max-w-6xl border-b border-[var(--color-border)] px-4 lg:flex lg:px-6 dark:border-[var(--color-border-dark)]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `nav-tab flex min-h-12 items-center px-4 pb-3 pt-4 ${
              isActive ? 'nav-tab-active' : ''
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
