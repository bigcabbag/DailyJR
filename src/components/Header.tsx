export function Header() {
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="editorial-header safe-top fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-3 lg:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="magazine-masthead-sub">Beijing Internship Ledger</p>
            <h1 className="magazine-masthead-title">北京实习流水</h1>
          </div>
          <div className="hidden text-right sm:block">
            <p className="magazine-masthead-sub">刊期</p>
            <p className="text-sm font-medium tabular-nums">{today}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
