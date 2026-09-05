import { useMemo, useState, type FormEvent } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Field, TextInput } from './ui/Field'
import { site } from './data/site'

/**
 * 預約場館（booking.html）— inline 式訂位流程（2026-09-06）。
 *
 * 流程與 inline 線上訂位一致：① 人數（− ＋）→ ② 日期（月曆）→ ③ 時段（格子）→ ④ 訂位資料 → 確認。
 * 沒有後端：送出時整理成 mailto 給 supportEmail，頁面顯示已送出摘要；之後接訂位系統只換 submit()。
 * 視覺沿用首頁 premium palette：Ivory 底、Charcoal 字、Sand 選取／主按鈕、Functional CTA 10px。
 */

const SLOTS = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
const MAX_PEOPLE = 8
const WEEK = ['日', '一', '二', '三', '四', '五', '六']

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

type Contact = { name: string; phone: string; email: string; note: string }
const emptyContact: Contact = { name: '', phone: '', email: '', note: '' }

/* ---------- 小元件 ---------- */

function StepTitle({ n, title, value }: { n: number; title: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="flex items-baseline gap-3 text-base font-semibold text-[#252C30]">
        <span className="pg-t-eyebrow-feature !mb-0 text-[#816B59]">0{n}</span>
        {title}
      </h2>
      {value && <span className="text-sm text-[#816B59]">{value}</span>}
    </div>
  )
}

function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  const btn =
    'grid h-10 w-10 place-items-center rounded-full border border-[rgba(20,30,35,.28)] text-lg text-[#252C30] transition-colors hover:bg-[#252C30]/5 disabled:opacity-30 disabled:hover:bg-transparent'
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[rgba(20,30,35,.14)] bg-white/60 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#252C30]">{label}</p>
        {hint && <p className="text-xs text-[#5d666e]">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} aria-label={`${label}減一`} disabled={value <= min} onClick={() => onChange(value - 1)}>
          −
        </button>
        <span className="w-6 text-center text-base font-semibold tabular-nums">{value}</span>
        <button type="button" className={btn} aria-label={`${label}加一`} disabled={value >= max} onClick={() => onChange(value + 1)}>
          ＋
        </button>
      </div>
    </div>
  )
}

