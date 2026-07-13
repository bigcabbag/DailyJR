import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确定',
  cancelLabel = '取消',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Prefer Cancel so Enter won't accidentally confirm a destructive action
    cancelRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="关闭对话框"
        className="absolute inset-0 cursor-pointer bg-black/40 dark:bg-black/60"
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="editorial-card relative z-10 w-full max-w-sm p-6 shadow-lg no-hover"
      >
        <h2
          id="confirm-dialog-title"
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-desc"
          className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]"
        >
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="editorial-btn min-h-10 border border-[var(--color-border)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] dark:border-[var(--color-border-dark)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`editorial-btn min-h-10 px-4 text-xs font-semibold uppercase tracking-wider text-white ${
              danger
                ? 'bg-[var(--color-danger)] hover:bg-red-700'
                : 'editorial-btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
