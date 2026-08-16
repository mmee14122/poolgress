import { course } from './course-detail'

/**
 * 教練群。
 *
 * ── 如何新增一位教練 ──────────────────────────────────
 * 在下方 partnerCoaches 陣列加一筆即可：
 *   ・教練頁（coach.html）的「合作教練」區自動出現新卡片
 *   ・個別教練頁（coach.html?id=…）自動可用，不必新增檔案
 *   ・桌機 3 欄，第 4 位以後自動換到下一列，欄寬不變
 *
 *   {
 *     id: 'coach-lin',                        // 唯一代號，也是網址參數
 *     name: '教練姓名待補',
 *     role: '實戰策略教練',                     // 角色標籤（可自由命名）
 *     featured: false,                        // true＝精選／首席（只留一位）
 *     photo: '/assets/coach/coach-lin.jpg',   // 建議 800×1000（4:5）；null＝漸層佔位
 *     specialties: ['母球控制', '實戰判斷'],    // 建議 2–3 個
 *     shortBio: '卡片上的一句話（不超過兩行）',
 *     philosophy: '完整教學理念（個別頁以引言呈現）',
 *     bio: ['關於教練段落一', '段落二'],         // 空陣列＝該區塊不顯示
 *     stats: [{ label: '教學年資', value: '＿＿年' }],
 *     credentials: ['經歷一'],                 // 空陣列＝該區塊不顯示
 *     socialLinks: { instagram: '@帳號' },      // 空物件＝不顯示
 *     courseIds: ['course-tbd-1'],            // 對應 data/courses.ts 的課程 id
 *     challengeIds: ['challenge-1'],          // 對應 data/challenges.ts 的關卡 id
 *   }
 *
 * ⚠️ 資料紀律：姓名、年資、經歷等未確認的內容一律留「待補／＿＿」，不可虛構。
 * ──────────────────────────────────────────────────
 */

export type CoachStat = { label: string; value: string }

/**
 * 可預約時段：日期（YYYY-MM-DD）→ 該日開放的時間。
 * 空物件＝這位教練目前不開放預約（個別頁不顯示行事曆）。
 */
export type CoachAvailability = Record<string, string[]>

/**
 * ⚠️ 示範用的開放時段產生器——上線前必須換成真實資料。
 *
 * 目前沒有預約後端，為了讓行事曆看得出設計，這裡自動把
 * 「今天起三個月內的每週二、四、六」當成開放日。
 * 真實資料到位後，直接把 coach 的 availability 換成固定物件即可：
 *
 *   availability: {
 *     '2026-09-03': ['19:00', '20:00'],
 *     '2026-09-05': ['14:00'],
 *   }
 */
function demoAvailability(times: string[]): CoachAvailability {
  const out: CoachAvailability = {}
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const end = new Date(d)
  end.setMonth(end.getMonth() + 3)

  for (; d <= end; d.setDate(d.getDate() + 1)) {
    /* 2＝週二、4＝週四、6＝週六 */
    if ([2, 4, 6].includes(d.getDay())) out[toDateKey(d)] = times
  }
  return out
}

/** Date → 'YYYY-MM-DD'（用本地時區，避免跨時區差一天） */
export function toDateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export type CoachSocialLinks = {
  instagram?: string
  youtube?: string
  facebook?: string
  website?: string
}

