/**
 * ══════════════════════════════════════════════════════════════
 *  Poolgress 內容資料入口
 * ══════════════════════════════════════════════════════════════
 *
 * 全站所有「可替換內容」都在 src/data/ 這個資料夾，畫面元件不寫死文案。
 * 要改網站內容，只需要動這裡的檔案，不必碰版面程式。
 *
 * ┌──────────────────────┬──────────────────────────────────────┐
 * │ 檔案                  │ 內容                                  │
 * ├──────────────────────┼──────────────────────────────────────┤
 * │ site.ts              │ 品牌名、主導覽、頁尾連結、促銷倒數、聯絡信箱 │
 * │ home.ts              │ 首頁七個區塊的全部文案                    │
 * │ courses.ts           │ 課程目錄（列表頁卡片）＋章節查表           │
 * │ course-detail.ts     │ 主課程詳情：Hero、六段文案、章節單元、     │
 * │                      │ 教練、學員評價、FAQ、購買卡資訊           │
 * │ catalog.ts           │ 商品價格與優惠券                         │
 * │ challenges.ts        │ 實戰闖關關卡、App 商店連結               │
 * │ venues.ts            │ 合作場館                                │
 * │ user.ts              │ 使用者示範資料（進度、星星、等級）         │
 * └──────────────────────┴──────────────────────────────────────┘
 *
 * 圖片與影片素材放 public/assets/（該資料夾的 README.md 有尺寸建議）。
 * 完整操作說明見專案根目錄 README.md。
 *
 * 這支檔案只是彙整出口，方便一次 import；也可以直接 import 個別檔案。
 */

export { site } from './site'
export { home } from './home'
export { courseCatalog, courseLevels, courseById, chaptersByCourse, flatLessons } from './courses'
export type { CourseSummary, CourseLevel, FlatLesson } from './courses'
export { course, courseStats } from './course-detail'
export type { Chapter, Lesson, Review, CoachInfo, Faq } from './course-detail'
export { products, productById, availableCoupons, findCoupon, couponDiscount } from './catalog'
export type { Product, Coupon } from './catalog'
export { challenges, challengeById, appLinks } from './challenges'
export type { Challenge } from './challenges'
export { venues, venueContactEmail } from './venues'
export type { Venue } from './venues'
export { currentUserMeta } from './user'

/* ── 以下為方便取用的別名，對應需求文件的命名 ───────────────── */

import { course } from './course-detail'

/* 教練清單見 data/coaches.ts：coaches（全部）、featured（精選）、partners（合作） */
export { coaches, featured, partners, coachById, coachHref, coachesIntro, partnersIntro } from './coaches'
export type { Coach, CoachStat, CoachSocialLinks } from './coaches'

/** 學員評價 ⚠️ 目前為範例文案，上線前必須換成真實回饋 */
export const testimonials = course.reviews

/** 常見問題（課程頁與 FAQ 頁共用） */
export const faqs = course.faqs
