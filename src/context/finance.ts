import { createContext } from 'react'
import type { AppSettings, AppSnapshot, TransactionRecord } from '../lib/types'

export type SyncStatus =
  | 'unconfigured'
  | 'local'
  | 'syncing'
  | 'synced'
  | 'error'

export interface FinanceContextValue {
  loading: boolean
  snapshot: AppSnapshot | null
  syncStatus: SyncStatus
  syncError: string | null
  refresh: () => Promise<void>
  syncNow: () => Promise<void>
  saveRecord: (record: TransactionRecord) => Promise<void>
  removeRecord: (id: string) => Promise<void>
  patchSettings: (settings: Partial<AppSettings>) => Promise<void>
  importSnapshot: (snapshot: AppSnapshot) => Promise<void>
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
