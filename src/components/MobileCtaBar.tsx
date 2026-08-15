import { useEffect, useRef, useState } from 'react'
import { products } from '../content/catalog'
import { cart, formatNT } from '../lib/cart'
import { Button } from '../ui/Button'

const product = products[0]

/**
 * 手機底部固定購買列。捲過頁首後才出現。
 * 「立即購買」加入購物車後導向結帳頁（與購買卡一致）。
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 420)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      inert={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink-900 tabular-nums">
              {formatNT(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-ink-400 line-through tabular-nums">
                {formatNT(product.originalPrice)}
              </span>
            )}
          </p>
          <p className="truncate text-xs text-brand-700">預購六折優惠中</p>
        </div>
        <Button size="lg" className="shrink-0" onClick={buyNow} disabled={busy}>
          {busy ? '處理中…' : '立即購買'}
        </Button>
      </div>
    </div>
  )
}
