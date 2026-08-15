/**
 * 課程簡介頁資料（獨立模板）。
 *
 * 每一堂課程頁只回答六件事：
 *   01 你現在可能卡在哪裡？   → 這堂課的「具體問題」，不是首頁的大問題
 *   02 這堂課會怎麼帶你學？   → 詳細學習流程只放這裡，不放首頁
 *   03 上完課＋完成闖關能得到什麼？ → 三層：會理解／會挑戰／能做到
 *   04 這堂課適合誰？         → 比首頁 TA 更精準
 *   05 這堂課的特色           → 只講「這一堂」，不重複品牌四大支柱
 *   06 課程章節               → 真實資料
 *
 * ⚠️ 真實課程名稱、章節、闖關條件、價格等尚未提供，
 *    以下全部使用「待補」佔位，禁止虛構。
 *    型別即後端介面：API 回傳符合 CourseIntro，元件不用改。
 */

export type SectionId =
  | 'problem'
  | 'how'
  | 'gains'
  | 'fit'
  | 'features'
  | 'chapters'
  | 'reviews'
  | 'coach'
  | 'faq'

export type FlowStage = {
  name: string
  body: string
}

export type Chapter = {
  no: string
  /** 真實章節名稱，未提供時顯示待補 */
  name: string
  summary: string
}

export type Review = {
  /** ⚠️ 範例評價；上線前必須換成真實學員回饋 */
  name: string
  title: string
  rating: number
  /** 具體學習成果比形容詞有說服力 */
  result: string
  comment: string
}

export type CoachInfo = {
  name: string
  title: string
  /** 教學理念（引言形式呈現） */
  philosophy: string
  bio: string[]
  credentials: string[]
  stats: { value: string; label: string }[]
  instagram: string
}

export type Faq = { q: string; a: string }

export type PurchaseInfo = {
  studentCount: string
  totalHours: string
  lessonCount: string
  gameCount: string
  /** 優惠／早鳥／組合文案；null 時不顯示該區 */
  offerNote: string | null
}

export type CourseIntro = {
  /** 真實課程名稱，不可虛構 */
  name: string
  /** 一句話說明這堂課處理什麼 */
  tagline: string
  problem: {
    /** 這堂課要解決的具體問題（非首頁的大問題） */
    lines: string[]
  }
  flow: FlowStage[]
  gains: {
    understand: string
    challenge: string
    outcome: string
  }
  fit: {
    items: string[]
    /** 有前置課程時顯示；null 表示無 */
    prereq: string | null
  }
  features: string[]
  chapters: Chapter[]
  reviews: Review[]
  coach: CoachInfo
  faqs: Faq[]
  purchase: PurchaseInfo
  /** 課程平台連結，確定後填入 */
  startUrl: string
  ctaLabel: string
}

