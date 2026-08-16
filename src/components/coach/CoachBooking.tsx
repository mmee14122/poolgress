import { useMemo, useRef, useState } from 'react'
import { Button } from '../../ui/Button'
import { Field, TextInput, ChoiceCard } from '../../ui/Field'
import { paymentOptions, type PaymentMethod } from '../../lib/checkout'
import { isEmail } from '../../lib/validate'
import { toDateKey, type Coach } from '../../data/coaches'

/**
 * 教練預約行事曆（個別教練頁最下方）。
 *
 * 流程：選月份 → 點有綠色勾勾的開放日 → 選時段 → 確認預約
 *      → 付款畫面（填 Email、選付款方式）→ 付款處理中 → 預約成功。
 *
 * ⚠️ 目前沒有後端：
 *   ・付款是前端模擬（同結帳頁做法，不收卡號）
 *   ・不會真的保留時段，也不會真的寄出確認信
 *   結果畫面都明確標示為示範，避免學員誤以為已完成預約。
 *
 * 串接時只有兩個地方要改（UI 不用動）：
 *   handlePay()  → 導向金流／送出預約 API
 *   成功畫面     → 由後端回傳真實訂單編號與寄信結果
 *
 * 開放日資料來自 coach.availability、費用來自 coach.lessonPrice
 * （見 data/coaches.ts）。
 */

/** 預約流程的四個階段 */
type Step = 'select' | 'payment' | 'processing' | 'done'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
/** 可往後看幾個月（含當月） */
const MONTHS_AHEAD = 3

export function CoachBooking({ coach }: { coach: Coach }) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  /** 顯示中的月份（每月 1 號） */
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [step, setStep] = useState<Step>('select')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<PaymentMethod | ''>('')
  /** 送出後才顯示錯誤，避免使用者還沒填就看到紅字 */
  const [tried, setTried] = useState(false)
  /** 防連點：付款處理中不可重複送出 */
  const paying = useRef(false)

  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonth = new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD - 1, 1)
  const canPrev = month > firstMonth
  const canNext = month < lastMonth

  const cells = useMemo(() => buildMonthCells(month), [month])
  const openCount = cells.filter(
    (c) => c && coach.availability[toDateKey(c)] && c >= today,
  ).length

  function goMonth(delta: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))
    setSelectedDate(null)
    setSelectedTime(null)
  }

  /** 選好時段 → 進入付款畫面 */
  function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    setStep('payment')
  }

  const emailError = tried && !isEmail(email) ? '請填寫正確的 Email' : null
  const methodError = tried && !method ? '請選擇付款方式' : null

  /** 付款畫面送出 */
  function handlePay() {
    setTried(true)
    if (!isEmail(email) || !method || paying.current) return

    paying.current = true
    setStep('processing')

    /* ── 串接點：這裡改成導向金流，並在回呼後送出預約 ── */
    setTimeout(() => {
      paying.current = false
      setStep('done')
    }, 1400)
  }

  /** 回到選擇畫面（重新預約） */
  function resetAll() {
    setStep('select')
    setSelectedTime(null)
    setTried(false)
  }

  const times = selectedDate ? (coach.availability[selectedDate] ?? []) : []

  return (
    <section className="mt-12 rounded-card border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-xl sm:text-2xl">預約教練</h2>
        <p className="text-sm text-ink-500">
          選擇有 <span className="font-semibold text-pulse-700">綠色勾勾</span> 的日期即可預約
        </p>
      </div>

      {step === 'payment' || step === 'processing' ? (
        <BookingPayment
          coach={coach}
          date={selectedDate!}
          time={selectedTime!}
          email={email}
          onEmail={setEmail}
          emailError={emailError}
          method={method}
          onMethod={setMethod}
          methodError={methodError}
          processing={step === 'processing'}
          onBack={() => {
            setStep('select')
            setTried(false)
          }}
          onPay={handlePay}
        />
      ) : step === 'done' ? (
        <BookingResult
          coach={coach}
          date={selectedDate!}
          time={selectedTime!}
          email={email}
          onReset={resetAll}
        />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-8">
          {/* ── 月曆 ── */}
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                disabled={!canPrev}
                aria-label="上個月"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:bg-ivory-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M12.7 4.7L11.3 3.3 4.6 10l6.7 6.7 1.4-1.4L7.4 10z" />
                </svg>
              </button>

              <p className="text-base font-semibold text-ink-900 tabular-nums">
                {month.getFullYear()} 年 {month.getMonth() + 1} 月
              </p>

              <button
                type="button"
                onClick={() => goMonth(1)}
                disabled={!canNext}
                aria-label="下個月"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:bg-ivory-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M7.3 4.7l1.4-1.4L15.4 10l-6.7 6.7-1.4-1.4L12.6 10z" />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-ink-500 tabular-nums">
              本月尚有 <span className="font-semibold text-ink-900">{openCount}</span> 天可預約
            </p>

            {/* 星期列 */}
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-ink-400">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            {/* 日期格 */}
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} aria-hidden="true" />

                const key = toDateKey(date)
                const past = date < today
                const open = !past && Boolean(coach.availability[key]?.length)
                const isToday = key === toDateKey(today)
                const active = key === selectedDate

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!open}
                    aria-pressed={active}
                    aria-label={`${date.getMonth() + 1} 月 ${date.getDate()} 日${open ? '，可預約' : '，未開放'}`}
                    onClick={() => {
                      setSelectedDate(key)
                      setSelectedTime(null)
                    }}
                    className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition ${
                      active
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : open
                          ? 'border-line bg-white text-ink-900 hover:border-brand-500 hover:bg-brand-50'
                          : `border-transparent ${past ? 'text-ink-400/60' : 'text-ink-400'} cursor-not-allowed`
                    } ${isToday && !active ? 'ring-1 ring-brand-200' : ''}`}
                  >
                    <span className="tabular-nums">{date.getDate()}</span>
                    {/* 綠色勾勾＝該日開放預約 */}
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className={`h-3 w-3 ${
                        open ? (active ? 'fill-white' : 'fill-pulse-700') : 'fill-transparent'
                      }`}
                    >
                      <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                    </svg>
                  </button>
                )
              })}
            </div>

            {/* 圖例 */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-500">
              <li className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3 w-3 fill-pulse-700">
                  <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                </svg>
                可預約
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-brand-600" />
                已選擇
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-ivory-200" />
                未開放
              </li>
            </ul>
          </div>

          {/* ── 時段 ── */}
          <div className="text-center lg:border-l lg:border-line lg:pl-8">
            {!selectedDate ? (
              <p className="text-sm leading-relaxed text-ink-500">
                請先在左側選一個開放日期，這裡會顯示當天可預約的時段。
              </p>
            ) : (
              <>
                <p className="font-semibold text-ink-900 tabular-nums">{formatDate(selectedDate)}</p>

                {times.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-500">這一天目前沒有開放時段。</p>
                ) : (
                  <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
                    {times.map((t) => (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          aria-pressed={selectedTime === t}
                          className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold tabular-nums transition ${
                            selectedTime === t
                              ? 'border-brand-600 bg-brand-600 text-white'
                              : 'border-line bg-white text-ink-700 hover:border-brand-500 hover:bg-brand-50'
                          }`}
                        >
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5">
                  <Button onClick={handleConfirm} disabled={!selectedTime} size="lg" block>
                    確認預約
                  </Button>
                </div>
              </>
            )}

            <p className="mt-5 text-xs leading-relaxed text-ink-400">
              ⚠️ 線上預約為示範流程，尚未串接實際排程系統；開放時段亦為示範資料。
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */

