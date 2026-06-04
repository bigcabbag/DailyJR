import { useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { MonthlyLineChart } from '../components/MonthlyLineChart'
import { useFinance } from '../context/FinanceContext'
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
  const records = snapshot?.records ?? []
  const settings = snapshot?.settings

  const [from, setFrom] = useState(START_DATE)
  const [to, setTo] = useState(today())

  const filtered = useMemo(
    () => filterByDateRange(records, from, to),
    [records, from, to],
  )

  const tableRows = useMemo(() => categoryTableRows(filtered), [filtered])
  const lineData = useMemo(
    () => monthlyExpenseTotals(filtered),
    [filtered],
  )

  if (!settings) return null

  const inputClass =
    'rounded-xl border border-teal-accent/30 bg-white/50 px-3 py-2 text-sm dark:bg-white/10'

  return (
    <div className="space-y-5">
      <GlassCard hover={false}>
        <h2 className="font-heading mb-4 text-lg font-semibold">日期范围</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs opacity-70">开始</label>
            <input
              type="date"
              value={from}
              min={START_DATE}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs opacity-70">结束</label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          月度支出趋势
        </h2>
        <MonthlyLineChart data={lineData} darkMode={settings.darkMode} />
      </GlassCard>

      <GlassCard hover={false}>
        <h2 className="font-heading mb-4 text-lg font-semibold">
          分类汇总
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/30 dark:border-white/10">
                <th className="py-2 pr-4 font-medium">类目</th>
                <th className="py-2 pr-4 font-medium">笔数</th>
                <th className="py-2 font-medium">合计</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr
                  key={row.category}
                  className="border-b border-white/20 dark:border-white/5"
                >
                  <td className="py-3 pr-4">
                    <i
                      className={`fa-solid ${CATEGORY_META[row.category].icon} mr-2 text-primary`}
                    />
                    {CATEGORY_META[row.category].label}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{row.count}</td>
                  <td className="py-3 tabular-nums font-medium">
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
