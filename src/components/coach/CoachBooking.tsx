import { useMemo, useRef, useState } from 'react'
import { Button } from '../../ui/Button'
import { Field, TextInput, ChoiceCard } from '../../ui/Field'
import { paymentOptions, type PaymentMethod, type Carrier } from '../../lib/checkout'
import { isEmail, isMobileBarcode, isCitizenCert } from '../../lib/validate'
import { toDateKey, type Coach, type CoachService } from '../../data/coaches'

/**
 * 教練預約卡（個別教練頁；桌機在右欄 sticky，手機／平板為單欄全寬）。
 *
 * 流程：選服務 → 選日期（綠勾＝開放）→ 選時段 → 前往確認與付款
 *      → 付款畫面（Email＋付款方式）→ 處理中 → 預約成功。
 *
 * 版面刻意做成緊湊卡片（桌機寬度由外層限制在 380–450px）：
 *   ・日期區固定高度（永遠六列），切換月份時卡片高度不跳動
 *   ・時段區只在選定日期後展開
 *   ・觸控目標最小 44px（min-h-11）
 *
 * ⚠️ 目前沒有後端：付款是前端模擬（不收卡號）、不會保留時段、
 * 也不會真的寄確認信；結果畫面都明確標示為示範。
 *
 * 串接時只要改 handlePay()，UI 不用動。
 * 資料來源見 data/coaches.ts：availability（開放時段）、services（服務與價格）。
 */

/** 預約流程的四個階段 */
type Step = 'select' | 'payment' | 'processing' | 'done'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
/** 可往後看幾個月（含當月） */
const MONTHS_AHEAD = 3
/** 日期區固定六列，避免切換月份時卡片高度跳動 */
const CALENDAR_ROWS = 6

/** 教練預約只收信用卡與 ATM 轉帳（不提供分期與超商代碼） */
const bookingPaymentOptions = paymentOptions.filter(
  (o) => o.value === 'card' || o.value === 'atm',
)

