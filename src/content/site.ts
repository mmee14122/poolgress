/**
 * 全站設定：導覽、促銷列、對外連結。
 * 站台層級的東西都放這裡，元件不寫死任何文案或網址。
 */

export type NavLink = { label: string; href: string }
export type Language = { code: string; label: string }

export const site = {
  brandName: 'Poolgress',
  tagline: 'AI 撞球教育平台',

  /** 主導覽 —— 目前為佔位路徑，之後接上實際頁面即可 */
  nav: [
    { label: '線上課程', href: '/courses' },
    { label: '遊戲闖關', href: '/games' },
    { label: '關於教練', href: '/coach' },
  ] as NavLink[],

  cartUrl: '/cart',
  loginUrl: '/login',
  signupUrl: '/signup',

  /** 購物車數量，之後改由狀態管理或 API 提供 */
  cartCount: 2,

  languages: [
    { code: 'zh-Hant', label: '繁中' },
    { code: 'en', label: 'English' },
  ] as Language[],

  /**
   * 頂部促銷列。
   * endsAt 設為 null 時倒數會顯示「＿＿天＿＿時＿＿分」佔位符；
   * 填入 ISO 時間字串則顯示實際倒數，過期後整條促銷列自動隱藏。
   */
  promo: {
    label: '限時優惠倒數',
    endsAt: '2026-09-30T23:59:59+08:00' as string | null,
    linkLabel: '查看特別優惠組合',
    linkHref: '/offers',
  },

  contactEmail: 'hello@poolgress.com',

  footerLinks: [
    { label: '服務條款', href: '/terms' },
    { label: '隱私權政策', href: '/privacy' },
    { label: '退費政策', href: '/refund' },
    { label: '聯絡我們', href: '/contact' },
  ] as NavLink[],
} as const
