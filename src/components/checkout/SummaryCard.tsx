import type { Coupon } from '../../content/catalog'
import { couponDiscount } from '../../content/catalog'
import { formatNT, type CartItem } from '../../lib/cart'
import type { PaymentMethod } from '../../lib/checkout'
import { CourseThumb } from '../cart/MiniCart'
import { CouponBox } from './CouponBox'
import { Button } from '../../ui/Button'

type Props = {
  items: CartItem[]
  coupon: Coupon | null
  onCoupon: (c: Coupon | null) => void
  method: PaymentMethod | ''
  terms: number
  canConfirm: boolean
  missing: string[]
  onConfirm: () => void
  confirming: boolean
}

/** 右欄訂單明細：金額即時反映優惠券與付款方式 */
export function SummaryCard({
  items,
  coupon,
  onCoupon,
  method,
  terms,
  canConfirm,
  missing,
  onConfirm,
  confirming,
}: Props) {
  const subtotal = items.reduce((s, i) => s + i.price, 0)
  const discount = coupon ? couponDiscount(coupon, subtotal) : 0
  const total = subtotal - discount

  return (
    <div className="rounded-card border border-line bg-white p-6">
      <h2 className="text-lg">訂單明細</h2>

      <ul className="mt-4 divide-y divide-line">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <CourseThumb className="h-11 w-16" />
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">
              {item.title}
            </p>
            <p className="text-sm text-ink-700 tabular-nums">{formatNT(item.price)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-2.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-500">商品小計</dt>
          <dd className="text-ink-900 tabular-nums">{formatNT(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-500">優惠折抵</dt>
            <dd className="font-semibold text-brand-700 tabular-nums">−{formatNT(discount)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4">
        <CouponBox subtotal={subtotal} applied={coupon} onApply={onCoupon} />
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="font-semibold text-ink-900">訂單總計</span>
        <span className="text-2xl font-bold text-ink-900 tabular-nums">{formatNT(total)}</span>
      </div>

      {/* 付款方式相關說明即時更新 */}
      {method === 'installment' && terms > 0 && (
        <p className="mt-2 text-right text-xs text-ink-500">
          分 {terms} 期，每期約{' '}
          <strong className="font-semibold text-ink-900">{formatNT(Math.ceil(total / terms))}</strong>
        </p>
      )}
      {(method === 'atm' || method === 'cvs') && (
        <p className="mt-2 text-right text-xs text-brass-600">建立訂單後 3 天內未繳費將自動取消</p>
      )}

      <div className="mt-5">
        <Button block size="lg" onClick={onConfirm} disabled={!canConfirm || confirming}>
          {confirming ? '處理中…' : '確認購買'}
        </Button>
      </div>

      {!canConfirm && missing.length > 0 && (
        <p className="mt-3 text-xs text-red-700">尚未完成：{missing.join('、')}</p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        點擊「確認購買」，即表示同意
        <a href="/terms" className="underline underline-offset-2">服務條款</a>、
        <a href="/refund" className="underline underline-offset-2">退款政策</a>與
        <a href="/privacy" className="underline underline-offset-2">隱私權政策</a>。
      </p>
    </div>
  )
}
