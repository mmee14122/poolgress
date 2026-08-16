import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CourseThumb } from './components/cart/MiniCart'
import { CartItemIssue } from './components/cart/CartItemIssue'
import { StatusIllustration } from './components/StatusIllustration'
import { cart, useCart, formatNT } from './lib/cart'
import { Button } from './ui/Button'

/**
 * 購物車頁：只確認商品與進入結帳，不填任何付款／會員／發票資料。
 * 桌機左（商品清單）右（sticky 訂單摘要）雙欄；手機單欄 + 底部固定結帳列。
 */
export default function CartApp() {
  const items = useCart()

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="text-2xl sm:text-3xl">購物車</h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
            {/* 左：商品清單 */}
            <ul className="divide-y divide-line rounded-card border border-line bg-white px-5 sm:px-6">
              {items.map((item) => (
                <li key={item.id} className="py-5">
                  <div className="flex items-center gap-4">
                  <CourseThumb className="h-16 w-24 sm:h-20 sm:w-32" />

                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                      {item.type}
                    </span>
                    <p className="mt-1.5 font-semibold text-ink-900">{item.title}</p>
                    <p className="mt-1 flex items-baseline gap-2 text-sm">
                      <span className="font-bold text-ink-900 tabular-nums">
                        {formatNT(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-ink-400 line-through tabular-nums">
                          {formatNT(item.originalPrice)}
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => cart.remove(item.id)}
                    aria-label={`移除 ${item.title}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ivory-100 hover:text-ink-900"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                      <path d="M9 3h6l1 2h4v2H4V5h4zM6 8h12l-.9 12.1a2 2 0 01-2 1.9H8.9a2 2 0 01-2-1.9zM10 10v9h1.6v-9zm2.4 0v9H14v-9z" />
                    </svg>
                  </button>
                  </div>
                  {/* 下架／改價／優惠到期：說明原因並給對應動作 */}
                  <CartItemIssue item={item} />
                </li>
              ))}
            </ul>

            {/* 右：sticky 訂單摘要 */}
            <aside className="mt-8 lg:sticky lg:top-[calc(var(--promo-h)+6rem)] lg:mt-0">
              <div className="rounded-card border border-line bg-white p-6">
                <h2 className="text-lg">訂單摘要</h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">商品小計（{items.length} 項）</dt>
                    <dd className="font-semibold text-ink-900 tabular-nums">
                      {formatNT(cart.subtotal())}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3">
                    <dt className="font-semibold text-ink-900">訂單總計</dt>
                    <dd className="text-xl font-bold text-ink-900 tabular-nums">
                      {formatNT(cart.subtotal())}
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-ink-400">優惠券可在結帳時套用</p>

                <Button href="./checkout.html" block size="lg" className="mt-5">
                  前往結帳
                </Button>

                <p className="mt-4 text-center text-xs text-ink-500">
                  想學更多嗎？
                  <a
                    href="./course.html"
                    className="font-semibold text-brand-700 underline underline-offset-4"
                  >
                    探索其他線上課程
                  </a>
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* 手機底部固定：總金額 + 前往結帳 */}
      {items.length > 0 && (
        <>
          <div className="h-20 lg:hidden" aria-hidden="true" />
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink-500">總計 {items.length} 項</p>
                <p className="text-lg font-bold text-ink-900 tabular-nums">
                  {formatNT(cart.subtotal())}
                </p>
              </div>
              <Button href="./checkout.html" size="lg" className="shrink-0">
                前往結帳
              </Button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  )
}

function EmptyCart() {
  return (
    <div className="mt-8 flex flex-col items-center rounded-card border border-line bg-white px-6 py-16 text-center">
      <StatusIllustration status="empty-cart" />
      <p className="mt-5 text-lg font-semibold text-ink-900">球桌還在等第一球。</p>
      <p className="mt-2 text-ink-500">購物車目前是空的，先挑一門課開始吧。</p>
      <Button href="./course.html" size="lg" className="mt-6">
        探索線上課程
      </Button>
    </div>
  )
}
