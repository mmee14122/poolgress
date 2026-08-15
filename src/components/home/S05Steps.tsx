import { home } from '../../content/home'
import { Button } from '../../ui/Button'

/** 四步驟各配一個極簡圖示 */
const icons = [
  // 理解：眼睛
  'M12 5c5 0 9.3 3 11 7-1.7 4-6 7-11 7S2.7 16 1 12c1.7-4 6-7 11-7zm0 3.5A3.5 3.5 0 1012 15.5 3.5 3.5 0 0012 8.5z',
  // 實踐：球桿與球
  'M3.5 19.1L15.6 7l1.4 1.4L4.9 20.5zM18.5 3.5l2 2-2.3 2.3-2-2zM17 15a4 4 0 11-4 4 4 4 0 014-4z',
  // 闖關：旗子
  'M6 2h2v20H6zm4 2h10l-2.5 4L20 12H10z',
  // 成長：上升折線
  'M3 17l6-6 4 4 7-7v5h2V4h-9v2h5l-5 5-4-4-8 8z',
]

/**
 * SECTION 05｜解決步驟
 * 第一次完整回答「Poolgress 到底怎麼幫我」。
 * 桌機水平四欄、手機垂直。
 */
export function S05Steps() {
  const { steps } = home

  return (
    <section id="steps" className="scroll-mt-24 bg-ivory-50 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-4xl">
            {steps.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 text-ink-500">{steps.lead}</p>
        </div>

        <ol className="mt-12 grid gap-4 lg:grid-cols-4 lg:gap-5">
          {steps.items.map((step, i) => (
            <li key={step.no} className="relative flex gap-4 rounded-card border border-line bg-white p-6 lg:flex-col">
              {/* 手機：左側直線把四步串起來 */}
              {i < steps.items.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-16 left-[2.35rem] -bottom-4 w-px bg-line lg:hidden"
                />
              )}

              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-felt-600">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
                  <path d={icons[i]} />
                </svg>
              </span>

              <div>
                <p className="text-xs font-bold tracking-widest text-felt-600">STEP {step.no}</p>
                <h3 className="mt-1 text-lg">{step.name}</h3>
                <p className="mt-1 text-sm font-semibold text-ink-700">{step.tagline}</p>
                <p className="mt-2 text-sm text-ink-500">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-ink-900">{steps.close}</p>
          <Button href={steps.cta.href} size="lg" className="mt-6">
            {steps.cta.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
