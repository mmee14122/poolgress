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
  /** 02 THE APP 三段敘事的小眉標（例：01 / PLAY）；未提供則不顯示 */
  eyebrow?: string
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
  {
    id: 's02',
    no: '02',
    en: 'THE APP',
    eyebrow: '01 / PLAY',
    zh: '球桌變成你的關卡。',
    body: '打開 App，照著指示在真實球桌上挑戰、闖關、拿星星。',
    image: null,
    imageHint: 'PLAY：真實撞球桌＋App 闖關介面（3200×1800）',
  },
  {
    id: 's03',
    no: '03',
    en: 'PROGRESS',
    eyebrow: '02 / PROGRESS',
    zh: '每一球，都留下進步。',
    body: '記錄成績、精彩片段與成長軌跡，讓玩家看見自己逐漸變強。',
    image: null,
    imageHint: 'PROGRESS：App 個人成長／成績／精彩片段／關卡進度（3200×1800）',
  },
  {
    id: 's04',
    no: '04',
    en: 'TOGETHER',
    eyebrow: '03 / TOGETHER',
    zh: '離開球館，遊戲還在繼續。',
    body: '分享精彩時刻、找到一起打球的人，並自然產生下一次回來的理由。',
    image: null,
    imageHint: 'TOGETHER：好友／分享／活動／再次邀約的 App 畫面（3200×1800）',
  },
]

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
  accent: '#816B59',    // Walnut：淺底眉標、編號
  text: '#252C30',      // Charcoal：文字、深色段落底
  /** 深色段落的漸層亮端（charcoal 的提亮衍生色） */
  textSoft: '#333c41',
} as const

export const brand = {
  name: 'Poolgress',
  /** 2026-09-05 使用者指定移除 NAV 右上角按鈕；資料保留，之後要加回來直接用 */
  navCta: { label: '開始學習', href: './course.html' },
}
