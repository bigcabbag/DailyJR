import { useRef } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '../components/GlassCard'
import { SectionHeader } from '../components/SectionHeader'
import { useFinance } from '../context/FinanceContext'
import { downloadJson, parseImportJson } from '../lib/db'
import type { CurrencyCode } from '../lib/types'

export function Settings() {
  const { snapshot, patchSettings, importSnapshot } = useFinance()
  const fileRef = useRef<HTMLInputElement>(null)

  if (!snapshot) return null

  const { settings } = snapshot

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const data = parseImportJson(text)
      await importSnapshot(data)
      toast.success('备份已导入')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '导入失败')
    }
  }

  const rowClass =
    'flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] py-4 last:border-0 dark:border-[var(--color-border-dark)]'

  const toggleClass = (on: boolean) =>
    `relative h-8 w-14 cursor-pointer border transition-colors ${
      on
        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
        : 'border-[var(--color-border)] bg-[var(--color-paper)] dark:border-[var(--color-border-dark)] dark:bg-[var(--color-paper-elevated-dark)]'
    }`

  return (
    <div className="mx-auto max-w-lg">
      <SectionHeader kicker="偏好" title="设置" />
      <GlassCard hover={false}>
        <div className={rowClass}>
          <div>
            <p className="font-medium">深色模式</p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              切换时平滑过渡
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.darkMode}
            onClick={() =>
              void patchSettings({ darkMode: !settings.darkMode })
            }
            className={toggleClass(settings.darkMode)}
          >
            <span
              className={`absolute top-1 h-6 w-6 bg-white shadow transition-transform ${
                settings.darkMode ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className={rowClass}>
          <p className="font-medium">货币</p>
          <select
            value={settings.currency}
            onChange={(e) =>
              void patchSettings({ currency: e.target.value as CurrencyCode })
            }
            className="editorial-input min-h-11 w-auto"
          >
            <option value="CNY">人民币 (¥)</option>
            <option value="USD">美元 ($)</option>
            <option value="EUR">欧元 (€)</option>
          </select>
        </div>

        <div className={rowClass}>
          <div>
            <p className="font-medium">云端同步</p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              占位功能，不会真实请求接口
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.cloudSyncEnabled}
            onClick={() =>
              void patchSettings({
                cloudSyncEnabled: !settings.cloudSyncEnabled,
              })
            }
            className={toggleClass(settings.cloudSyncEnabled)}
          >
            <span
              className={`absolute top-1 h-6 w-6 bg-white shadow transition-transform ${
                settings.cloudSyncEnabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {settings.cloudSyncEnabled ? (
          <div className="border-b border-[var(--color-border)] py-4 dark:border-[var(--color-border-dark)]">
            <label className="magazine-stat-label mb-2 block">接口地址</label>
            <input
              type="url"
              value={settings.cloudApiUrl}
              onChange={(e) =>
                void patchSettings({ cloudApiUrl: e.target.value })
              }
              className="editorial-input text-sm"
              placeholder="https://api.example.com/sync"
            />
          </div>
        ) : null}

        <div className={`${rowClass} flex-col !items-stretch !border-0`}>
          <p className="font-medium">备份与恢复</p>
          <p className="text-xs text-[var(--color-ink-muted)]">
            数据保存在本机 IndexedDB 中，建议定期导出 JSON 备份。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => downloadJson(snapshot)}
              className="editorial-btn editorial-btn-primary min-h-11 px-5 text-xs uppercase tracking-wider"
            >
              <i className="fa-solid fa-download mr-2" />
              导出 JSON
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="editorial-btn min-h-11 border border-[var(--color-border)] px-5 text-xs uppercase tracking-wider dark:border-[var(--color-border-dark)]"
            >
              <i className="fa-solid fa-upload mr-2" />
              导入 JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void handleImport(f)
                e.target.value = ''
              }}
            />
          </div>
        </div>

        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          记账起始日 {snapshot.startDate} · 北京实习开销
        </p>
      </GlassCard>
    </div>
  )
}
