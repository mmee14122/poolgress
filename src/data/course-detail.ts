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
  | 'info'
  | 'stuck'
  | 'outcomes'
  | 'how'
  | 'challenge'
  | 'fit'
  | 'chapters'
  | 'reviews'
  | 'coach'
  | 'faq'

/** 帶粗體標記的文案行，保留原文的強調節奏 */
export type RichLine = { text: string; bold?: boolean }

export type StuckCard = { title: string; lines: RichLine[] }
export type OutcomeCard = { title: string; lines: RichLine[] }
export type HowStep = { no: string; name: string; lines: RichLine[]; quote?: string }

export type LessonType = 'video' | 'game'

export type Lesson = {
  title: string
  type: LessonType
  /** 影片時長 mm:ss；遊戲闖關無時長 */
  duration?: string
  /** 可免費試看 */
  free?: boolean
  /** 付費單元彈窗顯示的內容重點（1–3 點） */
  points?: string[]
  /** 試看影片網址；未接入前顯示佔位播放區 */
  videoUrl?: string
  /** 遊戲闖關：闖關目標 */
  goal?: string
  /** 遊戲闖關：完成後獲得的能力 */
  ability?: string
}

export type Chapter = {
  /** 章節名稱；Chapter 編號由順序自動產生 */
  name: string
  lessons: Lesson[]
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

export type HeroInfo = {
  /** 課程分類／難度標籤，例：「新手入門｜花式撞球」 */
  category: string
  title: string
  /** 一句課程核心價值 */
  value: string
  /** 簡短課程介紹（2–3 行） */
  intro: string
  /** 適合程度，例：「新手入門」 */
  level: string
}

export type PurchaseInfo = {
  studentCount: string
  /** 主要價格的名稱（例：預購價），顯示在價格旁 */
  priceLabel: string
  /** 預購截止日（顯示為「X月X日前預購價」）；null 時只顯示 priceLabel */
  priceDeadline: string | null
  /** 加贈優惠說明（獨立淡金徽章呈現）；null 時不顯示 */
  giftNote: string | null
}

export type CourseIntro = {
  /** 真實課程名稱，不可虛構 */
  name: string
  /** 一句話說明這堂課處理什麼 */
  tagline: string
  hero: HeroInfo
  /** 課程簡介六區塊（SECTION 01–06）的完整文案 */
  intro: {
    /** 課程資訊列（【＿＿】為待確認占位符） */
    info: { students: string; level: string; access: string; startDate: string }
    /** 02｜你可能正卡在這裡 */
    stuck: { eyebrow: string; title: string; cards: StuckCard[]; closing: string }
    /** 03｜學完後，你會有什麼不同？ */
    outcomes: { title: string; sub: string; cards: OutcomeCard[] }
    /** 04｜這堂課怎麼學？ */
    how: { title: string; sub: string; steps: HowStep[] }
    /** 05｜球桌 Challenge */
    challenge: {
      eyebrow: string
      title: string
      lines: string[]
      quote: string
      features: string[]
      punch: string
      ctaPrimary: { label: string; href: string }
      ctaSecondary: { label: string; href: string }
      /** App 下載 QR code 圖片路徑；null＝顯示佔位框 */
      qrCode: string | null
    }
    /** 06｜這堂課適合你嗎？ */
    fit: { title: string; sub: string; items: string[]; nudge: string; nudgeCta: string }
  }
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

  /* Hero 區塊文案 */
  hero: {
    category: '新手入門｜花式撞球',
    /* \n 為建議斷行點（桌機兩行）；「建立」不可被拆行 */
    title: '從第一顆球開始，建立\n真正打得準的基本功',
    value: '不再只靠感覺亂打；理解擊球原理，讓每一次練習都有進步。',
    intro:
      '這堂課會帶你從觀念、基本動作、擊球原理到實際闖關練習，一步步建立可複製的進步方法——知道自己在練什麼，也看得見自己練到哪裡。',
    level: '新手入門',
  },

  /* 課程簡介六區塊文案（【＿＿待確認】占位符不可自行捏造） */
  intro: {
    /* startDate：開課時間（待確認實際日期，先以占位符呈現） */
    info: { students: '＿＿', level: '新手入門', access: '無限制', startDate: '＿月＿日' },

    /* 02｜你可能正卡在這裡 */
    stuck: {
      eyebrow: '你可能正卡在這裡',
      title: '有時候會進，下一球卻又不知道怎麼打？',
      cards: [
        {
          title: '球進了，但不知道為什麼',
          lines: [
            { text: '有時候打得進，下一次遇到差不多的球，結果卻完全不同。' },
            { text: '你知道成功了，卻不知道自己做對了什麼。' },
          ],
        },
        {
          title: '球歪了，也不知道該改哪裡',
          lines: [
            { text: '是瞄準？' },
            { text: '運桿？' },
            { text: '還是動作根本沒有做到自己以為的樣子？' },
            { text: '如果不知道問題在哪，下一球通常只能再試一次。' },
          ],
        },
        {
          title: '聽懂技巧，到了球桌卻用不出來',
          lines: [
            { text: '別人可能跟你說：' },
            { text: '「瞄這裡。」' },
            { text: '「運桿直一點。」' },
            { text: '「多打就會了。」' },
            { text: '但真正站上球桌，你還是會想：' },
            { text: '「所以我現在到底要注意什麼？」', bold: true },
          ],
        },
        {
          title: '打了一陣子，卻看不出自己有沒有進步',
          lines: [
            { text: '到底會了什麼？' },
            { text: '哪裡進步了？' },
            { text: '下一步該練什麼？' },
            { text: '如果沒有方向，進步很容易只剩下感覺。' },
          ],
        },
      ],
      closing: '如果這些狀況很像你，這堂課就從這裡開始。',
    },

    /* 03｜學完後，你會有什麼不同？ */
    outcomes: {
      title: '學完後，你會有什麼不同？',
      sub: '從「再試一次看看」，到知道自己正在做什麼。',
      cards: [
        {
          title: '你會理解',
          lines: [
            { text: '看懂球路軌跡，以及球桌上的碰撞如何影響球的結果。' },
            { text: '不只記住打法，而是知道：' },
            { text: '為什麼要這樣做。', bold: true },
          ],
        },
        {
          title: '你會做到',
          lines: [
            { text: '將腦海的想像帶到真正的球桌上。' },
            { text: '最後不是只有：' },
            { text: '「我看懂了。」' },
            { text: '而是：' },
            { text: '「我真的做得出來。」', bold: true },
          ],
        },
        {
          title: '你會知道',
          lines: [
            { text: '當結果不如預期，你開始知道可以從哪裡找問題。' },
            { text: '也更清楚：' },
            { text: '我現在會什麼？', bold: true },
            { text: '下一步要練什麼？', bold: true },
          ],
        },
      ],
    },

    /* 04｜這堂課怎麼學？ */
    how: {
      title: '這堂課怎麼學？',
      sub: '先看懂，再親手做一次。',
      steps: [
        {
          no: '01',
          name: '理解',
          lines: [
            { text: '先弄懂這堂課最重要的觀念。' },
            { text: '回答：' },
            { text: '「我現在到底要注意什麼？」', bold: true },
          ],
        },
        {
          no: '02',
          name: '觀察',
          lines: [
            { text: '看實際示範，找出不同打法造成的差異。' },
            { text: '不只看球有沒有進。' },
            { text: '而是看：' },
            { text: '哪裡不一樣？', bold: true },
          ],
        },
        {
          no: '03',
          name: '實踐',
          lines: [
            { text: '接著到球桌上自己試。' },
            { text: '腦袋知道怎麼做，手還是需要真的練過。' },
          ],
          quote: '理解讓練習有方向，練習讓理解變成能力。',
        },
        {
          no: '04',
          name: '挑戰',
          lines: [
            { text: '完成【本堂 Challenge 待確認】。' },
            { text: '看看自己能不能把剛剛學到的東西真正做出來。' },
          ],
        },
        {
          no: '05',
          name: '確認',
          lines: [
            { text: '最後確認一件事：' },
            { text: '「我是真的會了，還是這次剛好成功？」', bold: true },
            { text: '【真實確認方式待確認】' },
          ],
        },
      ],
    },

    /* 05｜球桌 Challenge */
    challenge: {
      eyebrow: '球桌 Challenge',
      title: '看懂了，換你試。',
      lines: [
        '真正的學習，不是影片播完的那一刻。',
        '而是你站到球桌前，親手把它做出來。',
        '然後心裡冒出一句：',
      ],
      quote: '「靠，我居然做到了。」',
      features: ['【Challenge 練習題】', '下載 Poolgress App', '透過 AI 影像辨識，進行球桌實戰挑戰'],
      punch: '你將開始掌控整張球桌。',
      ctaPrimary: { label: '下載 Poolgress App', href: '#' }, // ⚠️ App 商店連結待補
      /* 下載 QR code 圖片：放 public/assets/og 或 challenges 後填路徑
         （建議 512×512 去背 PNG）；null 時顯示待補佔位框 */
      qrCode: null,
      ctaSecondary: { label: '了解實戰闖關如何進行', href: './challenges.html' },
    },

    /* 06｜這堂課適合你嗎？ */
    fit: {
      title: '這堂課適合你嗎？',
      sub: '適合你，如果你：',
      items: [
        '打過幾次撞球，但還不知道該從哪裡開始學。',
        '有時候會進球，卻不知道自己為什麼成功。',
        '球打歪時，很難判斷問題在哪。',
        '聽過一些技巧，但到了球桌還是不知道怎麼做。',
        '想知道自己現在該練什麼，而不是一直靠感覺摸索。',
      ],
      nudge: '如果你想讓每一次練習不再只是碰運氣，這堂課會帶你從看懂開始。',
      /* 引導往下看課程章節的行動文字 */
      nudgeCta: '看看課程章節怎麼安排',
    },
  },

  /* 06｜課程內容
     單元數與時數由資料自動計算；Chapter 03、04 的單元名稱與
     付費單元的內容重點、闖關目標仍為待補 */
  chapters: [
    {
      name: '撞球器材、背景認識',
      lessons: [
        { title: '撞球三大領域', type: 'video', duration: '03:42', free: true },
        {
          title: '球桿、組成結構',
          type: 'video',
          duration: '04:55',
          points: ['內容重點待補', '內容重點待補'],
        },
        { title: '球檯組成', type: 'video', duration: '01:20', points: ['內容重點待補'] },
      ],
    },
    {
      name: '基本動作養成',
      lessons: [
        { title: '標準動作展示', type: 'video', duration: '02:15', free: true },
        {
          title: '基本動作 SOP',
          type: 'video',
          duration: '03:30',
          points: ['內容重點待補', '內容重點待補'],
        },
        { title: '後手的握力', type: 'video', duration: '02:50', points: ['內容重點待補'] },
        { title: '後手的擺動', type: 'video', duration: '05:00', points: ['內容重點待補'] },
        {
          title: '基本動作三角形',
          type: 'video',
          duration: '04:10',
          points: ['內容重點待補', '內容重點待補'],
        },
        { title: '打擊練習', type: 'game', goal: '闖關目標待補', ability: '完成後能力待補' },
        {
          title: '長檯直線來回打進區塊內練習',
          type: 'game',
          goal: '闖關目標待補',
          ability: '完成後能力待補',
        },
        {
          title: '五分點純準度挑戰',
          type: 'game',
          goal: '闖關目標待補',
          ability: '完成後能力待補',
        },
      ],
    },
    {
      name: '瞄準與擊球原理',
      lessons: [
        { title: '單元名稱待補', type: 'video', duration: '05:20', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '06:10', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '04:45', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '07:05', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '05:40', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '05:20', points: ['內容重點待補'] },
      ],
    },
    {
      name: '從練習到實戰',
      lessons: [
        { title: '單元名稱待補', type: 'video', duration: '07:20', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '06:50', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '08:00', points: ['內容重點待補'] },
        { title: '單元名稱待補', type: 'video', duration: '06:00', points: ['內容重點待補'] },
        { title: '實戰挑戰待補', type: 'game', goal: '闖關目標待補', ability: '完成後能力待補' },
      ],
    },
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

  /* 右欄購買卡資訊（單元數、時數由章節資料自動計算） */
  purchase: {
    studentCount: '＿＿',
    priceLabel: '預購價',
    /* 預購截止日待確認，先以占位符呈現 */
    priceDeadline: '＿月＿日',
    giftNote: '預購期間加贈 1 堂教練課',
  },

  startUrl: '#', // ⚠️ 課程平台連結待補
  ctaLabel: '開始課程',
}

/**
 * 課程規模統計：由章節資料自動計算。
 * Hero 資訊列、購買卡、課程內容標題列共用，改資料自動同步。
 */
export const courseStats = (() => {
  let units = 0
  let games = 0
  let seconds = 0
  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons) {
      if (lesson.type === 'video') units += 1
      else games += 1
      if (lesson.duration) {
        const [m, s] = lesson.duration.split(':').map(Number)
        seconds += m * 60 + s
      }
    }
  }
  return { units, games, hours: (seconds / 3600).toFixed(1), totalSeconds: seconds }
})()

/**
 * 錨點導覽項目（左欄與手機標籤列共用）。
 * 選單刻意精簡：前五段（卡在哪→怎麼學→得到什麼→適合誰→特色）
 * 統一歸在「課程簡介」，錨點指向第一段；「課程章節」獨立。
 * 捲動到章節之前，「課程簡介」都維持高亮。
 */
export const sections: { id: SectionId; label: string }[] = [
  { id: 'info', label: '課程資訊' },
  { id: 'stuck', label: '課程簡介' },
  { id: 'chapters', label: '課程章節' },
  { id: 'reviews', label: '學員評價' },
  { id: 'coach', label: '關於教練' },
  { id: 'faq', label: '課程 FAQ' },
]
