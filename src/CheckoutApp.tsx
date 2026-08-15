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

  const confirm = () => {
    if (!canConfirm) return

    setPhase('processing')
    const placed = createDemoOrder(method as PaymentMethod, buyerEmail, total)

    // 模擬金流處理；正式版在此導向第三方付款
    timer.current = window.setTimeout(() => {
      if (method === 'card' || method === 'installment') {
        const forceFail = new URLSearchParams(location.search).get('demo') === 'fail'
        if (forceFail) {
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

                  {/* 表單底部的確認區：填完資料不必捲回右側明細卡 */}
                  <div className="mt-10 rounded-card border border-line bg-white p-6">
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-ink-900">訂單總計</span>
                      <span className="text-2xl font-bold text-ink-900 tabular-nums">
                        {formatNT(total)}
                      </span>
                    </div>

                    <Button
                      block
                      size="lg"
                      className="mt-4"
                      onClick={confirm}
                      disabled={!canConfirm || phase === 'processing'}
                    >
                      {phase === 'processing' ? '處理中…' : '確認購買'}
                    </Button>

                    {!canConfirm && missingSummary(errors).length > 0 && (
                      <p className="mt-3 text-xs text-red-700">
                        尚未完成：{missingSummary(errors).join('、')}
                      </p>
                    )}

                    <p className="mt-4 text-xs leading-relaxed text-ink-400">
                      點擊「確認購買」，即表示同意
                      <a href="/terms" className="underline underline-offset-2">服務條款</a>、
                      <a href="/refund" className="underline underline-offset-2">退款政策</a>與
                      <a href="/privacy" className="underline underline-offset-2">隱私權政策</a>。
                    </p>
                  </div>
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

      {/* 手機底部固定：總金額 + 確認購買 */}
      {(phase === 'form' || phase === 'processing') && items.length > 0 && (
        <>
          <div className="h-20 lg:hidden" aria-hidden="true" />
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-ink-500">訂單總計</p>
                <p className="text-lg font-bold text-ink-900 tabular-nums">{formatNT(total)}</p>
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
        </>
      )}

      {phase === 'processing' && <ProcessingOverlay />}

      <Footer />
    </>
  )
}
