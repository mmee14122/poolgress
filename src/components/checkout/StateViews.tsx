import type { ReactNode } from 'react'
import { StatusIllustration, type IllustrationStatus } from '../StatusIllustration'
import { failureCopy, type FailureReason, type OrderLock } from '../../lib/payment'
import { formatNT } from '../../lib/cart'
import { site } from '../../data/site'
import { Button } from '../../ui/Button'

/**
 * 付款流程的各種狀態畫面。
 *
 * 共用骨架 StateShell：插圖 → 標題 → 說明 → 訂單摘要 → 主／次 CTA → 客服連結。
 * 每一頁都必須回答：現在發生什麼事、有沒有扣款、下一步、要不要重付。
 * 一律不使用 alert()／滿版紅底；提示色為低飽和磚紅與琥珀。
 */

type ShellProps = {
  illus: IllustrationStatus
  title: string
  /** 一句話講清楚「有沒有扣款」 */
  lead: string
  tone?: 'neutral' | 'warn' | 'good'
  children?: ReactNode
  primary?: ReactNode
  secondary?: ReactNode
  /** 需要協助的第三層連結；沒有客服信箱時自動隱藏 */
  helpNote?: string
}

function StateShell({
  illus,
  title,
  lead,
  tone = 'neutral',
  children,
  primary,
  secondary,
  helpNote,
}: ShellProps) {
  const toneRing =
    tone === 'warn'
      ? 'ring-[#B5645A]/25 bg-[#B5645A]/[0.06]'
      : tone === 'good'
        ? 'ring-[#5B9E8F]/25 bg-[#5B9E8F]/[0.07]'
        : 'ring-line bg-ivory-50'

  return (
    <div role="status" className="mx-auto max-w-xl py-12 text-center sm:py-16">
      <StatusIllustration status={illus} />
      <h1 className="mt-6 text-2xl sm:text-3xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">{lead}</p>

      {children && (
        <div className={`mt-8 rounded-card p-5 text-left ring-1 ring-inset sm:p-6 ${toneRing}`}>
          {children}
        </div>
      )}

      {(primary || secondary) && (
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          {primary}
          {secondary}
        </div>
      )}

      {helpNote && (
        <p className="mt-6 text-sm text-ink-500">
          {helpNote}
          {site.supportEmail ? (
            <a
              href={`mailto:${site.supportEmail}`}
              className="ml-1 font-semibold text-brand-700 underline underline-offset-4"
            >
              聯絡我們
            </a>
          ) : (
            <a
              href="./contact.html"
              className="ml-1 font-semibold text-brand-700 underline underline-offset-4"
            >
              聯絡我們
            </a>
          )}
        </p>
      )}
    </div>
  )
}

/** 訂單摘要：課程、訂單編號、金額、付款方式、建立時間 */
export function OrderSummaryRows({
  lock,
  titles,
}: {
  lock: OrderLock
  titles: string[]
}) {
  const methodLabel: Record<string, string> = {
    card: '信用卡',
    installment: '信用卡分期',
    atm: 'ATM 轉帳',
    cvs: '超商代碼',
  }
  return (
    <dl className="space-y-2.5 text-sm">
      {titles.length > 0 && (
        <Row label="課程">
          <span className="text-right">{titles.join('、')}</span>
        </Row>
      )}
      <Row label="訂單編號">
        <span className="font-mono tabular-nums">{lock.orderId}</span>
      </Row>
      <Row label="金額">
        <span className="font-semibold tabular-nums">{formatNT(lock.total)}</span>
      </Row>
      <Row label="付款方式">{methodLabel[lock.method] ?? lock.method}</Row>
      <Row label="建立時間">
        <span className="tabular-nums">{lock.createdAt}</span>
      </Row>
    </dl>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd className="min-w-0 text-ink-900">{children}</dd>
    </div>
  )
}

/* ------------------------------------------------------------------ */

