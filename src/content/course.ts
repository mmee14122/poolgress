/**
 * 課程詳情頁資料。
 *
 * 最上方的型別即為之後接後端時的介面：API 回傳符合這些型別，
 * 把下方的 course 常數換成 fetch 結果即可，元件一行都不用改。
 * 新增課程 = 多一筆同型別資料，不需要動版面。
 *
 * ⚠️ 以下皆為範例文案，「＿＿」為待填佔位符。
 */

/** 左欄錨點導覽的區段。id 同時是 DOM 錨點與 scroll spy 的依據 */
export type SectionId = 'overview' | 'chapters' | 'reviews' | 'coach' | 'faq'

export type LessonStatus = 'free' | 'unlocked' | 'game'

export type Lesson = {
  title: string
  duration: string
  status?: LessonStatus
}

export type Chapter = {
  title: string
  /** 本章學習目標，顯示在展開後的最上方 */
  goal: string
  lessons: Lesson[]
}

export type Review = {
  name: string
  /** 學員身分或程度，例如「業餘三年」 */
  title: string
  rating: number
  /** 具體學習成果，比形容詞更有說服力 */
  result: string
  comment: string
}

export type Faq = { q: string; a: string }

export type Course = {
  title: string
  /** 一句話核心價值，放在課名下方 */
  hook: string
  intro: string[]
  /** 適合對象 */
  audience: string[]
  /** 學完後能做到什麼 */
  outcomes: { title: string; description: string }[]
  /** 課程亮點卡片 */
  highlights: { label: string; value: string; note: string }[]
  chapters: Chapter[]
  reviews: Review[]
  coach: {
    name: string
    title: string
    philosophy: string
    bio: string[]
    credentials: string[]
    stats: { value: string; label: string }[]
  }
  faqs: Faq[]
  purchase: {
    studentCount: string
    totalHours: string
    lessonCount: string
    gameCount: string
    /** 優惠說明，未設定時不顯示該區塊 */
    offerNote: string | null
    originalPrice: number
    salePrice: number
  }
}

