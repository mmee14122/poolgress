import { useEffect, useState } from 'react'
import { course } from '../content/course'
import { Button } from '../ui/Button'

/**
 * 手機底部固定 CTA 列。捲過頁首後才出現。
 * 不顯示價格——價格資料尚未確認。
 */
export function MobileCtaBar() {
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
      inert={!visible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{course.name}</p>
        <Button href={course.startUrl} size="lg" className="shrink-0">
          {course.ctaLabel}
        </Button>
      </div>
    </div>
  )
}
