import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Header } from './Header'
import { NavTabs } from './NavTabs'

export function Layout() {
  return (
    <div className="app-background relative min-h-dvh">
      <Header />
      <div className="relative z-10 pt-16">
        <NavTabs />
        <main className="mx-auto max-w-6xl px-4 pb-28 lg:px-6 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
