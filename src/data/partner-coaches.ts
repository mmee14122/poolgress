/**
 * 合作教練（2026-09-16 重設計）——首頁「02 / THE COACHES」卡片、coaches.html 列表、
 * coach-profile.html 詳細頁三處共用的資料。
 * （檔名刻意與舊站的 coaches.ts 區隔：那份是舊教練頁／帳號頁在用的，不動。）
 *
 * ⚠️ 目前全部是「示意資料」：教練尚未簽約，姓名／照片／教學方向／球館／時段都是佔位內容，
 *    畫面上會標示「示意」。正式資料進來後只改這一檔，版面不用動。
 *    ・照片：直式或橫式皆可，至少 1200 寬；卡片裁 4:3、詳細頁裁 4:5。路徑放 public/assets/coaches/。
 *    ・價格／時長沒確認就留 null，畫面會顯示「待確認」，不要填假數字。
 *    ・可預約時段：每個球館各自一份（日期 → 時段）；空物件＝該球館目前沒有開放時段。
 *
 * 路徑一律用 /ui/assets/…（絕對路徑）：正式站的根目錄頁與 /ui/ 底下的頁面共用同一批檔案。
 */

export type CoachService = {
  id: string
  name: string
  /** 單堂時長（分鐘）；null＝待確認 */
  durationMin: number | null
  /** 單堂價格（新台幣）；null＝待確認 */
  price: number | null
}

/** 日期（YYYY-MM-DD）→ 該日開放的時段（HH:mm） */
export type Availability = Record<string, string[]>

export type CoachVenue = {
  id: string
  name: string
  /** 城市／區，例：台北市・大安區 */
  city: string
  address: string
  /** Google Maps 連結；null＝待補（畫面不顯示「查看地圖」） */
  mapUrl: string | null
  /** 這個球館的可預約時段；空物件＝目前沒有開放時段 */
  availability: Availability
}

export type CoachCourse = {
  title: string
  /** 教練在課程中的角色，例：主講／協同指導 */
  role: string
  href: string
}

export type PartnerCoach = {
  id: string
  /** 是否為佔位資料；true 時畫面會加「示意」標記 */
  placeholder: boolean
  name: string
  /** 教學方向（卡片最醒目的一行），例：基本功與新手入門 */
  focus: string
  /** 一句具體教學說明，例：從站姿、握桿到出桿，建立穩定的擊球動作。 */
  pitch: string
  /** 2–3 個教學項目標籤，例：站姿與握桿 */
  topics: string[]
  /** 適合對象，例：零基礎／初學者 */
  levels: string
  /** 授課方式，例：實體一對一 */
  format: string
  /** 授課球館（一個以上；預約時要選） */
  venues: CoachVenue[]
  /** 可預約的服務項目 */
  services: CoachService[]
  /** 開設／參與的課程；空陣列＝顯示「課程籌備中」 */
  courses: CoachCourse[]
  /** 詳細頁：教練介紹，一段 */
  intro: string
  /** 詳細頁：教學理念，一到兩句 */
  philosophy: string
  /** 詳細頁：經歷與資格；空陣列＝顯示「待補」 */
  credentials: string[]
  photo: string
  photoAlt: string
}

/** Date → 'YYYY-MM-DD'（本地時區） */
export function toDateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/**
 * ⚠️ 示意時段產生器——上線前必須換成真實資料。
 * 沒有排程後端，為了讓行事曆看得出設計，把今天起三個月內指定的星期幾當成開放日。
 * 真實資料到位後直接改成固定物件：{ '2026-10-03': ['19:00','20:00'], … }
 */
function demoAvailability(weekdays: number[], times: string[]): Availability {
  const out: Availability = {}
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const end = new Date(d)
  end.setMonth(end.getMonth() + 3)
  for (; d <= end; d.setDate(d.getDate() + 1)) {
    if (weekdays.includes(d.getDay())) out[toDateKey(d)] = times
  }
  return out
}

