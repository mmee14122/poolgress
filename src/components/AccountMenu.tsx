import { useEffect, useRef, useState } from 'react'
import {
  session,
  displayNameOf,
  readAvatarFile,
  MAX_NAME_LENGTH,
  type Session,
} from '../lib/session'
import { Avatar } from './Avatar'
import { Button } from '../ui/Button'
import { currentUserMeta } from '../data/user'
import { useLibrary, totalStarsOf } from '../lib/library'
import { toast } from '../ui/Toast'

/**
 * 選單項目：個人檔案／我的課程／我的訂單／邀請好友＋頂部摘要與星星卡片；
 * 不放收藏、商城、通知等。路徑皆為相對路徑。
 */
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
  {
    label: '我的訂單',
    href: './orders.html',
    icon: 'M7 4h10l1 3h3v2h-1.2l-1.1 11.1A2 2 0 0116.7 22H7.3a2 2 0 01-2-1.9L4.2 9H3V7h3zm2 0l-.4 1h6.8L15 4zm-2.8 5l1 11h9.6l1-11z',
  },
  {
    label: '邀請好友',
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
 * 深色導覽列時觸發鈕（.pg-nav-trigger）由 nav state 變數上色，面板維持白底深色字。
 */
export function AccountMenu({ user }: { user: Session }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lib = useLibrary()
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const closeTimer = useRef<number | null>(null)

  /* 顯示名稱編輯（與個人檔案頁同一套規則） */
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const startEditName = () => {
    setNameValue(displayNameOf(user))
    setNameError(null)
    setEditingName(true)
    requestAnimationFrame(() => nameRef.current?.select())
  }

  const saveName = () => {
    const next = nameValue.trim()
    if (!next) {
      setNameError('請輸入顯示名稱')
      return
    }
    if (next.length > MAX_NAME_LENGTH) {
      setNameError(`顯示名稱最多 ${MAX_NAME_LENGTH} 個字`)
      return
    }
    session.setName(next)
    setEditingName(false)
    toast('名稱已更新', 'success')
  }

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    // 編輯名稱時不因滑鼠移開而收起，避免輸入到一半消失
    if (editingName) return
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 250)
  }

  // 選單收起時一併結束編輯狀態，下次展開回到乾淨畫面
  useEffect(() => {
    if (!open) setEditingName(false)
  }, [open])

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
      toast('頭像已更新', 'success')
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
        className="pg-nav-trigger flex items-center gap-1 rounded-full transition-[filter] duration-150 hover:brightness-110"
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
                <Avatar user={user} className="h-12 w-12 text-base" />
                {/* hover 時覆蓋相機圖示提示可更換 */}
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
                    <path d="M9 3l-1.7 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.3L15 3zm3 5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                </span>
              </button>

              <div className="min-w-0 flex-1">
                {editingName ? (
                  <div>
                    <input
                      ref={nameRef}
                      value={nameValue}
                      onChange={(e) => {
                        setNameValue(e.target.value)
                        setNameError(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveName()
                        if (e.key === 'Escape') setEditingName(false)
                      }}
                      maxLength={MAX_NAME_LENGTH}
                      aria-label="顯示名稱"
                      aria-invalid={nameError ? true : undefined}
                      className={`w-full rounded-lg border bg-white px-2.5 py-1.5 text-sm font-semibold text-ink-900 focus:outline-2 focus:outline-offset-1 ${
                        nameError
                          ? 'border-red-400 focus:outline-red-600'
                          : 'border-line focus:outline-brand-600'
                      }`}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={saveName}>
                        儲存
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingName(false)}>
                        取消
                      </Button>
                    </div>
                    {nameError && (
                      <p role="alert" className="mt-1 text-xs text-red-700">
                        {nameError}
                      </p>
                    )}
                  </div>
                ) : (
                  /* 整個名稱就是編輯入口；鉛筆圖示保留作為視覺提示 */
                  <button
                    type="button"
                    onDoubleClick={startEditName}
                    onPointerUp={(e) => {
                      if (e.pointerType !== 'mouse') startEditName()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        startEditName()
                      }
                    }}
                    title="點兩下更改顯示名稱"
                    className="group flex max-w-full items-center gap-1 rounded-lg text-left select-none"
                  >
                    <span className="truncate font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                      {displayNameOf(user)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors group-hover:bg-ivory-100 group-hover:text-brand-700"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                        <path d="M3 17.2V21h3.8L17.8 10 14 6.2zm17.7-12.9a1 1 0 000-1.4L18.1.3a1 1 0 00-1.4 0l-1.8 1.8L18.7 6z" />
                      </svg>
                    </span>
                    <span className="sr-only">（更改顯示名稱）</span>
                  </button>
                )}
                {/* 等級（規則待確認，值來自 data/user.ts） */}
                <p className="mt-0.5 text-xs font-semibold text-ink-500">
                  Lv.{currentUserMeta.level}
                </p>
              </div>

              {/* 前往個人檔案 */}
              <a
                href="./account.html"
                aria-label="前往個人檔案"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ivory-100 hover:text-brand-700"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
                </svg>
              </a>
            </div>

            {/* 挑戰星星卡片：金色細線星星＋數量＋右箭頭 → 我的星星 */}
            <a
              href="./stars.html"
              className="mt-3 flex items-center gap-3 rounded-xl bg-brass-400/10 px-4 py-3 ring-1 ring-brass-400/40 transition-colors ring-inset hover:bg-brass-400/20"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
                <path
                  d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z"
                  fill="none"
                  stroke="var(--color-brass-600)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="flex-1 text-sm font-semibold text-brass-700">挑戰星星</span>
              <span className="text-base font-bold text-brass-700 tabular-nums">{totalStarsOf(lib)}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 fill-brass-600">
                <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
              </svg>
            </a>

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
