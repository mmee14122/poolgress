/**
 * 首頁 Poolhouse 式定案版——滿版分段敘事（2026-08-17 使用者定案）。
 *
 * 保留 S01–S09 故事線，壓縮成 5 個滿版段落：
 * 每段一張大圖＋一句話，捲到時輕輕淡入，無其他動畫。
 * image null＝深藍佔位；圖片規格：3200×1800 平面圖（不分層）。
 */

export type Section = {
  id: string
  /** 對應的分鏡幕（給使用者對照用） */
  scenes: string
  image: string | null
  /** 文字位置：左／右／置中 */
  align: 'left' | 'right' | 'center'
  eyebrow?: string
  title: string
  body?: string
  cta?: { label: string; href: string }
}

export const brand = {
  name: 'Poolgress',
  navCta: { label: '探索課程', href: './course.html' },
}

export const sections: Section[] = [
  {
    id: 'hero',
    scenes: 'S01',
    image: null,
    align: 'left',
    eyebrow: 'WELCOME TO POOLGRESS',
    title: '從玩撞球，開始真正學會撞球。',
    body: '媽媽喝著茶，爸爸帶著女兒站上球桌。這樣的夜晚，正在成為一種生活。',
    cta: { label: '探索完整課程', href: './course.html' },
  },
  {
    id: 'app',
    scenes: 'S02–S04',
    image: null,
    align: 'right',
    eyebrow: 'POOLGRESS APP',
    title: '看懂，再出手。',
    body: 'App 把球路投在真實球桌上，告訴你這一桿該注意什麼。不用猜，也不用只靠手感。',
  },
  {
    id: 'play',
    scenes: 'S05–S06',
    image: './assets/hero/s05-strike.webp',
    align: 'left',
    eyebrow: 'YOUR TURN',
    title: '換你上場。',
    body: '照著球路出竿，看球照你想的走。每一次成功，都知道自己做對了什麼。',
  },
  {
    id: 'friends',
    scenes: 'S07–S08',
    image: null,
    align: 'right',
    eyebrow: 'PLAY TOGETHER',
    title: '一起闖關，讓進步多一點樂趣。',
    body: '邀請家人或好友加入挑戰，共享關卡、成績與每一次成功。',
  },
  {
    id: 'join',
    scenes: 'S09',
    image: null,
    align: 'center',
    title: '加入 Poolgress，一起讓撞球變得好玩。',
    cta: { label: '開始你的第一桿', href: './course.html' },
  },
]