/** 付款失敗（含六種原因）。已填資料與購物車都保留 */
export function PaymentFailedView({
  reason,
  lock,
  titles,
  onRetry,
}: {
  reason: FailureReason
  lock: OrderLock | null
  titles: string[]
  onRetry: () => void
}) {
  const copy = failureCopy[reason]
  return (
    <StateShell
      illus="failed"
      tone="warn"
      title="這一桿差一點。"
      lead="付款還沒有完成，你的訂單尚未成立，這次交易不會開通課程。課程與填寫的資料都還在。"
      primary={
        <Button size="lg" onClick={onRetry}>
          調整後再試一次
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./cart.html">
          返回購物車
        </Button>
      }
      helpNote="需要協助？"
    >
      <p className="font-semibold text-ink-900">{copy.title}</p>
      <p className="mt-1.5 leading-relaxed text-ink-700">{copy.body}</p>
      {lock && (
        <div className="mt-5 border-t border-line pt-4">
          <OrderSummaryRows lock={lock} titles={titles} />
        </div>
      )}
    </StateShell>
  )
}

/** 最重要：結果未確認。絕不可說失敗，也不可讓人再刷一次 */
export function PendingConfirmationView({
  lock,
  titles,
  onRecheck,
  checking,
  attempts,
}: {
  lock: OrderLock
  titles: string[]
  onRecheck: () => void
  checking: boolean
  attempts: number
}) {
  return (
    <StateShell
      illus="pending"
      title="正在確認這一桿的結果。"
      lead="我們尚未能確認銀行的最終結果。為避免重複扣款，請先不要再次付款。"
      primary={
        <Button size="lg" onClick={onRecheck} disabled={checking}>
          {checking ? '確認中…' : '重新確認付款狀態'}
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./orders.html">
          前往我的訂單
        </Button>
      }
      helpNote={attempts >= 2 ? '確認超過預期時間了，可以帶著訂單編號' : undefined}
    >
      <OrderSummaryRows lock={lock} titles={titles} />
      <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-500">
        若款項已扣除，課程權限可能需要幾分鐘才會更新。
      </p>
    </StateShell>
  )
}

/** 這筆訂單已完成付款（重新整理／上一頁回來） */
export function AlreadyPaidView({ lock, titles }: { lock: OrderLock; titles: string[] }) {
  return (
    <StateShell
      illus="already-paid"
      tone="good"
      title="這一球已經進了。"
      lead="此筆訂單已完成付款，不需要再付一次。"
      primary={
        <Button size="lg" href="./my-courses.html">
          開始學習
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./orders.html">
          查看訂單
        </Button>
      }
    >
      <OrderSummaryRows lock={lock} titles={titles} />
    </StateShell>
  )
}

/** 已擁有此課程 */
export function AlreadyOwnedView() {
  return (
    <StateShell
      illus="owned"
      tone="good"
      title="這門課已經在你的球袋裡。"
      lead="你已經擁有這門課程，不需要重複購買。"
      primary={
        <Button size="lg" href="./my-courses.html">
          開始學習
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./course.html">
          回到課程頁
        </Button>
      }
    />
  )
}

/** 付款成功但權限尚未開通 */
export function ProvisioningView({
  lock,
  titles,
  onRefresh,
  refreshing,
  done,
  attempts,
}: {
  lock: OrderLock
  titles: string[]
  onRefresh: () => void
  refreshing: boolean
  done: boolean
  attempts: number
}) {
  if (done) {
    return (
      <StateShell
        illus="already-paid"
        tone="good"
        title="球桌準備好了。"
        lead="課程權限已開通，可以開始上課了。"
        primary={
          <Button size="lg" href="./my-courses.html">
            開始學習
          </Button>
        }
        secondary={
          <Button size="lg" variant="secondary" href="./orders.html">
            查看我的訂單
          </Button>
        }
      >
        <OrderSummaryRows lock={lock} titles={titles} />
      </StateShell>
    )
  }
  return (
    <StateShell
      illus="provisioning"
      tone="good"
      title="正在替你開通球桌。"
      lead="付款成功，正在為你開通課程。通常會在幾分鐘內完成，請不要重複購買。"
      primary={
        <Button size="lg" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? '更新中…' : '重新整理權限狀態'}
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./orders.html">
          查看我的訂單
        </Button>
      }
      helpNote={attempts >= 2 ? '超過預期時間了，可以帶著訂單編號' : undefined}
    >
      <p className="flex items-center gap-2 font-semibold text-[#3F7A6C]">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-[#5B9E8F]">
          <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
        </svg>
        付款成功
      </p>
      <div className="mt-4 border-t border-line pt-4">
        <OrderSummaryRows lock={lock} titles={titles} />
      </div>
    </StateShell>
  )
}

