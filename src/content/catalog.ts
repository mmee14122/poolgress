/**
 * 商品目錄與優惠券。
 *
 * 價格為 2026-08 確認的定價：
 *   免費：體驗課程｜付費：NT$4,900／一套課程
 *   預購：NT$2,940（六折）｜活動：NT$4,900 贈一堂教練課
 * 結帳價採預購價，原價 4,900 作為劃線價。
 * ⚠️ 課程名稱與優惠券仍為待補／示範資料。
 */

export type Product = {
  id: string
  title: string
  /** 商品類型標籤，例如「課程」 */
  type: string
  /** 實際結帳價（目前為預購六折價） */
  price: number
  originalPrice?: number
}

export const products: Product[] = [
  {
    id: 'course-tbd-1',
    title: '課程名稱待補',
    type: '課程',
    price: 2940,
    originalPrice: 4900,
  },
]

/** 依 id 取得商品（購物車項目還原用） */
export const productById = (id: string) => products.find((p) => p.id === id)

/* ------------------------------------------------------------------ */

export type Coupon = {
  code: string
  label: string
  kind: 'amount' | 'percent'
  value: number
}

/** ⚠️ 示範優惠券。正式券由後端發放與驗證 */
export const availableCoupons: Coupon[] = [
  { code: 'DEMO100', label: '示範優惠券｜折抵 NT$100', kind: 'amount', value: 100 },
  { code: 'DEMO10', label: '示範優惠券｜結帳 9 折', kind: 'percent', value: 10 },
]

export function findCoupon(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase()
  return availableCoupons.find((x) => x.code === c)
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
  const raw =
    coupon.kind === 'amount' ? coupon.value : Math.round((subtotal * coupon.value) / 100)
  return Math.min(raw, subtotal)
}
