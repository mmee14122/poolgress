/**
 * 首頁品牌區塊的全部文案。
 *
 * 首頁只回答一件事：「Poolgress 是什麼？為什麼跟我有關？」
 * 敘事順序：共鳴 → 問題 → 觀點 → 產品價值 → 課程入口
 *
 * 層級分工（不要互相搶工作）：
 *   首頁      → Poolgress 是什麼、為什麼跟我有關
 *   課程簡介  → 這堂課解決什麼、我會得到什麼（見 data/course-detail.ts）
 *   關於頁    → 長期願景（about.html，data 在下方 about）
 *
 * ⚠️ 品牌金句「靠，我居然做到了」首頁只完整出現一次（S01 Hero）。
 *    S07 改用「原來我做得到」。課程步驟、章節、闖關細節禁止放進首頁。
 */

export const home = {
  /* ---------------- SECTION 01｜Hero：品牌核心體驗 ---------------- */
  hero: {
    titleLines: ['讓「靠，我居然做到了」，', '一次又一次發生。'],
    subtitle:
      '你不需要先很會打撞球。Poolgress 陪你從「覺得撞球好玩」，走到理解、做到，看見自己真的能進步。',
    core: '從玩撞球，開始真正學會撞球。',
    cta: { label: '探索 Poolgress', href: '#struggle' },
    /* 遊戲闖關獨立頁面上線後，href 改為實際頁面路徑 */
    /* 次要 CTA 直接前往實戰闖關頁（原為捲到頁內 #pillars 區塊） */
    ctaSecondary: { label: 'App 免費體驗', href: './challenges.html' },
    /* SCENE 03 唯一提示句 */
    sceneHint: '知道自己在做什麼。',
    /* SCENE 04 高潮句（不含引號版本，配合動畫排版） */
    sceneQuote: '靠，我居然做到了。',
  },

  /* ---------------- SECTION 02｜困境：只描述問題，不解決 ---------------- */
  struggle: {
    titleLines: ['打了很多次，', '卻不知道自己有沒有進步？'],
    story: ['朋友約了，就去打。', '偶爾進一顆很爽。', '連續沒進，又開始亂打。'],
    quote: '有人跟你說：「多打就會啦。」',
    unknowns: {
      lead: '但你連——',
      items: ['瞄準對不對', '運桿有沒有問題', '為什麼這球進', '為什麼那球沒進'],
      close: '都不清楚。',
    },
    ending: ['最後你只能說：', '「撞球滿好玩的，但我不太會。」'],
  },

  /* ---------------- SECTION 03｜觀點：只講 WHY ---------------- */
  viewpoint: {
    titleLines: ['多打可能會變強，', '但你不必一直靠自己摸索。'],
    lead: [
      'Poolgress 不反對「熟能生巧」。',
      '真正的問題是：如果不知道自己正在練什麼，重複不一定等於進步。',
    ],
    paths: {
      blind: { title: '沒有方向的重複', steps: ['亂打', '偶爾進球', '不知道為什麼', '繼續亂打'], loops: true },
      guided: { title: '有方向的練習', steps: ['理解', '嘗試', '發現差異', '調整', '進步'], loops: false },
    },
  },

  /* ---------------- SECTION 05｜Poolgress 提供什麼：四個產品支柱 ---------------- */
  pillars: {
    title: '為什麼選擇 Poolgress？',
    sub: '讓學習撞球，有一條看得見的路',
    /* href：卡片點擊後的去處；cta 為卡片底部的行動文字。
       成長歷程的 href 由元件依登入狀態決定（未登入→登入頁、已登入→我的星星） */
    items: [
      {
        no: '01',
        name: '循序線上課程',
        body: '從初學開始，建立一條清楚的學習方向。不用自己在網路上拼湊零散技巧。',
        href: './course.html',
        cta: '查看線上課程',
      },
      {
        no: '02',
        name: '球桌遊戲與挑戰',
        body: '把「看懂」帶到真正的球桌，讓學到的東西有機會變成「我真的做到了」。',
        href: './challenges.html',
        cta: '查看遊戲闖關',
      },
      {
        no: '03',
        name: '成長歷程',
        body: '看見自己已經完成什麼、已經學會什麼、下一步在哪裡。',
        href: null, // 由登入狀態決定
        cta: '登入累積星星',
      },
      {
        no: '04',
        name: '教練群支援',
        body: '當線上內容無法解決個人問題時，可以獲得進一步指導與校正。',
        href: './coach.html',
        cta: '關於教練',
      },
    ],
  },

  /**
   * SECTION 05.5｜App 預告
   * 只做預告：一句價值主張＋一到兩張畫面，完整四步驟流程在實戰闖關頁，
   * 首頁不重複細節。畫面沿用實戰闖關頁的第 1、3 張。
   */
  appTeaser: {
    eyebrow: 'POOLGRESS APP',
    title: '用遊戲闖關，把看懂變成做得到',
    body: '從選關卡、看懂目標、完成挑戰到解鎖下一關，App 帶著你在真實球桌上一關一關往前。',
    cta: { label: '認識實戰闖關', href: './challenges.html' },
    images: [
      { src: './assets/challenges/flow-01.png' as string | null, alt: 'App 關卡地圖畫面' },
      { src: './assets/challenges/flow-03.png' as string | null, alt: 'App 通關結算畫面' },
    ],
  },

  /* ---------------- SECTION 06｜首頁收尾邀請（願景已移至 about） ---------------- */
  entry: {
    eyebrow: 'READY WHEN YOU ARE',
    title: '想知道自己可以從哪裡開始？',
    body: ['從適合初學者的 Poolgress 課程開始，', '一步一步把看懂變成做得到。'],
    cta: { label: '探索線上課程', href: './course.html' },
    /** 按鈕下方的補充語（不是連結） */
    ctaNote: '前往你的第一堂課',
  },

  /* ---------------- 關於 Poolgress（about.html） ---------------- */
  about: {
    /**
     * Hero 主視覺。日後拿到正式品牌照片／影片，只要改這個物件即可，版面不用動：
     *   圖片 → { kind: 'image', src: './assets/about/hero.jpg', alt: '圖說' }
     *   影片 → { kind: 'video', src: './assets/about/hero.mp4', poster: './assets/about/hero.jpg' }
     * kind: 'animation' 為暫代方案，沿用首頁 Hero 的球桌球路視覺。
     */
    heroMedia: {
      kind: 'animation',
      src: null,
      alt: null,
      poster: null,
    } as {
      kind: 'animation' | 'image' | 'video'
      src: string | null
      alt: string | null
      poster: string | null
    },
    heroTitle: '關於 Poolgress',
    eyebrow: 'POOLGRESS 的長期願景',
    title: ['從興趣，', '到一生的熱愛。'],
    body: [
      '我們相信，每一個曾經覺得撞球有趣的人，都有可能讓撞球成為陪伴自己很久的運動。',
      '撞球不只依賴肌力。思考與判斷、專注、身體控制與經驗累積，都能讓一個人在球桌上持續成長。',
      '因此，不同年齡、性別與身體條件的人，都有機會在同一張球桌上交流、競爭、成長。',
    ],
    hope: ['我們期待有一天：', '撞球成為跨越年齡、性別與身體條件，', '值得陪伴一生的運動。'],

    /**
     * 合作成果：願景的實際行動與信任證明（非活動廣告，故不放按鈕與連結）。
     * background.src 待補真實照片（撞球教學／玩家練習／教練帶領／場館合作，滿版橫式，
     * 建議 2000×1200 以上）。未填時自動退回深藍漸層底，不放假圖。
     */
    impact: {
      title: '一起讓撞球更好玩',
      subtitle: '#攜手場館、學校、教練，共同推廣撞球教育',
      stats: [
        { value: '20+', label: '撞球場館' },
        { value: '30+', label: '學校團體' },
        { value: '10+', label: '專業撞球教練' },
      ],
      background: { src: null as string | null, alt: null as string | null },
    },
  },
} as const