/** 網路中斷：請求送不出去，尚未能確認結果 */
export function NetworkErrorView({
  lock,
  titles,
  onRetry,
}: {
  lock: OrderLock | null
  titles: string[]
  onRetry: () => void
}) {
  return (
    <StateShell
      illus="offline"
      tone="warn"
      title="球路暫時中斷了。"
      lead="連線中斷，我們尚未能確認付款結果。請先不要重複付款，先查看訂單狀態。"
      primary={
        <Button size="lg" onClick={onRetry}>
          重新確認付款狀態
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./orders.html">
          前往我的訂單
        </Button>
      }
      helpNote="狀態一直沒更新？"
    >
      {lock ? (
        <OrderSummaryRows lock={lock} titles={titles} />
      ) : (
        <p className="text-sm leading-relaxed text-ink-700">
          這筆付款尚未送出到金流，購物車內容都還留著。網路恢復後可以直接再試一次。
        </p>
      )}
    </StateShell>
  )
}

/** 需要銀行驗證（3DS／外部付款頁） */
export function RequiresActionView({
  lock,
  titles,
  onComplete,
  onCancel,
}: {
  lock: OrderLock
  titles: string[]
  onComplete: () => void
  onCancel: () => void
}) {
  return (
    <StateShell
      illus="pending"
      title="等待銀行完成驗證。"
      lead="請在銀行的驗證頁面完成確認。完成前請不要關閉這個頁面，款項尚未扣除。"
      primary={
        <Button size="lg" onClick={onComplete}>
          我已完成驗證
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" onClick={onCancel}>
          取消這次付款
        </Button>
      }
    >
      <OrderSummaryRows lock={lock} titles={titles} />
      <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-500">
        正式串接後，這裡會跳轉到銀行的 3D 驗證頁；目前為前端示範。
      </p>
    </StateShell>
  )
}

/** 使用者取消付款 */
export function CancelledView({ onRetry }: { onRetry: () => void }) {
  return (
    <StateShell
      illus="failed"
      title="這一桿收桿了。"
      lead="你取消了這次付款，訂單沒有成立，款項也沒有扣除。購物車內容都還留著。"
      primary={
        <Button size="lg" onClick={onRetry}>
          再試一次
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./cart.html">
          返回購物車
        </Button>
      }
    />
  )
}

/** 結帳中 session 過期 */
export function SessionExpiredView({ redirect }: { redirect: string }) {
  return (
    <StateShell
      illus="timeout"
      tone="warn"
      title="這一局暫停了一下。"
      lead="你的登入已逾時。請重新登入後繼續，我們已為你保留目前的購物內容。"
      primary={
        <Button size="lg" href={redirect}>
          重新登入並繼續結帳
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./cart.html">
          查看購物車
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-ink-700">
        購物車、填寫的訂購資料與發票設定都會保留，登入完成後會直接回到這一頁。
      </p>
    </StateShell>
  )
}

/** 空購物車 */
export function EmptyCartView() {
  return (
    <StateShell
      illus="empty-cart"
      title="球桌還在等第一球。"
      lead="購物車目前是空的，還沒有可以結帳的課程。"
      primary={
        <Button size="lg" href="./course.html">
          探索線上課程
        </Button>
      }
      secondary={
        <Button size="lg" variant="secondary" href="./challenges.html">
          認識實戰闖關
        </Button>
      }
    />
  )
}
