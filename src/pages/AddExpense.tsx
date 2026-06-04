import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GlassCard } from '../components/GlassCard'
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

  const expenseCategories = EXPENSE_CATEGORIES
  const incomeCategories = ['salary'] as const

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
      await saveRecord({
        ...record,
        id: crypto.randomUUID(),
      })
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

  const inputClass =
    'w-full rounded-xl border border-teal-accent/30 bg-white/50 px-4 py-3 text-[var(--color-text-light)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-white/10 dark:text-[var(--color-text-dark)]'

  return (
    <GlassCard className="mx-auto max-w-lg" hover={false}>
      <h2 className="font-heading mb-6 text-xl font-semibold">记一笔</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-2">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`ripple-btn min-h-12 flex-1 rounded-xl px-4 text-sm font-medium ${
                recordType === t
                  ? 'bg-primary text-white'
                  : 'bg-white/40 dark:bg-white/10'
              }`}
            >
              {RECORD_TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">类目</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            {(recordType === 'expense'
              ? expenseCategories
              : incomeCategories
            ).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">日期</label>
          <input
            type="date"
            value={date}
            min={START_DATE}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">金额</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            备注（选填）
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如：午饭、滴滴打车"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="ripple-btn min-h-12 w-full rounded-xl bg-primary font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? '保存中…' : '保存'}
        </button>
      </form>
    </GlassCard>
  )
}
