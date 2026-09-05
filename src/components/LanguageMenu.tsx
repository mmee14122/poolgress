import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'

/**
 * 語言切換。目前只切換 UI 狀態 —— 實際 i18n 尚未接上，
 * 接上後把 setCurrent 換成路由或 i18n library 的切換函式即可。
 */
export function LanguageMenu({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(site.languages[0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="pg-nav-trigger flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-ivory-100"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-ink-500">
          <path d="M10 1.7a8.3 8.3 0 100 16.6 8.3 8.3 0 000-16.6zm5.6 5.4h-2.2a12 12 0 00-1.2-3.2 6.7 6.7 0 013.4 3.2zM10 3.4c.6.8 1.1 2 1.4 3.7H8.6c.3-1.7.8-2.9 1.4-3.7zM3.5 10c0-.6.1-1.2.2-1.7h2.6a15 15 0 000 3.4H3.7c-.1-.5-.2-1.1-.2-1.7zm.9 3.2h2.2c.3 1.2.7 2.3 1.2 3.2a6.7 6.7 0 01-3.4-3.2zm2.2-6.1H4.4a6.7 6.7 0 013.4-3.2c-.5.9-.9 2-1.2 3.2zM10 16.6c-.6-.8-1.1-2-1.4-3.7h2.8c-.3 1.7-.8 2.9-1.4 3.7zm1.6-5.2H8.4a13.4 13.4 0 010-3.4h3.2a13.4 13.4 0 010 3.4zm.6 5c.5-.9.9-2 1.2-3.2h2.2a6.7 6.7 0 01-3.4 3.2zm1.5-4.9a15 15 0 000-3.4h2.6a6.9 6.9 0 010 3.4h-2.6z" />
        </svg>
        {current.label}
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 fill-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-50 mt-2 w-36 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {site.languages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={lang.code === current.code}
                onClick={() => {
                  setCurrent(lang)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-ivory-50 ${
                  lang.code === current.code ? 'font-semibold text-brand-700' : 'text-ink-700'
                }`}
              >
                {lang.label}
                {lang.code === current.code && (
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-brand-600">
                    <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
