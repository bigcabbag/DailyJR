import { CATEGORY_META } from '../lib/types'
import { formatMoney } from '../lib/ledger'
import type { AppSettings, TransactionRecord } from '../lib/types'

interface TransactionListProps {
  records: TransactionRecord[]
  settings: AppSettings
  onDelete?: (id: string) => void
  limit?: number
}

export function TransactionList({
  records,
  settings,
  onDelete,
  limit,
}: TransactionListProps) {
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
  const shown = limit ? sorted.slice(0, limit) : sorted

  if (shown.length === 0) {
    return (
      <p className="py-6 text-center text-sm opacity-70">
        暂无记录。可从 2026 年 6 月 4 日起添加第一笔账目。
      </p>
    )
  }

  return (
    <ul className="divide-y divide-white/30 dark:divide-white/10">
      {shown.map((r) => {
        const meta = CATEGORY_META[r.category]
        const isIncome = r.type === 'income'
        return (
          <li
            key={r.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/50 dark:bg-white/10">
              <i className={`fa-solid ${meta.icon} text-primary`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {meta.label}
                {r.note ? (
                  <span className="ml-1 font-normal opacity-70">· {r.note}</span>
                ) : null}
              </p>
              <p className="text-xs opacity-60">{r.date}</p>
            </div>
            <p
              className={`shrink-0 font-semibold tabular-nums ${
                isIncome ? 'text-success' : 'text-danger'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatMoney(r.amount, settings.currency)}
            </p>
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                className="ripple-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-danger hover:bg-white/40 dark:hover:bg-white/10"
                aria-label="删除记录"
              >
                <i className="fa-solid fa-trash-can text-sm" />
              </button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
