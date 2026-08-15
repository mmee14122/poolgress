/**
 * 課程目錄（課程列表頁／我的課程頁共用）。
 *
 * ⚠️ 這是集中管理的 mock data：要新增課程，在 courseCatalog 加一筆即可，
 * 列表頁與篩選會自動更新。詳細單元內容（章節、影片）目前只有主課程一堂，
 * 放在 src/content/course.ts（course.chapters），學習頁由該處讀取。
 *
 * 可替換欄位說明：
 *   id        商品／課程識別碼，需與 src/content/catalog.ts 的 products 對應
 *   title     課程名稱
 *   cover     封面圖路徑（建議 16:9、1280×720 以上；放 public/assets/courses/）
 *             null＝顯示內建漸層佔位封面
 *   level     難度（新手入門｜進階｜高階）
 *   category  分類標籤
 *   summary   一句話簡述
 *   units     單元數（主課程自動由章節計算，其餘手填）
 *   hours     總時數（小時）
 *   price     價格；null＝顯示「即將推出」（不可購買）
 *   originalPrice 劃線原價（可省略）
 *   href      課程詳情頁connect；即將推出者為 null
 */

import { course, courseStats } from './course-detail'
import type { Chapter } from './course-detail'

export type CourseLevel = '新手入門' | '進階' | '高階'

export type CourseSummary = {
  id: string
  title: string
  cover: string | null
  level: CourseLevel
  category: string
  summary: string
  units: number
  hours: number
  price: number | null
  originalPrice?: number
  href: string | null
}

export const courseCatalog: CourseSummary[] = [
  {
    /* 主課程：詳情頁＝course.html，資料與 content/course.ts 同步 */
    id: 'course-tbd-1',
    title: '課程名稱待補',
    cover: null,
    level: '新手入門',
    category: '花式撞球',
    summary: '從觀念、基本動作、擊球原理到實際闖關練習，建立可複製的進步方法。',
    units: courseStats.units,
    hours: Number(courseStats.hours),
    price: 2940,
    originalPrice: 4900,
    href: './course.html',
  },
  {
    /* ⚠️ 示範的「即將推出」課程：上線前請換成真實規劃或整筆刪除 */
    id: 'course-coming-1',
    title: '進階課程規劃中',
    cover: null,
    level: '進階',
    category: '花式撞球',
    summary: '課程內容規劃中，敬請期待。',
    units: 0,
    hours: 0,
    price: null,
    href: null,
  },
]

export const courseLevels: CourseLevel[] = ['新手入門', '進階', '高階']

/** 依 id 取得課程摘要 */
export const courseById = (id: string) => courseCatalog.find((c) => c.id === id)

/**
 * 課程章節（學習頁用）。
 * 主課程的章節在 src/content/course.ts（course.chapters）——新增單元改那裡；
 * 未來多課程時，在此對照表加入 { 課程 id: 章節陣列 }。
 */
export const chaptersByCourse: Record<string, Chapter[]> = {
  'course-tbd-1': course.chapters,
}

/** 攤平成單元清單：id 格式「章序-單元序」（皆從 1 起算） */
export type FlatLesson = {
  id: string
  chapterIndex: number
  chapterName: string
  lesson: Chapter['lessons'][number]
}

export function flatLessons(courseId: string): FlatLesson[] {
  const chapters = chaptersByCourse[courseId] ?? []
  return chapters.flatMap((ch, ci) =>
    ch.lessons.map((lesson, li) => ({
      id: `${ci + 1}-${li + 1}`,
      chapterIndex: ci,
      chapterName: ch.name,
      lesson,
    })),
  )
}
