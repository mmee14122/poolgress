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

export type SectionId = 'problem' | 'how' | 'gains' | 'fit' | 'features' | 'chapters'

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

  startUrl: '#', // ⚠️ 課程平台連結待補
  ctaLabel: '開始課程',
}

/** 左欄錨點導覽項目。順序即頁面順序 */
export const sections: { id: SectionId; label: string }[] = [
  { id: 'problem', label: '你卡在哪裡' },
  { id: 'how', label: '怎麼帶你學' },
  { id: 'gains', label: '你能得到什麼' },
  { id: 'fit', label: '適合誰' },
  { id: 'features', label: '這堂課的特色' },
  { id: 'chapters', label: '課程章節' },
]
