import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

/**
 * 極簡 toast（無外部套件）：呼叫 toast('訊息') 即可。
 * 首次呼叫時才建立容器，掛在 <body> 最上層（z-60，高於導覽列與抽屜）。
 * 以 role="status" + aria-live 播報，螢幕閱讀器可感知。
 * prefers-reduced-motion 時不做位移動畫（由 CSS 全域規則處理）。
 */

type ToastKind = 'success' | 'error' | 'info'
type ToastItem = { id: number; message: string; kind: ToastKind }

let push: ((t: ToastItem) => void) | null = null
let seq = 0

function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    push = (t) => {
      setItems((list) => [...list, t])
      window.setTimeout(() => {
        setItems((list) => list.filter((i) => i.id !== t.id))
      }, 2600)
    }
    return () => {
      push = null
    }
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg ${
            t.kind === 'error'
              ? 'bg-red-700 text-white'
              : t.kind === 'success'
                ? 'bg-brand-950 text-white'
                : 'bg-ink-900 text-white'
          }`}
        >
          {t.kind === 'success' && (
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 fill-pulse-500">
              <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
            </svg>
          )}
          {t.kind === 'error' && (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  )
}

let mounted = false

function ensureHost() {
  if (mounted || typeof document === 'undefined') return
  mounted = true
  const el = document.createElement('div')
  document.body.appendChild(el)
  createRoot(el).render(<ToastHost />)
}

export function toast(message: string, kind: ToastKind = 'info') {
  ensureHost()
  // 容器可能還在掛載中，下一個 tick 再推送
  const item = { id: ++seq, message, kind }
  if (push) push(item)
  else window.setTimeout(() => push?.(item), 0)
}
