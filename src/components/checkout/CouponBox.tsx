import { useEffect, useRef, useState } from 'react'
import { availableCoupons, findCoupon, couponDiscount, type Coupon } from '../../content/catalog'
import { formatNT } from '../../lib/cart'

type Props = {
  subtotal: number
  applied: Coupon | null
  onApply: (c: Coupon | null) => void
}

/** 折扣券區塊：輸入優惠碼或從清單選擇，含套用中／無效／已套用狀態 */
export function CouponBox({ subtotal, applied, onApply }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const apply = (code: string) => {
    setError(null)
    setApplying(true)
    // 模擬向後端驗證優惠碼
    timer.current = window.setTimeout(() => {
      setApplying(false)
      const coupon = findCoupon(code)
      if (!coupon) {
        setError('優惠碼無效或已過期')
        return
      }
      onApply(coupon)
      setInput('')
      setPickerOpen(false)
    }, 400)
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3 ring-1 ring-brand-200">
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-brand-700">{applied.code}</p>
          <p className="truncate text-xs text-ink-500">{applied.label}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-brand-700 tabular-nums">
            −{formatNT(couponDiscount(applied, subtotal))}
          </span>
          <button
            type="button"
            onClick={() => onApply(null)}
            aria-label="移除優惠券"
            className="text-xs text-ink-400 underline underline-offset-2 hover:text-ink-900"
          >
            移除
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value.toUpperCase())
            setError(null)
          }}
          placeholder="輸入優惠碼"
          aria-label="優惠碼"
          aria-invalid={!!error || undefined}
          className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-2 focus:outline-offset-1 ${
            error ? 'border-red-400 focus:outline-red-600' : 'border-line focus:outline-brand-600'
          }`}
        />
        <button
          type="button"
          onClick={() => input.trim() && apply(input)}
          disabled={applying || !input.trim()}
          className="shrink-0 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-700 disabled:opacity-50"
        >
          {applying ? '套用中…' : '套用'}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => setPickerOpen((v) => !v)}
        aria-expanded={pickerOpen}
        className="mt-2 text-xs text-brand-700 underline underline-offset-2"
      >
        選擇可用優惠券
      </button>

      {pickerOpen && (
        <ul className="mt-2 space-y-2">
          {availableCoupons.length === 0 && (
            <li className="rounded-lg bg-ivory-50 px-4 py-3 text-sm text-ink-500">
              目前沒有可用的優惠券
            </li>
          )}
          {availableCoupons.map((c) => (
            <li
              key={c.code}
              className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-brand-200 bg-white px-4 py-2.5"
            >
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-ink-900">{c.code}</p>
                <p className="truncate text-xs text-ink-500">{c.label}</p>
              </div>
              <button
                type="button"
                onClick={() => apply(c.code)}
                disabled={applying}
                className="shrink-0 text-sm font-semibold text-brand-700 underline underline-offset-2 disabled:opacity-50"
              >
                套用
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
