/**
 * 首頁漫畫分鏡版演示——版面與文案資料。
 *
 * 每格一張平面圖（不分層、不用影片）。image null＝灰藍佔位格。
 * span：桌機 12 欄格線中佔的欄數；手機一律整排堆疊。
 * kind：'panel' 純圖格｜'text' 文字格（停留點的說明文字）。
 */

export type Panel = {
  id: string
  kind: 'panel' | 'text'
  /** 桌機佔欄數（12 欄制） */
  span: number
  /** 圖格長寬比（w/h） */
  ratio?: string
  /** 圖片路徑；null＝佔位 */
  image?: string | null
  /** 格內小標（佔位期顯示；正式圖進來後移除） */
  label?: string
  /** 圖說（漫畫的旁白框，小字） */
  caption?: string
  /** 文字格內容 */
  title?: string
  body?: string
  /** 深色格（場景是深色時佔位也用深色） */
  dark?: boolean
}

export const comicCopy = {
  pageTitle: '首頁漫畫分鏡版演示',
  intro: '同一條故事線，改用漫畫分鏡呈現：格子大小＝重要性，排列＝節奏。灰格之後換成你的圖。',
  cta: '探索完整課程',
  ctaFinal: '加入 Poolgress，一起讓撞球變得好玩',
}

export const panels: Panel[] = [
  /* ---- S01｜滿版開場（停留點：品牌主張） ---- */
  {
    id: 'S01', kind: 'panel', span: 12, ratio: '21/9', image: null, dark: true,
    label: 'S01｜場館生活遠景（滿版開場格）',
    caption: '媽媽喝著茶，爸爸帶著女兒站上球桌。',
  },
  /* ---- S02–S03｜推進（兩小格） ---- */
  {
    id: 'S02', kind: 'panel', span: 5, ratio: '4/3', image: null, dark: true,
    label: 'S02｜鏡頭靠近球桌',
    caption: '走近一點。',
  },
  {
    id: 'S03', kind: 'panel', span: 7, ratio: '16/9', image: null, dark: true,
    label: 'S03｜正上方俯視球桌',
    caption: '從上面看，這桌球有了另一種樣子。',
  },
  /* ---- S04｜App 投影（停留點：大格＋文字） ---- */
  {
    id: 'S04', kind: 'panel', span: 8, ratio: '16/10', image: null, dark: true,
    label: 'S04｜App 投影路徑＋虛擬球預演',
    caption: 'App 把球路投在桌上：先看懂，再出手。',
  },
  {
    id: 'S04t', kind: 'text', span: 4,
    title: '看懂，再出手',
    body: 'App 在真實球桌上投影球路，告訴你這一桿該注意什麼。不用猜，也不用只靠手感。',
  },
  /* ---- S05–S06｜出竿與白球（動作格＋留白格） ---- */
  {
    id: 'S05', kind: 'panel', span: 7, ratio: '16/10', image: null, dark: true,
    label: 'S05｜女兒出竿（速度線）',
    caption: '她照著球路，出竿。',
  },
  {
    id: 'S06', kind: 'panel', span: 5, ratio: '4/3', image: null,
    label: 'S06｜白球撲面特寫（近乎純白的一格）',
    caption: '球，朝著你來。',
  },
  /* ---- S07｜玩家加入（細橫條 UI 格） ---- */
  {
    id: 'S07', kind: 'panel', span: 12, ratio: '21/5', image: null,
    label: 'S07｜第二位玩家加入（頭像＋連線＋進度，程式繪製）',
    caption: '下一球，變成兩個人的了。',
  },
  /* ---- S08｜擊掌（停留點：大格＋文字） ---- */
  {
    id: 'S08t', kind: 'text', span: 4,
    title: '一起闖關，讓進步多一點樂趣。',
    body: '邀請家人或好友加入挑戰，共享關卡、成績與每一次成功。',
  },
  {
    id: 'S08', kind: 'panel', span: 8, ratio: '16/10', image: null, dark: true,
    label: 'S08｜父女擊掌',
    caption: '進了。',
  },
  /* ---- S09｜滿版收尾（停留點：CTA） ---- */
  {
    id: 'S09', kind: 'panel', span: 12, ratio: '21/8', image: null, dark: true,
    label: 'S09｜拉遠成完整場館（滿版收尾格）',
    caption: '這樣的夜晚，每天都在發生。',
  },
]
