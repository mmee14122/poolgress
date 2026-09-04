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
    en: 'YOUR TABLE. YOUR SPACE.',
    zh: '一張球桌，一個完整的空間。',
    body: '完整的出桿空間、專屬座位與 Café。不用側身、不用等桌，把朋友帶來就好。',
    image: null,
    imageHint: '場館環境：球桌＋座位＋Café（深色暖光，3200×1800）',
  },
  {
    id: 's02',
    no: '02',
    en: 'THE TABLE BECOMES THE GAME.',
    zh: '球桌自己變成遊戲。',
    body: '投影直接落在桌面上：闖關、球路提示、即時回饋。每一桿都看得見自己打了什麼。',
    image: null,
    imageHint: '互動球桌：投影閃關畫面（品牌藍發光線，3200×1800）',
  },
  {
    id: 's03',
    no: '03',
    en: 'PLAY TOGETHER. KEEP PROGRESSING.',
    zh: '一起玩，一起變強。',
    body: '好友、活動、紀錄、成長都在 App 裡。每一次來玩，都接得上上一次的自己。',
    image: null,
    imageHint: 'App：好友／紀錄／成長畫面（3200×1800）',
  },
  {
    id: 's04',
    no: '04',
    en: 'WANT TO GET BETTER?',
    zh: '想變得更強？',
    body: '線上課程按部就班，搭配預約教練一對一校正。從玩家到高手，路是看得見的。',
    image: null,
    imageHint: '線上課程×教練：教學畫面（3200×1800）',
  },
]

export const finale = {
  en: 'HOW DO YOU WANT TO PLAY?',
  zh: '你想怎麼玩？',
  ctas: [
    { label: '探索場館', href: './venues.html' },
    { label: '開始玩', href: './challenges.html' },
    { label: '開始學習', href: './course.html' },
  ],
}

export const brand = {
  name: 'Poolgress',
  navCta: { label: '開始學習', href: './course.html' },
}
