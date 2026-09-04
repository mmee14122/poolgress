/**
 * 首頁定案版——價值階梯架構。
 *
 * NAV → HERO → 01 THE SPACE（場館）→ 02 THE APP（章節開場＋PLAY→PROGRESS→TOGETHER
 * 三段連續敘事）→ FINAL CTA → FOOTER
 *
 * 2026-09-05 使用者改版：舊的 02/03/04 三個獨立 pillar 區塊，
 * 合併成 02 THE APP 底下一條連續的產品旅程（appJourney），
 * 不再是三個彼此無關的功能區。
 *
 * 版面系統照 pool.house 實測值：米白底、深色圖浮在上面、
 * 標題大字級襯線、只有 Hero 滿屏、其餘隨內容高、大按鈕。
 *
 * ⚠️ 場館文案為使用者提供的規劃內容；場館約一年後才有，維持未來式與 COMING SOON。
 */

export const hero = {
  /** 8 秒品牌影片；null＝深色佔位框 */
  video: null as string | null,
  poster: null as string | null,
  manifesto: ['SPACE', 'PLAY', 'TOGETHER', 'PROGRESS'],
  title: '從玩撞球，開始真正學會撞球。',
  cta: { label: '探索 Poolgress', href: '#s01' },
}

export type Pillar = {
  id: string
  no: string
  /** 狀態徽章（例：COMING SOON）；未提供則不顯示 */
  badge?: string
  en: string
  zh: string
  body: string
  image: string | null
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
    image: null,
    imageHint: '場館願景圖（概念視覺，3200×1800）',
  },
]

export type JourneyStep = {
  no: string
  /** 英文 keyword：uppercase sans、字距 0.22em */
  key: string
  zh: string
  body: string
  image: string | null
  imageHint: string
}

/**
 * 02 THE APP：章節開場 ＋ 一條連續的體驗路徑。
 * 三段之間用細線＋小箭頭連接，讀成 journey 而非三個功能。
 */
export const appJourney = {
  intro: {
    eyebrow: '02 / THE APP',
    lines: ['THE GAME', 'GOES WITH YOU.'],
  },
  steps: [
    {
      no: '01',
      key: 'PLAY',
      zh: '球桌變成你的關卡。',
      body: '打開 App，照著指示在真實球桌上挑戰、闖關、拿星星。',
      image: null,
      imageHint: 'PLAY：真實撞球桌＋App 闖關介面（3200×1800）',
    },
    {
      no: '02',
      key: 'PROGRESS',
      zh: '每一球，都留下進步。',
      body: '記錄成績、精彩片段與成長軌跡，讓玩家看見自己逐漸變強。',
      image: null,
      imageHint: 'PROGRESS：App 個人成長／成績／精彩片段／關卡進度（3200×1800）',
    },
    {
      no: '03',
      key: 'TOGETHER',
      zh: '離開球館，遊戲還在繼續。',
      body: '分享精彩時刻、找到一起打球的人，並自然產生下一次回來的理由。',
      image: null,
      imageHint: 'TOGETHER：好友／分享／活動／再次邀約的 App 畫面（3200×1800）',
    },
  ] as JourneyStep[],
}

export const finale = {
  en: 'HOW DO YOU WANT TO PLAY?',
  zh: '你想怎麼玩？',
  ctas: [
    { label: '開始玩', href: './challenges.html' },
    { label: '線上課程', href: './course.html' },
    { label: '預約教練', href: './coach.html' },
  ],
}

/**
 * 首頁專用色盤（2026-08-17 使用者提供）。只作用於本頁，不動全站 token。
 * 小字對比度不足處見工程回報，深色由 Text 擔任。
 */
export const palette = {
  primary: '#6F8FA3',   // 灰藍：撞球軌跡、佔位圖
  secondary: '#AFC4CF', // 淺灰藍：佔位圖漸層亮端
  light: '#AFC4CF',     // （相容保留，同 secondary）
  bg: '#F2EEE6',        // Background：頁面底、深底文字
  neutral: '#D2C2AD',   // Sand：主按鈕底、徽章底、深底眉標
  accent: '#816B59',    // Walnut／taupe：淺底眉標、編號、細線與箭頭
  text: '#252C30',      // Charcoal：文字、深色段落底
  /** 深色段落的漸層亮端（charcoal 的提亮衍生色） */
  textSoft: '#333c41',
} as const

export const brand = {
  name: 'Poolgress',
  navCta: { label: '開始學習', href: './course.html' },
}
