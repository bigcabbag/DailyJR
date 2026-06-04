import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { ExpenseDonutChart } from '../components/ExpenseDonutChart'
import { TransactionList } from '../components/TransactionList'
import { useFinance } from '../context/FinanceContext'
import { formatMoney, groupExpensesByCategory, summarize } from '../lib/ledger'

export function Dashboard() {
  const { loading, snapshot } = useFinance()

  const records = snapshot?.records ?? []
  const settings = snapshot?.settings

  const stats = useMemo(() => summarize(records), [records])
  const pieData = useMemo(() => groupExpensesByCategory(records), [records])

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="spinner" aria-hidden />
        <p className="text-sm opacity-70">加载中…</p>
      </div>
    )
  }

  const { totalIncome, totalExpenses, netBalance } = stats

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard>
          <p className="text-xs font-medium tracking-wide opacity-60">
            总收入
          </p>
          <p className="mt-2 font-heading text-2xl font-semibold text-success">
            {formatMoney(totalIncome, settings.currency)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs font-medium tracking-wide opacity-60">
            总支出
          </p>
          <p className="mt-2 font-heading text-2xl font-semibold text-danger">
            {formatMoney(totalExpenses, settings.currency)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs font-medium tracking-wide opacity-60">
            结余
          </p>
          <p
            className={`mt-2 font-heading text-2xl font-semibold ${
              netBalance >= 0 ? 'text-primary' : 'text-danger'
            }`}
          >
            {formatMoney(netBalance, settings.currency)}
          </p>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-semibold">最近流水</h2>
            <Link
              to="/transactions"
              className="text-sm font-medium text-primary hover:underline"
            >
              管理全部
              <i className="fa-solid fa-arrow-right ml-1 text-xs" />
            </Link>
          </div>
          <TransactionList
            records={records}
            settings={settings}
            limit={8}
          />
        </GlassCard>

        <GlassCard>
          <h2 className="font-heading mb-4 text-lg font-semibold">
            支出分类占比
          </h2>
          <ExpenseDonutChart data={pieData} darkMode={settings.darkMode} />
        </GlassCard>
      </div>
    </div>
  )
}
