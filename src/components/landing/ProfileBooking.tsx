import { useMemo, useRef, useState } from 'react'
import { paymentOptions, type PaymentMethod, type Carrier } from '../../lib/checkout'
import { isEmail, isMobileBarcode, isCitizenCert } from '../../lib/validate'
import { library } from '../../lib/library'
import { useSession } from '../../lib/session'
import { REDIRECT_PARAM } from '../../lib/auth'
import { toDateKey, type PartnerCoach, type CoachService, type CoachVenue } from '../../data/partner-coaches'

/**
 * 教練預約面板（coach-profile.html 右欄；手機為單欄全寬）— 2026-09-16。
 *
 * 流程與舊站 components/coach/CoachBooking 完全相同：
 *   選服務 → 選球館（一個以上才出現）→ 選日期（勾＝開放）→ 選時段 → 前往確認與付款
 *   → 付款畫面（Email＋付款方式＋發票載具）→ 處理中 → 預約成功（→ 我的教練課）。
 * 只有外觀換成正式首頁的語彙（Ivory／Charcoal／Sand／Walnut、serif 標題、直角、無陰影），
 * 樣式在 styles/coach-profile.css 的 .pg-bk-*。舊站的 coach.html 不受影響。
 *
 * ⚠️ 目前沒有後端：付款是前端模擬（不收卡號）、不會保留時段、也不會真的寄確認信；
 * 結果畫面都明確標示為示範。串接時只要改 handlePay()，UI 不用動。
 *
 * 面板不做內層捲動：高度隨內容長，桌機由外層 sticky 跟著捲。
 * 沒有開放時段的球館：日曆整段換成空白狀態。
 */

type Step = 'select' | 'payment' | 'processing' | 'done'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
/** 可往後看幾個月（含當月） */
const MONTHS_AHEAD = 3

/** 教練預約只收信用卡與 ATM 轉帳（與舊站相同） */
const bookingPaymentOptions = paymentOptions.filter((o) => o.value === 'card' || o.value === 'atm')

const carrierOptions: { value: Carrier; label: string; hint?: string }[] = [
  { value: 'member', label: '會員載具（使用上方 Email）' },
  { value: 'mobile', label: '手機條碼', hint: '斜線開頭共 8 碼，例：/ABC+123' },
  { value: 'cert', label: '自然人憑證條碼', hint: '2 碼大寫英文 + 14 碼數字' },
]

/* 舊站的帳號頁都在 /ui/ 底下；這一頁同時存在於根目錄與 /ui/，所以用絕對路徑 */
const MY_LESSONS_URL = '/ui/my-courses.html'
const LOGIN_URL = `/ui/login.html?${REDIRECT_PARAM}=${encodeURIComponent('./my-courses.html')}`

