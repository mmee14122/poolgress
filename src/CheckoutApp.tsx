import { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { BuyerSection } from './components/checkout/BuyerSection'
import { PaymentSection } from './components/checkout/PaymentSection'
import { InvoiceSection } from './components/checkout/InvoiceSection'
import { SummaryCard } from './components/checkout/SummaryCard'
import { ProcessingOverlay, SuccessView, OrderCreatedView } from './components/checkout/ResultViews'
import {
  PaymentFailedView,
  PendingConfirmationView,
  AlreadyPaidView,
  AlreadyOwnedView,
  ProvisioningView,
  NetworkErrorView,
  RequiresActionView,
  CancelledView,
  SessionExpiredView,
  EmptyCartView,
} from './components/checkout/StateViews'
import { PaymentDebugPanel } from './components/dev/PaymentDebugPanel'
import { cart, useCart, formatNT } from './lib/cart'
import { library, useLibrary } from './lib/library'
import { couponDiscount, type Coupon } from './data/catalog'
import {
  validateCheckout,
  missingSummary,
  createDemoOrder,
  type BuyerMode,
  type PaymentMethod,
  type InvoiceType,
  type Carrier,
  type OrderInfo,
} from './lib/checkout'
import {
  orderLock,
  currentScenario,
  resolveScenario,
  loginUrlForCheckout,
  type TxStatus,
  type FailureReason,
  type OrderLock,
} from './lib/payment'
import { Button } from './ui/Button'

/**
 * 結帳頁。左：購買方式／付款／發票；右：sticky 訂單明細 + 確認購買。
 * 手機單欄，底部固定「確認購買」（桌機 lg:hidden 完全移除，全站同時只有一顆主要送出按鈕）。
 *
 * 付款為前端模擬，但流程與正式金流一致：
 *   驗證 → 建立訂單並上鎖 → 送出 → 依回傳狀態進入對應畫面。
 * 訂單鎖存在 localStorage，重新整理或按上一頁回來都讀得到，
 * 因此「處理中／已付款」不會退回成可再次付款的表單。
 * 可模擬的結果見 lib/payment.ts；開發模式右下角有情境切換面板。
 */
export default function CheckoutApp() {
  const items = useCart()
  const lib = useLibrary()

  // 購買方式
  const [mode, setMode] = useState<BuyerMode>('guest')
  const [member, setMember] = useState({ loggedIn: false, email: '' })
  const [guest, setGuest] = useState({ email: '', name: '', phone: '' })

  // 付款
  const [method, setMethod] = useState<PaymentMethod | ''>('')
  const [bank, setBank] = useState('')
  const [terms, setTerms] = useState(0)

  // 發票
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('personal')
  const [carrier, setCarrier] = useState<Carrier>('member')
  const [mobileCode, setMobileCode] = useState('')
  const [certCode, setCertCode] = useState('')
  const [donateTarget, setDonateTarget] = useState('unit-a')
  const [donateCode, setDonateCode] = useState('')
  const [company, setCompany] = useState({ name: '', taxId: '', address: '' })

  // 優惠券與交易狀態
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [status, setStatus] = useState<TxStatus>('idle')
  const [reason, setReason] = useState<FailureReason>('card_declined')
  const [lock, setLock] = useState<OrderLock | null>(null)
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [checking, setChecking] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [provisioned, setProvisioned] = useState(false)
  /** 按過確認購買的次數：決定未填欄位要不要顯示錯誤，並觸發捲動聚焦 */
  const [attemptSeq, setAttemptSeq] = useState(0)
  const attempted = attemptSeq > 0
  const timer = useRef<number | null>(null)
  /** 送出鎖：同步生效（早於 state 更新），連點／雙擊／Enter 都只會送出一次 */
  const submitting = useRef(false)

  /* 掛載時讀訂單鎖：重新整理或上一頁回到結帳頁時，
     處理中的訂單不可再付一次，已付款的直接顯示完成狀態 */
  useEffect(() => {
    const existing = orderLock.read()
    if (!existing) return
    setLock(existing)
    if (existing.status === 'paid') setStatus('already_paid')
    else if (existing.status === 'pending_confirmation') setStatus('pending_confirmation')
    else setStatus('pending_confirmation') // processing 中途離開：一律以待確認呈現，不可重付
  }, [])

  /* 手機底部固定列的實際高度 → 頁尾之後預留同高空白，剛好不遮住頁尾 */
  const barRef = useRef<HTMLDivElement>(null)
  const [barHeight, setBarHeight] = useState(0)
  useEffect(() => {
    const el = barRef.current
    if (!el) {
      setBarHeight(0)
      return
    }
    const ro = new ResizeObserver(([entry]) => {
      setBarHeight(entry.target.getBoundingClientRect().height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  })

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const buyerEmail = mode === 'member' ? member.email : guest.email
  const titles = useMemo(() => items.map((i) => i.title), [items])

  const errors = useMemo(
    () =>
      validateCheckout({
        mode,
        memberLoggedIn: member.loggedIn,
        memberEmail: member.email,
        guest,
        method,
        bank,
        terms,
        invoiceType,
        carrier,
        mobileCode,
        certCode,
        donateTarget,
        donateCode,
        company,
      }),
    [mode, member, guest, method, bank, terms, invoiceType, carrier, mobileCode, certCode, donateTarget, donateCode, company],
  )

  const canConfirm = items.length > 0 && Object.keys(errors).length === 0
  const subtotal = items.reduce((s, i) => s + i.price, 0)
  const total = subtotal - (coupon ? couponDiscount(coupon, subtotal) : 0)

  /** 交易處理中：欄位、優惠碼、付款方式一律鎖住，避免中途被改動 */
  const busy = status === 'validating' || status === 'processing'
  const inForm = status === 'idle' || busy

  /** 寫入學習庫（後端串接後改由付款回呼觸發） */
  const grantCourses = (paid: boolean) => {
    library.completePurchase(
      items.map((i) => ({ id: i.id, title: i.title, price: i.price })),
      total,
      method as PaymentMethod,
      paid,
    )
  }

  /**
   * 桌機（明細卡）與手機（底部固定列）唯一共用的送出函式。
   * submitting ref 在 state 更新前就先上鎖，快速連點不會送出兩筆訂單。
   */
  /**
   * 捲到第一個錯誤欄位並聚焦。
   * 手機底部有固定 CTA 列，因此捲到畫面中央而非頂端，錯誤提示不會被蓋住。
   */
  const focusFirstError = () => {
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (!el) return
    /* 先 focus（瀏覽器會自動捲入畫面），再置中；
       手機底部有固定 CTA 列，置中才不會被蓋住 */
    el.focus()
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  /* 錯誤訊息渲染完成後才捲動聚焦（在 render 之前找不到 aria-invalid 的欄位） */
  useEffect(() => {
    if (attemptSeq > 0 && !canConfirm) focusFirstError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptSeq])

  const confirm = () => {
    if (submitting.current) return
    setAttemptSeq((n) => n + 1)
    if (!canConfirm) return
    /* 已有處理中／已付款的訂單就不再建立第二筆 */
    const existing = orderLock.read()
    if (existing) {
      setLock(existing)
      setStatus(existing.status === 'paid' ? 'already_paid' : 'pending_confirmation')
      return
    }
    /* 已擁有課程：不重複販售。未登入的訪客不做此判斷——
       本機學習庫可能是別人或先前訪客購買留下的，不能當作這個人的權限 */
    if (member.loggedIn && items.some((i) => lib.courses.some((c) => c.courseId === i.id))) {
      setStatus('already_owned')
      return
    }

    submitting.current = true
    setStatus('processing')

    const placed = createDemoOrder(method as PaymentMethod, buyerEmail, total)
    const newLock: OrderLock = {
      orderId: placed.id,
      status: 'processing',
      total,
      method: method as string,
      email: buyerEmail,
      createdAt: new Date().toLocaleString('zh-TW', { hour12: false }),
    }
    orderLock.write(newLock)
    setLock(newLock)

    // 模擬金流；正式版在此呼叫建立訂單 API 並依回傳狀態分流
    timer.current = window.setTimeout(() => {
      const resolved = resolveScenario(currentScenario())

      /* ATM／超商不吃卡片情境，一律走「建立訂單、等待繳費」 */
      if ((method === 'atm' || method === 'cvs') && resolved.status === 'succeeded') {
        grantCourses(false)
        orderLock.clear()
        setOrder(placed)
        setStatus('idle')
        setPhaseOrder(placed)
        cart.clear()
        submitting.current = false
        return
      }

      switch (resolved.status) {
        case 'succeeded':
          grantCourses(true)
          orderLock.update({ status: 'paid' })
          setLock(orderLock.read())
          setOrder(placed)
          setStatus('succeeded')
          cart.clear()
          break
        case 'succeeded_provisioning':
          /* 已扣款但權限尚未寫入：不清購物車鎖，避免使用者以為沒買到 */
          orderLock.update({ status: 'paid' })
          setLock(orderLock.read())
          setOrder(placed)
          setStatus('succeeded_provisioning')
          break
        case 'pending_confirmation':
          orderLock.update({ status: 'pending_confirmation' })
          setLock(orderLock.read())
          setStatus('pending_confirmation')
          break
        case 'requires_action':
          setStatus('requires_action')
          break
        case 'network_error':
          orderLock.update({ status: 'pending_confirmation' })
          setLock(orderLock.read())
          setStatus('network_error')
          break
        case 'already_owned':
          orderLock.clear()
          setStatus('already_owned')
          break
        case 'session_expired':
          orderLock.clear()
          setStatus('session_expired')
          break
        case 'cancelled':
          orderLock.clear()
          setStatus('cancelled')
          break
        default:
          /* 失敗：解鎖可重試，購物車與已填資料全部保留 */
          orderLock.clear()
          setReason(resolved.reason ?? 'card_declined')
          setStatus('failed')
      }
      submitting.current = false
    }, 1400)
  }

  /* ATM／超商建立訂單後的畫面沿用既有 OrderCreatedView */
  const [orderCreated, setPhaseOrder] = useState<OrderInfo | null>(null)

  /** 重新確認付款狀態：依目前情境給出成功／失敗／仍待確認 */
  const recheck = () => {
    setChecking(true)
    setAttempts((n) => n + 1)
    timer.current = window.setTimeout(() => {
      setChecking(false)
      const scenario = currentScenario()
      /* 情境仍設定為待確認時就一直等，讓「持續待確認」也能被驗收 */
      if (scenario === 'pending_confirmation' || scenario === 'network_error') return
      const resolved = resolveScenario(scenario)
      if (resolved.status === 'failed') {
        orderLock.clear()
        setReason(resolved.reason ?? 'card_declined')
        setStatus('failed')
        return
      }
      grantCourses(true)
      orderLock.update({ status: 'paid' })
      setLock(orderLock.read())
      setStatus('succeeded')
      cart.clear()
    }, 1200)
  }

  /** 權限開通輪詢：第二次以後回報開通完成 */
  const refreshEntitlement = () => {
    setChecking(true)
    setAttempts((n) => n + 1)
    timer.current = window.setTimeout(() => {
      setChecking(false)
      if (attempts >= 1) {
        grantCourses(true)
        cart.clear()
        setProvisioned(true)
      }
    }, 1200)
  }

  const retryForm = () => {
    submitting.current = false
    setStatus('idle')
  }

  const isGuest = mode === 'guest'
  const showForm = inForm && !order && !orderCreated

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {status === 'succeeded' && order && <SuccessView order={order} isGuest={isGuest} />}
        {orderCreated && <OrderCreatedView order={orderCreated} isGuest={isGuest} />}

        {status === 'failed' && (
          <PaymentFailedView reason={reason} lock={lock} titles={titles} onRetry={retryForm} />
        )}
        {status === 'pending_confirmation' && lock && (
          <PendingConfirmationView
            lock={lock}
            titles={titles}
            onRecheck={recheck}
            checking={checking}
            attempts={attempts}
          />
        )}
        {status === 'network_error' && (
          <NetworkErrorView lock={lock} titles={titles} onRetry={recheck} />
        )}
        {status === 'requires_action' && lock && (
          <RequiresActionView
            lock={lock}
            titles={titles}
            onComplete={() => {
              grantCourses(true)
              orderLock.update({ status: 'paid' })
              setLock(orderLock.read())
              setOrder(createDemoOrder(method as PaymentMethod, buyerEmail, total))
              setStatus('succeeded')
              cart.clear()
            }}
            onCancel={() => {
              orderLock.clear()
              setStatus('cancelled')
            }}
          />
        )}
        {status === 'cancelled' && <CancelledView onRetry={retryForm} />}
        {status === 'already_paid' && lock && <AlreadyPaidView lock={lock} titles={titles} />}
        {status === 'already_owned' && <AlreadyOwnedView />}
        {status === 'succeeded_provisioning' && lock && (
          <ProvisioningView
            lock={lock}
            titles={titles}
            onRefresh={refreshEntitlement}
            refreshing={checking}
            done={provisioned}
            attempts={attempts}
          />
        )}
        {status === 'session_expired' && (
          <SessionExpiredView redirect={loginUrlForCheckout()} />
        )}

        {showForm &&
          (items.length === 0 ? (
            <EmptyCartView />
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl">結帳</h1>

              {busy && (
                <p
                  role="status"
                  className="mt-4 rounded-card bg-brand-50 px-4 py-3 text-sm text-brand-800 ring-1 ring-brand-200 ring-inset"
                >
                  正在確認付款結果，請勿重新整理或關閉此頁面。
                </p>
              )}

              {/* 交易處理期間鎖住整組欄位：購物車、優惠碼、付款方式都不可改 */}
              <fieldset disabled={busy} className="contents">
                <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-10">
                  <div className="min-w-0">
                    <BuyerSection
                      mode={mode}
                      onMode={setMode}
                      memberLoggedIn={member.loggedIn}
                      memberEmail={member.email}
                      onDemoLogin={() => setMember({ loggedIn: true, email: 'demo@poolgress.com' })}
                      guest={guest}
                      onGuest={setGuest}
                      errors={errors}
                      attempted={attempted}
                    />

                    <PaymentSection
                      method={method}
                      onMethod={setMethod}
                      bank={bank}
                      onBank={setBank}
                      terms={terms}
                      onTerms={setTerms}
                    />

                    <InvoiceSection
                      invoiceType={invoiceType}
                      onInvoiceType={setInvoiceType}
                      carrier={carrier}
                      onCarrier={setCarrier}
                      mobileCode={mobileCode}
                      onMobileCode={setMobileCode}
                      certCode={certCode}
                      onCertCode={setCertCode}
                      donateTarget={donateTarget}
                      onDonateTarget={setDonateTarget}
                      donateCode={donateCode}
                      onDonateCode={setDonateCode}
                      company={company}
                      onCompany={setCompany}
                      buyerEmail={buyerEmail}
                      errors={errors}
                      attempted={attempted}
                    />

                    {/* 購買區只存在兩處且互斥：桌機＝右側明細卡內、手機＝底部固定列 */}
                  </div>

                  <aside className="mt-10 lg:sticky lg:top-[calc(var(--promo-h)+6rem)] lg:mt-0">
                    <SummaryCard
                      items={items}
                      coupon={coupon}
                      onCoupon={setCoupon}
                      method={method}
                      terms={terms}
                      canConfirm={canConfirm}
                      missing={missingSummary(errors)}
                      onConfirm={confirm}
                      confirming={busy}
                    />
                  </aside>
                </div>
              </fieldset>
            </>
          ))}
      </main>

      {/* 手機／平板（lg 以下）唯一的購買入口；桌機以 lg:hidden 完全移除 */}
      {showForm && items.length > 0 && (
        <div
          ref={barRef}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ink-500">訂單總計</p>
              <p className="text-lg font-bold text-ink-900 tabular-nums">{formatNT(total)}</p>
              {!canConfirm && missingSummary(errors).length > 0 && (
                <p className="truncate text-xs text-[#9A4A41]">
                  尚未完成：{missingSummary(errors).join('、')}
                </p>
              )}
            </div>
            {/* 不因欄位未填而停用：點下去會帶使用者到第一個要修的欄位，
                比一顆點不下去的按鈕更清楚下一步 */}
            <Button
              size="lg"
              className="shrink-0"
              onClick={confirm}
              disabled={busy}
              aria-disabled={!canConfirm || undefined}
            >
              {busy ? '正在處理付款…' : '確認購買'}
            </Button>
          </div>
        </div>
      )}

      {busy && <ProcessingOverlay />}

      {/* 結帳頁手機版不顯示頁尾：底部固定購買列已是唯一動線 */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {showForm && items.length > 0 && (
        <div className="lg:hidden" aria-hidden="true" style={{ height: barHeight }} />
      )}

      <PaymentDebugPanel />
    </>
  )
}
