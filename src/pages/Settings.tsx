import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { GlassCard } from '../components/GlassCard'
import { SectionHeader } from '../components/SectionHeader'
import { useAuth } from '../context/useAuth'
import { useFinance } from '../context/useFinance'
import { downloadJson, parseImportJson } from '../lib/db'
import type { CurrencyCode } from '../lib/types'

type AuthMode = 'signIn' | 'signUp'

const syncStatusLabel = {
  unconfigured: '未配置',
  local: '本机模式',
  syncing: '同步中',
  synced: '已同步',
  error: '同步异常',
}

export function Settings() {
  const {
    snapshot,
    syncStatus,
    syncError,
    patchSettings,
    importSnapshot,
    syncNow,
  } = useFinance()
  const { isConfigured, user, signIn, signUp, signOut } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [syncBusy, setSyncBusy] = useState(false)

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthBusy(true)
    try {
      if (authMode === 'signIn') {
        await signIn(email.trim(), password)
        toast.success('已登录，正在同步数据')
      } else {
        await signUp(email.trim(), password)
        toast.success('注册成功；如开启邮箱验证，请先到邮箱确认')
      }
      setPassword('')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '认证失败')
    } finally {
      setAuthBusy(false)
    }
  }

  const handleSignOut = async () => {
    setAuthBusy(true)
    try {
      await signOut()
      toast.success('已退出登录')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '退出失败')
    } finally {
      setAuthBusy(false)
    }
  }

  const handleSyncNow = async () => {
    setSyncBusy(true)
    try {
      await syncNow()
      toast.success('同步完成')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '同步失败')
    } finally {
      setSyncBusy(false)
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
            aria-label="切换深色模式"
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
            aria-label="选择货币"
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

        <div className="border-b border-[var(--color-border)] py-4 dark:border-[var(--color-border-dark)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">云端同步</p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                使用 Supabase 邮箱账号，让手机和电脑共享同一份数据。
              </p>
            </div>
            <span className="border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] dark:border-[var(--color-border-dark)]">
              {syncStatusLabel[syncStatus]}
            </span>
          </div>

          {!isConfigured ? (
            <p className="text-xs leading-6 text-[var(--color-ink-muted)]">
              还没有配置 Supabase。请在 `.env.local` 中填写
              `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 后重启开发服务。
            </p>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  已登录；新增、删除和导入数据会自动保存到云端。
                </p>
                {syncError ? (
                  <p className="mt-2 text-xs text-danger">{syncError}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={syncBusy || syncStatus === 'syncing'}
                  onClick={() => void handleSyncNow()}
                  className="editorial-btn editorial-btn-primary min-h-11 px-5 text-xs uppercase tracking-wider disabled:opacity-60"
                >
                  {syncBusy || syncStatus === 'syncing' ? '同步中…' : '立即同步'}
                </button>
                <button
                  type="button"
                  disabled={authBusy}
                  onClick={() => void handleSignOut()}
                  className="editorial-btn min-h-11 border border-[var(--color-border)] px-5 text-xs uppercase tracking-wider dark:border-[var(--color-border-dark)] disabled:opacity-60"
                >
                  退出登录
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div className="flex gap-2">
                {(['signIn', 'signUp'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAuthMode(mode)}
                    className={`editorial-btn min-h-10 flex-1 border px-4 text-xs font-semibold uppercase tracking-wider ${
                      authMode === mode
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white dark:border-[#fafafa] dark:bg-[#fafafa] dark:text-[var(--color-ink)]'
                        : 'border-[var(--color-border)] text-[var(--color-ink-muted)] dark:border-[var(--color-border-dark)]'
                    }`}
                  >
                    {mode === 'signIn' ? '登录' : '注册'}
                  </button>
                ))}
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="editorial-input text-sm"
                placeholder="邮箱"
                autoComplete="email"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="editorial-input text-sm"
                placeholder="密码"
                autoComplete="current-password"
                minLength={6}
                required
              />
              <button
                type="submit"
                disabled={authBusy}
                className="editorial-btn editorial-btn-primary min-h-11 w-full px-5 text-xs uppercase tracking-wider disabled:opacity-60"
              >
                {authBusy
                  ? '处理中…'
                  : authMode === 'signIn'
                    ? '登录并同步'
                    : '注册账号'}
              </button>
            </form>
          )}
        </div>

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
              aria-label="导入 JSON 备份文件"
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
