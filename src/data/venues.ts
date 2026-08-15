/**
 * 合作場館。
 *
 * ⚠️ 目前沒有任何已簽約場館，venues 刻意留空 → 頁面顯示「洽談中」狀態。
 * 未來新增：在 venues 加一筆即可，頁面自動變成清單。
 *
 * 欄位說明：
 *   name     場館名稱
 *   city     縣市（用於分組顯示）
 *   address  地址
 *   mapUrl   Google Maps 連結（直接貼分享網址即可）
 *   note     備註（例：提供 Poolgress 學員優惠）
 *   image    場館照片路徑（建議 16:9；放 public/assets/venues/）；null＝漸層佔位
 */

export type Venue = {
  name: string
  city: string
  address: string
  mapUrl: string | null
  note?: string
  image: string | null
}

export const venues: Venue[] = []

/** 場館合作洽談窗口（顯示於場館頁） */
export const venueContactEmail = 'hello@poolgress.com'
