/**
 * 分頁開場（2026-09-16）——合作教練頁與 App 玩法頁共用的同一個元件與同一套 CSS：
 *   Eyebrow → 主標（左）＋副標（右、底對齊）→ 1px 淡線 → 內容
 * 只換文字，不各自寫版型；改這裡兩頁一起變。樣式在 styles/page-intro.css（.pg-page-intro…）。
 */
export function PageIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="pg-page-intro">
      <div className="pg-page-intro__inner">
        <p className="pg-t-eyebrow">{eyebrow}</p>
        {/* 標題可用 \n 指定手機版換行點：桌機同一行、手機每段各一行（2026-09-16 使用者） */}
        <h1 className="pg-page-intro__title">
          {title.split('\n').map((line) => (
            <span key={line} className="pg-page-intro__tline">{line}</span>
          ))}
        </h1>
        <p className="pg-t-body pg-page-intro__intro">{intro}</p>
      </div>
    </header>
  )
}
