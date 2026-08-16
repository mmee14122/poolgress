import { cartIssueOf } from '../../data/catalog'
import { cart, formatNT, type CartItem } from '../../lib/cart'
import { StatusIllustration } from '../StatusIllustration'

/**
 * 購物車商品的例外提示：下架、價格更新、優惠到期。
 *
 * 每一種都講清楚「發生什麼事」與「下一步」，並附上正確的動作按鈕，
 * 不只是顯示一行錯誤字。沒有例外時不渲染任何東西。
 */
export function CartItemIssue({ item }: { item: CartItem }) {
  const issue = cartIssueOf(item)
  if (!issue) return null

  if (issue.kind === 'unavailable') {
    return (
      <Box tone="warn">
        <StatusIllustration status="unavailable" className="mb-2 w-20!" />
        <p className="font-semibold text-ink-900">這張球桌暫時收起來了。</p>
        <p className="mt-1 leading-relaxed text-ink-700">
          這門課程目前暫停販售，無法結帳。移除後就能繼續完成訂單。
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => cart.remove(item.id)}
            className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700"
          >
            移除此課程
          </button>
          <a
            href="./course.html"
            className="self-center text-sm font-semibold text-brand-700 underline underline-offset-2"
          >
            回到課程頁
          </a>
        </div>
      </Box>
    )
  }

  if (issue.kind === 'price_changed') {
    return (
      <Box tone="warn">
        <p className="font-semibold text-ink-900">這門課的價格更新了。</p>
        <p className="mt-1 leading-relaxed text-ink-700">
          加入購物車時為 {formatNT(issue.oldPrice)}，目前為{' '}
          <strong className="font-semibold text-ink-900">{formatNT(issue.newPrice)}</strong>
          。結帳前請先確認最新價格。
        </p>
        <button
          type="button"
          onClick={() => {
            cart.remove(item.id)
            cart.add({ ...item, price: issue.newPrice })
          }}
          className="mt-3 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700"
        >
          套用最新價格
        </button>
      </Box>
    )
  }

  return (
    <Box tone="warn">
      <StatusIllustration status="coupon-expired" className="mb-2 w-20!" />
      <p className="font-semibold text-ink-900">預購優惠已經過了出桿時間。</p>
      <p className="mt-1 leading-relaxed text-ink-700">
        限時優惠已結束，此課程回到原價{' '}
        <strong className="font-semibold text-ink-900">{formatNT(issue.newPrice)}</strong>。
      </p>
      <button
        type="button"
        onClick={() => {
          cart.remove(item.id)
          cart.add({ ...item, price: issue.newPrice })
        }}
        className="mt-3 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-700"
      >
        查看最新價格
      </button>
    </Box>
  )
}

function Box({ children, tone }: { children: React.ReactNode; tone: 'warn' }) {
  return (
    <div
      role="status"
      className={`mt-3 rounded-lg px-4 py-3 text-sm ring-1 ring-inset ${
        tone === 'warn' ? 'bg-[#B5645A]/[0.07] ring-[#B5645A]/25' : ''
      }`}
    >
      {children}
    </div>
  )
}
