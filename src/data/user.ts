/**
 * 使用者相關 mock data：學習進度、星星紀錄、訂單。
 *
 * ⚠️ 全部是示範資料（後端串接後由 API 提供），集中在此方便替換：
 *   - enrollments：已購課程與進度（demo 預設有一筆進行中，讓「我的課程」
 *     與學習頁可展示；上線前清空或由後端取代）
 *   - starHistory：星星獲得紀錄（demo 兩筆；清空即顯示空狀態）
 *   - orders：訂單紀錄（預設空＝空狀態）
 *   - currentUserMeta：等級等顯示資訊（登入身分本身在 lib/session.ts）
 *
 * 日期一律 ISO 字串；金額為新台幣整數。
 */

export type Enrollment = {
  /** 對應 data/courses.ts 的課程 id */
  courseId: string
  /** 0–100 */
  progress: number
  /** 最後學習的單元 id（章節序-單元序，如 '1-2'）；null＝尚未開始 */
  lastLessonId: string | null
  status: 'in-progress' | 'completed' | 'not-started'
}

export type StarRecord = {
  /** 來源說明（例：完成 Challenge 第一關） */
  source: string
  date: string
  amount: number
}

export type OrderRecord = {
  id: string
  date: string
  items: string[]
  total: number
  status: '已完成' | '待繳費' | '已取消'
}

/**
 * 首次進站的預設已購課程。
 *
 * 預設為空 → 新訪客的「我的課程」是空狀態，購買後才會出現課程，
 * 完整展示「購買 → 我的課程 → 開始學習」動線。
 *
 * 若要在展示時直接看到有進度的課程（不用先跑一次購買），
 * 在這裡加一筆即可，例如：
 *   { courseId: 'course-tbd-1', progress: 22, lastLessonId: '1-2', status: 'in-progress' }
 */
export const enrollments: Enrollment[] = []

/** 首次進站的預設星星紀錄；預設為空＝星星頁顯示空狀態 */
export const starHistory: StarRecord[] = []

/** 星星總數＝紀錄加總（實際顯示以 lib/library.ts 為準） */
export const totalStars = starHistory.reduce((sum, r) => sum + r.amount, 0)

/** 訂單（實際訂單由 lib/library.ts 於結帳後產生） */
export const orders: OrderRecord[] = []

/** 顯示用等級（規則【待確認】，先固定 Lv.1） */
export const currentUserMeta = {
  level: 1,
  completedCourses: 0,
}