export type Coach = {
  id: string
  name: string
  /** 角色標籤，例：Poolgress 首席教練／基礎訓練教練／實戰策略教練 */
  role: string
  /** 精選（首席）教練：教練頁上方的大型介紹區只顯示這一位 */
  featured: boolean
  /** 照片路徑；null 時顯示品牌漸層佔位 */
  photo: string | null
  specialties: string[]
  /** 卡片用的一句話介紹 */
  shortBio: string
  /** 教學理念（個別頁以引言呈現） */
  philosophy: string
  /** 關於教練；空陣列＝不顯示該區塊 */
  bio: string[]
  /** 數據列；空陣列＝不顯示 */
  stats: CoachStat[]
  /** 經歷與資格；空陣列＝不顯示 */
  credentials: string[]
  /** 社群連結；未填的欄位不顯示 */
  socialLinks: CoachSocialLinks
  /** 開設／參與的課程（對應 data/courses.ts） */
  courseIds: string[]
  /** 對應實戰 Challenge（對應 data/challenges.ts） */
  challengeIds: string[]
  /** 可預約時段；空物件＝不開放預約，個別教練頁不顯示行事曆 */
  availability: CoachAvailability
  /** 單堂課費用（新台幣）；null＝【待確認】，付款畫面顯示待補金額 */
  lessonPrice: number | null
  /** 授課的撞球場館；null＝不顯示這個區塊 */
  venue: CoachVenue | null
  /** 可預約的服務項目；空陣列＝預約卡不顯示服務選單 */
  services: CoachService[]
}

/**
 * 可預約的服務項目（預約卡上方的下拉選單）。
 * 只有一項時顯示為文字，兩項以上才出現下拉。
 */
export type CoachService = {
  id: string
  name: string
  /** 單堂時長（分鐘）；null＝待補 */
  durationMin: number | null
  /** 單堂價格（新台幣）；null＝待補 */
  price: number | null
}

/**
 * 教練授課的撞球場館。
 * mapUrl 填 Google Maps 連結後，場館名稱會變成可點的連結並出現「在 Google 地圖開啟」；
 * 留 null 時只顯示文字，並標示地圖連結待補。
 */
export type CoachVenue = {
  name: string
  address: string
  /** Google Maps 連結（例：https://maps.app.goo.gl/xxxx）；null＝待補 */
  mapUrl: string | null
}

/**
 * 精選（首席）教練。
 * 姓名、理念、經歷等沿用 data/course-detail.ts 的 course.coach，
 * 課程頁與教練頁共用同一份資料，改一處兩邊同步。
 */
const featuredCoach: Coach = {
  id: 'coach-1',
  name: course.coach.name,
  role: course.coach.title,
  featured: true,
  photo: null,
  specialties: ['基本功建立', '擊球原理', '新手入門'],
  shortBio: '把看起來像天賦的東西，拆成可以描述、練習、檢查的具體動作。',
  philosophy: course.coach.philosophy,
  bio: course.coach.bio,
  stats: course.coach.stats.map((s) => ({ label: s.label, value: s.value })),
  credentials: course.coach.credentials,
  socialLinks: { instagram: course.coach.instagram },
  courseIds: ['course-tbd-1'],
  challengeIds: [],
  availability: demoAvailability(['19:00', '20:00', '21:00']),
  /* ⚠️ 單堂費用待確認，填數字（如 1200）後付款畫面才會顯示金額 */
  lessonPrice: null,
  /* ⚠️ 場館與地址待補；mapUrl 填 Google Maps 連結後即可點擊開啟地圖 */
  venue: {
    name: '撞球場館名稱待補',
    address: '場館地址待補',
    mapUrl: null,
  },
  /* ⚠️ 服務名稱／時長／價格皆待確認；填 price 與 durationMin 後預約摘要才會顯示 */
  services: [
    { id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null },
  ],
}

/**
 * 合作教練。
 * ⚠️ 以下三位為結構示範，姓名與經歷皆為待補佔位，上線前必須換成真實資料。
 */
