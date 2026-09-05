import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../lib/cart'
import { MiniCart } from './MiniCart'

function CartIcon() {
  const count = useCart().length
  return (
    <span className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-ink-700">
        <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z" />
      </svg>
      {count > 0 && (
        <span className="absolute top-1 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[0.6875rem] font-bold text-white tabular-nums">
          {count}
        </span>
      )}
    </span>
  )
}

/**
 * 桌機版購物車：hover 或點擊圖示展開 mini cart 浮層。
 * 游標離開圖示與浮層後延遲 250ms 收起，讓游標能跨過間隙移向浮層；
 * 點擊在觸控裝置上也能開啟預覽。前往購物車頁由浮層內按鈕負責。
 */
export function CartHover() {
  const count = useCart().length
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 250)
  }

  // 點擊外部或 Esc 關閉（點擊開啟時 hover 離開不一定會發生）
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
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

  return (
    <div ref={rootRef} className="relative" onMouseEnter={openNow} onMouseLeave={scheduleClose}>
      <button
        type="button"
        className="pg-nav-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`購物車，${count} 件商品`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <CartIcon />
      </button>

      {/* 浮層：淡入 + 輕微向下展開 */}
      <div
        role="region"
        aria-label="購物車預覽"
        aria-hidden={!open}
        className={`absolute right-0 z-50 mt-2 w-80 origin-top-right transition duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        {/* 指向圖示的小三角形 */}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 right-[0.9rem] h-3 w-3 rotate-45 rounded-[2px] border-t border-l border-line bg-white"
        />
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-xl">
          <MiniCart />
        </div>
      </div>
    </div>
  )
}

/**
 * 手機版購物車：點擊圖示開啟右側滑出抽屜（手機沒有 hover）。
 */
export function CartDrawerButton() {
  const count = useCart().length
  const [open, setOpen] = useState(false)

  // 抽屜開啟時鎖住背景捲動 + Esc 關閉
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="pg-nav-trigger"
        onClick={() => setOpen(true)}
        aria-label={`開啟購物車，${count} 件商品`}
        aria-expanded={open}
      >
        <CartIcon />
      </button>

      {/* 背景遮罩 */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink-900/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* 右側抽屜 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="購物車"
        inert={!open}
        className={`fixed top-0 right-0 bottom-0 z-50 flex w-[85vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-250 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-bold text-ink-900">購物車</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="關閉購物車"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-ink-700">
              <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MiniCart />
        </div>
      </div>
    </>
  )
}
