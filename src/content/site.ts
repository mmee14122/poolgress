/**
 * 全站設定：導覽與對外連結。
 * 站台層級的東西都放這裡，元件不寫死任何文案或網址。
 */

export type NavLink = { label: string; href: string }
export type Language = { code: string; label: string }

export const site = {
  brandName: 'Poolgress',
  tagline: 'AI 撞球教育平台',

  /** 主導覽。/games 與 /coach 為佔位路徑，頁面建立後接上 */
  nav: [
    { label: '線上課程', href: './course.html' },
    { label: '遊戲闖關', href: '/games' },
    { label: '關於教練', href: '/coach' },
  ] as NavLink[],

  cartUrl: './cart.html',
  loginUrl: '/login',
  signupUrl: '/signup',

  /** 購物車數量，之後由狀態管理或 API 提供；0 時不顯示徽章 */
  cartCount: 0,

  languages: [
    { code: 'zh-Hant', label: '繁中' },
    { code: 'en', label: 'English' },
  ] as Language[],

  /**
   * 頂部限時優惠倒數列。
   * endsAt 為活動結束時間（ISO 字串，可設定，不寫死數字）；
   * 倒數結束後顯示 endedText。
   */
  promo: {
    label: '限時優惠活動',
    endsAt: '2026-08-31T23:59:59+08:00',
    endedText: '本次限時優惠已結束',
  },

  contactEmail: 'hello@poolgress.com',

  footerLinks: [
    { label: '服務條款', href: '/terms' },
    { label: '隱私權政策', href: '/privacy' },
    { label: '退費政策', href: '/refund' },
    { label: '聯絡我們', href: '/contact' },
  ] as NavLink[],
} as const
