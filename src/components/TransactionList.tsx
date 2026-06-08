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
      <p className="py-8 text-center text-sm leading-relaxed text-[var(--color-ink-muted)]">
        暂无记录。可从 2026 年 6 月 4 日起添加第一笔账目。
      </p>
    )
  }

  return (
    <ul>
      {shown.map((r) => {
        const meta = CATEGORY_META[r.category]
        const isIncome = r.type === 'income'
        return (
          <li
            key={r.id}
            className="tx-row flex items-center gap-3 py-4 first:pt-0 last:border-0"
          >
            <div className="tx-icon flex h-10 w-10 shrink-0 items-center justify-center">
              <i
                className={`fa-solid ${meta.icon} text-sm text-[var(--color-ink-muted)]`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {meta.label}
                {r.note ? (
                  <span className="ml-1 font-normal text-[var(--color-ink-muted)]">
                    · {r.note}
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-xs tracking-wide text-[var(--color-ink-muted)]">
                {r.date}
              </p>
            </div>
            <p
              className={`shrink-0 font-semibold tabular-nums ${
                isIncome ? 'text-success' : 'text-danger'
              }`}
            >
              {isIncome ? '+' : '−'}
              {formatMoney(r.amount, settings.currency)}
            </p>
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                className="editorial-btn flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-[var(--color-border)] text-danger transition-colors hover:border-danger dark:border-[var(--color-border-dark)]"
                aria-label="删除记录"
              >
                <i className="fa-solid fa-trash-can text-xs" />
              </button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