const partnerCoaches: Coach[] = [
  {
    id: 'coach-2',
    name: '教練姓名待補',
    role: '基礎訓練教練',
    featured: false,
    photo: null,
    specialties: ['基本功建立', '新手入門'],
    shortBio: '從握桿與站姿開始，把每個動作的理由講清楚。',
    philosophy: '完整教學理念待補。',
    bio: ['完整自我介紹待補。'],
    stats: [{ label: '教學年資', value: '＿＿年' }],
    credentials: [],
    socialLinks: {},
    courseIds: [],
    challengeIds: [],
    availability: demoAvailability(['10:00', '14:00']),
    /* ⚠️ 單堂費用待確認，填數字（如 1200）後付款畫面才會顯示金額 */
    lessonPrice: null,
    /* ⚠️ 場館與地址待補；mapUrl 填 Google Maps 連結後即可點擊開啟地圖 */
    venue: {
      name: '撞球場館名稱待補',
      address: '場館地址待補',
      mapUrl: null,
    },
    /* ⚠️ 服務名稱／時長／價格皆待確認；填 price 與 durationMin 後預約摘要才會顯示 */
    services: [
      { id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null },
    ],
  },
  {
    id: 'coach-3',
    name: '教練姓名待補',
    role: '瞄準原理教練',
    featured: false,
    photo: null,
    specialties: ['瞄準與球路', '擊球原理'],
    shortBio: '球為什麼會走這條線？先看懂，再談準度。',
    philosophy: '完整教學理念待補。',
    bio: ['完整自我介紹待補。'],
    stats: [{ label: '教學年資', value: '＿＿年' }],
    credentials: [],
    socialLinks: {},
    courseIds: [],
    challengeIds: [],
    availability: demoAvailability(['15:00', '19:00']),
    /* ⚠️ 單堂費用待確認，填數字（如 1200）後付款畫面才會顯示金額 */
    lessonPrice: null,
    /* ⚠️ 場館與地址待補；mapUrl 填 Google Maps 連結後即可點擊開啟地圖 */
    venue: {
      name: '撞球場館名稱待補',
      address: '場館地址待補',
      mapUrl: null,
    },
    /* ⚠️ 服務名稱／時長／價格皆待確認；填 price 與 durationMin 後預約摘要才會顯示 */
    services: [
      { id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null },
    ],
  },
  {
    id: 'coach-4',
    name: '教練姓名待補',
    role: '實戰策略教練',
    featured: false,
    photo: null,
    specialties: ['母球控制', '實戰選擇'],
    shortBio: '這一球該打哪顆？把選擇的依據交到你手上。',
    philosophy: '完整教學理念待補。',
    bio: ['完整自我介紹待補。'],
    stats: [{ label: '教學年資', value: '＿＿年' }],
    credentials: [],
    socialLinks: {},
    courseIds: [],
    challengeIds: [],
    availability: demoAvailability(['20:00', '21:00']),
    /* ⚠️ 單堂費用待確認，填數字（如 1200）後付款畫面才會顯示金額 */
    lessonPrice: null,
    /* ⚠️ 場館與地址待補；mapUrl 填 Google Maps 連結後即可點擊開啟地圖 */
    venue: {
      name: '撞球場館名稱待補',
      address: '場館地址待補',
      mapUrl: null,
    },
    /* ⚠️ 服務名稱／時長／價格皆待確認；填 price 與 durationMin 後預約摘要才會顯示 */
    services: [
      { id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null },
    ],
  },
]

/** 全部教練（精選在前） */
export const coaches: Coach[] = [featuredCoach, ...partnerCoaches]

/** 精選（首席）教練；找不到時退回第一位 */
export const featured = coaches.find((c) => c.featured) ?? coaches[0]

/** 合作教練（精選以外的全部） */
export const partners = coaches.filter((c) => c.id !== featured.id)

/** 依 id 取得教練 */
export const coachById = (id: string) => coaches.find((c) => c.id === id)

/** 個別教練頁網址 */
export const coachHref = (id: string) => `./coach.html?id=${encodeURIComponent(id)}`

/** 教練頁上方的簡介文案（可自由修改） */
export const coachesIntro = {
  eyebrow: '教練群',
  title: '把「看起來像天賦的東西」講清楚的人',
  lead: '每一位 Poolgress 教練都相信同一件事：動作可以被描述、被練習、被檢查。',
}

/** 「合作教練」區塊文案 */
export const partnersIntro = {
  eyebrow: '合作教練',
  title: '從不同角度，陪你把球打得更清楚。',
  lead: '每位教練有不同專長；從基本動作、瞄準原理到實戰判斷，找到適合你目前階段的帶領方式。',
}
