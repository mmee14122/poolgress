import { course } from './course-detail'
import type { CoachInfo } from './course-detail'

/**
 * 教練群。
 *
 * ── 如何新增一位教練 ──────────────────────────────────
 * 在下方 coaches 陣列加一筆即可，教練頁自動出現新卡片：
 *
 *   {
 *     id: 'coach-2',                       // 唯一代號（用於錨點連結）
 *     name: '王教練',
 *     title: '進階走位教練',                 // 職稱／專長定位
 *     photo: '/assets/coach/coach-2.jpg',   // 建議 800×1066（3:4）；null＝漸層佔位
 *     philosophy: '一句話教學理念（引言呈現）',
 *     bio: ['段落一', '段落二'],
 *     credentials: ['資歷一', '資歷二'],
 *     stats: [{ value: '10', label: '教學年資' }],   // 建議 2–3 項
 *     instagram: '@帳號',                    // null＝不顯示
 *     specialties: ['基本功', '走位'],        // 專長標籤，可省略
 *   }
 *
 * 第一位（主教練）沿用 data/course-detail.ts 的 coach 資料，
 * 課程頁與教練頁共用同一份，改一處兩邊同步。
 * ──────────────────────────────────────────────────
 */

export type Coach = CoachInfo & {
  id: string
  /** 照片路徑；null 時顯示品牌漸層佔位 */
  photo: string | null
  /** 專長標籤（可省略） */
  specialties?: string[]
}

export const coaches: Coach[] = [
  {
    id: 'coach-1',
    ...course.coach,
    photo: null,
    specialties: ['基本功建立', '擊球原理', '新手入門'],
  },
  /* 未來新增教練：複製上方註解的範例格式貼在這裡 */
]

/** 依 id 取得教練 */
export const coachById = (id: string) => coaches.find((c) => c.id === id)

/** 教練頁上方的簡介文案（可自由修改） */
export const coachesIntro = {
  eyebrow: '教練群',
  title: '把「看起來像天賦的東西」講清楚的人',
  lead: '每一位 Poolgress 教練都相信同一件事：動作可以被描述、被練習、被檢查。',
}
