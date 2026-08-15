import { useEffect, useRef, useState } from 'react'
import { products } from '../content/catalog'
import { course } from '../content/course'
import { cart, formatNT } from '../lib/cart'
import { Button } from '../ui/Button'

const product = products[0]
const saving = product.originalPrice ? product.originalPrice - product.price : 0

/**
 * 手機底部固定購買列。捲過頁首後才出現。
 * 「立即購買」加入購物車後導向結帳頁（與購買卡一致）。
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const timer = useRef<number | null>(null)

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
    }
  }, [])

  const buyNow = () => {
    setBusy(true)
    cart.add(product)
    timer.current = window.setTimeout(() => {
      location.href = './checkout.html'
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
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-brand-700">
              {course.purchase.priceLabel}
            </span>
            <span className="text-lg font-bold text-ink-900 tabular-nums">
              {formatNT(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-ink-400 line-through tabular-nums">
                {formatNT(product.originalPrice)}
              </span>
            )}
          </p>
          <p className="truncate text-xs text-ink-500">
            現省 {formatNT(saving)}
            {course.purchase.giftNote && `｜${course.purchase.giftNote}`}
          </p>
        </div>
        <Button size="lg" className="shrink-0" onClick={buyNow} disabled={busy}>
          {busy ? '處理中…' : '立即購買'}
        </Button>
      </div>
    </div>
  )
}