function Calendar({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const t0 = today()
  const [cursor, setCursor] = useState(() => new Date(t0.getFullYear(), t0.getMonth(), 1))
  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    const lead = first.getDay()
    const out: (Date | null)[] = Array.from({ length: lead }, () => null)
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    return out
  }, [cursor])
  const canPrev = cursor > new Date(t0.getFullYear(), t0.getMonth(), 1)
  const nav = 'grid h-9 w-9 place-items-center rounded-full text-[#252C30] hover:bg-[#252C30]/5 disabled:opacity-30'
  return (
    <div className="rounded-[10px] border border-[rgba(20,30,35,.14)] bg-white/60 p-4">
      <div className="flex items-center justify-between">
        <button type="button" className={nav} aria-label="上個月" disabled={!canPrev} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
          ‹
        </button>
        <p className="text-sm font-semibold tracking-wide">
          {cursor.getFullYear()} 年 {cursor.getMonth() + 1} 月
        </p>
        <button type="button" className={nav} aria-label="下個月" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
          ›
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-xs text-[#816B59]">
        {WEEK.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const k = iso(d)
          const past = d < t0
          const sel = k === value
          return (
            <button
              key={k}
              type="button"
              disabled={past}
              aria-pressed={sel}
              onClick={() => onChange(k)}
              className={`mx-auto grid h-10 w-10 place-items-center rounded-full text-sm transition-colors ${
                sel ? 'bg-[#D2C2AD] font-semibold text-[#252C30]' : past ? 'text-[#252C30]/25' : 'text-[#252C30] hover:bg-[#252C30]/5'
              }`}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- 頁面 ---------- */

/** 訂位表單（inline 式流程）——2026-09-06 暫不啟用，booking.html 先顯示 Coming Soon；接訂位系統時再掛回 */
export default function BookingForm() {
  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)
  const [date, setDate] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [c, setC] = useState<Contact>(emptyContact)
  const [errors, setErrors] = useState<Partial<Record<keyof Contact | 'date' | 'slot', string>>>({})
  const [sent, setSent] = useState<null | { adults: number; kids: number; date: string; slot: string; c: Contact }>(null)

  const setField = (k: keyof Contact) => (v: string) => {
    setC((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const people = adults + kids

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: typeof errors = {}
    if (!date) e.date = '請選擇日期'
    if (!slot) e.slot = '請選擇時段'
    if (!c.name.trim()) e.name = '請輸入姓名'
    if (!/^0\d{8,9}$/.test(c.phone.replace(/[-\s]/g, ''))) e.phone = '請輸入台灣手機或市話號碼'
    if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.email = 'Email 格式不正確'
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(e.date ? 'step-date' : e.slot ? 'step-slot' : 'step-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const lines = [
      `人數：${adults} 位大人${kids ? `、${kids} 位小孩` : ''}`,
      `日期：${date}`,
      `時段：${slot}`,
      `姓名：${c.name}`,
      `電話：${c.phone}`,
      c.email && `Email：${c.email}`,
      c.note && `備註：${c.note}`,
    ].filter(Boolean)
    const subject = encodeURIComponent(`[預約場館] ${date} ${slot}・${c.name}・${people} 人`)
    window.location.href = `mailto:${site.supportEmail}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`
    setSent({ adults, kids, date: date!, slot: slot!, c })
  }

  const reset = () => {
    setSent(null)
    setAdults(2)
    setKids(0)
    setDate(null)
    setSlot(null)
    setC(emptyContact)
    setErrors({})
  }

  const chip = (active: boolean) =>
    `h-11 rounded-[10px] border text-sm transition-colors ${
      active ? 'border-[#D2C2AD] bg-[#D2C2AD] font-semibold text-[#252C30]' : 'border-[rgba(20,30,35,.2)] bg-white/60 text-[#252C30] hover:bg-[#252C30]/5'
    }`

  return (
    <div className="pg-booking-root min-h-screen bg-[#F2EEE6] text-[#252C30]">
      <Navbar />

      <main className="site-container pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="mx-auto max-w-xl">
          {/* 標頭：像 inline 的店家資訊卡 */}
          <header>
            <p className="pg-t-eyebrow">RESERVATION</p>
            <h1 className="pg-t-serif-editorial mt-3 text-[32px] leading-[1.15] sm:text-[40px]">Poolgress Club</h1>
            <p className="mt-2 text-sm text-[#816B59]">台北・2028 開幕前優先預約登記</p>
            <p className="pg-t-body mt-4">留下人數、日期與時段，我們會在一個工作天內以電話或 Email 與你確認。</p>
          </header>

          {sent ? (
            <section aria-live="polite" className="mt-10 rounded-[10px] border border-[rgba(20,30,35,.16)] bg-white/60 p-6 sm:p-8">
              <p className="pg-t-eyebrow-feature">CONFIRMED</p>
              <h2 className="pg-t-serif-editorial mt-2 text-2xl">已收到你的預約</h2>
              <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-[#816B59]">人數</dt>
                <dd>
                  {sent.adults} 位大人{sent.kids ? `、${sent.kids} 位小孩` : ''}
                </dd>
                <dt className="text-[#816B59]">日期</dt>
                <dd>{sent.date}</dd>
                <dt className="text-[#816B59]">時段</dt>
                <dd>{sent.slot}</dd>
                <dt className="text-[#816B59]">姓名</dt>
                <dd>{sent.c.name}</dd>
                <dt className="text-[#816B59]">電話</dt>
                <dd>{sent.c.phone}</dd>
                {sent.c.email && (
                  <>
                    <dt className="text-[#816B59]">Email</dt>
                    <dd>{sent.c.email}</dd>
                  </>
                )}
              </dl>
              <p className="mt-5 text-sm text-[#333C41]">若郵件程式沒有自動開啟，請直接來信 {site.supportEmail}，我們會盡快回覆。</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="./" className="pg-btn pg-btn-shape bg-[#D2C2AD] text-[#252C30]">
                  回首頁
                </a>
                <button type="button" onClick={reset} className="pg-btn pg-btn-shape border border-[rgba(20,30,35,.32)] text-[#252C30]">
                  再預約一次
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={submit} noValidate className="mt-10 space-y-10">
              {/* 01 人數 */}
              <section id="step-people" className="space-y-3">
                <StepTitle n={1} title="選擇人數" value={`${people} 人`} />
                <Stepper label="大人" value={adults} min={1} max={MAX_PEOPLE - kids} onChange={setAdults} />
                <Stepper label="小孩" hint="12 歲以下" value={kids} min={0} max={MAX_PEOPLE - adults} onChange={setKids} />
                <p className="text-xs text-[#5d666e]">單筆預約最多 {MAX_PEOPLE} 人；包場或團體請在備註說明。</p>
              </section>

              {/* 02 日期 */}
              <section id="step-date" className="scroll-mt-24 space-y-3">
                <StepTitle n={2} title="選擇日期" value={date ?? undefined} />
                <Calendar value={date} onChange={(v) => { setDate(v); setErrors((e) => ({ ...e, date: undefined })) }} />
                {errors.date && (
                  <p role="alert" className="text-sm text-red-700">
                    {errors.date}
                  </p>
                )}
              </section>

              {/* 03 時段 */}
              <section id="step-slot" className="scroll-mt-24 space-y-3">
                <StepTitle n={3} title="選擇時段" value={slot ?? undefined} />
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {SLOTS.map((s) => (
                    <button key={s} type="button" aria-pressed={slot === s} onClick={() => { setSlot(s); setErrors((e) => ({ ...e, slot: undefined })) }} className={chip(slot === s)}>
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#5d666e]">每個時段以 2 小時計。</p>
                {errors.slot && (
                  <p role="alert" className="text-sm text-red-700">
                    {errors.slot}
                  </p>
                )}
              </section>

              {/* 04 訂位資料 */}
              <section id="step-contact" className="scroll-mt-24 space-y-5">
                <StepTitle n={4} title="訂位資料" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="姓名" required error={errors.name}>
                    {(id, invalid) => <TextInput id={id} value={c.name} onChange={(e) => setField('name')(e.target.value)} invalid={invalid} autoComplete="name" placeholder="王小明" />}
                  </Field>
                  <Field label="聯絡電話" required error={errors.phone}>
                    {(id, invalid) => (
                      <TextInput id={id} type="tel" inputMode="tel" value={c.phone} onChange={(e) => setField('phone')(e.target.value)} invalid={invalid} autoComplete="tel" placeholder="0912 345 678" />
                    )}
                  </Field>
                </div>
                <Field label="Email" error={errors.email} hint="選填，方便寄送預約確認">
                  {(id, invalid) => (
                    <TextInput id={id} type="email" inputMode="email" value={c.email} onChange={(e) => setField('email')(e.target.value)} invalid={invalid} autoComplete="email" placeholder="you@example.com" />
                  )}
                </Field>
                <Field label="備註" hint="生日、包場、教練陪打等需求可以先告訴我們">
                  {(id) => (
                    <textarea
                      id={id}
                      rows={3}
                      value={c.note}
                      onChange={(e) => setField('note')(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink-900 placeholder:text-ink-400 focus:outline-2 focus:outline-offset-1 focus:outline-brand-600"
                      placeholder="例如：四人同行，希望有教練帶第一局"
                    />
                  )}
                </Field>
              </section>

              {/* 摘要＋送出（inline 的底部確認列） */}
              <section className="rounded-[10px] border border-[rgba(20,30,35,.16)] bg-white/60 p-5">
                <p className="pg-t-eyebrow-feature !mb-2">SUMMARY</p>
                <p className="text-sm text-[#252C30]">
                  {people} 人・{date ?? '未選日期'}・{slot ?? '未選時段'}
                </p>
                <button type="submit" className="pg-btn pg-btn-shape mt-4 w-full bg-[#D2C2AD] text-[#252C30] hover:bg-[#DACCB9] sm:w-auto">
                  確認預約
                </button>
                <p className="mt-3 text-xs text-[#5d666e]">送出後會開啟你的郵件程式，內容已幫你填好。</p>
              </section>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
