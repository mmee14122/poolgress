/**
 * 商品目錄與優惠券。
 *
 * ⚠️ 全部為示範資料：課程名稱與正式價格尚未確認（待補），
 *    金額只為了讓購物車／結帳流程可以運作與驗證。
 *    正式資料到位後直接替換此檔即可。
 */

export type Product = {
  id: string
  title: string
  /** 商品類型標籤，例如「課程」 */
  type: string
  /** ⚠️ 示範價格 */
  price: number
  originalPrice?: number
}

export const products: Product[] = [
  {
    id: 'course-tbd-1',
    title: '課程名稱待補',
    type: '課程',
    price: 1800,
    originalPrice: 2400,
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
