import { useEffect, useRef, useState } from 'react'
import { session, displayNameOf, readAvatarFile, type Session } from '../lib/session'
import { Avatar } from './Avatar'

/** 選單項目；路徑皆為相對路徑，子資料夾部署也正確 */
const items = [
  {
    label: '個人檔案',
    href: './account.html',
    icon: 'M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z',
  },
  {
    label: '我的課程',
    href: './my-courses.html',
    icon: 'M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z',
  },
  /* 「我的星星」不放在此清單：頂端的星星徽章已是同一個入口，避免重複 */
  {
    label: '我的訂單',
    href: './orders.html',
    icon: 'M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z',
  },
  {
    label: '邀請朋友',
    href: './invite.html',
    icon: 'M15 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4zM6 9V6H4v3H1v2h3v3h2v-3h3V9z',
  },
]

/**
 * 登入後的頭像選單（取代導覽列的「登入／註冊」）。
 *
 * 桌機：滑鼠移入即展開，移出延遲 250ms 收起（與 mini cart 一致），
 * 點擊也可切換；手機（無 hover）用點擊。
 * 面板頂端為大頭像、名稱與星星數，頭像可直接點擊更換。
 * 深色導覽列時外框由 header.nav-hero 覆寫，面板維持白底深色字。
 */
export function AccountMenu({ user }: { user: Session }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const closeTimer = useRef<number | null>(null)

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 250)
  }

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

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  const pickAvatar = async (file?: File) => {
    if (!file) return
    setError(null)
    try {
      session.setAvatar(await readAvatarFile(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : '頭像更換失敗')
    }
  }

  const signOut = () => {
    session.signOut()
    setOpen(false)
    location.href = './index.html'
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={openNow} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`帳號選單，${displayNameOf(user)}`}
        className="flex items-center gap-1 rounded-full transition-[filter] duration-150 hover:brightness-110"
      >
        <Avatar user={user} />
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 fill-ink-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {/* 頂部：大頭像（可點擊更換）＋名稱＋星星數 */}
          <div className="border-b border-line px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="更換頭像"
                className="group relative rounded-full"
              >
                <Avatar user={user} className="h-14 w-14 text-lg" />
                {/* hover 時覆蓋相機圖示提示可更換 */}
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
                    <path d="M9 3l-1.7 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.3L15 3zm3 5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                </span>
              </button>

              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-900">{displayNameOf(user)}</p>
                {/* 星星數（實際數值待後端） */}
                <a
                  href="./stars.html"
                  className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-brass-400/15 px-4 py-2 text-base font-bold text-brass-700 ring-1 ring-brass-400/40 transition-colors ring-inset hover:bg-brass-400/25"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-brass-600">
                    <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z" />
                  </svg>
                  <span className="tabular-nums">0</span>
                </a>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                pickAvatar(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            {error && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {error}
              </p>
            )}
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
