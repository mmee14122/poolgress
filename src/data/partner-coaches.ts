/**
 * 合作教練（2026-09-16）——首頁「03 / THE COACHES」區塊與 coaches.html 分頁共用的資料。
 * （檔名刻意與舊站的 coaches.ts 區隔：那份是舊教練頁／帳號頁在用的，不動。）
 *
 * ⚠️ 目前全部是「示意資料」：教練尚未簽約，姓名／照片／經歷都是佔位內容，
 *    畫面上會標示「示意」。正式資料進來後只改這一檔，版面不用動。
 *    照片請提供直式、至少 1200 寬，會裁成 4:5；路徑放 public/assets/coaches/。
 *
 * 路徑一律用 /ui/assets/…（絕對路徑）：正式站的根目錄首頁與 /ui/ 底下的頁面共用同一批檔案。
 */

export type PartnerCoach = {
  id: string
  /** 是否為佔位資料；true 時畫面會加「示意」標記 */
  placeholder: boolean
  name: string
  /** 角色標籤，例：基礎訓練教練（名字下方那行，粗一點） */
  role: string
  /** 教學年資，例：8 年；未確認就寫「待補」 */
  years: string
  /** 授課方式，例：一對一 · 團體班 */
  format: string
  /** 一行定位（舊欄位，分頁 tagline 用） */
  tagline: string
  /** 首頁用的一句話（≤ 26 字） */
  summary: string
  /** 分頁：教學理念，一到兩句 */
  philosophy: string
  /** 分頁：專長，3–4 個短句 */
  specialties: string[]
  /** 分頁：簡介，兩到三句 */
  bio: string
  photo: string
  photoAlt: string
}

export const coaches: PartnerCoach[] = [
  {
    id: 'coach-a',
    placeholder: true,
    name: '教練 A',
    role: '基礎訓練教練（示意）',
    years: '待補',
    format: '一對一 · 團體班（示意）',
    tagline: '示意 · 專長待補 · 教學年資待補',
    summary: '示意文字：一句話說明這位教練的教學風格與適合的學員。',
    philosophy: '示意文字：教練的教學理念，一到兩句，例如「先把姿勢站穩，再談進球」。',
    specialties: ['專長項目（待補）', '專長項目（待補）', '專長項目（待補）'],
    bio: '示意文字：教練簡介兩到三句，包含教學經歷與擅長帶領的學員類型。正式資料由教練提供後替換，不自行撰寫經歷或成績。',
    photo: '/ui/assets/coaches/coach-a.webp',
    photoAlt: '教練 A（示意照片，待更換）',
  },
  {
    id: 'coach-b',
    placeholder: true,
    name: '教練 B',
    role: '瞄準與球路教練（示意）',
    years: '待補',
    format: '一對一 · 團體班（示意）',
    tagline: '示意 · 專長待補 · 教學年資待補',
    summary: '示意文字：一句話說明這位教練的教學風格與適合的學員。',
    philosophy: '示意文字：教練的教學理念，一到兩句。',
    specialties: ['專長項目（待補）', '專長項目（待補）', '專長項目（待補）'],
    bio: '示意文字：教練簡介兩到三句，包含教學經歷與擅長帶領的學員類型。正式資料由教練提供後替換。',
    photo: '/ui/assets/coaches/coach-b.webp',
    photoAlt: '教練 B（示意照片，待更換）',
  },
  {
    id: 'coach-c',
    placeholder: true,
    name: '教練 C',
    role: '實戰策略教練（示意）',
    years: '待補',
    format: '一對一 · 團體班（示意）',
    tagline: '示意 · 專長待補 · 教學年資待補',
    summary: '示意文字：一句話說明這位教練的教學風格與適合的學員。',
    philosophy: '示意文字：教練的教學理念，一到兩句。',
    specialties: ['專長項目（待補）', '專長項目（待補）', '專長項目（待補）'],
    bio: '示意文字：教練簡介兩到三句，包含教學經歷與擅長帶領的學員類型。正式資料由教練提供後替換。',
    photo: '/ui/assets/coaches/coach-c.webp',
    photoAlt: '教練 C（示意照片，待更換）',
  },
]

/** 首頁區塊文案 */
export const coachesSection = {
  eyebrow: '02 / THE COACHES',
  title: '跟著教練，打出自己的節奏。',
  intro: '三位合作教練，從基礎姿勢到比賽思維，陪你把每一次上桌變成看得見的進步。',
  link: { label: '認識合作教練', href: './coaches.html' },
}

/** coaches.html 分頁文案 */
export const coachesPage = {
  eyebrow: 'THE COACHES',
  title: '跟著教練，\n打出自己的節奏。',
  intro: 'Poolgress 的合作教練不只教你怎麼進球，而是幫你建立自己的練習方法。以下是目前合作的三位教練。',
  sectionLabels: { philosophy: '教學理念', specialties: '專長', bio: '簡介' },
  closing: {
    eyebrow: 'JOIN US',
    title: '想成為 Poolgress 合作教練？',
    body: '我們正在尋找認同「先理解，再練習」的教練一起合作。歡迎來信聊聊。',
    ctaLabel: '洽談合作',
  },
}
