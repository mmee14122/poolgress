/**
 * 首頁互動：「這顆球，你會怎麼打？」的三條打法。
 *
 * 三條路線都是合理、有魅力的選擇——沒有標準答案，也沒有「錯的那一條」。
 *
 * ⚠️ 資訊揭露順序是這個互動的核心：
 * 選擇前只給中性的 A／B／C 與三條未知球路，label／hint／resultTitle／CTA
 * 一律等動畫播完才揭曉。提前公布等於把體驗變成產品導覽列。
 * A／B／C 底層對應三種享受撞球的方式（想學會／想控制／想玩），
 * 但這是 UX 設計邏輯，**不可以**變成畫面上的人格標籤文案。
 *
 * 球桌座標系：viewBox 0 0 400 240（俯視，長邊橫放）。
 *   袋口：四角 (20,20)(380,20)(20,220)(380,220)、中袋 (200,14)(200,226)
 *   母球起點 (110,170)、目標球 (250,92)、下一顆球 (300,196)
 * 路徑用 SVG path 字串，由 CSS offset-path 驅動；
 * 不做物理引擎，但每條路線都符合撞球的基本反射邏輯。
 *
 * 要換球型或新增路線：改這裡即可，元件不用動。
 */

export type Route = {
  id: 'a' | 'b' | 'c'
  /**
   * 這條打法的名稱。⚠️ 只在動畫播完之後才揭曉，
   * 選擇前畫面上只會出現中性的 A／B／C。
   */
  label: string
  /** 揭曉後補在名稱下方的一句話 */
  hint: string
  /** 球桌上 A／B／C 標記的位置（沿該條球路擺放） */
  marker: { x: number; y: number }
  /** 母球路徑（含撞擊後續行） */
  cueBallPath: string
  /** 目標球路徑（自撞擊點到袋口） */
  objectBallPath: string
  /** 母球撞到目標球的時間點（毫秒，自動畫開始算） */
  collisionAt: number
  /** 母球走完的總時間 */
  cueDuration: number
  /** 目標球移動時間 */
  objectDuration: number
  /** 目標球是否進袋（三條都會進，但進法不同） */
  resultTitle: string
  resultDescription: string
  /** 動畫結束後補充的一句觀察（可為 null） */
  resultNote: string | null
  ctaLabel: string
  ctaHref: string
}

/** 固定球型：母球、目標球與「下一顆球」 */
export const layout = {
  cueBall: { x: 110, y: 170 },
  objectBall: { x: 250, y: 92 },
  nextBall: { x: 300, y: 196 },
}

export const routes: Route[] = [
  {
    id: 'a',
    label: '穩穩把球打進',
    hint: '直接、確實地把這一球送進袋',
    marker: { x: 322, y: 48 },
    /* 母球直線撞擊後往左上跑掉，停在遠離下一顆球的位置 */
    cueBallPath: 'M110 170 L232 103 L150 55',
    objectBallPath: 'M250 92 L380 20',
    collisionAt: 900,
    cueDuration: 1700,
    objectDuration: 900,
    resultTitle: '進球只是開始。',
    resultDescription: '開始理解準度、桿法與母球控制。',
    resultNote: '球進了。可是母球呢？',
    ctaLabel: '探索完整課程',
    ctaHref: './course.html',
  },
  {
    id: 'b',
    label: '我已經在想下一桿',
    hint: '把這一球打進，同時安排好母球',
    marker: { x: 336, y: 146 },
    /* 同樣進袋，但母球吃一顆庫後停在下一顆球的理想角度 */
    cueBallPath: 'M110 170 L232 103 L330 150 L296 176',
    objectBallPath: 'M250 92 L380 20',
    collisionAt: 900,
    cueDuration: 2100,
    objectDuration: 900,
    resultTitle: '高手看的，往往不是這一桿。',
    resultDescription: '練習走位、控制與局面判斷。',
    resultNote: '你已經在為下一桿做準備。',
    ctaLabel: '進入球桌演練',
    ctaHref: './challenges.html',
  },
  {
    id: 'c',
    label: '來點有趣的打法',
    hint: '繞一圈也能進——而且更好看',
    marker: { x: 236, y: 214 },
    /* 母球先吃上庫再撞目標球（借庫），撞完往右下漂 */
    cueBallPath: 'M110 170 L196 26 L268 84 L340 130',
    objectBallPath: 'M250 92 L372 150 L200 226',
    collisionAt: 1250,
    cueDuration: 2200,
    objectDuration: 1300,
    resultTitle: '撞球，本來就可以很好玩。',
    resultDescription: '跟朋友挑戰關卡、搶星星、比誰完成得漂亮。',
    resultNote: '借一顆庫，球照樣進。',
    ctaLabel: '看看好友闖關',
    ctaHref: './challenges.html',
  },
]

/** 三條都看過之後才出現的品牌收尾 */
export const finale = {
  title: '沒有標準答案。只有你想怎麼打。',
  subtitle: 'Poolgress，從你的下一桿開始。',
}

export const sectionCopy = {
  title: '這顆球，你會怎麼打？',
  replay: '換一種打法看看',
}
