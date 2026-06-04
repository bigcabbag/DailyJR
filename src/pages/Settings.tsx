import { useRef } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '../components/GlassCard'
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
    'flex min-h-12 flex-wrap items-center justify-between gap-3 border-b border-white/25 py-4 last:border-0 dark:border-white/10'

  return (
    <GlassCard className="mx-auto max-w-lg" hover={false}>
      <h2 className="font-heading mb-2 text-xl font-semibold">设置</h2>

      <div className={rowClass}>
        <div>
          <p className="font-medium">深色模式</p>
          <p className="text-xs opacity-60">切换时平滑过渡</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.darkMode}
          onClick={() =>
            void patchSettings({ darkMode: !settings.darkMode })
          }
          className={`ripple-btn relative h-8 w-14 rounded-full transition-colors ${
            settings.darkMode ? 'bg-primary' : 'bg-white/50 dark:bg-white/20'
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
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
          className="min-h-12 rounded-xl border border-teal-accent/30 bg-white/50 px-4 dark:bg-white/10"
        >
          <option value="CNY">人民币 (¥)</option>
          <option value="USD">美元 ($)</option>
          <option value="EUR">欧元 (€)</option>
        </select>
      </div>

      <div className={rowClass}>
        <div>
          <p className="font-medium">云端同步</p>
          <p className="text-xs opacity-60">占位功能，不会真实请求接口</p>
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
          className={`ripple-btn relative h-8 w-14 rounded-full transition-colors ${
            settings.cloudSyncEnabled
              ? 'bg-primary'
              : 'bg-white/50 dark:bg-white/20'
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              settings.cloudSyncEnabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {settings.cloudSyncEnabled ? (
        <div className="pb-4">
          <label className="mb-1 block text-xs opacity-70">接口地址</label>
          <input
            type="url"
            value={settings.cloudApiUrl}
            onChange={(e) =>
              void patchSettings({ cloudApiUrl: e.target.value })
            }
            className="w-full rounded-xl border border-teal-accent/30 bg-white/50 px-3 py-2 text-sm dark:bg-white/10"
            placeholder="https://api.example.com/sync"
          />
        </div>
      ) : null}

      <div className={`${rowClass} flex-col !items-stretch`}>
        <p className="font-medium">备份与恢复</p>
        <p className="text-xs opacity-60">
          数据保存在本浏览器 IndexedDB 中，建议定期导出 JSON 备份。
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadJson(snapshot)}
            className="ripple-btn min-h-12 rounded-xl bg-primary px-5 text-sm font-medium text-white hover:bg-primary-hover"
          >
            <i className="fa-solid fa-download mr-2" />
            导出 JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="ripple-btn min-h-12 rounded-xl border border-teal-accent/40 bg-white/40 px-5 text-sm font-medium dark:bg-white/10"
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

      <p className="mt-4 text-xs opacity-50">
        记账起始日 {snapshot.startDate} · 北京实习开销
      </p>
    </GlassCard>
  )
}
