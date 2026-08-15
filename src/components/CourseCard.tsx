import { course } from '../content/course'
import { products } from '../content/catalog'
import { cart, useCart, formatNT } from '../lib/cart'
import { Button } from '../ui/Button'
import { CourseCover } from './CourseCover'

/** 這一頁對應的商品（⚠️ 價格為示範資料） */
const product = products[0]

/**
 * 右欄課程卡（桌機 sticky）。
 * ⚠️ 價格、時數、學員數等資料尚未確認，一律顯示待補，不虛構。
 */
export function CourseCard() {
  const inCart = useCart().some((i) => i.id === product.id)

  return (
    <div className="overflow-hidden rounded-card border border-line bg-white shadow-sm">
      <div className="p-4">
        <CourseCover compact />
      </div>

      <div className="px-5 pb-5">
        <h2 className="text-lg">{course.name}</h2>
        <p className="mt-1 text-sm text-ink-500">{course.tagline}</p>

        <div className="mt-5 rounded-xl bg-ivory-50 p-4">
          <p className="mb-3 text-sm font-semibold text-ink-900">這堂課包含</p>
          <ul className="space-y-2.5 text-sm text-ink-500">
            <li className="flex items-center gap-2.5">
              <Dot />
              課程長度待補
            </li>
            <li className="flex items-center gap-2.5">
              <Dot />
              章節數待補（目前顯示 {course.chapters.length} 章佔位）
            </li>
            <li className="flex items-center gap-2.5">
              <Dot />
              球桌挑戰待補
            </li>
          </ul>
        </div>

        <div className="mt-5 space-y-2.5">
          <Button block size="lg" href={course.startUrl}>
            {course.ctaLabel}
          </Button>
          {inCart ? (
            <Button block variant="secondary" size="lg" href="./cart.html">
              已在購物車，前往結帳
            </Button>
          ) : (
            <Button block variant="secondary" size="lg" onClick={() => cart.add(product)}>
              加入購物車 · {formatNT(product.price)}
            </Button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-ink-400">＊金額為示範資料，正式價格待補</p>
      </div>
    </div>
  )
}

function Dot() {
  return (
    <svg viewBox="0 0 8 8" aria-hidden="true" className="h-2 w-2 shrink-0 fill-felt-500">
      <circle cx="4" cy="4" r="4" />
    </svg>
  )
}
