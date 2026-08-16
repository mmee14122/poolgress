import { useSyncExternalStore } from 'react'
import { enrollments as seedEnrollments, starHistory as seedStars } from '../data/user'

/**
 * 學習庫 store：已購課程、學習進度、訂單、星星紀錄。
 * 寫法與 lib/cart.ts 一致（localStorage + 訂閱通知 + 跨分頁同步）。
 *
 * ⚠️ 這是「沒有後端時的替身」：結帳成功會真的寫入瀏覽器，
 * 讓「購買 → 我的課程 → 開始學習 → 記錄進度」整條動線可完整展示。
 * 後端接上後，只要把本檔的讀寫換成 API 呼叫，UI 完全不用改。
 *
 * 初次使用時以 src/data/user.ts 的 seed 資料開場（可在該處清空）。
 */

export type LibraryCourse = {
  courseId: string
  /** 購買時間 ISO */
  purchasedAt: string
  /** 已完成的單元 id（格式「章序-單元序」） */
  completedLessons: string[]
  /** 最後學習的單元 id */
  lastLessonId: string | null
}

export type LibraryOrder = {
  id: string
  date: string
  items: { id: string; title: string; price: number }[]
  total: number
  status: '已完成' | '待繳費' | '已取消'
  /** 付款方式代碼（demo） */
  method: string
}

export type LibraryStar = {
  source: string
  date: string
  amount: number
}

/**
 * 已預約的教練課。
 * 預約成功後寫入，個人區「我的課程 → 我的教練課」會列出來。
 * ⚠️ 目前沒有後端，這是存在瀏覽器的替身資料。
 */
export type LibraryBooking = {
  id: string
  coachId: string
  coachName: string
  serviceName: string
  /** 上課日期 YYYY-MM-DD */
  date: string
  /** 開始時間 HH:mm */
  time: string
  /** 課程時長（分鐘）；null＝待確認 */
  durationMin: number | null
  /** 上課地點（場館名稱＋地址）；null＝待補 */
  venueName: string | null
  venueAddress: string | null
  /** 預約建立時間 ISO */
  bookedAt: string
}

export type Library = {
  courses: LibraryCourse[]
  orders: LibraryOrder[]
  stars: LibraryStar[]
  bookings: LibraryBooking[]
}

const KEY = 'poolgress.library.v1'

/** 首次進站的預設內容（來自 src/data/user.ts，方便你清空或調整） */
function seed(): Library {
  return {
    courses: seedEnrollments.map((e) => ({
      courseId: e.courseId,
      purchasedAt: new Date(0).toISOString(),
      completedLessons: [],
      lastLessonId: e.lastLessonId,
    })),
    orders: [],
    stars: [...seedStars],
    bookings: [],
  }
}

function load(): Library {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    const parsed = JSON.parse(raw) as Library
    return {
      courses: Array.isArray(parsed.courses) ? parsed.courses : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      stars: Array.isArray(parsed.stars) ? parsed.stars : [],
      /* 舊版資料沒有 bookings 欄位，補成空陣列避免壞掉 */
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    }
  } catch {
    return seed()
  }
}

let cache: Library = load()
const listeners = new Set<() => void>()

function commit(next: Library) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* 隱私模式等寫入失敗時仍維持記憶體內狀態 */
  }
  listeners.forEach((l) => l())
}

export const library = {
  get: (): Library => cache,

  /** 是否已購買某課程 */
  owns: (courseId: string) => cache.courses.some((c) => c.courseId === courseId),

  /** 取得單一課程的學習狀態 */
  courseState: (courseId: string) => cache.courses.find((c) => c.courseId === courseId) ?? null,

  /** 預約教練課成功：寫入一筆預約紀錄 */
  addBooking(booking: Omit<LibraryBooking, 'id' | 'bookedAt'>) {
    const now = new Date()
    const entry: LibraryBooking = {
      ...booking,
      id: `bk-${now.getTime()}`,
      bookedAt: now.toISOString(),
    }
    commit({ ...cache, bookings: [...cache.bookings, entry] })
    return entry
  },

  /** 結帳成功：加入已購課程並產生訂單（同一課程不重複加入） */
  completePurchase(
    items: { id: string; title: string; price: number }[],
    total: number,
    method: string,
    paid: boolean,
  ) {
    const now = new Date().toISOString()
    const added: LibraryCourse[] = items
      .filter((i) => !cache.courses.some((c) => c.courseId === i.id))
      .map((i) => ({
        courseId: i.id,
        purchasedAt: now,
        completedLessons: [],
        lastLessonId: null,
      }))

    const order: LibraryOrder = {
      id: `PG${now.slice(0, 10).replace(/-/g, '')}${String(cache.orders.length + 1).padStart(3, '0')}`,
      date: now,
      items,
      total,
      status: paid ? '已完成' : '待繳費',
      method,
    }

    commit({
      ...cache,
      /* 待繳費（ATM／超商）也先給課程存取權；正式版應等付款確認 */
      courses: [...cache.courses, ...added],
      orders: [order, ...cache.orders],
    })
    return order
  },

  /** 標記單元完成（同時更新最後學習位置） */
  completeLesson(courseId: string, lessonId: string) {
    const courses = cache.courses.map((c) =>
      c.courseId === courseId
        ? {
            ...c,
            completedLessons: c.completedLessons.includes(lessonId)
              ? c.completedLessons
              : [...c.completedLessons, lessonId],
            lastLessonId: lessonId,
          }
        : c,
    )
    commit({ ...cache, courses })
  },

  /** 只更新「最後看到哪」，不算完成 */
  touchLesson(courseId: string, lessonId: string) {
    if (!library.owns(courseId)) return
    const target = library.courseState(courseId)
    if (target?.lastLessonId === lessonId) return
    commit({
      ...cache,
      courses: cache.courses.map((c) =>
        c.courseId === courseId ? { ...c, lastLessonId: lessonId } : c,
      ),
    })
  },

  /** 新增星星紀錄（來源由呼叫端說明） */
  addStars(source: string, amount: number) {
    commit({
      ...cache,
      stars: [{ source, date: new Date().toISOString(), amount }, ...cache.stars],
    })
  },

  /** 清空（測試／展示重置用） */
  reset() {
    commit({ courses: [], orders: [], stars: [], bookings: [] })
  },

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = load()
      listeners.forEach((l) => l())
    }
  })
}

const emptyLibrary: Library = { courses: [], orders: [], stars: [], bookings: [] }

export function useLibrary(): Library {
  return useSyncExternalStore(library.subscribe, library.get, () => emptyLibrary)
}

/** 星星總數（全站唯一來源） */
export function totalStarsOf(lib: Library): number {
  return lib.stars.reduce((sum, s) => sum + s.amount, 0)
}

/** 是否已擁有某課程（重複購買保護：課程頁改顯示「開始學習」） */
export function ownsCourse(lib: Library, courseId: string): boolean {
  return lib.courses.some((c) => c.courseId === courseId)
}
