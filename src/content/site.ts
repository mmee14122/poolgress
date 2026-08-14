/**
 * 全站設定。所有對外連結集中在這裡 —— UI 端不需要知道金流是哪一家，
 * 換平台時只要改 checkoutUrl 一行。
 */
export const site = {
  brandName: '課程工作室',

  /** 主 CTA 目的地：填你的收款頁（Teachify / 綠界 / 藍新 / 表單皆可） */
  checkoutUrl: 'https://example.com/checkout',
  /** 次要 CTA：免費試看、索取大綱 */
  previewUrl: 'https://example.com/preview',

  contactEmail: 'hello@example.com',

  social: [
    { label: 'Instagram', href: 'https://instagram.com/example' },
    { label: 'YouTube', href: 'https://youtube.com/@example' },
  ],

  /** 頁尾法遵連結 —— 台灣線上課程建議至少備齊這三項 */
  legal: [
    { label: '服務條款', href: '/terms' },
    { label: '隱私權政策', href: '/privacy' },
    { label: '退費政策', href: '/refund' },
  ],

  /** 導覽列錨點 */
  nav: [
    { label: '課程內容', href: '#curriculum' },
    { label: '講師', href: '#instructor' },
    { label: '學員成果', href: '#testimonials' },
    { label: '方案', href: '#pricing' },
    { label: '常見問題', href: '#faq' },
  ],
} as const
