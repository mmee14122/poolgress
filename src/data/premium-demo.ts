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
  manifesto: ['PLAY', 'TOGETHER', 'PROGRESS', 'SPACE'],
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
    en: 'THE TABLE BECOMES THE GAME.',
    zh: '球桌變成你的關卡。',
    body: '打開 App，照著指示在真實球桌上擺球、闖關、拿星星。每一桿都有目標，每一關都看得到自己的進步。',
    image: null,
    imageHint: 'App 闖關：真實球桌＋手機畫面（3200×1800）',
  },
  {
    id: 's02',
    no: '02',
    en: 'PLAY TOGETHER. KEEP PROGRESSING.',
    zh: '一起玩，一起變強。',
    body: '邀請家人或好友加入，共享關卡、成績與每一次成功。每一次來玩，都接得上上一次的自己。',
    image: null,
    imageHint: 'App 好友／紀錄／成長畫面（3200×1800）',
  },
  {
    id: 's03',
    no: '03',
    en: 'WANT TO GET BETTER?',
    zh: '想變得更強？',
    body: '線上課程按部就班，搭配預約教練一對一校正。從玩家到高手，路是看得見的。',
    image: null,
    imageHint: '線上課程×教練：教學畫面（3200×1800）',
  },
  {
    id: 's04',
    no: '04',
    badge: 'COMING SOON',
    en: 'YOUR TABLE. YOUR SPACE.',
    zh: '屬於你的場館，正在路上。',
    body: '我們正在打造 Poolgress 場館：完整的出桿空間、專屬座位與 Café，以及把闖關投影直接搬上桌面的互動球桌。',
    image: null,
    imageHint: '場館願景圖（概念視覺，3200×1800）',
  },
]

export const finale = {
  en: 'HOW DO YOU WANT TO PLAY?',
  zh: '你想怎麼玩？',
  ctas: [
    { label: '開始玩', href: './challenges.html' },
    { label: '開始學習', href: './course.html' },
  ],
}

export const brand = {
  name: 'Poolgress',
  navCta: { label: '開始學習', href: './course.html' },
}
