import { useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { MonthlyLineChart } from '../components/MonthlyLineChart'
import { SectionHeader } from '../components/SectionHeader'
import { useFinance } from '../context/useFinance'
import {
  categoryTableRows,
  filterByDateRange,
  formatMoney,
  monthlyExpenseTotals,
} from '../lib/ledger'
import { CATEGORY_META, START_DATE } from '../lib/types'

const today = () => new Date().toISOString().slice(0, 10)

export function Reports() {
  const { snapshot } = useFinance()
  const records = snapshot?.records
  const settings = snapshot?.settings

  const [from, setFrom] = useState(START_DATE)
  const [to, setTo] = useState(today())

  const filtered = useMemo(
    () => filterByDateRange(records ?? [], from, to),
    [records, from, to],
  )

  const tableRows = useMemo(() => categoryTableRows(filtered), [filtered])
  const lineData = useMemo(
    () => monthlyExpenseTotals(filtered),
    [filtered],
  )

  if (!settings) return null

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="数据报表"
        title="支出分析"
        subtitle="按时间范围查看趋势与分类汇总。"
      />

      <GlassCard hover={false}>
        <p className="magazine-stat-label mb-4">日期范围</p>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs text-[var(--color-ink-muted)]">
              开始
            </label>
            <input
              type="date"
              value={from}
              min={START_DATE}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="editorial-input"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-[var(--color-ink-muted)]">
              结束
            </label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="editorial-input"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="magazine-card-title mb-5 border-b border-[var(--color-border)] pb-3 dark:border-[var(--color-border-dark)]">
          月度支出趋势
        </h3>
        <MonthlyLineChart data={lineData} darkMode={settings.darkMode} />
      </GlassCard>

      <GlassCard hover={false}>
        <h3 className="magazine-card-title mb-5 border-b border-[var(--color-border)] pb-3 dark:border-[var(--color-border-dark)]">
          分类汇总
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--color-ink)] dark:border-[#fafafa]">
                <th className="magazine-stat-label py-2 pr-4">类目</th>
                <th className="magazine-stat-label py-2 pr-4">笔数</th>
                <th className="magazine-stat-label py-2">合计</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.category}
                  className="border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]"
                >
                  <td className="py-3 pr-4 font-medium">
                    <i
                      className={`fa-solid ${CATEGORY_META[row.category].icon} mr-2 text-[var(--color-ink-muted)]`}
                    />
                    {CATEGORY_META[row.category].label}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{row.count}</td>
                  <td className="py-3 font-semibold tabular-nums">
                    {formatMoney(row.total, settings.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
