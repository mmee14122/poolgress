/**
 * 球具選物（shop.html）內容。
 * 商品尚未正式開賣：這裡的品項／價格是版面用的示意資料（2026-09-06），正式上架時整檔替換；
 * 圖片路徑 null＝顯示佔位色塊，圖進來後填 public/assets/shop/…。
 */
export type ShopCategory = { id: string; label: string; en: string; blurb: string }
export type ShopProduct = {
  id: string
  category: string
  brand: string
  name: string
  price: number
  comparePrice?: number
  badge?: string
  image: string | null
}

export const shopCategories: ShopCategory[] = [
  { id: 'cues', label: '球桿', en: 'CUES', blurb: '入門到進階的碳纖與楓木球桿。' },
  { id: 'tips', label: '皮頭與巧克', en: 'TIPS & CHALK', blurb: '影響手感的第一個零件。' },
  { id: 'gloves', label: '手套', en: 'GLOVES', blurb: '三指手套，出桿更順。' },
  { id: 'cases', label: '球桿袋', en: 'CASES', blurb: '通勤、上課、比賽都帶得走。' },
  { id: 'accessories', label: '配件', en: 'ACCESSORIES', blurb: '架桿、延長桿、清潔保養。' },
  { id: 'outlet', label: 'Outlet', en: 'OUTLET', blurb: '展示品與換季選物。' },
]

export const shopProducts: ShopProduct[] = [
  { id: 'c1', category: 'cues', brand: 'Poolgress', name: '入門碳纖維球桿 12.5mm', price: 6800, badge: '新品', image: null },
  { id: 'c2', category: 'cues', brand: 'Poolgress', name: '楓木練習球桿 13mm', price: 3200, image: null },
  { id: 'c3', category: 'cues', brand: 'Poolgress', name: '碳纖維前節 12.4mm', price: 9800, badge: '闖關星星可折抵', image: null },
  { id: 'c4', category: 'cues', brand: 'Poolgress', name: '衝球／跳球兩用桿', price: 5400, image: null },
  { id: 't1', category: 'tips', brand: 'Poolgress', name: '多層皮頭（中硬）', price: 480, image: null },
  { id: 't2', category: 'tips', brand: 'Poolgress', name: '巧克・藍', price: 120, image: null },
  { id: 't3', category: 'tips', brand: 'Poolgress', name: '巧克盒＋磁吸夾', price: 390, image: null },
  { id: 'g1', category: 'gloves', brand: 'Poolgress', name: '三指手套（左手）', price: 590, image: null },
  { id: 'g2', category: 'gloves', brand: 'Poolgress', name: '三指手套（右手）', price: 590, image: null },
  { id: 'k1', category: 'cases', brand: 'Poolgress', name: '2×2 硬殼球桿袋', price: 4200, badge: '新品', image: null },
  { id: 'k2', category: 'cases', brand: 'Poolgress', name: '1×1 帆布通勤袋', price: 1680, image: null },
  { id: 'a1', category: 'accessories', brand: 'Poolgress', name: '架桿頭（十字）', price: 350, image: null },
  { id: 'a2', category: 'accessories', brand: 'Poolgress', name: '延長桿 30cm', price: 1290, image: null },
  { id: 'a3', category: 'accessories', brand: 'Poolgress', name: '前節清潔保養組', price: 520, image: null },
  { id: 'o1', category: 'outlet', brand: 'Poolgress', name: '展示品・楓木球桿 13mm', price: 2400, comparePrice: 3200, badge: 'Outlet', image: null },
  { id: 'o2', category: 'outlet', brand: 'Poolgress', name: '換季・1×1 帆布袋（灰）', price: 1180, comparePrice: 1680, badge: 'Outlet', image: null },
]

/** 首頁式排版的區塊順序（參考 kshop：分類導覽 → 主視覺 → 分類入口 → 各系列商品列 → 促銷 → 頁尾） */
export const shopSections: { category: string; title: string; eyebrow: string }[] = [
  { category: 'cues', title: '球桿精選', eyebrow: '01 / CUES' },
  { category: 'tips', title: '皮頭與巧克', eyebrow: '02 / TIPS & CHALK' },
  { category: 'cases', title: '球桿袋', eyebrow: '03 / CASES' },
  { category: 'accessories', title: '配件與保養', eyebrow: '04 / ACCESSORIES' },
  { category: 'outlet', title: 'Outlet 專區', eyebrow: '05 / OUTLET' },
]
