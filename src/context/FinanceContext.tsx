import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  addRecord,
  deleteRecord,
  loadSnapshot,
  replaceSnapshot,
  updateSettings,
} from '../lib/db'
import { applySettingsToDocument } from '../lib/ledger'
import type { AppSettings, AppSnapshot, TransactionRecord } from '../lib/types'

interface FinanceContextValue {
  loading: boolean
  snapshot: AppSnapshot | null
  refresh: () => Promise<void>
  saveRecord: (record: TransactionRecord) => Promise<void>
  removeRecord: (id: string) => Promise<void>
  patchSettings: (settings: Partial<AppSettings>) => Promise<void>
  importSnapshot: (snapshot: AppSnapshot) => Promise<void>
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [snapshot, setSnapshot] = useState<AppSnapshot | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await loadSnapshot()
      setSnapshot(data)
      applySettingsToDocument(data.settings)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const saveRecord = useCallback(async (record: TransactionRecord) => {
    const data = await addRecord(record)
    setSnapshot(data)
  }, [])

  const removeRecord = useCallback(async (id: string) => {
    const data = await deleteRecord(id)
    setSnapshot(data)
  }, [])

  const patchSettings = useCallback(async (settings: Partial<AppSettings>) => {
    const data = await updateSettings(settings)
    setSnapshot(data)
    applySettingsToDocument(data.settings)
  }, [])

  const importSnapshot = useCallback(async (next: AppSnapshot) => {
    const data = await replaceSnapshot(next)
    setSnapshot(data)
    applySettingsToDocument(data.settings)
  }, [])

  const value = useMemo(
    () => ({
      loading,
      snapshot,
      refresh,
      saveRecord,
      removeRecord,
      patchSettings,
      importSnapshot,
    }),
    [
      loading,
      snapshot,
      refresh,
      saveRecord,
      removeRecord,
      patchSettings,
      importSnapshot,
    ],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
