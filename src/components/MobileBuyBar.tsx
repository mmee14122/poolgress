import { useEffect, useState } from 'react'
import { course } from '../content/course'
import { Button } from '../ui/Button'
import { formatPrice } from '../lib/format'

/**
 * 手機底部固定購買列。捲過主視覺後才出現，避免一進頁面就擋住內容。
 * 用捲動位置判斷而非 IntersectionObserver，行為較好預測也容易測試。
 */
export function MobileBuyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 420)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      /* 收起時用 inert 一併移出焦點順序與無障礙樹，不需要手動處理 tabIndex */
      inert={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink-900">
              {formatPrice(course.purchase.salePrice)}
            </span>
            <span className="text-sm text-ink-400 line-through">
              {formatPrice(course.purchase.originalPrice)}
            </span>
          </p>
          <p className="truncate text-xs text-ink-400">
            {course.purchase.studentCount} 位學員已參與
          </p>
        </div>

        <Button href="#purchase" size="lg" className="shrink-0">
          立即購買
        </Button>
      </div>
    </div>
  )
}
