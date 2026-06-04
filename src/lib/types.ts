export const START_DATE = '2026-06-04'

export type ExpenseCategory = 'taxi' | 'necessities' | 'meals'
export type IncomeCategory = 'salary'
export type Category = ExpenseCategory | IncomeCategory

export type RecordType = 'expense' | 'income'

export interface TransactionRecord {
  id: string
  date: string
  type: RecordType
  category: Category
  amount: number
  note?: string
}

export type CurrencyCode = 'CNY' | 'USD' | 'EUR'

export interface AppSettings {
  darkMode: boolean
  currency: CurrencyCode
  cloudSyncEnabled: boolean
  cloudApiUrl: string
}

export interface AppSnapshot {
  version: 1
  startDate: typeof START_DATE
  settings: AppSettings
  records: TransactionRecord[]
}

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  currency: 'CNY',
  cloudSyncEnabled: false,
  cloudApiUrl: 'https://api.example.com/sync',
}

export const CATEGORY_META: Record<
  Category,
  { label: string; type: RecordType; icon: string }
> = {
  taxi: { label: '打车', type: 'expense', icon: 'fa-car' },
  necessities: { label: '日用品', type: 'expense', icon: 'fa-basket-shopping' },
  meals: { label: '吃饭', type: 'expense', icon: 'fa-utensils' },
  salary: { label: '实习工资', type: 'income', icon: 'fa-wallet' },
}

export const RECORD_TYPE_LABEL: Record<RecordType, string> = {
  expense: '支出',
  income: '收入',
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'taxi',
  'necessities',
  'meals',
]

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
}
