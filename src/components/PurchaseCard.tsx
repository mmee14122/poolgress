import { useEffect, useRef, useState } from 'react'
import { course } from '../content/course'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { CourseCover } from './CourseCover'
import { formatPrice } from '../lib/format'

type Status = 'idle' | 'loading' | 'done'

const includes = [
  {
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3z',
    render: () => (
      <>
        課程長度約 <strong className="font-semibold text-ink-900">{course.purchase.totalHours}</strong> 小時
      </>
    ),
  },
  {
    icon: 'M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z',
    render: () => (
      <>
        <strong className="font-semibold text-ink-900">{course.purchase.lessonCount}</strong> 個課程單元
      </>
    ),
  },
  {
    icon: 'M17 4a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 21a3 3 0 01-2.5-1.4L13.4 17h-2.8l-1.5 2.6A3 3 0 016.6 21a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 4zm-8 4H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 100 2.4A1.2 1.2 0 0016 8zm2.5 3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z',
    render: () => (
      <>
        <strong className="font-semibold text-ink-900">{course.purchase.gameCount}</strong> 個遊戲闖關
      </>
    ),
  },
]

/**
 * 購買卡片。桌機 sticky 於右欄，手機以一般區塊插入內容流。
 *
 * 兩個按鈕的 loading／完成狀態目前是前端模擬 —— 接上金流時把
 * handlePurchase／handleAddToCart 換成實際請求，狀態機不需要改。
 */
export function PurchaseCard() {
  const { purchase } = course
  const [buyStatus, setBuyStatus] = useState<Status>('idle')
  const [cartStatus, setCartStatus] = useState<Status>('idle')
  const timers = useRef<number[]>([])

  // 元件卸載時清掉待執行的 timer，避免對已卸載元件 setState
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const run = (setStatus: (s: Status) => void) => {
    setStatus('loading')
    timers.current.push(
      window.setTimeout(() => {
        setStatus('done')
        timers.current.push(window.setTimeout(() => setStatus('idle'), 2200))
      }, 900),
    )
  }

  const discount = Math.round((1 - purchase.salePrice / purchase.originalPrice) * 100)

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white shadow-sm">
      <div className="p-4">
        <CourseCover compact />
      </div>

      <div className="px-5 pb-5">
        <p className="flex items-center gap-2 text-sm text-ink-500">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-felt-600">
            <path d="M16 11a4 4 0 10-4-4 4 4 0 004 4zm-8 0a4 4 0 10-4-4 4 4 0 004 4zm0 2c-2.7 0-8 1.3-8 4v3h9.5a6 6 0 01-.5-2.4c0-1.6.7-3 1.8-4.1A14 14 0 008 13zm8 0a6 6 0 100 12 6 6 0 000-12z" />
          </svg>
          已有 <strong className="font-semibold text-ink-900">{purchase.studentCount}</strong> 位學員參與此課程
        </p>

        <div className="mt-5 rounded-xl bg-ivory-50 p-4">
          <p className="mb-3 text-sm font-semibold text-ink-900">課程包含以下內容</p>
          <ul className="space-y-2.5 text-sm text-ink-500">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-ink-400">
                  <path d={item.icon} />
                </svg>
                {item.render()}
              </li>
            ))}
          </ul>
        </div>

        {purchase.offerNote && (
          <p className="mt-5 flex items-start gap-2 text-sm text-ink-500">
            <Badge tone="offer">優惠</Badge>
            <span className="pt-0.5">{purchase.offerNote}</span>
          </p>
        )}

        <div className="mt-5 flex items-baseline gap-2.5">
          <span className="text-3xl font-bold text-ink-900">{formatPrice(purchase.salePrice)}</span>
          <span className="text-base text-ink-400 line-through">
            {formatPrice(purchase.originalPrice)}
          </span>
          {discount > 0 && (
            <span className="text-sm font-semibold text-felt-600">省 {discount}%</span>
          )}
        </div>

        <div className="mt-5 space-y-2.5">
          <Button
            block
            size="lg"
            onClick={() => run(setBuyStatus)}
            disabled={buyStatus !== 'idle'}
          >
            {buyStatus === 'loading' && <Spinner />}
            {buyStatus === 'done' && <Check />}
            {buyStatus === 'idle' ? '立即購買' : buyStatus === 'loading' ? '處理中…' : '已前往結帳'}
          </Button>

          <Button
            block
            variant="secondary"
            size="lg"
            onClick={() => run(setCartStatus)}
            disabled={cartStatus !== 'idle'}
          >
            {cartStatus === 'loading' && <Spinner />}
            {cartStatus === 'done' && <Check />}
            {cartStatus === 'idle'
              ? '加入購物車'
              : cartStatus === 'loading'
                ? '加入中…'
                : '已加入購物車'}
          </Button>
        </div>

        {/* 狀態變化以文字播報給螢幕閱讀器，不只靠按鈕外觀 */}
        <p aria-live="polite" className="sr-only">
          {buyStatus === 'done' ? '已前往結帳' : cartStatus === 'done' ? '已加入購物車' : ''}
        </p>

        <p className="mt-4 text-center text-xs text-ink-400">
          可開立統編電子發票 · 購買後無限期觀看
        </p>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M12 3a9 9 0 019 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
    </svg>
  )
}
