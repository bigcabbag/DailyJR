export function Header() {
  return (
    <header className="glass-header safe-top fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <h1
          className="font-heading text-xl font-semibold tracking-tight text-[var(--color-text-light)] lg:text-2xl dark:text-[var(--color-text-dark)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          北京实习流水
        </h1>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-accent/40 bg-white/40 text-primary dark:bg-white/10"
          aria-label="用户头像"
        >
          <i className="fa-solid fa-user text-sm" />
        </div>
      </div>
    </header>
  )
}
