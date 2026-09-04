import { comicCopy, panels, type Panel } from './data/comic-demo'

/**
 * 首頁「漫畫分鏡版」演示：捨棄所有動畫，用格子的大小與排列講同一條故事線。
 *
 * - 桌機 12 欄格線，格與格之間的留白＝漫畫的溝（gutter）
 * - 停留點（S01／S04／S08／S09）用大格或滿版格，過場用小格
 * - 手機一律單欄堆疊，閱讀順序不變
 * - 完全靜態：無 sticky、無捲動驅動、無影片，效能與無障礙問題歸零
 *
 * 佔位格：深藍漸層＋虛線框＋幕名。正式圖進來後換 image 路徑即可。
 */

export default function ComicDemoApp() {
  return (
    <main className="min-h-screen bg-brand-950 text-white">
      {/* 頁首說明（演示用，正式版拿掉） */}
      <header className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="font-logo text-lg font-semibold text-white/90 sm:text-xl">
          {comicCopy.pageTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/45">{comicCopy.intro}</p>
      </header>

      {/* 漫畫頁：12 欄格線，gap 就是溝 */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 pb-24 sm:px-6 lg:grid-cols-12 lg:gap-6">
        {panels.map((pn) => (pn.kind === 'text' ? <TextPanel key={pn.id} p={pn} /> : <ImagePanel key={pn.id} p={pn} />))}
      </div>

      {/* 收尾 CTA（跟在 S09 滿版格之後） */}
      <div className="mx-auto max-w-6xl px-4 pb-20 text-center sm:px-6">
        <p className="text-xl font-bold text-white sm:text-3xl">{comicCopy.ctaFinal}</p>
        <a
          href="./course.html"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-500 px-8 text-base font-semibold text-white transition-colors hover:bg-brand-600"
        >
          {comicCopy.cta}
        </a>
      </div>
    </main>
  )
}

/** 圖格：正式圖或佔位。S06 特別處理成「近乎純白＋一顆球」的留白格 */
function ImagePanel({ p }: { p: Panel }) {
  const isS06 = p.id === 'S06'
  const isS07 = p.id === 'S07'
  return (
    <figure className="m-0 lg:col-[span_var(--span)]" style={{ '--span': p.span } as React.CSSProperties}>
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: p.ratio ?? '16/9' }}
      >
        {p.image ? (
          <img src={p.image} alt={p.caption ?? p.id} className="absolute inset-0 h-full w-full object-cover" />
        ) : isS06 ? (
          /* S06 留白格：近乎全白，只有一顆逼近的球——靜態版的白球記憶點 */
          <div className="absolute inset-0 bg-white">
            <div
              className="absolute left-1/2 top-1/2 h-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                aspectRatio: '1',
                background: 'radial-gradient(circle at 38% 32%, #ffffff 55%, #eef1f5 80%, #d5dbe2)',
                boxShadow: '0 10px 40px rgba(15,30,51,.12)',
              }}
            />
            <span className="absolute top-2 left-3 text-[11px] text-ink-400">{p.label}</span>
          </div>
        ) : isS07 ? (
          /* S07 UI 格：頭像＋連線＋進度條（程式繪製，正式版也是程式畫） */
          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-white px-6">
            <Avatar active />
            <svg viewBox="0 0 100 8" className="h-1.5 w-[18%]" preserveAspectRatio="none">
              <line x1="2" y1="4" x2="98" y2="4" stroke="#387ed9" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <Avatar active />
            <div className="ml-[4%] h-2.5 w-[26%] overflow-hidden rounded-full border border-brand-200 bg-white">
              <div className="h-full w-[85%] rounded-full bg-brand-500" />
            </div>
            <span className="text-xs font-medium text-ink-500">2/2 位玩家</span>
            <span className="absolute top-2 left-3 text-[11px] text-ink-400">{p.label}</span>
          </div>
        ) : (
          /* 一般佔位格 */
          <div className="absolute inset-0 bg-gradient-to-br from-brand-925 to-brand-950">
            <div className="absolute inset-[6%] rounded-lg border border-dashed border-white/15" />
            <span className="absolute top-2.5 left-3.5 text-[11px] text-white/40">{p.label}</span>
          </div>
        )}
      </div>
      {p.caption && (
        <figcaption className="mt-2 px-1 text-xs leading-relaxed tracking-wide text-white/40">{p.caption}</figcaption>
      )}
    </figure>
  )
}

/** 文字格：停留點的說明（漫畫頁裡的文字區塊） */
function TextPanel({ p }: { p: Panel }) {
  return (
    <div
      className="flex flex-col justify-center px-2 py-8 lg:col-[span_var(--span)] lg:px-6"
      style={{ '--span': p.span } as React.CSSProperties}
    >
      <span className="text-xs tracking-[0.2em] text-brass-300">POOLGRESS</span>
      <h2 className="mt-3 text-2xl leading-snug font-bold text-white sm:text-3xl">{p.title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">{p.body}</p>
    </div>
  )
}

function Avatar({ active }: { active: boolean }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2"
      style={{
        borderColor: active ? '#387ed9' : '#b7d3f2',
        background: active ? '#dbe9f9' : '#f4f7fb',
      }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#387ed9">
        <circle cx="12" cy="9" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7v1H4z" />
      </svg>
    </div>
  )
}