/** 發票載具選項（與結帳頁同一套規則） */
const carrierOptions: { value: Carrier; label: string; hint?: string }[] = [
  { value: 'member', label: '會員載具（使用上方 Email）' },
  { value: 'mobile', label: '手機條碼', hint: '斜線開頭共 8 碼，例：/ABC+123' },
  { value: 'cert', label: '自然人憑證條碼', hint: '2 碼大寫英文 + 14 碼數字' },
]

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
  /** 預設選第一個服務；沒有服務資料時為 null */
  const [serviceId, setServiceId] = useState<string | null>(coach.services[0]?.id ?? null)

  const [step, setStep] = useState<Step>('select')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<PaymentMethod | ''>('')
  const [carrier, setCarrier] = useState<Carrier>('member')
  const [mobileCode, setMobileCode] = useState('')
  const [certCode, setCertCode] = useState('')
  /** 送出後才顯示錯誤，避免使用者還沒填就看到紅字 */
  const [tried, setTried] = useState(false)
  /** 防連點：付款處理中不可重複送出 */
  const paying = useRef(false)

  const service = coach.services.find((s) => s.id === serviceId) ?? null

  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonth = new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD - 1, 1)
  const canPrev = month > firstMonth
  const canNext = month < lastMonth

  const cells = useMemo(() => buildMonthCells(month), [month])
  const openCount = cells.filter((c) => c && coach.availability[toDateKey(c)] && c >= today).length
  const times = selectedDate ? (coach.availability[selectedDate] ?? []) : []

  /** 必要資訊都選齊才能前往付款 */
  const ready = Boolean(serviceId && selectedDate && selectedTime)

  function goMonth(delta: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const emailError = tried && !isEmail(email) ? '請填寫正確的 Email' : null
  const methodError = tried && !method ? '請選擇付款方式' : null
  const carrierError =
    tried && carrier === 'mobile' && !isMobileBarcode(mobileCode)
      ? '手機條碼格式不正確（斜線開頭共 8 碼）'
      : tried && carrier === 'cert' && !isCitizenCert(certCode)
        ? '自然人憑證條碼格式不正確（2 碼大寫英文 + 14 碼數字）'
        : null

  /** 載具填寫是否完整 */
  const carrierValid =
    carrier === 'member' ||
    (carrier === 'mobile' && isMobileBarcode(mobileCode)) ||
    (carrier === 'cert' && isCitizenCert(certCode))

  /** 付款畫面送出 */
  function handlePay() {
    setTried(true)
    if (!isEmail(email) || !method || !carrierValid || paying.current) return

    paying.current = true
    setStep('processing')

    /* ── 串接點：這裡改成導向金流，並在回呼後送出預約 ──
       送出內容：coachId / serviceId / 日期 / 時段 / Email / 付款方式 */
    setTimeout(() => {
      paying.current = false
      setStep('done')
    }, 1400)
  }

  function resetAll() {
    setStep('select')
    setSelectedTime(null)
    setTried(false)
  }

  return (
    <section
      aria-labelledby="booking-heading"
      className="overflow-hidden rounded-card border border-line bg-white shadow-[0_1px_3px_rgba(20,23,26,0.05)]"
    >
      <div className="border-b border-line px-4 py-3">
        <h2 id="booking-heading" className="text-lg">
          預約教練
        </h2>
      </div>

      <div className="p-4">
        {step === 'payment' || step === 'processing' ? (
          <BookingPayment
            coach={coach}
            service={service}
            date={selectedDate!}
            time={selectedTime!}
            email={email}
            onEmail={setEmail}
            emailError={emailError}
            method={method}
            onMethod={setMethod}
            methodError={methodError}
            carrier={carrier}
            onCarrier={setCarrier}
            mobileCode={mobileCode}
            onMobileCode={setMobileCode}
            certCode={certCode}
            onCertCode={setCertCode}
            carrierError={carrierError}
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
            service={service}
            date={selectedDate!}
            time={selectedTime!}
            email={email}
            onReset={resetAll}
          />
        ) : (
          <>
            {/* ── 預約服務 ── */}
            {coach.services.length > 0 && (
              <div>
                <label
                  htmlFor="booking-service"
                  className="block text-xs font-semibold text-ink-900"
                >
                  預約服務
                </label>
                {coach.services.length > 1 ? (
                  <select
                    id="booking-service"
                    value={serviceId ?? ''}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900 focus:outline-2 focus:outline-offset-1 focus:outline-brand-600"
                  >
                    {coach.services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-0.5 text-sm font-semibold text-ink-900">
                    {coach.services[0].name}
                  </p>
                )}
              </div>
            )}

            {/* ── 月份切換 ── */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                disabled={!canPrev}
                aria-label="上個月"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:bg-ivory-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent lg:h-9 lg:w-9"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M12.7 4.7L11.3 3.3 4.6 10l6.7 6.7 1.4-1.4L7.4 10z" />
                </svg>
              </button>

              <div className="text-center">
                <p className="font-semibold text-ink-900 tabular-nums">
                  {month.getFullYear()} 年 {month.getMonth() + 1} 月
                </p>
                <p className="mt-0.5 text-xs text-ink-500 tabular-nums">
                  尚有 <span className="font-semibold text-ink-900">{openCount}</span> 天可預約
                </p>
              </div>

              <button
                type="button"
                onClick={() => goMonth(1)}
                disabled={!canNext}
                aria-label="下個月"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-700 transition-colors hover:bg-ivory-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent lg:h-9 lg:w-9"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M7.3 4.7l1.4-1.4L15.4 10l-6.7 6.7-1.4-1.4L12.6 10z" />
                </svg>
              </button>
            </div>

            {/* 星期列 */}
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-ink-400 lg:mt-2">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1 lg:py-0.5">
                  {w}
                </div>
              ))}
            </div>

            {/* 日期格：固定六列，高度不隨月份跳動 */}
            <div className="mt-1 grid grid-cols-7 gap-1">
              {padCells(cells).map((date, i) => {
                if (!date) return <div key={`empty-${i}`} aria-hidden="true" className="min-h-11 lg:min-h-8" />

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
                    className={`flex min-h-11 flex-col items-center justify-center rounded-lg border text-sm transition lg:min-h-8 ${
                      active
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : open
                          ? 'border-brand-200 bg-brand-50 text-ink-900 hover:border-brand-500'
                          : `border-transparent ${past ? 'text-ink-400/60' : 'text-ink-400'} cursor-not-allowed`
                    } ${isToday && !active ? 'ring-1 ring-brand-300' : ''}`}
                  >
                    <span className="tabular-nums">{date.getDate()}</span>
                    {/* 勾勾＝該日開放預約 */}
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 ${
                        open ? (active ? 'fill-white' : 'fill-pulse-700') : 'fill-transparent'
                      }`}
                    >
                      <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                    </svg>
                  </button>
                )
              })}
            </div>

            {/* ── 時段：選定日期後才展開 ── */}
            <div className="mt-4 border-t border-line pt-3 lg:mt-3">
              {!selectedDate ? (
                <p className="text-sm text-ink-500">請先選擇日期，查看可預約時段。</p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-ink-900 tabular-nums">
                    {formatDate(selectedDate)}
                  </p>
                  {times.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-500">這一天目前沒有開放時段。</p>
                  ) : (
                    <ul className="mt-2.5 grid grid-cols-3 gap-2">
                      {times.map((t) => (
                        <li key={t}>
                          <button
                            type="button"
                            onClick={() => setSelectedTime(t)}
                            aria-pressed={selectedTime === t}
                            className={`min-h-11 w-full rounded-lg border px-2 text-sm font-semibold tabular-nums transition lg:min-h-10 ${
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
                </>
              )}
            </div>

            {/* ── 預約摘要 ── */}
            {/* 摘要：兩欄排列，不把卡片撐高 */}
            <dl className="mt-3 grid grid-cols-2 lg:mt-2.5 gap-x-4 gap-y-1 rounded-lg bg-ivory-50 p-3 text-sm">
              <Row label="日期" value={selectedDate ? formatDate(selectedDate) : '尚未選擇'} />
              <Row label="時間" value={selectedTime ?? '尚未選擇'} />
              <Row label="時長" value={formatDuration(service)} />
              <Row label="價格" value={formatPrice(service)} strong />
            </dl>

            <div className="mt-3">
              <Button onClick={() => setStep('payment')} disabled={!ready} size="lg" block>
                前往確認與付款
              </Button>
            </div>

            <p className="mt-2.5 text-xs leading-snug text-ink-400 lg:mt-2">
              ⚠️ 預約與開放時段皆為示範，尚未串接排程系統。
            </p>
          </>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/** 摘要列 */
function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-ink-500">{label}</dt>
      <dd
        className={`min-w-0 truncate text-right tabular-nums ${
          strong ? 'font-bold text-ink-900' : 'font-semibold text-ink-900'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

/** 付款畫面：填 Email、選付款方式（不收卡號，與結帳頁一致） */
function BookingPayment({
  coach,
  service,
  date,
  time,
  email,
  onEmail,
  emailError,
  method,
  onMethod,
  methodError,
  carrier,
  onCarrier,
  mobileCode,
  onMobileCode,
  certCode,
  onCertCode,
  carrierError,
  processing,
  onBack,
  onPay,
}: {
  coach: Coach
  service: CoachService | null
  date: string
  time: string
  email: string
  onEmail: (v: string) => void
  emailError: string | null
  method: PaymentMethod | ''
  onMethod: (m: PaymentMethod) => void
  methodError: string | null
  carrier: Carrier
  onCarrier: (c: Carrier) => void
  mobileCode: string
  onMobileCode: (v: string) => void
  certCode: string
  onCertCode: (v: string) => void
  carrierError: string | null
  processing: boolean
  onBack: () => void
  onPay: () => void
}) {
  return (
    <div>
      <Steps current={2} />

      <dl className="mt-4 space-y-1.5 rounded-lg bg-ivory-50 p-3 text-sm">
        <Row label="教練" value={coach.name} />
        <Row label="服務" value={service?.name ?? '待補'} />
        <Row label="日期" value={formatDate(date)} />
        <Row label="時間" value={time} />
        <Row label="時長" value={formatDuration(service)} />
        <Row label="價格" value={formatPrice(service)} strong />
      </dl>

      <div className="mt-5">
        <Field label="Email" required error={emailError} hint="預約確認信會寄到這個信箱。">
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

      <div className="mt-5">
        <p className="text-sm font-semibold text-ink-900">
          付款方式
          <span className="ml-1 text-brand-600" aria-hidden="true">
            *
          </span>
        </p>
        <div className="mt-2.5 space-y-2">
          {bookingPaymentOptions.map((opt) => (
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

      {/* ── 發票載具（規則與結帳頁一致） ── */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-ink-900">發票載具</p>
        <div className="mt-2.5 space-y-1">
          {carrierOptions.map((c) => (
            <div key={c.value}>
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink-700">
                <input
                  type="radio"
                  name="booking-carrier"
                  value={c.value}
                  checked={carrier === c.value}
                  onChange={() => onCarrier(c.value)}
                  className="h-4 w-4 shrink-0 accent-brand-600"
                />
                {c.label}
              </label>

              {/* 選到才展開輸入欄，避免卡片被撐高 */}
              {carrier === c.value && c.value === 'mobile' && (
                <div className="mt-1 mb-1 pl-6.5">
                  <TextInput
                    aria-label="手機條碼"
                    placeholder="/ABC+123"
                    value={mobileCode}
                    invalid={!!carrierError}
                    onChange={(e) => onMobileCode(e.target.value.toUpperCase())}
                  />
                  <p className="mt-1 text-xs text-ink-500">{c.hint}</p>
                </div>
              )}
              {carrier === c.value && c.value === 'cert' && (
                <div className="mt-1 mb-1 pl-6.5">
                  <TextInput
                    aria-label="自然人憑證條碼"
                    placeholder="AB12345678901234"
                    value={certCode}
                    invalid={!!carrierError}
                    onChange={(e) => onCertCode(e.target.value.toUpperCase())}
                  />
                  <p className="mt-1 text-xs text-ink-500">{c.hint}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {carrierError && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {carrierError}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-2">
        <Button onClick={onPay} disabled={processing} size="lg" block>
          {processing ? '付款處理中…' : '確認付款'}
        </Button>
        <Button onClick={onBack} disabled={processing} variant="quiet" block>
          返回改時間
        </Button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-500">
        ⚠️ 金流尚未串接，這裡是<strong className="font-semibold">前端示範</strong>，
        不會實際扣款，也不會收取信用卡資料。
      </p>

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
  service,
  date,
  time,
  email,
  onReset,
}: {
  coach: Coach
  service: CoachService | null
  date: string
  time: string
  email: string
  onReset: () => void
}) {
  return (
    <div className="text-center">
      <Steps current={3} />

      <span className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-pulse-100">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6 fill-pulse-700">
          <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
        </svg>
      </span>

      <h3 className="mt-3 text-lg font-semibold text-ink-900">預約成功</h3>
      <p className="mt-2 text-sm break-words text-ink-500">
        確認信已寄送至 <strong className="font-semibold text-ink-900">{email}</strong>
      </p>

      <dl className="mt-4 space-y-1.5 rounded-lg bg-ivory-50 p-3 text-left text-sm">
        <Row label="教練" value={coach.name} />
        <Row label="服務" value={service?.name ?? '待補'} />
        <Row label="日期" value={formatDate(date)} />
        <Row label="時間" value={time} />
        <Row label="時長" value={formatDuration(service)} />
        <Row label="價格" value={formatPrice(service)} strong />
      </dl>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        ⚠️ 本次為前端示範流程：
        <strong className="font-semibold">未實際完成付款、未保留時段，確認信也尚未真的寄出</strong>。
      </p>

      <div className="mt-4">
        <Button onClick={onReset} variant="secondary" block>
          再預約一堂
        </Button>
      </div>
    </div>
  )
}

/** 三步驟指示 */
function Steps({ current }: { current: 1 | 2 | 3 }) {
  const labels = ['選時段', '付款', '完成']
  return (
    <ol className="flex items-center justify-center gap-2 text-xs text-ink-400">
      {labels.map((l, i) => (
        <li key={l} className="flex items-center gap-2">
          <span className={i + 1 === current ? 'font-semibold text-brand-600' : ''}>
            {i + 1} {l}
          </span>
          {i < labels.length - 1 && <span aria-hidden="true">→</span>}
        </li>
      ))}
    </ol>
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

/** 補到固定六列（42 格），讓卡片高度不隨月份改變 */
function padCells(cells: (Date | null)[]): (Date | null)[] {
  const total = CALENDAR_ROWS * 7
  return cells.length >= total ? cells : [...cells, ...Array(total - cells.length).fill(null)]
}

/** 'YYYY-MM-DD' → 'M 月 D 日（週X）' */
function formatDate(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${m} 月 ${d} 日（週${WEEKDAYS[date.getDay()]}）`
}

/** 時長；未填顯示待補 */
function formatDuration(service: CoachService | null) {
  if (!service || service.durationMin === null) return '＿＿分鐘（待確認）'
  return `${service.durationMin} 分鐘`
}

/** 價格；未填顯示待補 */
function formatPrice(service: CoachService | null) {
  if (!service || service.price === null) return 'NT$＿＿（待確認）'
  return `NT$${service.price.toLocaleString()}`
}
