import { getSupabaseClient } from './supabase'
import { normalizeSnapshot } from './db'
import type { AppSnapshot } from './types'

interface UserSnapshotRow {
  snapshot: AppSnapshot
  updated_at: string
}

export interface CloudSnapshot {
  snapshot: AppSnapshot
  updatedAt: string
}

export async function loadCloudSnapshot(): Promise<CloudSnapshot | null> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('user_snapshots')
    .select('snapshot, updated_at')
    .maybeSingle<UserSnapshotRow>()

  if (error) throw error
  if (!data) return null

  return {
    snapshot: normalizeSnapshot(data.snapshot),
    updatedAt: data.updated_at,
  }
}

export async function saveCloudSnapshot(
  userId: string,
  snapshot: AppSnapshot,
): Promise<CloudSnapshot> {
  const client = getSupabaseClient()
  const updatedAt = new Date().toISOString()
  const { data, error } = await client
    .from('user_snapshots')
    .upsert(
      {
        user_id: userId,
        snapshot,
        updated_at: updatedAt,
      },
      { onConflict: 'user_id' },
    )
    .select('snapshot, updated_at')
    .single<UserSnapshotRow>()

  if (error) throw error

  return {
    snapshot: normalizeSnapshot(data.snapshot),
    updatedAt: data.updated_at,
  }
}