export const coaches: PartnerCoach[] = [
  {
    id: 'coach-a',
    placeholder: true,
    name: '教練 A',
    focus: '基本功與新手入門',
    pitch: '從站姿、握桿到出桿，建立穩定的擊球動作。',
    topics: ['站姿與握桿', '出桿節奏', '基本瞄準'],
    levels: '零基礎／初學者',
    format: '實體一對一',
    venues: [
      {
        id: 'venue-1',
        name: '示意球館 A',
        city: '城市待補',
        address: '地址待補',
        mapUrl: null,
        availability: demoAvailability([2, 4, 6], ['19:00', '20:00', '21:00']),
      },
      {
        id: 'venue-2',
        name: '示意球館 B',
        city: '城市待補',
        address: '地址待補',
        mapUrl: null,
        availability: demoAvailability([0], ['14:00', '15:00']),
      },
    ],
    services: [
      { id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null },
      { id: 'private-4', name: '四堂基礎課程', durationMin: null, price: null },
    ],
    courses: [],
    intro: '示意文字：教練簡介一段，包含教學經歷與擅長帶領的學員類型。正式資料由教練提供後替換，不自行撰寫經歷或成績。',
    philosophy: '示意文字：先把姿勢站穩，再談進球。',
    credentials: [],
    photo: '/ui/assets/coaches/coach-a.webp',
    photoAlt: '教練 A（示意照片，待更換）',
  },
  {
    id: 'coach-b',
    placeholder: true,
    name: '教練 B',
    focus: '瞄準與球路控制',
    pitch: '用系統化的瞄準方法，把進球從運氣變成習慣。',
    topics: ['瞄準系統', '母球走位', '角度判讀'],
    levels: '初學者／進階練習者',
    format: '實體一對一・小組班',
    venues: [
      {
        id: 'venue-1',
        name: '示意球館 A',
        city: '城市待補',
        address: '地址待補',
        mapUrl: null,
        availability: demoAvailability([1, 3, 5], ['10:00', '14:00']),
      },
    ],
    services: [{ id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null }],
    courses: [],
    intro: '示意文字：教練簡介一段，包含教學經歷與擅長帶領的學員類型。正式資料由教練提供後替換。',
    philosophy: '示意文字：教練的教學理念，一到兩句。',
    credentials: [],
    photo: '/ui/assets/coaches/coach-b.webp',
    photoAlt: '教練 B（示意照片，待更換）',
  },
  {
    id: 'coach-c',
    placeholder: true,
    name: '教練 C',
    focus: '實戰策略與比賽思維',
    pitch: '從開球到收尾，練習在球桌上做出正確決定。',
    topics: ['防守與安全球', '清桌規劃', '比賽心態'],
    levels: '有基礎／想參加比賽',
    format: '實體一對一',
    venues: [
      {
        id: 'venue-1',
        name: '示意球館 A',
        city: '城市待補',
        address: '地址待補',
        mapUrl: null,
        availability: demoAvailability([3, 6], ['15:00', '19:00']),
      },
      {
        /* 示意：這個球館目前沒有開放時段，用來檢視預約面板的空白狀態 */
        id: 'venue-3',
        name: '示意球館 C',
        city: '城市待補',
        address: '地址待補',
        mapUrl: null,
        availability: {},
      },
    ],
    services: [{ id: 'private-1', name: '單堂一對一指導', durationMin: null, price: null }],
    courses: [],
    intro: '示意文字：教練簡介一段，包含教學經歷與擅長帶領的學員類型。正式資料由教練提供後替換。',
    philosophy: '示意文字：教練的教學理念，一到兩句。',
    credentials: [],
    photo: '/ui/assets/coaches/coach-c.webp',
    photoAlt: '教練 C（示意照片，待更換）',
  },
]

export function coachById(id: string | null) {
  return coaches.find((c) => c.id === id) ?? null
}

/** 詳細頁網址（根目錄與 /ui/ 兩邊都有這一頁，用相對路徑） */
export function coachProfileHref(id: string) {
  return `./coach-profile.html?id=${encodeURIComponent(id)}`
}

/** 卡片上的標籤文字（首頁區塊、列表頁、詳細頁共用） */
export const coachLabels = {
  levels: '適合對象',
  format: '授課方式',
  venue: '授課地點',
  cta: '查看課程與預約',
  /** 卡片 hover 時浮在照片上的提示 */
  hoverHint: '查看教練頁',
  placeholder: '示意',
  placeholderPhoto: '示意照片',
}

/** 首頁區塊文案 */
export const coachesSection = {
  eyebrow: '02 / 撞球教練與課程預約',
  title: '跟著教練，打出自己的節奏。',
  intro: '專業 × 無菸\n預約更舒適的撞球學習體驗',
  link: { label: '查看全部教練', href: './coaches.html' },
}

/** coaches.html 列表頁文案 */
export const coachesPage = {
  eyebrow: '撞球教練與課程預約',
  title: '跟著教練，\n打出自己的節奏。',
  intro: '專業 × 無菸\n預約更舒適的撞球學習體驗',
  closing: {
    eyebrow: 'JOIN US',
    title: '想成為 Poolgress 合作教練？',
    body: '我們正在尋找認同「先理解，再練習」的教練一起合作。歡迎來信聊聊。',
    ctaLabel: '洽談合作',
  },
}

/** coach-profile.html 詳細頁文案 */
export const profilePage = {
  back: '全部教練',
  sections: {
    about: '教練介紹',
    courses: '開設／參與的課程',
    venues: '授課球館',
    philosophy: '教學方式與理念',
    credentials: '經歷與資格',
  },
  coursesEmpty: '課程籌備中，開課後會在這裡列出。',
  credentialsEmpty: '經歷與資格待教練提供後補上。',
  mapLink: '查看地圖',
  mapPending: '地圖連結待補',
  mobileCta: '查看可預約時段',
  notFound: { title: '找不到這位教練', body: '連結可能已失效，請回到教練列表重新選擇。', cta: '回到教練列表' },
}
