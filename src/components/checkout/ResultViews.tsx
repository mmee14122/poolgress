import type { OrderInfo } from '../../lib/checkout'
import { formatNT } from '../../lib/cart'
import { Button } from '../../ui/Button'

/** 付款處理中：全螢幕覆蓋，避免使用者重複送出 */
export function ProcessingOverlay() {
  return (
    <div
      role="alert"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 px-6"
    >
      <div className="w-full max-w-sm rounded-card bg-white p-8 text-center shadow-2xl">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-auto h-10 w-10 animate-spin">
          <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-line)" strokeWidth="3" />
          <path
            d="M12 3a9 9 0 019 9"
            fill="none"
            stroke="var(--color-brand-600)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-4 font-semibold text-ink-900">付款處理中</p>
        <p className="mt-1 text-sm text-ink-500">請勿關閉視窗或重新整理頁面</p>
      </div>
    </div>
  )
}

/** 非會員購買成功後的綁定會員引導 */
function GuestBindBlock({ email }: { email: string }) {
  return (
    /* 主要動作（開始學習）獨立一行置中，次要的建立帳號放在下方，
       避免兩顆並排時使用者以為都是必要步驟 */
    <div className="mt-8 rounded-card bg-ivory-50 p-6 text-center">
      <div className="flex justify-center">
        <Button href="./my-courses.html" size="lg">
          開始學習
        </Button>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink-700">
        已將課程資訊寄送至 <strong className="font-semibold text-ink-900">{email}</strong>。
        建立帳號後，即可永久保存課程、學習進度與購買紀錄。
      </p>
      <div className="mt-4 flex justify-center">
        <Button variant="secondary" href={`./register.html?email=${encodeURIComponent(email)}`}>
          建立帳號並保存學習進度
        </Button>
      </div>
    </div>
  )
}

type ResultProps = {
  order: OrderInfo
  isGuest: boolean
}

/** 信用卡付款成功 */
export function SuccessView({ order, isGuest }: ResultProps) {
  return (
    <div className="mx-auto max-w-xl py-14 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-200">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-brand-600">
          <path d="M9.1 17.2L4 12.1l1.7-1.7 3.4 3.4 9.2-9.2L20 6.3z" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl sm:text-3xl">購買完成</h1>
      <p className="mt-3 text-ink-500">
        訂單編號 <span className="font-semibold text-ink-900 tabular-nums">{order.id}</span>
      </p>

      {/* ⚠️ 金流尚未串接，明確標示不可誤解為真實付款 */}
      <p className="mx-auto mt-4 max-w-md rounded-lg bg-brass-400/15 px-4 py-2.5 text-xs leading-relaxed text-brass-700 ring-1 ring-brass-400/40 ring-inset">
        本次為前端示範流程，未實際完成付款。金流串接後，此頁將顯示真實交易結果。
      </p>

      {isGuest ? (
        <GuestBindBlock email={order.email} />
      ) : (
        <div className="mt-8">
          <p className="text-sm text-ink-500">課程已加入你的帳號，可在「我的課程」查看進度。</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="./my-courses.html" size="lg">
              開始學習
            </Button>
            <Button href="./orders.html" size="lg" variant="secondary">
              查看訂單
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/** 信用卡付款失敗 */
export function FailedView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-14 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-200">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-red-600">
          <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
        </svg>
      </span>
      <h1 className="mt-6 text-2xl sm:text-3xl">付款未完成</h1>
      <p className="mt-3 text-ink-500">
        銀行未核准這筆交易，或付款流程中斷。你的購物車內容已保留，可重新嘗試或改用其他付款方式。
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Button onClick={onRetry} size="lg">
          重新嘗試
        </Button>
        <Button href="./cart.html" variant="secondary" size="lg">
          回購物車
        </Button>
      </div>
    </div>
  )
}

/** ATM／超商：訂單建立完成，顯示繳費資訊 */
export function OrderCreatedView({ order, isGuest }: ResultProps) {
  const isAtm = order.method === 'atm'
  return (
    <div className="mx-auto max-w-xl py-14">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-200">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-brand-600">
            <path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 4v2h16V9zm2 5v2h6v-2z" />
          </svg>
        </span>
        <h1 className="mt-6 text-2xl sm:text-3xl">訂單已建立，請完成繳費</h1>
        <p className="mt-3 text-ink-500">
          訂單編號 <span className="font-semibold text-ink-900 tabular-nums">{order.id}</span>
        </p>
      </div>

      <dl className="mt-8 space-y-4 rounded-card border border-line bg-white p-6">
        {isAtm ? (
          <>
            <div className="flex justify-between text-sm">
              <dt className="text-ink-500">銀行代碼</dt>
              <dd className="font-semibold text-ink-900">{order.bankCode}</dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="shrink-0 text-ink-500">虛擬帳號</dt>
              <dd className="font-mono text-lg font-bold tracking-wider text-ink-900">
                {order.payCode}
              </dd>
            </div>
          </>
        ) : (
          <div className="flex justify-between gap-4 text-sm">
            <dt className="shrink-0 text-ink-500">超商繳費代碼</dt>
            <dd className="font-mono text-lg font-bold tracking-wider text-ink-900">
              {order.payCode}
            </dd>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <dt className="text-ink-500">應繳金額</dt>
          <dd className="font-bold text-ink-900 tabular-nums">{formatNT(order.total)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-sm">
          <dt className="text-ink-500">繳費期限</dt>
          <dd className="font-semibold text-brass-600">{order.deadline}</dd>
        </div>
      </dl>

      <p className="mt-4 flex items-start gap-2 text-sm text-ink-500">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 fill-brass-400">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3.5a1 1 0 011 1V11a1 1 0 11-2 0V6.5a1 1 0 011-1zm0 9.5a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
        </svg>
        繳費資訊已同步寄送至 {order.email}。逾期未繳費，訂單將自動取消。
      </p>

      {isGuest && <GuestBindBlock email={order.email} />}
    </div>
  )
}
