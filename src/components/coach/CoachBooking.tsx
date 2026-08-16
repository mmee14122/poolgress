import { useMemo, useState } from 'react'
import { Button } from '../../ui/Button'
import { toDateKey, type Coach } from '../../data/coaches'

/**
 * 教練預約行事曆（個別教練頁最下方）。
 *
 * 流程：選月份 → 點有綠色勾勾的開放日 → 選時段 → 確認預約。
 *
 * ⚠️ 目前沒有預約後端：確認後只顯示「示範」結果畫面，
 * 不會送出任何資料，也不會真的保留時段。
 * 串接時只要把 handleConfirm 換成 API 呼叫即可，UI 不用改。
 *
 * 開放日資料來自 coach.availability（見 data/coaches.ts）。
 */

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
  const [booked, setBooked] = useState<{ date: string; time: string } | null>(null)

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

  function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    /* ── 串接點：這裡改成送出預約的 API 呼叫 ── */
    setBooked({ date: selectedDate, time: selectedTime })
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

      {booked ? (
        <BookingResult
          coach={coach}
          date={booked.date}
          time={booked.time}
          onReset={() => {
            setBooked(null)
            setSelectedTime(null)
          }}
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
          <div className="lg:border-l lg:border-line lg:pl-8">
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

/** 預約完成（示範）畫面 */
function BookingResult({
  coach,
  date,
  time,
  onReset,
}: {
  coach: Coach
  date: string
  time: string
  onReset: () => void
}) {
  return (
    <div className="mt-6 rounded-card bg-ivory-50 p-6 text-center sm:p-8">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pulse-100">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6 fill-pulse-700">
          <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
        </svg>
      </span>

      <h3 className="mt-4 text-lg font-semibold text-ink-900">預約已送出（示範）</h3>

      <dl className="mx-auto mt-4 grid max-w-xs gap-2 text-sm">
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
      </dl>

      <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-ink-500">
        ⚠️ 這是介面示範，<strong className="font-semibold">尚未真的送出預約</strong>，
        也不會保留這個時段。實際預約系統串接後，這裡會顯示真正的預約結果與通知信。
      </p>

      <div className="mt-5">
        <Button onClick={onReset} variant="secondary">
          重新選擇
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
