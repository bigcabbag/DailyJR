import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { ExpenseDonutChart } from '../components/ExpenseDonutChart'
import { SectionHeader } from '../components/SectionHeader'
import { TransactionList } from '../components/TransactionList'
import { useFinance } from '../context/useFinance'
import { formatMoney, groupExpensesByCategory, summarize } from '../lib/ledger'

export function Dashboard() {
  const { loading, snapshot } = useFinance()

  const records = snapshot?.records
  const settings = snapshot?.settings

  const stats = useMemo(() => summarize(records ?? []), [records])
  const pieData = useMemo(
    () => groupExpensesByCategory(records ?? []),
    [records],
  )

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="spinner" aria-hidden />
        <p className="text-sm text-[var(--color-ink-muted)]">加载中…</p>
      </div>
    )
  }

  const { totalIncome, totalExpenses, netBalance } = stats

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="2026 · 北京实习专刊"
        title="财务概览"
        subtitle="从 6 月 4 日起，记录实习期间的每一笔收入与支出。"
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <GlassCard className="lg:col-span-5">
          <p className="magazine-stat-label">结余 Balance</p>
          <p
            className={`magazine-stat-value text-4xl md:text-5xl ${
              netBalance >= 0 ? 'text-[var(--color-ink)]' : 'text-danger'
            }`}
          >
            {formatMoney(netBalance, settings.currency)}
          </p>
          <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
            收入减去支出后的可用余额
          </p>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          <GlassCard>
            <p className="magazine-stat-label">总收入</p>
            <p className="magazine-stat-value text-success">
              {formatMoney(totalIncome, settings.currency)}
            </p>
          </GlassCard>
          <GlassCard>
            <p className="magazine-stat-label">总支出</p>
            <p className="magazine-stat-value text-danger">
              {formatMoney(totalExpenses, settings.currency)}
            </p>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <GlassCard className="lg:col-span-7">
          <div className="mb-5 flex items-end justify-between gap-2 border-b border-[var(--color-border)] pb-3 dark:border-[var(--color-border-dark)]">
            <h3 className="magazine-card-title">最近流水</h3>
            <Link to="/transactions" className="editorial-link">
              管理全部 →
            </Link>
          </div>
          <TransactionList
            records={records ?? []}
            settings={settings}
            limit={8}
          />
        </GlassCard>

        <GlassCard className="lg:col-span-5">
          <h3 className="magazine-card-title mb-5 border-b border-[var(--color-border)] pb-3 dark:border-[var(--color-border-dark)]">
            支出分类
          </h3>
          <ExpenseDonutChart data={pieData} darkMode={settings.darkMode} />
        </GlassCard>
      </div>
    </div>
  )
}
