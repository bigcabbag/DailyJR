import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { GlassCard } from '../components/GlassCard'
import { SectionHeader } from '../components/SectionHeader'
import { TransactionList } from '../components/TransactionList'
import { useFinance } from '../context/useFinance'
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
  const records = snapshot?.records
  const settings = snapshot?.settings

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [from, setFrom] = useState(START_DATE)
  const [to, setTo] = useState(today())
  const [keyword, setKeyword] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = filterByDateRange(records ?? [], from, to)
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

  const handleDeleteRequest = (id: string) => {
    setPendingDeleteId(id)
  }

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return
    const id = pendingDeleteId
    setPendingDeleteId(null)
    void removeRecord(id).then(() => toast.success('已删除'))
  }

  if (!settings) return null

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker="账目管理"
        title="流水"
        subtitle="查看、筛选并删除记错的账目。"
      />

      <GlassCard hover={false}>
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
                className={`editorial-btn min-h-10 border px-4 text-xs font-semibold uppercase tracking-wider ${
                  typeFilter === t
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white dark:border-[#fafafa] dark:bg-[#fafafa] dark:text-[var(--color-ink)]'
                    : 'border-[var(--color-border)] text-[var(--color-ink-muted)] dark:border-[var(--color-border-dark)]'
                }`}
              >
                {t === 'all' ? '全部' : RECORD_TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="magazine-stat-label mb-2 block">类目</label>
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as Category | 'all')
                }
                className="editorial-input"
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
              <label className="magazine-stat-label mb-2 block">开始</label>
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
              <label className="magazine-stat-label mb-2 block">结束</label>
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className="editorial-input"
              />
            </div>
            <div>
              <label className="magazine-stat-label mb-2 block">搜索</label>
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="备注、类目、日期"
                className="editorial-input"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <p className="magazine-stat-label mb-4">
          共 {filtered.length} 笔记录
        </p>
        <TransactionList
          records={filtered}
          settings={settings}
          onDelete={handleDeleteRequest}
        />
      </GlassCard>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="确认删除"
        message="确定删除这笔记录？删除后无法恢复。"
        confirmLabel="删除"
        cancelLabel="取消"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
