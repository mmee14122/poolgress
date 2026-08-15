import { useMemo } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { useLibrary } from './lib/library'
import { formatNT } from './lib/cart'
import { courseById } from './data/courses'

/**
 * 購買成功頁（purchase-success.html?order=PG…）。
 *
 * 獨立網址：可重新整理、可分享、可從信件連回。
 * 訂單資料讀自 lib/library.ts；找不到訂單時顯示引導而非空白頁。
 * ⚠️ 金流尚未串接，頁面明確標示為示範流程。
 */
export default function PurchaseSuccessApp() {
  const lib = useLibrary()
  const orderId = useMemo(() => new URLSearchParams(location.search).get('order'), [])
  const order = orderId ? lib.orders.find((o) => o.id === orderId) : lib.orders[0]

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-xl px-4 py-14 sm:px-6">
        {!order ? (
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl">找不到這筆訂單</h1>
            <p className="mt-3 text-ink-500">訂單可能已過期，或這個裝置沒有購買紀錄。</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="./courses.html" size="lg">
                探索線上課程
              </Button>
              <Button href="./orders.html" size="lg" variant="secondary">
                查看我的訂單
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-200">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-brand-600">
                <path d="M9.1 17.2L4 12.1l1.7-1.7 3.4 3.4 9.2-9.2L20 6.3z" />
              </svg>
            </span>
            <h1 className="mt-6 text-2xl sm:text-3xl">
              {order.status === '待繳費' ? '訂單已建立' : '購買完成'}
            </h1>
            <p className="mt-3 text-ink-500">
              訂單編號 <span className="font-semibold text-ink-900 tabular-nums">{order.id}</span>
            </p>

            <p className="mx-auto mt-4 rounded-lg bg-brass-400/15 px-4 py-2.5 text-xs leading-relaxed text-brass-700 ring-1 ring-brass-400/40 ring-inset">
              本頁為前端示範流程，未實際完成付款。金流串接後將顯示真實交易結果。
            </p>

            {/* 訂單明細 */}
            <ul className="mt-8 divide-y divide-line rounded-card border border-line bg-white text-left">
              {order.items.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <span className="min-w-0 truncate text-sm font-semibold text-ink-900">
                    {courseById(i.id)?.title ?? i.title}
                  </span>
                  <span className="shrink-0 text-sm text-ink-700 tabular-nums">
                    {formatNT(i.price)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 px-5 py-4">
                <span className="font-semibold text-ink-900">訂單總計</span>
                <span className="text-xl font-bold text-ink-900 tabular-nums">
                  {formatNT(order.total)}
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="./my-courses.html" size="lg">
                開始學習
              </Button>
              <Button href="./orders.html" size="lg" variant="secondary">
                查看我的訂單
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
