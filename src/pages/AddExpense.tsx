import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GlassCard } from '../components/GlassCard'
import { SectionHeader } from '../components/SectionHeader'
import { useFinance } from '../context/FinanceContext'
import { validateRecord } from '../lib/ledger'
import {
  CATEGORY_META,
  EXPENSE_CATEGORIES,
  RECORD_TYPE_LABEL,
  START_DATE,
  type Category,
  type RecordType,
  type TransactionRecord,
} from '../lib/types'

const today = () => new Date().toISOString().slice(0, 10)

export function AddExpense() {
  const { saveRecord } = useFinance()
  const navigate = useNavigate()

  const [recordType, setRecordType] = useState<RecordType>('expense')
  const [category, setCategory] = useState<Category>('taxi')
  const [date, setDate] = useState(today() < START_DATE ? START_DATE : today())
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleTypeChange = (type: RecordType) => {
    setRecordType(type)
    setCategory(type === 'expense' ? 'taxi' : 'salary')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount)
    const record: Omit<TransactionRecord, 'id'> = {
      date,
      type: recordType,
      category,
      amount: parsed,
      note: note.trim() || undefined,
    }

    const err = validateRecord(record)
    if (err) {
      toast.error(err)
      return
    }

    setSaving(true)
    try {
      await saveRecord({ ...record, id: crypto.randomUUID() })
      toast.success('保存成功')
      setAmount('')
      setNote('')
      navigate('/')
    } catch {
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const incomeCategories = ['salary'] as const

  return (
    <div className="mx-auto max-w-lg">
      <SectionHeader
        kicker="记账"
        title="记一笔"
        subtitle="记录一笔支出或实习工资收入。"
      />
      <GlassCard hover={false}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-2 border-b border-[var(--color-border)] pb-5 dark:border-[var(--color-border-dark)]">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`editorial-btn min-h-11 flex-1 border px-4 text-xs font-semibold uppercase tracking-wider ${
                  recordType === t
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white dark:border-[#fafafa] dark:bg-[#fafafa] dark:text-[var(--color-ink)]'
                    : 'border-[var(--color-border)] bg-transparent text-[var(--color-ink-muted)] dark:border-[var(--color-border-dark)]'
                }`}
              >
                {RECORD_TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          <div>
            <label className="magazine-stat-label mb-2 block">类目</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="editorial-input"
            >
              {(recordType === 'expense'
                ? EXPENSE_CATEGORIES
                : incomeCategories
              ).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_META[cat].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="magazine-stat-label mb-2 block">日期</label>
            <input
              type="date"
              value={date}
              min={START_DATE}
              onChange={(e) => setDate(e.target.value)}
              className="editorial-input"
              required
            />
          </div>

          <div>
            <label className="magazine-stat-label mb-2 block">金额</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="editorial-input font-semibold tabular-nums"
              required
            />
          </div>

          <div>
            <label className="magazine-stat-label mb-2 block">
              备注（选填）
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：午饭、滴滴打车"
              className="editorial-input"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="editorial-btn editorial-btn-accent min-h-12 w-full px-4 text-sm uppercase tracking-wider disabled:opacity-60"
          >
            {saving ? '保存中…' : '保存记录'}
          </button>
        </form>
      </GlassCard>
    </div>
  )
}
