import { useEffect, useRef, useState } from 'react'
import { session, displayNameOf, initialOf, type Session } from '../lib/session'

/** 選單項目；路徑皆為相對路徑，子資料夾部署也正確 */
const items = [
  {
    label: '個人檔案',
    href: './account.html',
    icon: 'M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z',
  },
  {
    label: '我的星星',
    href: './stars.html',
    icon: 'M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z',
  },
  {
    label: '邀請朋友',
    href: './invite.html',
    icon: 'M15 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4zM6 9V6H4v3H1v2h3v3h2v-3h3V9z',
  },
]

/**
 * 登入後的頭像選單（取代導覽列的「登入／註冊」）。
 * 桌機與手機共用；深色導覽列時由 header.nav-hero 的 CSS 覆寫顏色，
 * 展開的面板維持白底深色字（面板帶 role="menu"，在 reset 範圍內）。
 */
export function AccountMenu({ user }: { user: Session }) {
  const [open, setOpen] = useState(false)
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

  const signOut = () => {
    session.signOut()
    setOpen(false)
    location.href = './index.html'
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`帳號選單，${displayNameOf(user)}`}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white ring-1 ring-brand-200 transition-[filter] duration-150 hover:brightness-110"
      >
        {initialOf(user)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {/* 目前登入的帳號 */}
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink-900">{displayNameOf(user)}</p>
            <p className="truncate text-xs text-ink-500">{user.email}</p>
          </div>

          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ivory-50 hover:text-ink-900"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-ink-400">
                <path d={item.icon} />
              </svg>
              {item.label}
            </a>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            className="flex w-full items-center gap-3 border-t border-line px-4 py-2.5 text-left text-sm text-ink-700 transition-colors hover:bg-ivory-50 hover:text-ink-900"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-ink-400">
              <path d="M10 3H5a2 2 0 00-2 2v14a2 2 0 002 2h5v-2H5V5h5zm6.5 4.5L15 9l2 2H9v2h8l-2 2 1.5 1.5L21 12z" />
            </svg>
            登出
          </button>
        </div>
      )}
    </div>
  )
}
