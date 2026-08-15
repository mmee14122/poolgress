import { home } from '../../content/home'

/**
 * SECTION 06｜你能得到什麼
 * 只講成果，不重複課程流程。
 * 深色底 + 逐張「點亮」的卡片（亮度隨序號遞增，hover 全亮）。
 */
export function S06Gains() {
  const { gains } = home

  return (
    <section id="gains" className="scroll-mt-24 bg-felt-900 py-16 text-white lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <h2 className="text-center text-2xl text-white sm:text-4xl">
          {gains.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {gains.items.map((item, i) => (
            <li
              key={item.no}
              className="group rounded-card border bg-white/5 p-6 transition-colors duration-300 hover:border-brass-400/60 hover:bg-white/10"
              /* 逐漸點亮：用邊框亮度遞增，而非整卡透明度——文字對比不能打折 */
              style={{ borderColor: `rgba(217, 164, 65, ${0.12 + i * 0.14})` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass-400/15 text-sm font-bold text-brass-300 ring-1 ring-brass-400/30 transition-colors group-hover:bg-brass-400/25">
                {item.no}
              </span>
              <h3 className="mt-4 text-xl text-white">{item.name}</h3>
              <p className="mt-2 text-sm text-white/70">{item.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-lg text-white/85">
          {gains.close.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
