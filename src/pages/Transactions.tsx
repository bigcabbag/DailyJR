import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '../components/GlassCard'
import { TransactionList } from '../components/TransactionList'
import { useFinance } from '../context/FinanceContext'
import { filterByDateRange } from '../lib/ledger'
import {
  CATEGORY_META,
  EXPENSE_CATEGORIES,
  RECORD_TYPE_LABEL,
  START_DATE,
  type Category,
  type RecordType,
} from '../lib/types'

const today = () => new Date().toISOString().slice(0, 10)

type TypeFilter = 'all' | RecordType

export function Transactions() {
  const { snapshot, removeRecord } = useFinance()
  const records = snapshot?.records ?? []
  const settings = snapshot?.settings

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [from, setFrom] = useState(START_DATE)
  const [to, setTo] = useState(today())
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(() => {
    let list = filterByDateRange(records, from, to)
    if (typeFilter !== 'all') {
      list = list.filter((r) => r.type === typeFilter)
    }
    if (categoryFilter !== 'all') {
      list = list.filter((r) => r.category === categoryFilter)
    }
    const q = keyword.trim().toLowerCase()
    if (q) {
      list = list.filter((r) => {
        const label = CATEGORY_META[r.category].label.toLowerCase()
        const note = (r.note ?? '').toLowerCase()
        return label.includes(q) || note.includes(q) || r.date.includes(q)
      })
    }
    return list
  }, [records, from, to, typeFilter, categoryFilter, keyword])

  const categoryOptions = useMemo(() => {
    if (typeFilter === 'income') return ['salary'] as const
    if (typeFilter === 'expense') return EXPENSE_CATEGORIES
    return [...EXPENSE_CATEGORIES, 'salary'] as const
  }, [typeFilter])

  const handleDelete = (id: string) => {
    if (!window.confirm('确定删除这笔记录？删除后无法恢复。')) return
    void removeRecord(id).then(() => toast.success('已删除'))
  }

  if (!settings) return null

  const inputClass =
    'rounded-xl border border-teal-accent/30 bg-white/50 px-3 py-2 text-sm dark:bg-white/10'

  return (
    <div className="space-y-5">
      <GlassCard hover={false}>
        <h2 className="font-heading mb-1 text-xl font-semibold">流水管理</h2>
        <p className="mb-4 text-sm opacity-70">
          查看、筛选并删除记错的账目。概览页仅显示最近几条，完整记录请在此管理。
        </p>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTypeFilter(t)
                  setCategoryFilter('all')
                }}
                className={`ripple-btn min-h-12 rounded-xl px-4 text-sm font-medium ${
                  typeFilter === t
                    ? 'bg-primary text-white'
                    : 'bg-white/40 dark:bg-white/10'
                }`}
              >
                {t === 'all' ? '全部' : RECORD_TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs opacity-70">类目</label>
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as Category | 'all')
                }
                className={`${inputClass} min-h-12 w-full`}
              >
                <option value="all">全部类目</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_META[cat].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs opacity-70">开始日期</label>
              <input
                type="date"
                value={from}
                min={START_DATE}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className={`${inputClass} min-h-12 w-full`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs opacity-70">结束日期</label>
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className={`${inputClass} min-h-12 w-full`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs opacity-70">搜索</label>
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="备注、类目、日期"
                className={`${inputClass} min-h-12 w-full`}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold">
            共 {filtered.length} 笔
          </h3>
        </div>
        <TransactionList
          records={filtered}
          settings={settings}
          onDelete={handleDelete}
        />
      </GlassCard>
    </div>
  )
}
