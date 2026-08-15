import { useEffect, useRef, useState } from 'react'
import { course } from '../content/course'
import { products } from '../content/catalog'
import { cart, useCart, formatNT } from '../lib/cart'
import { Button } from '../ui/Button'
import { CourseCover } from './CourseCover'

/** 這一頁對應的商品（⚠️ 價格為示範資料） */
const product = products[0]

type BuyState = 'idle' | 'loading' | 'done'

/**
 * 購買卡：桌機 sticky 於右欄，手機以一般內容區塊插入。
 * 「立即購買」加入購物車後導向結帳頁；「加入購物車」留在原頁。
 * 兩者皆有 loading／成功狀態，並以 aria-live 播報。
 */
export function CourseCard() {
  const inCart = useCart().some((i) => i.id === product.id)
  const [buyState, setBuyState] = useState<BuyState>('idle')
  const [addState, setAddState] = useState<BuyState>('idle')
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const buyNow = () => {
    setBuyState('loading')
    cart.add(product)
    // 短暫的處理狀態讓使用者知道有反應，再導向結帳
    timers.current.push(
      window.setTimeout(() => {
        setBuyState('done')
        timers.current.push(
          window.setTimeout(() => {
            location.href = './checkout.html'
          }, 350),
        )
      }, 450),
    )
  }

  const addToCart = () => {
    setAddState('loading')
    timers.current.push(
      window.setTimeout(() => {
        cart.add(product)
        setAddState('done')
      }, 450),
    )
  }

  const { purchase } = course
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white shadow-sm">
      <div className="p-4">
        <CourseCover compact />
      </div>

      <div className="px-5 pb-5">
        <p className="flex items-center gap-2 text-sm text-ink-500">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-felt-600">
            <path d="M16 11a4 4 0 10-4-4 4 4 0 004 4zm-8 0a4 4 0 10-4-4 4 4 0 004 4zm0 2c-2.7 0-8 1.3-8 4v3h9.5a6 6 0 01-.5-2.4c0-1.6.7-3 1.8-4.1A14 14 0 008 13zm8 0a6 6 0 100 12 6 6 0 000-12z" />
          </svg>
          已有 <strong className="font-semibold text-ink-900">{purchase.studentCount}</strong>
          位學員參與此課程
        </p>

        <div className="mt-4 rounded-xl bg-ivory-50 p-4">
          <p className="mb-3 text-sm font-semibold text-ink-900">課程包含以下內容</p>
          <ul className="space-y-2.5 text-sm text-ink-500">
            <li className="flex items-center gap-2.5">
              <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3z" />
              <span>
                課程長度約{' '}
                <strong className="font-semibold text-ink-900">{purchase.totalHours}</strong> 小時
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon d="M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z" />
              <span>
                <strong className="font-semibold text-ink-900">{purchase.lessonCount}</strong>
                個課程單元
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Icon d="M17 4a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 21a3 3 0 01-2.5-1.4L13.4 17h-2.8l-1.5 2.6A3 3 0 016.6 21a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 4zM9 8H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 100 2.4A1.2 1.2 0 0016 8zm2.5 3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
              <strong className="font-semibold text-ink-900">{purchase.gameCount}</strong>
              個遊戲練習題
            </li>
            <li className="flex items-center gap-2.5">
              {/* 無限符號 */}
              <Icon d="M6.2 8A4.8 4.8 0 0111 10.6 4.8 4.8 0 0115.8 8a4.3 4.3 0 010 8.6 4.8 4.8 0 01-4.8-2.6 4.8 4.8 0 01-4.8 2.6 4.3 4.3 0 010-8.6zm0 2.2a2.1 2.1 0 000 4.2c1.3 0 2.4-.9 3.1-2.1-.7-1.2-1.8-2.1-3.1-2.1zm9.6 0c-1.3 0-2.4.9-3.1 2.1.7 1.2 1.8 2.1 3.1 2.1a2.1 2.1 0 000-4.2z" />
              無限次觀看
            </li>
          </ul>
        </div>

        {purchase.offerNote && (
          <p className="mt-4 flex items-start gap-2 text-sm">
            <span className="inline-flex shrink-0 items-center rounded-full bg-brass-400/15 px-2.5 py-0.5 text-xs font-semibold text-brass-700 ring-1 ring-brass-400/40 ring-inset">
              優惠
            </span>
            <span className="pt-0.5 text-ink-500">{purchase.offerNote}</span>
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="text-3xl font-bold text-ink-900 tabular-nums">
            {formatNT(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-base text-ink-400 line-through tabular-nums">
              {formatNT(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="text-sm font-semibold text-felt-600">省 {discount}%</span>
          )}
        </div>

        <div className="mt-5">
          {inCart && addState !== 'loading' ? (
            /* 已加入後整塊顯示狀態，點擊前往購物車 */
            <Button block variant="secondary" size="lg" href="./cart.html">
              <Check />
              已加入購物車
            </Button>
          ) : (
            <div className="flex items-stretch gap-2.5">
              {/* 左：大塊立即購買 */}
              <Button
                size="lg"
                onClick={buyNow}
                disabled={buyState !== 'idle'}
                className="min-w-0 flex-1"
              >
                {buyState === 'loading' && <Spinner />}
                {buyState === 'done' && <Check />}
                {buyState === 'idle' ? '立即購買' : buyState === 'loading' ? '處理中…' : '前往結帳…'}
              </Button>

              {/* 右：購物車圖示鈕。hover 時方塊展開、圖示淡出換成「加入購物車」字樣 */}
              <button
                type="button"
                onClick={addToCart}
                disabled={addState === 'loading'}
                aria-label="加入購物車"
                className={`group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-felt-700 ring-1 ring-felt-200 transition-[width,background-color] duration-200 ease-out active:bg-felt-100 disabled:cursor-not-allowed ${
                  addState === 'loading'
                    ? 'w-[3.25rem]'
                    : 'w-[3.25rem] hover:w-[8.5rem] hover:bg-felt-50'
                }`}
              >
                {addState === 'loading' ? (
                  <Spinner />
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 fill-current transition-opacity duration-150 group-hover:opacity-0"
                    >
                      <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z" />
                    </svg>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center text-sm font-semibold whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    >
                      加入購物車
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 狀態變化以文字播報給螢幕閱讀器 */}
        <p aria-live="polite" className="sr-only">
          {buyState === 'done' ? '即將前往結帳' : addState === 'done' ? '已加入購物車' : ''}
        </p>

        <p className="mt-4 text-center text-xs text-ink-400">＊金額為示範資料，正式價格待補</p>
      </div>
    </div>
  )
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-ink-400">
      <path d={d} />
    </svg>
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
