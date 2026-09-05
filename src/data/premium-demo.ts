/**
 * 首頁定案版——價值階梯架構（2026-09-05 使用者定案）。
 *
 * 03/04 保留圖片與旁邊的文字，但不顯示全寬章節頭（使用者 2026-09-05 指定）。
 * NAV → HERO → 01 場館 → 02 轉場＋THE APP → 03 → 04 → FINAL CTA
 *
 * 版面系統照 pool.house 實測值：米白底、深色圖浮在上面、
 * 標題大字級襯線、只有 Hero 滿屏、其餘隨內容高、大按鈕。
 *
 * ⚠️ 場館與互動球桌的文案為使用者提供的規劃內容；
 *    實體場館的實際狀態待使用者確認後才可上線。
 */

export const hero = {
  /** 8 秒品牌影片；null＝先顯示 poster 靜態圖，連 poster 都沒有才是深色佔位框 */
  video: null as string | null,
  /** 場館入口主視覺（使用者 2026-09-05 提供，1672×941 PNG → WebP） */
  poster: './assets/hero/hero-entrance.webp' as string | null,
  /** 手機（≤768px）專用直式主視覺（4:5 或 3:4）；null＝沿用 poster＋手機 object-position */
  posterMobile: null as string | null,
  manifesto: ['SPACE', 'PLAY', 'TOGETHER', 'PROGRESS'],
  /** 主標兩行（2026-09-05 使用者定案斷行：讓撞球成為／一家人的共同記憶） */
  titleLines: ['讓撞球成為', '一家人的共同記憶'],
  /** 導到 01 THE SPACE 的章節開場（#the-space），不是照片 #s01 */
  /** 2026-09-06：預約場館 → 合作場館頁（booking.html 的 Coming Soon／BookingForm 保留，之後有訂位系統再改回） */
  cta: { label: '預約場館', href: './venues.html' },
}

export type Pillar = {
  id: string
  no: string
  /** 狀態徽章（例：COMING SOON）；未提供則不顯示 */
  badge?: string
  en: string
  /** 02 THE APP 三段敘事的小眉標（例：01 / PLAY）；未提供則不顯示 */
  eyebrow?: string
  zh: string
  body: string
  /** 手機（<768px）照片下方的 editorial 文字：標題＋一句說明（2026-09-05 起改用 teaser，保留欄位） */
  mobileTitle?: string
  mobileBody?: string
  /** 01 FUTURE SPACE teaser frame 的內容（僅 01 使用） */
  teaser?: { eyebrow: string; titleLines: [string, string]; zh: string; meta: string }
  image: string | null
  /** 手機（≤768px）專用直式圖；null＝沿用 image＋手機 object-position */
  imageMobile?: string | null
  /** 圖說（佔位期顯示要放什麼圖） */
  imageHint: string
}

export const pillarSections: Pillar[] = [
  {
    id: 's01',
    no: '01',
    badge: 'COMING SOON',
    en: 'YOUR TABLE. YOUR SPACE.',
    zh: '一張球桌，一個屬於你們的空間。',
    body: '我們正在打造 Poolgress 場館：完整的出桿空間、專屬座位與 Café，以及把闖關投影直接搬上桌面的互動球桌。',
    mobileTitle: '我們正在打造 Poolgress 場館',
    mobileBody: '完整的出桿空間、專屬座位與 Café，讓打球成為值得停留的日常。',
    /** 概念視覺 teaser（2026-09-05 使用者規格）：不是介紹設備，是「未來真的會有實體空間」的期待感 */
    teaser: { eyebrow: 'COMING SOON', titleLines: ['POOLGRESS', 'CLUB'], zh: '球桌還在路上。', meta: 'TAIPEI · OPENING 2028' },
    /** 場館願景圖（使用者 2026-09-05 提供，PNG → WebP） */
    image: './assets/hero/s01-venue.webp',
    imageMobile: null,
    imageHint: '場館願景圖（概念視覺，3200×1800）',
  },
  {
    id: 's02',
    no: '02',
    en: 'THE APP',
    eyebrow: '01 / PLAY',
    zh: '球桌，變成你的關卡。',
    /* 兩句以換行分開，渲染端用 whitespace-pre-line */
    body: '打開 App，跟著指引瞄準、闖關、拿星星。\n每一次上桌，都有新的挑戰。',
    image: null,
    imageHint: 'PLAY：真實撞球桌＋App 闖關介面（3200×1800）',
  },
  {
    id: 's03',
    no: '03',
    en: 'TOGETHER',
    eyebrow: '02 / TOGETHER',
    zh: '一個人的挑戰，兩個人的遊戲。',
    body: '加入好友、組隊闖關、登上排行榜。\n下一局，你想和誰一起？',
    image: null,
    imageHint: 'TOGETHER：好友／組隊闖關／比成績的 App 畫面（3200×1800）',
  },
  {
    id: 's04',
    no: '04',
    en: 'COMMUNITY',
    eyebrow: '03 / COMMUNITY',
    zh: '下一場，就在這裡。',
    body: '揪球友、參加活動、報名比賽，也分享你的每一次精彩。\n從一張球桌，遇見更多一起玩的人。',
    image: null,
    imageHint: 'COMMUNITY：揪球友／活動／比賽／分享的 App 畫面（3200×1800）',
  },
]

/** 02 / THE APP 章節開場（2026-09-06 加入內文與下載 CTA；商店連結尚未上架，先錨到 Footer 的下載區） */
export const appChapter = {
  eyebrow: '02 / THE APP',
  titleLines: ['THE GAME', 'GOES WITH YOU.'] as [string, string],
  body: 'Poolgress 不只陪你打完一局。\n從闖關、學習，到找到一起玩的朋友，\n每一次上桌，都能延續到下一次。',
  cta: { label: '下載 Poolgress App', href: '#app-download' },
}

export const finale = {
  en: 'HOW DO YOU WANT TO PLAY?',
  zh: '你想怎麼玩？',
  ctas: [
    { label: 'App 遊戲闖關', href: './challenges.html' },
    { label: '線上課程', href: './course.html' },
    { label: '預約教練', href: './coach.html' },
  ],
}

/**
 * 首頁專用色盤（2026-08-17 使用者提供）。只作用於本頁，不動全站 token。
 * 小字對比度不足處見工程回報，深色由 Text 擔任。
 */
export const palette = {
  /* 2026-09-05 Phase 1：值改讀 styles/tokens.css 的 CSS 變數（單一來源），色碼本身沒變 */
  primary: 'var(--pg-primary)',     // #6F8FA3 灰藍：撞球軌跡、佔位圖
  secondary: 'var(--pg-secondary)', // #AFC4CF 淺灰藍：佔位圖漸層亮端
  light: 'var(--pg-secondary)',     // （相容保留，同 secondary）
  bg: 'var(--pg-ivory)',            // #F2EEE6 Background：頁面底、深底文字
  neutral: 'var(--pg-sand)',        // #D2C2AD Sand：主按鈕底、徽章底、深底眉標
  accent: 'var(--pg-walnut)',       // #816B59 Walnut：淺底眉標、編號
  text: 'var(--pg-charcoal)',       // #252C30 Charcoal：文字、深色段落底
  /** 深色段落的漸層亮端（charcoal 的提亮衍生色） */
  textSoft: 'var(--pg-charcoal-soft)', // #333C41
} as const

export const brand = {
  name: 'Poolgress',
  /** 2026-09-05 使用者指定移除 NAV 右上角按鈕；資料保留，之後要加回來直接用 */
  navCta: { label: '開始學習', href: './course.html' },
}