export function ProfileBooking({ coach }: { coach: PartnerCoach }) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(coach.services[0]?.id ?? null)
  const [venueId, setVenueId] = useState<string | null>(coach.venues[0]?.id ?? null)

  const [step, setStep] = useState<Step>('select')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<PaymentMethod | ''>('')
  const [carrier, setCarrier] = useState<Carrier>('member')
  const [mobileCode, setMobileCode] = useState('')
  const [certCode, setCertCode] = useState('')
  const [tried, setTried] = useState(false)
  const paying = useRef(false)

  const service = coach.services.find((s) => s.id === serviceId) ?? null
  const venue = coach.venues.find((v) => v.id === venueId) ?? null
  const availability = venue?.availability ?? {}
  const venueHasSlots = Object.keys(availability).length > 0

  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonth = new Date(today.getFullYear(), today.getMonth() + MONTHS_AHEAD - 1, 1)
  const canPrev = month > firstMonth
  const canNext = month < lastMonth

  const cells = useMemo(() => buildMonthCells(month), [month])
  const openCount = cells.filter((c) => c && availability[toDateKey(c)] && c >= today).length
  const times = selectedDate ? (availability[selectedDate] ?? []) : []

  const ready = Boolean(serviceId && venue && selectedDate && selectedTime)

  function goMonth(delta: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))
    setSelectedDate(null)
    setSelectedTime(null)
  }
  function pickVenue(id: string) {
    setVenueId(id)
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
  const carrierValid =
    carrier === 'member' ||
    (carrier === 'mobile' && isMobileBarcode(mobileCode)) ||
    (carrier === 'cert' && isCitizenCert(certCode))

  function handlePay() {
    setTried(true)
    if (!isEmail(email) || !method || !carrierValid || paying.current) return
    paying.current = true
    setStep('processing')
    /* ── 串接點：這裡改成導向金流，並在回呼後送出預約 ── */
    setTimeout(() => {
      library.addBooking({
        coachId: coach.id,
        coachName: coach.name,
        serviceName: service?.name ?? '教練課',
        date: selectedDate!,
        time: selectedTime!,
        durationMin: service?.durationMin ?? null,
        venueName: venue?.name ?? null,
        venueAddress: venue?.address ?? null,
      })
      paying.current = false
      setStep('done')
    }, 1400)
  }

  function resetAll() {
    setStep('select')
    setSelectedTime(null)
    setTried(false)
  }

  /* 付款畫面的摘要用 2 欄格，讓付款步驟也能整個放進視窗（2026-09-16 使用者：面板不需捲動） */
  const summary = (
    <dl className="pg-bk-summary pg-bk-summary--grid">
      <Row label="教練" value={coach.name} />
      <Row label="服務" value={service?.name ?? '待確認'} />
      <Row label="球館" value={venue?.name ?? '尚未選擇'} />
      <Row label="日期" value={selectedDate ? formatDate(selectedDate) : '尚未選擇'} />
      <Row label="時間" value={selectedTime ?? '尚未選擇'} />
      <Row label="時長" value={formatDuration(service)} />
      <Row label="價格" value={formatPrice(service)} strong />
    </dl>
  )

  return (
    <section className="pg-bk" aria-labelledby="booking-heading">
      <div className="pg-bk__head">
        <p className="pg-bk__eyebrow">BOOKING</p>
        <h2 id="booking-heading" className="pg-bk__title">預約教練</h2>
      </div>

      {step === 'payment' || step === 'processing' ? (
        <div className="pg-bk__body">
          <Steps current={2} />
          {summary}

          <div className="pg-bk-field">
            <label htmlFor="bk-email" className="pg-bk-field__label">
              Email <span aria-hidden="true">*</span>
            </label>
            <input
              id="bk-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              aria-invalid={!!emailError}
              onChange={(e) => setEmail(e.target.value)}
              className="pg-bk-input"
            />
            <p className="pg-bk-field__hint">預約確認信會寄到這個信箱。</p>
            {emailError && <p role="alert" className="pg-bk-field__error">{emailError}</p>}
          </div>

          <div className="pg-bk-field">
            <p className="pg-bk-field__label">
              付款方式 <span aria-hidden="true">*</span>
            </p>
            <div className="pg-bk-choices">
              {bookingPaymentOptions.map((opt) => (
                <label key={opt.value} className="pg-bk-choice" data-checked={method === opt.value ? '1' : '0'}>
                  <input
                    type="radio"
                    name="bk-payment"
                    value={opt.value}
                    checked={method === opt.value}
                    onChange={() => setMethod(opt.value)}
                  />
                  <span className="pg-bk-choice__text">
                    <span className="pg-bk-choice__title">{opt.title}</span>
                    <span className="pg-bk-choice__desc">{opt.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {methodError && <p role="alert" className="pg-bk-field__error">{methodError}</p>}
          </div>

          <div className="pg-bk-field">
            <p className="pg-bk-field__label">發票載具</p>
            <div className="pg-bk-radios">
              {carrierOptions.map((c) => (
                <div key={c.value}>
                  <label className="pg-bk-radio">
                    <input
                      type="radio"
                      name="bk-carrier"
                      value={c.value}
                      checked={carrier === c.value}
                      onChange={() => setCarrier(c.value)}
                    />
                    {c.label}
                  </label>
                  {carrier === c.value && c.value === 'mobile' && (
                    <div className="pg-bk-radio__extra">
                      <input
                        aria-label="手機條碼"
                        placeholder="/ABC+123"
                        value={mobileCode}
                        aria-invalid={!!carrierError}
                        onChange={(e) => setMobileCode(e.target.value.toUpperCase())}
                        className="pg-bk-input"
                      />
                      <p className="pg-bk-field__hint">{c.hint}</p>
                    </div>
                  )}
                  {carrier === c.value && c.value === 'cert' && (
                    <div className="pg-bk-radio__extra">
                      <input
                        aria-label="自然人憑證條碼"
                        placeholder="AB12345678901234"
                        value={certCode}
                        aria-invalid={!!carrierError}
                        onChange={(e) => setCertCode(e.target.value.toUpperCase())}
                        className="pg-bk-input"
                      />
                      <p className="pg-bk-field__hint">{c.hint}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {carrierError && <p role="alert" className="pg-bk-field__error">{carrierError}</p>}
          </div>

          <div className="pg-bk-actions">
            <button type="button" className="pg-bk-btn pg-bk-btn--primary" onClick={handlePay} disabled={step === 'processing'}>
              {step === 'processing' ? '付款處理中…' : '確認付款'}
            </button>
            <button
              type="button"
              className="pg-bk-btn pg-bk-btn--quiet"
              onClick={() => {
                setStep('select')
                setTried(false)
              }}
              disabled={step === 'processing'}
            >
              返回改時間
            </button>
          </div>

          <p className="pg-bk-note">金流尚未串接，這裡是前端示範：不會實際扣款，也不會收取信用卡資料。</p>

          {step === 'processing' && (
            <div role="status" aria-live="polite" className="pg-bk-overlay">
              <div className="pg-bk-overlay__card">
                <span aria-hidden="true" className="pg-bk-spinner" />
                <p className="pg-bk-overlay__title">付款處理中</p>
                <p className="pg-bk-overlay__body">請不要關閉這個頁面。</p>
              </div>
            </div>
          )}
        </div>
      ) : step === 'done' ? (
        <BookingResult coach={coach} service={service} venue={venue} date={selectedDate!} time={selectedTime!} email={email} onReset={resetAll} />
      ) : (
        <div className="pg-bk__body">
          <div className="pg-bk-row">
          {/* ── 服務 ── */}
          {coach.services.length > 0 && (
            <div className="pg-bk-field">
              <label htmlFor="bk-service" className="pg-bk-field__label">服務項目</label>
              {coach.services.length > 1 ? (
                <select id="bk-service" value={serviceId ?? ''} onChange={(e) => setServiceId(e.target.value)} className="pg-bk-select">
                  {coach.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="pg-bk-field__value">{coach.services[0].name}</p>
              )}
              <p className="pg-bk-field__hint">
                {formatDuration(service)} · {formatPrice(service)}
              </p>
            </div>
          )}

          {/* ── 球館：一個以上才要選 ── */}
          {coach.venues.length > 1 ? (
            <div className="pg-bk-field">
              <p className="pg-bk-field__label">授課球館</p>
              <div className="pg-bk-venues" role="radiogroup" aria-label="授課球館">
                {coach.venues.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={v.id === venueId}
                    onClick={() => pickVenue(v.id)}
                    className="pg-bk-venue"
                  >
                    <span className="pg-bk-venue__name">{v.name}</span>
                    <span className="pg-bk-venue__city">{v.city}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : venue ? (
            <div className="pg-bk-field">
              <p className="pg-bk-field__label">授課球館</p>
              <p className="pg-bk-field__value">
                {venue.name}
                <span className="pg-bk-field__sub">{venue.city}</span>
              </p>
            </div>
          ) : null}
          </div>

          {/* ── 日曆或空白狀態 ── */}
          {!venue ? (
            <EmptySlots text="尚未安排授課球館，暫時無法線上預約。" />
          ) : !venueHasSlots ? (
            <EmptySlots text={`${venue.name} 目前沒有開放時段，請改選其他球館或稍後再看。`} />
          ) : (
            <>
            <div className="pg-bk-cal">
              <div className="pg-bk-month">
                <button type="button" onClick={() => goMonth(-1)} disabled={!canPrev} aria-label="上個月" className="pg-bk-month__nav">
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.7 4.7L11.3 3.3 4.6 10l6.7 6.7 1.4-1.4L7.4 10z" /></svg>
                </button>
                <div className="pg-bk-month__label">
                  <p className="pg-bk-month__title">{month.getFullYear()} 年 {month.getMonth() + 1} 月</p>
                  <p className="pg-bk-month__count">尚有 <strong>{openCount}</strong> 天可預約</p>
                </div>
                <button type="button" onClick={() => goMonth(1)} disabled={!canNext} aria-label="下個月" className="pg-bk-month__nav">
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.3 4.7l1.4-1.4L15.4 10l-6.7 6.7-1.4-1.4L12.6 10z" /></svg>
                </button>
              </div>

              {/* 圖例：與日期樣式一致的小色塊 */}
              <ul className="pg-bk-legend" aria-label="圖例">
                <li><span className="pg-bk-legend__sw pg-bk-legend__sw--open" />可預約</li>
                <li><span className="pg-bk-legend__sw pg-bk-legend__sw--active" />已選取</li>
                <li><span className="pg-bk-legend__sw pg-bk-legend__sw--today" />今天</li>
              </ul>
              <div className="pg-bk-week" aria-hidden="true">
                {WEEKDAYS.map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>

              <div className="pg-bk-days">
                {padCells(cells).map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} aria-hidden="true" className="pg-bk-day pg-bk-day--empty" />
                  const key = toDateKey(date)
                  const past = date < today
                  const open = !past && Boolean(availability[key]?.length)
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
                      className="pg-bk-day"
                      data-state={active ? 'active' : open ? 'open' : past ? 'past' : 'closed'}
                      data-today={isToday ? '1' : '0'}
                    >
                      <span>{date.getDate()}</span>
                      {/* 勾號只出現在已選取的日期（2026-09-16 使用者） */}
                      {active && (
                        <svg viewBox="0 0 20 20" aria-hidden="true" className="pg-bk-day__tick">
                          <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>

            </div>

              <div className="pg-bk-times">
                {!selectedDate ? (
                  <p className="pg-bk-muted">請先選擇日期，查看可預約時段。</p>
                ) : (
                  <>
                    <p className="pg-bk-times__date">{formatDate(selectedDate)}</p>
                    {times.length === 0 ? (
                      <p className="pg-bk-muted">這一天目前沒有開放時段。</p>
                    ) : (
                      <ul className="pg-bk-times__list">
                        {times.map((t) => (
                          <li key={t}>
                            <button type="button" onClick={() => setSelectedTime(t)} aria-pressed={selectedTime === t} className="pg-bk-time">
                              {t}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* ── 摘要（精簡：教練／服務／球館已在上方選過）與前往付款 ── */}
          <dl className="pg-bk-summary pg-bk-summary--grid">
            <Row label="日期" value={selectedDate ? formatDate(selectedDate) : '尚未選擇'} />
            <Row label="時間" value={selectedTime ?? '尚未選擇'} />
            <Row label="時長" value={formatDuration(service)} />
            <Row label="價格" value={formatPrice(service)} strong />
          </dl>
          <div className="pg-bk-actions">
            <button type="button" className="pg-bk-btn pg-bk-btn--primary" onClick={() => setStep('payment')} disabled={!ready}>
              前往確認與付款
            </button>
          </div>
          <p className="pg-bk-note">預約與開放時段皆為示意，尚未串接排程系統。</p>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */

function EmptySlots({ text }: { text: string }) {
  return (
    <div className="pg-bk-empty" role="status">
      <p className="pg-bk-empty__title">目前沒有可預約時段</p>
      <p className="pg-bk-empty__body">{text}</p>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="pg-bk-summary__row" data-strong={strong ? '1' : '0'}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function BookingResult({
  coach,
  service,
  venue,
  date,
  time,
  email,
  onReset,
}: {
  coach: PartnerCoach
  service: CoachService | null
  venue: CoachVenue | null
  date: string
  time: string
  email: string
  onReset: () => void
}) {
  const user = useSession()
  const myLessonsHref = user ? MY_LESSONS_URL : LOGIN_URL

  return (
    <div className="pg-bk__body pg-bk-result">
      <Steps current={3} />
      <span className="pg-bk-result__mark" aria-hidden="true">
        <svg viewBox="0 0 20 20"><path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" /></svg>
      </span>
      <h3 className="pg-bk-result__title">預約成功</h3>
      <p className="pg-bk-result__body">
        確認信已寄送至 <strong>{email}</strong>
      </p>
      <dl className="pg-bk-summary pg-bk-summary--left">
        <Row label="教練" value={coach.name} />
        <Row label="服務" value={service?.name ?? '待確認'} />
        <Row label="球館" value={venue?.name ?? '待補'} />
        <Row label="日期" value={formatDate(date)} />
        <Row label="時間" value={time} />
        <Row label="時長" value={formatDuration(service)} />
        <Row label="價格" value={formatPrice(service)} strong />
      </dl>
      <p className="pg-bk-note">本次為前端示範流程：未實際完成付款、未保留時段，確認信也尚未真的寄出。</p>
      <div className="pg-bk-actions">
        <a href={myLessonsHref} className="pg-bk-btn pg-bk-btn--primary">前往我的教練課</a>
        <button type="button" onClick={onReset} className="pg-bk-btn pg-bk-btn--secondary">再預約一堂</button>
      </div>
    </div>
  )
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const labels = ['選時段', '付款', '完成']
  return (
    <ol className="pg-bk-steps">
      {labels.map((l, i) => (
        <li key={l} data-current={i + 1 === current ? '1' : '0'}>
          <span>{i + 1} {l}</span>
          {i < labels.length - 1 && <span aria-hidden="true" className="pg-bk-steps__arrow">→</span>}
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */

function buildMonthCells(month: Date): (Date | null)[] {
  const year = month.getFullYear()
  const m = month.getMonth()
  const leading = new Date(year, m, 1).getDay()
  const days = new Date(year, m + 1, 0).getDate()
  const cells: (Date | null)[] = Array.from({ length: leading }, () => null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, m, d))
  return cells
}

/** 補到整週（7 的倍數）；列數依當月實際週數，不再固定六列（2026-09-16 使用者：移除底部多餘空白） */
function padCells(cells: (Date | null)[]): (Date | null)[] {
  const rem = cells.length % 7
  return rem === 0 ? cells : [...cells, ...Array(7 - rem).fill(null)]
}

function formatDate(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${m} 月 ${d} 日（週${WEEKDAYS[date.getDay()]}）`
}

export function formatDuration(service: CoachService | null) {
  if (!service || service.durationMin === null) return '時長待確認'
  return `${service.durationMin} 分鐘`
}

export function formatPrice(service: CoachService | null) {
  if (!service || service.price === null) return '價格待確認'
  return `NT$${service.price.toLocaleString()}`
}