export const course: Course = {
  title: '＿＿撞球課程名稱＿＿：從基礎到穩定進球',
  hook: '把「有時候打得進」練成「每次都打得進」——用可重複的方法取代手感。',

  intro: [
    '這門課把撞球拆解成可以逐項練習的技術模組：站姿、瞄準、母球控制、走位與防守。每個模組都有明確的判斷標準，你會知道自己這一桿為什麼進、為什麼不進，而不是打完只能歸因於手感。',
    '課程搭配 Poolgress 的遊戲闖關系統，每學完一個技術模組就有對應的關卡驗收。練習不再是漫無目的地打球，而是有目標、有回饋、看得見進步。',
  ],

  audience: [
    '完全沒接觸過撞球，想有系統地入門的新手',
    '打了一段時間但成績起伏很大，想穩定下來的人',
    '想理解走位與佈局，不只是把球打進的進階玩家',
    '希望有明確練習方法、不想再靠感覺瞎練的球友',
  ],

  outcomes: [
    {
      title: '建立穩定且可重複的擊球姿勢',
      description: '從站位、握桿到出桿節奏都有檢查點，任何時候走樣都能自己修正回來。',
    },
    {
      title: '看懂母球走位，而不只是打進當下這顆',
      description: '學會用分離角與加塞控制母球落點，開始能想到後面兩三顆。',
    },
    {
      title: '面對難球有判斷依據',
      description: '知道什麼時候該進攻、什麼時候該防守，減少送機會給對手。',
    },
    {
      title: '擁有一套可長期執行的練習菜單',
      description: '結業後知道每次上桌該練什麼，而不是隨便打兩小時。',
    },
  ],

  highlights: [
    { label: '技術模組', value: '＿＿', note: '個可獨立練習的單元' },
    { label: '遊戲闖關', value: '＿＿', note: '關卡驗收學習成果' },
    { label: '練習菜單', value: '＿＿', note: '份可下載的練習表' },
  ],

  chapters: [
    {
      title: '第一章　基礎架構：站姿、握桿與瞄準',
      goal: '建立一套每次都能重現的擊球準備動作。',
      lessons: [
        { title: '課程導覽與學習地圖', duration: '08:24', status: 'free' },
        { title: '站姿與重心分配', duration: '14:10', status: 'free' },
        { title: '握桿與手架的三種選擇', duration: '12:35' },
        { title: '瞄準系統：從假想球到重合法', duration: '18:02' },
        { title: '闖關：直球連續進球挑戰', duration: '互動關卡', status: 'game' },
      ],
    },
    {
      title: '第二章　出桿品質與母球控制',
      goal: '讓母球停在你想要的位置，而不是它想去的位置。',
      lessons: [
        { title: '出桿直線性與跟隨動作', duration: '15:48' },
        { title: '高低桿：跟球與縮球的力道對應', duration: '20:16' },
        { title: '加塞原理與偏移補正', duration: '22:40' },
        { title: '闖關：母球停位精準度測驗', duration: '互動關卡', status: 'game' },
      ],
    },
    {
      title: '第三章　走位與線路規劃',
      goal: '從打進一顆，變成安排出一整局的順序。',
      lessons: [
        { title: '分離角的基本規則', duration: '16:55' },
        { title: '一庫走位與角度換算', duration: '19:30' },
        { title: '排列順序：先解決麻煩球', duration: '17:12' },
        { title: '實戰拆解：一局清檯的思路', duration: '24:08' },
        { title: '闖關：三顆球連續走位', duration: '互動關卡', status: 'game' },
      ],
    },
    {
      title: '第四章　防守與比賽心理',
      goal: '知道什麼時候不該進攻，比會進攻更重要。',
      lessons: [
        { title: '安全球的三種基本型', duration: '18:45' },
        { title: '風險評估：這一桿值不值得打', duration: '15:20' },
        { title: '比賽節奏與失誤後的心理重整', duration: '13:38' },
        { title: '闖關：攻守選擇判斷測驗', duration: '互動關卡', status: 'game' },
      ],
    },
    {
      title: '第五章　建立你的長期練習系統',
      goal: '把課程內容轉成每週可執行的練習計畫。',
      lessons: [
        { title: '如何自我診斷技術弱點', duration: '14:02' },
        { title: '練習菜單設計與紀錄方式', duration: '16:30' },
        { title: '結業：接下來三個月的路線圖', duration: '11:15' },
      ],
    },
  ],

  /** ⚠️ 範例評價，上線前必須換成真實學員回饋 */
  reviews: [
    {
      name: '陳＿＿',
      title: '球齡兩年',
      rating: 5,
      result: '母球停位準確度明顯提升',
      comment:
        '以前打球全憑感覺，好的時候很好、壞的時候完全找不回來。上完第二章之後我終於知道自己出桿哪裡跑掉，可以當場修正。這是我覺得最有價值的地方。',
    },
    {
      name: '林＿＿',
      title: '完全新手',
      rating: 5,
      result: '兩個月從不會握桿到能清半檯',
      comment:
        '本來很擔心新手跟不上，結果第一章講得非常細，連腳要站哪裡都有畫線示範。闖關關卡也讓我知道自己到底練到什麼程度了。',
    },
    {
      name: '黃＿＿',
      title: '業餘比賽選手',
      rating: 4,
      result: '比賽勝率提升',
      comment:
        '走位那一章對我幫助最大。以前我只會想下一顆，現在會想到三顆之後的排列。防守章節也讓我少送很多機會給對手。',
    },
    {
      name: '張＿＿',
      title: '球齡半年',
      rating: 5,
      result: '練習變得有方向',
      comment:
        '最實用的是練習菜單。以前上桌就是隨便打，現在每次去球館都知道今天要練什麼、練到什麼標準算過關。',
    },
  ],

  coach: {
    name: '＿＿教練姓名＿＿',
    title: 'Poolgress 首席教練',
    philosophy:
      '我不相信「手感」這種說法。所有看起來像天賦的東西，拆開來都是可以被描述、被練習、被檢查的具體動作。我的工作就是把那些東西講清楚。',
    bio: [
      '從事撞球教學＿＿年，累計指導超過＿＿位學員，其中＿＿位進入全國賽事前八強。',
      '教學上堅持「每個動作都要有理由」。與其讓學員模仿我的姿勢，不如讓他們理解為什麼這樣站、這樣握，遇到問題時才有辦法自己找答案。',
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
  },

  faqs: [
    {
      q: '這堂課適合完全新手嗎？',
      a: '適合。第一章從握桿與站姿開始教起，不需要任何基礎。課程中會標示每個單元的難度，新手可以照順序上，有經驗的學員也能直接跳到需要補強的章節。',
    },
    {
      q: '課程購買後可以觀看多久？',
      a: '購買後可無限期觀看，日後課程更新也會自動取得，不需額外付費。',
    },
    {
      q: '遊戲闖關要如何進行？',
      a: '每章結束後會有對應的闖關關卡，你在實體球檯上完成指定任務後於平台記錄結果，系統會依據完成度判定是否通過並給出練習建議。闖關不限次數，可以反覆挑戰。',
    },
    {
      q: '可以使用手機觀看嗎？',
      a: '可以。課程支援手機、平板與電腦瀏覽器，並提供倍速播放與字幕。在球館練習時用手機邊看邊對照是常見的使用方式。',
    },
    {
      q: '如果有問題要如何聯絡？',
      a: '課程內每個單元下方都有提問區，教練會定期回覆。也可以直接來信 hello@poolgress.com，通常一個工作天內回覆。',
    },
  ],

  purchase: {
    studentCount: '＿＿',
    totalHours: '＿＿',
    lessonCount: '＿＿',
    gameCount: '＿＿',
    offerNote: '早鳥優惠｜含＿＿份練習菜單與闖關系統完整權限',
    /** ⚠️ 範例價格，請換成實際定價 */
    originalPrice: 6800,
    salePrice: 4800,
  },
}

/** 左欄錨點導覽項目。順序即頁面順序 */
export const sections: { id: SectionId; label: string }[] = [
  { id: 'overview', label: '課程簡介' },
  { id: 'chapters', label: '課程章節' },
  { id: 'reviews', label: '學員評價' },
  { id: 'coach', label: '關於教練' },
  { id: 'faq', label: '課程 FAQ' },
]
