import { cart, useCart, formatNT } from '../../lib/cart'
import { Button } from '../../ui/Button'

/** 課程縮圖（檯面綠底 + 球），與課程封面同語言的迷你版 */
export function CourseThumb({ className = 'h-14 w-20' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(ellipse_at_45%_35%,var(--color-brand-700),var(--color-brand-950))] ${className}`}
    >
      <span className="absolute top-[55%] left-[28%] h-2.5 w-2.5 rounded-full bg-ivory-50" />
      <span className="absolute top-[38%] left-[55%] h-2.5 w-2.5 rounded-full bg-brass-400" />
    </span>
  )
}

/**
 * Mini cart 內容：桌機 hover 浮層與手機抽屜共用。
 * 商品多時只有中段清單捲動，底部總計與按鈕固定。
 */
export function MiniCart() {
  const items = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 fill-ink-400">
          <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z" />
        </svg>
        <p className="mt-3 text-ink-500">購物車目前是空的</p>
        <Button href="./course.html" className="mt-5">
          探索線上課程
        </Button>
      </div>
    )
  }

  return (
    <div className="flex max-h-[70vh] flex-col">
      {/* 中段清單：可捲動 */}
      <ul className="scroll-row min-h-0 flex-1 divide-y divide-line overflow-y-auto px-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <CourseThumb />
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                {item.type}
              </span>
              <p className="mt-1 truncate text-sm font-semibold text-ink-900">{item.title}</p>
            </div>
            <p className="text-sm font-semibold text-ink-900 tabular-nums">
              {formatNT(item.price)}
            </p>
          </li>
        ))}
      </ul>

      {/* 底部固定：總計與 CTA */}
      <div className="border-t border-line bg-ivory-50 px-4 py-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-ink-500">總計 {items.length} 項商品</span>
          <span className="text-lg font-bold text-ink-900 tabular-nums">
            {formatNT(cart.subtotal())}
          </span>
        </div>
        <Button href="./cart.html" block className="mt-3">
          前往購物車
        </Button>
      </div>
    </div>
  )
}