export const course: CourseIntro = {
  name: '課程名稱待補',
  tagline: '課程定位一句話待補',

  /* 01｜你現在可能卡在哪裡？ */
  problem: {
    lines: [
      '你可能已經可以把球打出去，',
      '但瞄準還大量靠感覺。',
      '有時候進，有時候偏，',
      '卻不知道差別在哪。',
    ],
  },

  /* 02｜這堂課會怎麼帶你學？ */
  flow: [
    { name: '理解', body: '理解這堂課最重要的原理。' },
    { name: '示範', body: '看懂實際操作方式。' },
    { name: '實踐', body: '到球桌親手嘗試。' },
    { name: '闖關', body: '完成指定挑戰。' },
    { name: '確認', body: '知道自己是不是真的做到。' },
  ],

  /* 03｜上完課＋完成闖關，你能得到什麼？ */
  gains: {
    understand: '課程成果待補（一個核心原理）',
    challenge: '球桌挑戰待補（球桌上實際要完成的任務）',
    outcome: '能理解＿＿，並完成＿＿。',
  },

  /* 04｜這堂課適合誰？ */
  fit: {
    items: [
      '第一次認真學這個技巧的人',
      '娛樂玩家',
      '初階玩家',
    ],
    prereq: null, // 有前置課程時改為：'建議先完成＿＿課程。'
  },

  /* 05｜這堂課的特色（只講這一堂） */
  features: [
    '這堂課的理解方式待補',
    '這堂課的特殊練習待補',
    '這堂課的球桌挑戰待補',
    '如何判斷是否成功待補',
    '與上一堂／下一堂課程的關係待補',
  ],

  /* 06｜課程章節（真實資料，未提供前為待補） */
  chapters: [
    { no: 'Chapter 01', name: '章節名稱待補', summary: '章節內容待補' },
    { no: 'Chapter 02', name: '章節名稱待補', summary: '章節內容待補' },
    { no: 'Chapter 03', name: '章節名稱待補', summary: '章節內容待補' },
  ],

  /* C｜學員評價（⚠️ 範例評價，上線前請替換為真實學員回饋） */
  reviews: [
    {
      name: '陳＿＿',
      title: '球齡兩年',
      rating: 5,
      result: '母球停位準確度明顯提升',
      comment:
        '以前打球全憑感覺，好的時候很好、壞的時候完全找不回來。上完課之後我終於知道自己出桿哪裡跑掉，可以當場修正，這是我覺得最有價值的地方。',
    },
    {
      name: '林＿＿',
      title: '完全新手',
      rating: 5,
      result: '兩個月從不會握桿到能穩定進球',
      comment:
        '本來很擔心新手跟不上，結果連腳要站哪裡都有示範。闖關關卡讓我很清楚自己到底練到什麼程度了，不會看完影片就以為自己會了。',
    },
    {
      name: '黃＿＿',
      title: '業餘玩家',
      rating: 4,
      result: '和朋友對打勝率變高',
      comment:
        '最有感的是瞄準那段。以前進球靠運氣，現在知道為什麼進、為什麼沒進。四顆星是因為希望闖關再多一點。',
    },
    {
      name: '張＿＿',
      title: '球齡半年',
      rating: 5,
      result: '練習變得有方向',
      comment:
        '每個單元後面都有明確的球桌任務，去球館不再是隨便打兩小時，知道今天要練什麼、練到什麼標準算過關。',
    },
  ],

  /* D｜關於教練（⚠️ 全部待補） */
  coach: {
    name: '教練姓名待補',
    title: 'Poolgress 首席教練',
    philosophy:
      '我不相信「手感」這種說法。所有看起來像天賦的東西，拆開來都是可以被描述、練習、檢查的具體動作。我的工作就是把那些東西講清楚。',
    bio: [
      '從事撞球教學＿＿年，累計指導超過＿＿位學員。',
      '教學上堅持「每個動作都要有理由」：與其模仿姿勢，不如理解為什麼這樣做，遇到問題時才有辦法自己找答案。',
    ],
    credentials: [
      '＿＿年撞球教學經驗',
      '＿＿協會認證教練資格',
      '＿＿年全國錦標賽＿＿名',
      '累計授課時數超過＿＿小時',
    ],
    stats: [
      { value: '＿＿', label: '指導學員數' },
      { value: '＿＿', label: '教學年資' },
      { value: '＿＿', label: '賽事獲獎' },
    ],
    instagram: '@帳號待補',
  },

  /* E｜課程 FAQ（範例文案，政策數字以＿＿標示待確認） */
  faqs: [
    {
      q: '這堂課適合完全新手嗎？',
      a: '適合。課程從最基礎的部分開始教起，不需要任何先備經驗；已有基礎的學員也可以直接跳到需要補強的章節。',
    },
    {
      q: '課程購買後可以觀看多久？',
      a: '購買後可觀看＿＿（觀看期限待確認），課程內容更新時也會自動取得新版本。',
    },
    {
      q: '遊戲闖關要如何進行？',
      a: '每個章節後面有對應的球桌挑戰：到實體球桌完成指定任務後，回到平台記錄結果，系統會判定是否通過並給出下一步建議。闖關不限次數，可以反覆挑戰。',
    },
    {
      q: '可以使用手機觀看嗎？',
      a: '可以。課程支援手機、平板與電腦瀏覽器。在球館練習時，用手機邊看邊對照是最常見的使用方式。',
    },
    {
      q: '如果有問題要如何聯絡？',
      a: '課程內每個單元下方都有提問區，教練會定期回覆；也可以來信 hello@poolgress.com，通常＿＿個工作天內回覆。',
    },
  ],

  /* 右欄購買卡資訊（⚠️ 待補） */
  purchase: {
    studentCount: '＿＿',
    totalHours: '＿＿',
    lessonCount: '＿＿',
    gameCount: '＿＿',
    offerNote: '早鳥優惠文案待補｜組合優惠說明待補',
  },

  startUrl: '#', // ⚠️ 課程平台連結待補
  ctaLabel: '開始課程',
}

/**
 * 錨點導覽項目（左欄與手機標籤列共用）。
 * 選單刻意精簡：前五段（卡在哪→怎麼學→得到什麼→適合誰→特色）
 * 統一歸在「課程簡介」，錨點指向第一段；「課程章節」獨立。
 * 捲動到章節之前，「課程簡介」都維持高亮。
 */
export const sections: { id: SectionId; label: string }[] = [
  { id: 'problem', label: '課程簡介' },
  { id: 'chapters', label: '課程章節' },
  { id: 'reviews', label: '學員評價' },
  { id: 'coach', label: '關於教練' },
  { id: 'faq', label: '課程 FAQ' },
]
