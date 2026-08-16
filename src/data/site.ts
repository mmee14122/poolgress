/**
 * 全站設定：導覽與對外連結。
 * 站台層級的東西都放這裡，元件不寫死任何文案或網址。
 */

export type NavLink = { label: string; href: string }
export type Language = { code: string; label: string }

export const site = {
  brandName: 'Poolgress',
  tagline: 'AI 撞球教育平台',

  /** 主導覽。venues 目前為「敬請期待」佔位頁，正式頁完成後整頁替換 */
  nav: [
    { label: '線上課程', href: './course.html' },
    { label: '實戰闖關', href: './challenges.html' },
    { label: '關於教練', href: './coach.html' },
    { label: '合作場館', href: './venues.html' },
  ] as NavLink[],

  cartUrl: './cart.html',
  /* 相對路徑：GitHub Pages 部署在 /poolgress/ 子路徑下也不會 404 */
  loginUrl: './login.html',
  signupUrl: './login.html?mode=register',

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

  /* 全部使用相對路徑（子資料夾部署也正確） */
  footerLinks: [
    { label: '常見問題', href: './faq.html' },
    { label: '服務條款', href: './terms.html' },
    { label: '隱私權政策', href: './privacy.html' },
    { label: '聯絡我們', href: './contact.html' },
  ] as NavLink[],
} as const