/** 預約摘要（付款畫面與成功畫面共用） */
function BookingSummary({
  coach,
  date,
  time,
  email,
}: {
  coach: Coach
  date: string
  time: string
  email?: string
}) {
  return (
    <dl className="grid gap-2 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-500">教練</dt>
        <dd className="font-semibold text-ink-900">{coach.name}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-500">日期</dt>
        <dd className="font-semibold text-ink-900 tabular-nums">{formatDate(date)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-ink-500">時間</dt>
        <dd className="font-semibold text-ink-900 tabular-nums">{time}</dd>
      </div>
      {email && (
        <div className="flex justify-between gap-4">
          <dt className="text-ink-500">Email</dt>
          <dd className="min-w-0 truncate font-semibold text-ink-900">{email}</dd>
        </div>
      )}
      <div className="mt-1 flex justify-between gap-4 border-t border-line pt-3">
        <dt className="text-ink-500">單堂費用</dt>
        <dd className="font-bold text-ink-900 tabular-nums">
          {coach.lessonPrice === null ? (
            <span className="text-ink-500">NT$＿＿（待確認）</span>
          ) : (
            `NT$${coach.lessonPrice.toLocaleString()}`
          )}
        </dd>
      </div>
    </dl>
  )
}

/* ------------------------------------------------------------------ */

/** 付款畫面：填 Email、選付款方式（不收卡號，與結帳頁一致） */
function BookingPayment({
  coach,
  date,
  time,
  email,
  onEmail,
  emailError,
  method,
  onMethod,
  methodError,
  processing,
  onBack,
  onPay,
}: {
  coach: Coach
  date: string
  time: string
  email: string
  onEmail: (v: string) => void
  emailError: string | null
  method: PaymentMethod | ''
  onMethod: (m: PaymentMethod) => void
  methodError: string | null
  processing: boolean
  onBack: () => void
  onPay: () => void
}) {
  return (
    <div className="mt-6">
      {/* 步驟指示 */}
      <ol className="flex items-center justify-center gap-2 text-xs text-ink-400">
        <li className="font-semibold text-ink-900">1 選時段</li>
        <li aria-hidden="true">→</li>
        <li className="font-semibold text-brand-600">2 付款</li>
        <li aria-hidden="true">→</li>
        <li>3 完成</li>
      </ol>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-8">
        {/* 表單 */}
        <div>
          <h3 className="text-base font-semibold">付款資訊</h3>

          <div className="mt-4">
            <Field
              label="Email"
              required
              error={emailError}
              hint="預約確認信會寄到這個信箱，請確認沒有拼錯。"
            >
              {(id, invalid) => (
                <TextInput
                  id={id}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  invalid={invalid}
                  onChange={(e) => onEmail(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-ink-900">
              付款方式
              <span className="ml-1 text-brand-600" aria-hidden="true">
                *
              </span>
            </p>
            <div className="mt-3 space-y-3">
              {paymentOptions.map((opt) => (
                <ChoiceCard
                  key={opt.value}
                  name="booking-payment"
                  value={opt.value}
                  checked={method === opt.value}
                  onChange={(v) => onMethod(v as PaymentMethod)}
                  title={opt.title}
                  description={opt.description}
                />
              ))}
            </div>
            {methodError && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {methodError}
              </p>
            )}
          </div>
        </div>

        {/* 明細與送出 */}
        <div className="rounded-card border border-line bg-ivory-50 p-5">
          <h3 className="text-base font-semibold">預約明細</h3>
          <div className="mt-4">
            <BookingSummary coach={coach} date={date} time={time} />
          </div>

          <div className="mt-5 space-y-2">
            <Button onClick={onPay} disabled={processing} size="lg" block>
              {processing ? '付款處理中…' : '確認付款'}
            </Button>
            <Button onClick={onBack} disabled={processing} variant="quiet" block>
              返回改時間
            </Button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            ⚠️ 金流尚未串接，這裡是<strong className="font-semibold">前端示範</strong>，
            不會實際扣款，也不會收取信用卡資料。
          </p>
        </div>
      </div>

      {/* 付款處理中：全螢幕覆蓋，避免重複送出 */}
      {processing && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
        >
          <div className="w-full max-w-sm rounded-card bg-white p-8 text-center shadow-2xl">
            <span
              aria-hidden="true"
              className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"
            />
            <p className="mt-4 font-semibold text-ink-900">付款處理中</p>
            <p className="mt-1 text-sm text-ink-500">請不要關閉這個頁面。</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

/** 預約成功（示範）畫面 */
function BookingResult({
  coach,
  date,
  time,
  email,
  onReset,
}: {
  coach: Coach
  date: string
  time: string
  email: string
  onReset: () => void
}) {
  return (
    <div className="mt-6 rounded-card bg-ivory-50 p-6 text-center sm:p-8">
      <ol className="flex items-center justify-center gap-2 text-xs text-ink-400">
        <li>1 選時段</li>
        <li aria-hidden="true">→</li>
        <li>2 付款</li>
        <li aria-hidden="true">→</li>
        <li className="font-semibold text-pulse-700">3 完成</li>
      </ol>

      <span className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-pulse-100">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6 fill-pulse-700">
          <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
        </svg>
      </span>

      <h3 className="mt-4 text-lg font-semibold text-ink-900">預約成功</h3>
      <p className="mt-2 text-sm text-ink-500">
        確認信已寄送至 <strong className="font-semibold text-ink-900">{email}</strong>
        <br />
        請於上課前 24 小時確認出席。
      </p>

      <div className="mx-auto mt-5 max-w-xs text-left">
        <BookingSummary coach={coach} date={date} time={time} email={email} />
      </div>

      <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-ink-500">
        ⚠️ 本次為前端示範流程：
        <strong className="font-semibold">未實際完成付款、未保留時段，確認信也尚未真的寄出</strong>。
        金流與預約系統串接後，這裡會顯示真實的交易結果與寄信狀態。
      </p>

      <div className="mt-5">
        <Button onClick={onReset} variant="secondary">
          再預約一堂
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 產生月曆格子：月初前面補空格（對齊星期），之後是該月每一天。
 * null＝空格。
 */
function buildMonthCells(month: Date): (Date | null)[] {
  const year = month.getFullYear()
  const m = month.getMonth()
  const leading = new Date(year, m, 1).getDay()
  const days = new Date(year, m + 1, 0).getDate()

  const cells: (Date | null)[] = Array.from({ length: leading }, () => null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, m, d))
  return cells
}

/** 'YYYY-MM-DD' → 'M 月 D 日（週X）' */
function formatDate(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${m} 月 ${d} 日（週${WEEKDAYS[date.getDay()]}）`
}
