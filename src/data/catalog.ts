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
  /** 販售狀態：unavailable＝已下架或暫停販售，購物車顯示原因並提供移除 */
  availability?: 'on_sale' | 'unavailable'
  /** 預購／限時優惠截止日（ISO）；已過期時價格回原價 */
  offerEndsAt?: string | null
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
  /** 到期日（ISO 日期）；null＝不設限 */
  expiresAt?: string | null
  /** 使用門檻：訂單金額需達此數才能用 */
  minSubtotal?: number
  /** 已使用過（正式版由後端依帳號判斷） */
  used?: boolean
  /** 不可與這些商品併用 */
  excludeProductIds?: string[]
}

/** ⚠️ 示範優惠券。正式券由後端發放與驗證 */
export const availableCoupons: Coupon[] = [
  { code: 'DEMO100', label: '示範優惠券｜折抵 NT$100', kind: 'amount', value: 100 },
  { code: 'DEMO10', label: '示範優惠券｜結帳 9 折', kind: 'percent', value: 10 },
  /* 以下為各種失效情境的示範券，方便驗收；正式版由後端發放與驗證 */
  { code: 'EXPIRED', label: '示範｜已過期', kind: 'amount', value: 100, expiresAt: '2025-01-01' },
  { code: 'MIN5000', label: '示範｜滿 5000 折 500', kind: 'amount', value: 500, minSubtotal: 5000 },
  { code: 'USED', label: '示範｜已使用過', kind: 'amount', value: 100, used: true },
  {
    code: 'NOCOMBO',
    label: '示範｜不可與本課程併用',
    kind: 'amount',
    value: 100,
    excludeProductIds: ['course-tbd-1'],
  },
]

/** 優惠碼不可用的原因（每一種都對應一句人類看得懂的說明） */
export type CouponIssue = 'not_found' | 'expired' | 'below_min' | 'used' | 'not_combinable'

export const couponIssueCopy: Record<CouponIssue, string> = {
  not_found: '查不到這組優惠碼，請確認大小寫與空格後再試一次。',
  expired: '這張優惠券已經過了出桿時間，無法再使用。',
  below_min: '這張優惠券有使用門檻，目前訂單金額還沒達到。',
  used: '這張優惠券已經使用過了，同一張券不能重複折抵。',
  not_combinable: '這張優惠券不能和購物車中的課程一起使用。',
}

/**
 * 驗證優惠碼。回傳 coupon 或不可用的原因。
 * 後端串接後改呼叫 POST /coupons/validate，回傳格式對應同一組 CouponIssue。
 */
export function validateCoupon(
  code: string,
  subtotal: number,
  productIds: string[],
): { ok: true; coupon: Coupon } | { ok: false; issue: CouponIssue; coupon?: Coupon } {
  const coupon = findCoupon(code)
  if (!coupon) return { ok: false, issue: 'not_found' }
  if (coupon.used) return { ok: false, issue: 'used', coupon }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { ok: false, issue: 'expired', coupon }
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { ok: false, issue: 'below_min', coupon }
  }
  if (coupon.excludeProductIds?.some((id) => productIds.includes(id))) {
    return { ok: false, issue: 'not_combinable', coupon }
  }
  return { ok: true, coupon }
}

export function findCoupon(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase()
  return availableCoupons.find((x) => x.code === c)
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
  const raw =
    coupon.kind === 'amount' ? coupon.value : Math.round((subtotal * coupon.value) / 100)
  return Math.min(raw, subtotal)
}

/* ------------------------------------------------------------------ */

/** 購物車項目的例外狀況 */
export type CartIssue =
  | { kind: 'unavailable' }
  | { kind: 'price_changed'; oldPrice: number; newPrice: number }
  | { kind: 'offer_expired'; newPrice: number }

/**
 * 檢查購物車中的一筆商品是否有例外（下架、改價、優惠到期）。
 * 目前商品資料為單一課程且皆正常，因此提供開發用模擬：
 *   ?cart=unavailable｜?cart=price_changed｜?cart=offer_expired
 * 後端串接後改以 GET /cart/validate 回傳同樣的三種 kind。
 */
export function cartIssueOf(
  item: { id: string; price: number },
): CartIssue | null {
  let forced: string | null = null
  try {
    forced = new URLSearchParams(location.search).get('cart')
  } catch {
    forced = null
  }
  const product = productById(item.id)

  if (forced === 'unavailable' || product?.availability === 'unavailable') {
    return { kind: 'unavailable' }
  }
  if (forced === 'price_changed') {
    /* 模擬的新價格固定為原價 +500；使用者套用後兩者相等，提示自動消失 */
    const newPrice = (product?.price ?? item.price) + 500
    if (item.price === newPrice) return null
    return { kind: 'price_changed', oldPrice: item.price, newPrice }
  }
  if (forced === 'offer_expired') {
    const newPrice = product?.originalPrice ?? item.price
    if (item.price === newPrice) return null
    return { kind: 'offer_expired', newPrice }
  }
  if (product?.offerEndsAt && new Date(product.offerEndsAt).getTime() < Date.now()) {
    return { kind: 'offer_expired', newPrice: product.originalPrice ?? item.price }
  }
  if (product && product.price !== item.price) {
    return { kind: 'price_changed', oldPrice: item.price, newPrice: product.price }
  }
  return null
}
