import {
  useCallback,
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
import { loadCloudSnapshot, saveCloudSnapshot } from '../lib/cloudSnapshot'
import { applySettingsToDocument } from '../lib/ledger'
import type { AppSettings, AppSnapshot, TransactionRecord } from '../lib/types'
import { FinanceContext, type SyncStatus } from './finance'
import { useAuth } from './useAuth'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '同步失败'
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading, isConfigured, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [snapshot, setSnapshot] = useState<AppSnapshot | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    isConfigured ? 'local' : 'unconfigured',
  )
  const [syncError, setSyncError] = useState<string | null>(null)

  const applySnapshot = useCallback((data: AppSnapshot) => {
    setSnapshot(data)
    applySettingsToDocument(data.settings)
  }, [])

  const refresh = useCallback(async () => {
    if (authLoading) return
    setLoading(true)
    try {
      const local = await loadSnapshot()

      if (!isConfigured) {
        setSyncStatus('unconfigured')
        setSyncError(null)
        applySnapshot(local)
        return
      }

      if (!user) {
        setSyncStatus('local')
        setSyncError(null)
        applySnapshot(local)
        return
      }

      setSyncStatus('syncing')
      const remote = await loadCloudSnapshot()

      if (remote) {
        const data = await replaceSnapshot(remote.snapshot)
        applySnapshot(data)
      } else {
        await saveCloudSnapshot(user.id, local)
        applySnapshot(local)
      }

      setSyncStatus('synced')
      setSyncError(null)
    } catch (error) {
      const local = await loadSnapshot()
      applySnapshot(local)
      setSyncStatus('error')
      setSyncError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [applySnapshot, authLoading, isConfigured, user])

  useEffect(() => {
    if (authLoading) return
    queueMicrotask(() => {
      void refresh()
    })
  }, [authLoading, refresh])

  const saveSyncedSnapshot = useCallback(
    async (data: AppSnapshot) => {
      const next = await replaceSnapshot(data)
      applySnapshot(next)

      if (!isConfigured) {
        setSyncStatus('unconfigured')
        setSyncError(null)
        return next
      }

      if (!user) {
        setSyncStatus('local')
        setSyncError(null)
        return next
      }

      setSyncStatus('syncing')
      try {
        await saveCloudSnapshot(user.id, next)
        setSyncStatus('synced')
        setSyncError(null)
      } catch (error) {
        setSyncStatus('error')
        setSyncError(getErrorMessage(error))
      }

      return next
    },
    [applySnapshot, isConfigured, user],
  )

  const syncNow = useCallback(async () => {
    if (!isConfigured) {
      throw new Error('请先配置 Supabase 环境变量')
    }
    if (!user) {
      throw new Error('请先登录账号')
    }

    setSyncStatus('syncing')
    const local = await loadSnapshot()
    const remote = await loadCloudSnapshot()

    if (remote) {
      const data = await replaceSnapshot(remote.snapshot)
      applySnapshot(data)
    } else {
      await saveCloudSnapshot(user.id, local)
      applySnapshot(local)
    }

    setSyncStatus('synced')
    setSyncError(null)
  }, [applySnapshot, isConfigured, user])

  const saveRecord = useCallback(async (record: TransactionRecord) => {
    const data = await addRecord(record)
    await saveSyncedSnapshot(data)
  }, [saveSyncedSnapshot])

  const removeRecord = useCallback(async (id: string) => {
    const data = await deleteRecord(id)
    await saveSyncedSnapshot(data)
  }, [saveSyncedSnapshot])

  const patchSettings = useCallback(async (settings: Partial<AppSettings>) => {
    const data = await updateSettings(settings)
    await saveSyncedSnapshot(data)
  }, [saveSyncedSnapshot])

  const importSnapshot = useCallback(async (next: AppSnapshot) => {
    const data = await replaceSnapshot(next)
    await saveSyncedSnapshot(data)
  }, [saveSyncedSnapshot])

  const value = useMemo(
    () => ({
      loading,
      snapshot,
      syncStatus,
      syncError,
      refresh,
      syncNow,
      saveRecord,
      removeRecord,
      patchSettings,
      importSnapshot,
    }),
    [
      loading,
      snapshot,
      syncStatus,
      syncError,
      refresh,
      syncNow,
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
