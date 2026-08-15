import { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { BuyerSection } from './components/checkout/BuyerSection'
import { PaymentSection } from './components/checkout/PaymentSection'
import { InvoiceSection } from './components/checkout/InvoiceSection'
import { SummaryCard } from './components/checkout/SummaryCard'
import {
  ProcessingOverlay,
  SuccessView,
  FailedView,
  OrderCreatedView,
} from './components/checkout/ResultViews'
import { cart, useCart, formatNT } from './lib/cart'
import { couponDiscount, type Coupon } from './content/catalog'
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
import { Button } from './ui/Button'

type Phase = 'form' | 'processing' | 'success' | 'failed' | 'order'

/**
 * 結帳頁。左：購買方式／付款／發票；右：sticky 訂單明細 + 確認購買。
 * 手機單欄，底部固定「確認購買」。
 *
 * 付款為前端模擬：信用卡 → 處理中 → 成功（網址帶 ?demo=fail 可看失敗態）；
 * ATM／超商 → 建立訂單並顯示繳費代碼與期限。
 */
export default function CheckoutApp() {
  const items = useCart()

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

  // 優惠券與流程狀態
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [phase, setPhase] = useState<Phase>('form')
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const timer = useRef<number | null>(null)
  /** 送出鎖：同步生效（早於 state 更新），防止快速連點送出兩次 */
  const submitting = useRef(false)

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

  /**
   * 桌機（明細卡）與手機（底部固定列）唯一共用的送出函式：
   * 驗證、金額、loading 狀態、API 呼叫、錯誤處理都只有這一份。
   * submitting ref 在 state 更新前就先上鎖，快速連點不會送出兩次訂單。
   */
  const confirm = () => {
    if (!canConfirm || submitting.current) return
    submitting.current = true

    setPhase('processing')
    const placed = createDemoOrder(method as PaymentMethod, buyerEmail, total)

    // 模擬金流處理；正式版在此導向第三方付款
    timer.current = window.setTimeout(() => {
      if (method === 'card' || method === 'installment') {
        const forceFail = new URLSearchParams(location.search).get('demo') === 'fail'
        if (forceFail) {
          submitting.current = false // 失敗可重試
          setPhase('failed')
          return // 失敗保留購物車
        }
        setOrder(placed)
        setPhase('success')
        cart.clear()
      } else {
        setOrder(placed)
        setPhase('order')
        cart.clear()
      }
    }, 1400)
  }

  const isGuest = mode === 'guest'

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {phase === 'success' && order && <SuccessView order={order} isGuest={isGuest} />}
        {phase === 'order' && order && <OrderCreatedView order={order} isGuest={isGuest} />}
        {phase === 'failed' && <FailedView onRetry={() => setPhase('form')} />}

        {(phase === 'form' || phase === 'processing') &&
          (items.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-lg text-ink-500">購物車目前是空的，無法結帳</p>
              <Button href="./course.html" size="lg" className="mt-6">
                探索線上課程
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl">結帳</h1>

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
                  />

                  {/* 購買區只存在兩處且互斥：桌機＝右側明細卡內、手機＝底部固定列。
                      這裡不再放第三個確認區（原本無斷點條件，是重複按鈕來源） */}
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
                    confirming={phase === 'processing'}
                  />
                </aside>
              </div>
            </>
          ))}
      </main>

      {/* 手機／平板（lg 以下）唯一的購買入口；桌機以 lg:hidden 完全移除（display:none） */}
      {(phase === 'form' || phase === 'processing') && items.length > 0 && (
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
                  <p className="truncate text-xs text-red-700">
                    尚未完成：{missingSummary(errors).join('、')}
                  </p>
                )}
              </div>
              <Button
                size="lg"
                className="shrink-0"
                onClick={confirm}
                disabled={!canConfirm || phase === 'processing'}
              >
                {phase === 'processing' ? '處理中…' : '確認購買'}
              </Button>
            </div>
          </div>
      )}

      {phase === 'processing' && <ProcessingOverlay />}

      <Footer />

      {/* 底部安全空間放在頁尾之後：避免固定列蓋住頁尾，
          又不會在內容與頁尾之間撐出一段空白（縮短捲到底的距離）。
          高度取實際列高（含安全區與未完成提示行），不多留也不少留 */}
      {(phase === 'form' || phase === 'processing') && items.length > 0 && (
        <div className="lg:hidden" aria-hidden="true" style={{ height: barHeight }} />
      )}
    </>
  )
}
