import {
  CATEGORY_META,
  EXPENSE_CATEGORIES,
  START_DATE,
  type AppSettings,
  type Category,
  type CurrencyCode,
  type TransactionRecord,
} from './types'
import { CURRENCY_SYMBOL } from './types'

export function formatMonthLabel(month: string): string {
  const [year, mo] = month.split('-')
  return `${year}年${parseInt(mo, 10)}月`
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const sym = CURRENCY_SYMBOL[currency]
  return `${sym}${amount.toFixed(2)}`
}

export function isOnOrAfterStartDate(date: string): boolean {
  return date >= START_DATE
}

export function validateRecord(
  partial: Pick<TransactionRecord, 'date' | 'amount' | 'category' | 'type'>,
): string | null {
  if (!isOnOrAfterStartDate(partial.date)) {
    return `日期不能早于 ${START_DATE}`
  }
  if (partial.amount <= 0 || !Number.isFinite(partial.amount)) {
    return '金额必须大于 0'
  }
  const meta = CATEGORY_META[partial.category]
  if (meta.type !== partial.type) {
    return '类目与收支类型不匹配'
  }
  return null
}

export function summarize(records: TransactionRecord[]) {
  let totalIncome = 0
  let totalExpenses = 0
  for (const r of records) {
    if (r.type === 'income') totalIncome += r.amount
    else totalExpenses += r.amount
  }
  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  }
}

export function filterByDateRange(
  records: TransactionRecord[],
  from: string,
  to: string,
): TransactionRecord[] {
  return records.filter((r) => r.date >= from && r.date <= to)
}

export function groupExpensesByCategory(
  records: TransactionRecord[],
): { category: Category; total: number }[] {
  const map = new Map<Category, number>()
  for (const cat of EXPENSE_CATEGORIES) map.set(cat, 0)
  for (const r of records) {
    if (r.type !== 'expense') continue
    map.set(r.category, (map.get(r.category) ?? 0) + r.amount)
  }
  return EXPENSE_CATEGORIES.map((category) => ({
    category,
    total: map.get(category) ?? 0,
  })).filter((x) => x.total > 0)
}

export function monthlyExpenseTotals(
  records: TransactionRecord[],
): { month: string; total: number }[] {
  const map = new Map<string, number>()
  for (const r of records) {
    if (r.type !== 'expense') continue
    const month = r.date.slice(0, 7)
    map.set(month, (map.get(month) ?? 0) + r.amount)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }))
}

export function categoryTableRows(
  records: TransactionRecord[],
): { category: Category; count: number; total: number }[] {
  const counts = new Map<Category, number>()
  const totals = new Map<Category, number>()
  for (const r of records) {
    if (r.type !== 'expense') continue
    counts.set(r.category, (counts.get(r.category) ?? 0) + 1)
    totals.set(r.category, (totals.get(r.category) ?? 0) + r.amount)
  }
  return EXPENSE_CATEGORIES.map((category) => ({
    category,
    count: counts.get(category) ?? 0,
    total: totals.get(category) ?? 0,
  }))
}

export function applySettingsToDocument(settings: AppSettings) {
  document.documentElement.classList.toggle('dark', settings.darkMode)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', settings.darkMode ? '#09090b' : '#fafafa')
}
