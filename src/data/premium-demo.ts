/**
 * 首頁定案版——四段價值階梯架構（2026-08-17 使用者定稿）。
 *
 * NAV → HERO（8 秒品牌影片，暫空置）→ 01 場館 → 02 互動球桌
 * → 03 App → 04 課程×教練 → FINAL CTA（三入口）→ FOOTER
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
    en: 'THE TABLE BECOMES THE GAME.',
    zh: '球桌變成你的關卡。',
    body: '打開 App，照著指示在真實球桌上擺球、闖關、拿星星。每一桿都有目標，每一關都看得到自己的進步。',
    image: null,
    imageHint: 'App 闖關：真實球桌＋手機畫面（3200×1800）',
  },
  {
    id: 's03',
    no: '03',
    en: 'PLAY TOGETHER. KEEP PROGRESSING.',
    zh: '一起玩，一起變強。',
    body: '邀請家人或好友加入，共享關卡、成績與每一次成功。每一次來玩，都接得上上一次的自己。',
    image: null,
    imageHint: 'App 好友／紀錄／成長畫面（3200×1800）',
  },
  {
    id: 's04',
    no: '04',
    en: 'BEYOND',
    zh: '帶著你的進步，去連結更多人。',
    body: '分享你的成長、找到一起打球的朋友、揪一場週末的團體局。走出 App，撞球把人連在一起。',
    image: null,
    imageHint: 'BEYOND：店門前看手機的女孩＋Share/Find Friends/Group Play 卡片（3200×1800）',
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
  navCta: { label: '開始學習', href: './course.html' },
}
