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

/**
 * 預覽用示範場館（**不是真實合作場館**）。
 *
 * 正式頁面一律讀上面的 venues（目前為空＝顯示洽談中）。
 * 需要預覽卡片列表、篩選與地圖版面時，網址加 ?demo=venues 即可載入這份資料。
 * 真實場館簽約後，把資料填進 venues，這份示範資料可直接刪除。
 */
export const demoVenues: Venue[] = [
  {
    name: '示範撞球館・信義店',
    city: '台北市',
    address: '台北市信義區示範路 1 號 2 樓',
    mapUrl: null,
    note: '示範資料：出示 Poolgress 學員身分享平日時段優惠',
    image: null,
  },
  {
    name: '示範撞球館・板橋店',
    city: '新北市',
    address: '新北市板橋區示範街 22 號',
    mapUrl: null,
    note: '示範資料：提供 9 呎球檯與教學區',
    image: null,
  },
  {
    name: '示範撞球館・中壢店',
    city: '桃園市',
    address: '桃園市中壢區示範大道 88 號',
    mapUrl: null,
    image: null,
  },
  {
    name: '示範撞球館・西屯店',
    city: '台中市',
    address: '台中市西屯區示範路 3 段 15 號',
    mapUrl: null,
    note: '示範資料：週末開放闖關挑戰賽',
    image: null,
  },
]
