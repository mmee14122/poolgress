import { useEffect, useState } from 'react'
import { course } from '../content/course'
import { site } from '../content/site'
import { Button } from '../ui/Button'
import { formatPrice } from '../lib/format'

const lowestPrice = Math.min(...course.plans.map((p) => p.price))

/**
 * 手機常駐購買列：Hero 捲出畫面後才出現。
 * 用 IntersectionObserver 觀察 #top，不要監聽 scroll 事件。
 */
export function StickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-120px 0px 0px 0px' },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-sand-200 bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{course.title}</p>
          <p className="text-sm text-ink-600">{formatPrice(lowestPrice)} 起</p>
        </div>
        <Button href={site.checkoutUrl} tabIndex={visible ? 0 : -1}>
          立即報名
        </Button>
      </div>
    </div>
  )
}
