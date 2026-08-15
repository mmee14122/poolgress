import { home } from '../../data/home'

/** 四支柱圖示：課程、球桌挑戰、成長、教練 */
const icons = [
  // 循序線上課程：串連節點的路徑
  'M5 3a3 3 0 11-.9 5.86v6.28A3 3 0 115 15.1V8.9A3 3 0 015 3zm14 6a3 3 0 11-3 3 3 3 0 013-3zM5 18a1 1 0 101 1 1 1 0 00-1-1zM5 5a1 1 0 101 1 1 1 0 00-1-1zm7 1h4v2h-4zm0 10h4v2h-4z',
  // 球桌遊戲與挑戰：搖桿
  'M17 5a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 22a3 3 0 01-2.5-1.4L13.4 18h-2.8l-1.5 2.6A3 3 0 016.6 22a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 5zM9 9H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 101.2 1.2A1.2 1.2 0 0016 9zm2.5 3a1.2 1.2 0 101.2 1.2 1.2 1.2 0 00-1.2-1.2z',
  // 成長歷程：上升折線
  'M3 17l6-6 4 4 7-7v5h2V4h-9v2h5l-5 5-4-4-8 8zM3 20h18v2H3z',
  // 教練群支援：對話
  'M4 3h16a2 2 0 012 2v10a2 2 0 01-2 2h-9l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2zm3 5h10v2H7zm0-3.5h10v2H7z',
]

/**
 * SECTION 05｜Poolgress 提供什麼
 * 只介紹四個產品支柱，回答「Poolgress 裡面到底有什麼」。
 * 課程步驟、章節、闖關規則一律不放這裡——那是課程簡介頁的工作。
 */
export function S05Pillars() {
  const { pillars } = home

  return (
    <section id="pillars" className="scroll-mt-24 bg-white py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <h2 className="text-center text-2xl sm:text-4xl">
          {pillars.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {pillars.items.map((item, i) => (
            <li key={item.no} className="flex gap-5 rounded-card border border-line bg-ivory-50 p-6 sm:p-7">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-brand-600">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
                  <path d={icons[i]} />
                </svg>
              </span>
              <div>
                <p className="text-xs font-bold tracking-widest text-brand-600">{item.no}</p>
                <h3 className="mt-1 text-lg">{item.name}</h3>
                <p className="mt-2 text-sm text-ink-500">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
