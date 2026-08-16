import { useEffect, useRef, useState } from 'react'
import { products } from '../data/catalog'
import { course } from '../data/course-detail'
import { cart, useCart, formatNT } from '../lib/cart'
import { Button } from '../ui/Button'
import { toast } from '../ui/Toast'
import { useLibrary, ownsCourse } from '../lib/library'

const product = products[0]
const saving = product.originalPrice ? product.originalPrice - product.price : 0

/**
 * 手機底部固定購買列。捲過頁首後才出現。
 * 「立即購買」加入購物車後導向結帳頁（與購買卡一致）。
 */
export function MobileCtaBar() {
  const owned = ownsCourse(useLibrary(), product.id)
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [adding, setAdding] = useState(false)
  const inCart = useCart().some((i) => i.id === product.id)
  const timer = useRef<number | null>(null)
  const addTimer = useRef<number | null>(null)

  useEffect(() => {
    /* rAF 節流：scroll 事件只排一個 frame；同值 setState 由 React 自動略過 */
    let ticking = false
    const update = () => {
      ticking = false
      setVisible(window.scrollY > 420)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timer.current) clearTimeout(timer.current)
      if (addTimer.current) clearTimeout(addTimer.current)
    }
  }, [])

  const buyNow = () => {
    setBusy(true)
    cart.add(product)
    timer.current = window.setTimeout(() => {
      location.href = './checkout.html'
    }, 350)
  }

  /** 加入購物車：短暫 loading 讓使用者知道有反應，完成後 toast 提示 */
  const addToCart = () => {
    setAdding(true)
    addTimer.current = window.setTimeout(() => {
      cart.add(product)
      setAdding(false)
      toast('已加入購物車', 'success')
    }, 350)
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      inert={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* 文字區：標籤與金額都不換行（加了截止日後字數變長，
            不設 nowrap 會在窄螢幕被擠成直排） */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold whitespace-nowrap text-brand-700">
            {course.purchase.priceDeadline ? `${course.purchase.priceDeadline}前` : ''}
            {course.purchase.priceLabel}
          </p>
          <p className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-lg font-bold text-ink-900 tabular-nums">
              {formatNT(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-ink-400 line-through tabular-nums">
                {formatNT(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-ink-500">省 {formatNT(saving)}</span>
          </p>
        </div>
        {owned ? (
          /* 已擁有：不再顯示購買，改為進入課程（與桌機購買卡一致） */
          <Button size="lg" className="shrink-0" href="./my-courses.html">
            開始學習
          </Button>
        ) : (
          <Button size="lg" className="shrink-0" onClick={buyNow} disabled={busy}>
            {busy ? '處理中…' : '立即購買'}
          </Button>
        )}

        {/* 加入購物車：與桌機購買卡同一組動線，手機以圖示鈕呈現。
            已加入時改為打勾並導向購物車頁 */}
        {owned ? null : inCart ? (
          <a
            href="./cart.html"
            aria-label="已加入購物車，前往購物車"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-100"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
            </svg>
          </a>
        ) : (
          <button
            type="button"
            onClick={addToCart}
            disabled={adding}
            aria-label="加入購物車"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-50 active:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 animate-spin">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M12 3a9 9 0 019 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
