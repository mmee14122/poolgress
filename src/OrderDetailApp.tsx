import { useEffect, useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { StatusIllustration } from './components/StatusIllustration'
import { Button } from './ui/Button'
import { useSession } from './lib/session'
import { useLibrary, type LibraryOrder } from './lib/library'
import { loginUrlWithRedirect, currentPageTarget } from './lib/auth'
import { formatNT } from './lib/cart'
import { site } from './data/site'

type LoadState = 'loading' | 'ready' | 'error'

const methodLabel: Record<string, string> = {
  card: '信用卡',
  installment: '信用卡分期',
  atm: 'ATM 轉帳',
  cvs: '超商代碼',
}

/**
 * 訂單詳情（order.html?id=PG...）。
 *
 * 資料來源目前是 lib/library.ts 的本機訂單；後端接上後改為
 * GET /orders/:id，狀態機（載入中／成功／找不到／載入失敗）不用改。
 * 未登入時導向登入頁並帶 redirect，登入後回到同一筆訂單。
 * ?state=error 可預覽載入失敗畫面。
 */
export default function OrderDetailApp() {
  const user = useSession()
  const lib = useLibrary()
  const orderId = useMemo(() => new URLSearchParams(location.search).get('id') ?? '', [])
  const forcedError = useMemo(
    () => new URLSearchParams(location.search).get('state') === 'error',
    [],
  )
  const [state, setState] = useState<LoadState>('loading')
  const [retry, setRetry] = useState(0)

  /* 未登入：訂單屬於帳號，不在此頁顯示任何內容 */
  useEffect(() => {
    if (!user) location.replace(loginUrlWithRedirect(currentPageTarget()))
  }, [user])

  /* 模擬讀取（後端接上後換成 fetch，其餘畫面不動） */
  useEffect(() => {
    setState('loading')
    const timer = window.setTimeout(() => setState(forcedError ? 'error' : 'ready'), 500)
    return () => clearTimeout(timer)
  }, [forcedError, retry])

  if (!user) return null

  const order = lib.orders.find((o) => o.id === orderId)

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <a
          href="./orders.html"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M12.7 4.3l-5.7 5.7 5.7 5.7 1.4-1.4-4.3-4.3 4.3-4.3z" />
          </svg>
          我的訂單
        </a>

        {state === 'loading' && <LoadingView />}
        {state === 'error' && <ErrorView onRetry={() => setRetry((n) => n + 1)} />}
        {state === 'ready' && (order ? <OrderView order={order} /> : <NotFoundView id={orderId} />)}
      </main>
      <Footer />
    </>
  )
}

/** 載入中：骨架，避免畫面從空白直接跳出內容 */
function LoadingView() {
  return (
    <div role="status" aria-live="polite" className="mt-6">
      <span className="sr-only">訂單載入中</span>
      <div className="h-8 w-40 animate-pulse rounded-lg bg-ivory-100" />
      <div className="mt-6 space-y-3 rounded-card border border-line bg-white p-5 sm:p-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-ivory-100" />
        ))}
      </div>
    </div>
  )
}

/** 載入失敗：可重試，並保留客服入口 */
function ErrorView({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="py-12 text-center sm:py-16">
      <StatusIllustration status="offline" />
      <h1 className="mt-6 text-2xl sm:text-3xl">球路暫時中斷了。</h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
        訂單資料沒有載入成功，這不影響你的訂單本身。請稍後再試一次。
      </p>
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={onRetry}>
          重新載入
        </Button>
        <Button size="lg" variant="secondary" href="./orders.html">
          回到我的訂單
        </Button>
      </div>
    </div>
  )
}

/** 查無此訂單 */
function NotFoundView({ id }: { id: string }) {
  return (
    <div className="py-12 text-center sm:py-16">
      <StatusIllustration status="empty-cart" />
      <h1 className="mt-6 text-2xl sm:text-3xl">找不到這筆訂單。</h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
        {id ? (
          <>
            訂單編號 <span className="font-mono break-all">{id}</span> 不在你的帳號下，
            可能是網址有誤，或這筆訂單屬於其他帳號。
          </>
        ) : (
          '網址缺少訂單編號。'
        )}
      </p>
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" href="./orders.html">
          查看我的訂單
        </Button>
        <Button size="lg" variant="secondary" href="./contact.html">
          聯絡我們
        </Button>
      </div>
    </div>
  )
}

/** 訂單內容 */
function OrderView({ order }: { order: LibraryOrder }) {
  const statusTone =
    order.status === '已完成'
      ? 'bg-[#5B9E8F]/12 text-[#3F7A6C]'
      : order.status === '待繳費'
        ? 'bg-brass-400/15 text-brass-700'
        : 'bg-ivory-100 text-ink-500'

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl">訂單詳情</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusTone}`}>
          {order.status}
        </span>
      </div>

      <section className="mt-6 rounded-card border border-line bg-white p-5 sm:p-6">
        <h2 className="text-lg">訂單資訊</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="訂單編號">
            {/* 長編號在窄螢幕要能斷行，不可撐破卡片 */}
            <span className="font-mono break-all tabular-nums">{order.id}</span>
          </Row>
          <Row label="下單時間">
            <span className="tabular-nums">
              {new Date(order.date).toLocaleString('zh-TW', { hour12: false })}
            </span>
          </Row>
          <Row label="付款方式">{methodLabel[order.method] ?? order.method}</Row>
        </dl>
      </section>

      <section className="mt-6 rounded-card border border-line bg-white p-5 sm:p-6">
        <h2 className="text-lg">購買項目</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-4 py-3">
              <span className="min-w-0 font-semibold break-words text-ink-900">{item.title}</span>
              <span className="shrink-0 text-ink-700 tabular-nums">{formatNT(item.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-semibold text-ink-900">訂單總計</span>
          <span className="text-xl font-bold text-ink-900 tabular-nums">{formatNT(order.total)}</span>
        </div>
      </section>

      {order.status === '待繳費' && (
        <p
          role="status"
          className="mt-6 rounded-card bg-brass-400/12 px-4 py-3.5 text-sm leading-relaxed text-ink-700 ring-1 ring-brass-400/30 ring-inset"
        >
          這筆訂單尚未完成付款，繳費完成後課程才會開通。繳費代碼與期限請見購買完成頁或通知信。
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {order.status === '已完成' && (
          <Button size="lg" href="./my-courses.html">
            開始學習
          </Button>
        )}
        <Button size="lg" variant="secondary" href="./orders.html">
          回到我的訂單
        </Button>
      </div>

      <p className="mt-6 text-sm text-ink-500">
        訂單有問題？
        <a
          href={`mailto:${site.supportEmail}?subject=${encodeURIComponent(`訂單問題 ${order.id}`)}`}
          className="ml-1 font-semibold text-brand-700 underline underline-offset-4"
        >
          聯絡我們
        </a>
      </p>

      <p className="mt-4 text-xs text-ink-400">
        ⚠️ 目前為前端示範訂單（未實際付款），金流與後端串接後改由 API 提供。
      </p>
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd className="min-w-0 text-right text-ink-900">{children}</dd>
    </div>
  )
}
