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
    { label: '球具選物', href: './shop.html' },
    /* 「關於 Poolgress」不放主導覽，入口在頁尾「關於」欄 */
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

  /** 全站唯一對外信箱（2026-08-17 使用者決定統一用 support@） */
  contactEmail: 'support@poolgress.com',

  /** ⚠️ 公司地址待補；填入後頁尾自動顯示，留空字串則整行不出現 */
  companyAddress: '公司地址待補',

  /**
   * 社群連結（頁尾追蹤入口）。
   * 填入正式網址後 icon 自動變成可點；留 null 顯示為停用狀態，
   * 滑上去出現「即將公開」提示，不會連到錯誤網址。
   */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    youtube: null as string | null,
  },

  /** 客服信箱；已與 contactEmail 統一，兩個欄位保留是為了不動到既有引用點 */
  supportEmail: 'support@poolgress.com',

  /** LINE 官方帳號連結；null＝顯示為停用並標示即將公開 */
  lineUrl: null as string | null,

  /**
   * App 下載。
   *
   * smartUrl：智慧下載頁（QR code 指向這裡）——同一個網址依裝置分流，
   *           iOS 去 App Store、Android 去 Google Play、桌機顯示兩個平台。
   *           ⚠️ 尚未建立，填 null 時 QR code 顯示待補佔位框。
   * qrCode：  QR code 圖片路徑（建議 512×512 PNG，放 public/assets/challenges/）。
   * appStore／googlePlay：商店連結，null＝尚未上架，badge 顯示為停用。
   */
  appDownload: {
    smartUrl: null as string | null,
    qrCode: null as string | null,
    /** 下載區最下方唯一一句文案（非 CTA、不可點） */
    outro: '讓我們一起把撞球變得好玩！',
    /** 商店連結（上架後填入；null＝顯示為即將上架） */
    appStore: null as string | null,
    googlePlay: null as string | null,
  },

  /** 頁尾「關於」連結群組（放在支援與條款之前） */
  footerAbout: [
    { label: '關於 Poolgress', href: './about.html' },
    { label: '加入 Poolgress', href: './join.html' },
    { label: '合作洽談', href: './partnership.html' },
  ] as NavLink[],

  /** 頁尾「支援與條款」連結群組 */
  footerSupport: [
    { label: '常見問題', href: './faq.html' },
    { label: '使用者條款', href: './terms.html' },
    { label: '服務契約', href: './service-agreement.html' },
    { label: '隱私權政策', href: './privacy.html' },
  ] as NavLink[],

} as const
