import { openDB, type IDBPDatabase } from 'idb'
import {
  DEFAULT_SETTINGS,
  START_DATE,
  type AppSettings,
  type AppSnapshot,
  type TransactionRecord,
} from './types'

const DB_NAME = 'intern-finance-db'
const STORE = 'kv'
const SNAPSHOT_KEY = 'snapshot'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(database) {
        database.createObjectStore(STORE)
      },
    })
  }
  return dbPromise
}

export function createDefaultSnapshot(): AppSnapshot {
  return {
    version: 1,
    startDate: START_DATE,
    settings: { ...DEFAULT_SETTINGS },
    records: [],
  }
}

export async function loadSnapshot(): Promise<AppSnapshot> {
  const db = await getDb()
  const stored = await db.get(STORE, SNAPSHOT_KEY)
  if (!stored) {
    const fresh = createDefaultSnapshot()
    await saveSnapshot(fresh)
    return fresh
  }
  return stored as AppSnapshot
}

export async function saveSnapshot(snapshot: AppSnapshot): Promise<void> {
  const db = await getDb()
  await db.put(STORE, snapshot, SNAPSHOT_KEY)
}

export async function updateSettings(
  settings: Partial<AppSettings>,
): Promise<AppSnapshot> {
  const snapshot = await loadSnapshot()
  snapshot.settings = { ...snapshot.settings, ...settings }
  await saveSnapshot(snapshot)
  return snapshot
}

export async function addRecord(
  record: TransactionRecord,
): Promise<AppSnapshot> {
  const snapshot = await loadSnapshot()
  snapshot.records.push(record)
  await saveSnapshot(snapshot)
  return snapshot
}

export async function deleteRecord(id: string): Promise<AppSnapshot> {
  const snapshot = await loadSnapshot()
  snapshot.records = snapshot.records.filter((r) => r.id !== id)
  await saveSnapshot(snapshot)
  return snapshot
}

export async function replaceSnapshot(
  snapshot: AppSnapshot,
): Promise<AppSnapshot> {
  if (snapshot.version !== 1) {
    throw new Error('不支持的备份版本')
  }
  await saveSnapshot(snapshot)
  return snapshot
}

export function parseImportJson(text: string): AppSnapshot {
  const data = JSON.parse(text) as AppSnapshot
  if (!data.records || !Array.isArray(data.records)) {
    throw new Error('备份文件无效：缺少 records 数组')
  }
  if (!data.settings) {
    data.settings = { ...DEFAULT_SETTINGS }
  }
  data.version = 1
  data.startDate = START_DATE
  return data
}

export function downloadJson(snapshot: AppSnapshot, filename?: string) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download =
    filename ?? `intern-finance-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
