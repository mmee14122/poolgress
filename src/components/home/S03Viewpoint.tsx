import { home } from '../../data/home'

/**
 * SECTION 03｜Poolgress 的觀點
 * 只講 WHY：跟「多練就好」哪裡不同。不介紹功能。
 * 視覺：兩條路徑對照，有方向的那條逐步變清晰。
 */
export function S03Viewpoint() {
  const { viewpoint } = home
  const { blind, guided } = viewpoint.paths

  return (
    <section id="viewpoint" className="scroll-mt-24 bg-white py-16 lg:py-24">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <h2 className="text-2xl sm:text-4xl">
          {viewpoint.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-6 max-w-2xl space-y-2 text-lg text-ink-700">
          {viewpoint.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* 兩條路徑 */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {/* 無方向：整體灰階、末端繞回起點 */}
          <div className="rounded-card border border-line bg-ivory-50 p-6 sm:p-7">
            <p className="text-sm font-semibold tracking-widest text-ink-500 uppercase">
              {blind.title}
            </p>
            <ol className="mt-5 space-y-1">
              {blind.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-ink-500">
                  {i > 0 && <span aria-hidden="true" className="text-ink-400/60">↓</span>}
                  <span className={i > 0 ? '' : 'ml-6'}>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-ink-400">
                <path d="M10 3a7 7 0 016.32 4H14v2h6V3h-2v2.1A9 9 0 001.1 9h2.03A7 7 0 0110 3zm6.87 8A7 7 0 013.68 13H6v-2H0v6h2v-2.1A9 9 0 0018.9 11h-2.03z" />
              </svg>
              回到原點，再來一次
            </p>
          </div>

          {/* 有方向：逐步變清晰（透明度遞增），終點亮起 */}
          <div className="rounded-card border-2 border-brand-200 bg-brand-50/60 p-6 sm:p-7">
            <p className="text-sm font-semibold tracking-widest text-brand-700 uppercase">
              {guided.title}
            </p>
            <ol className="mt-5 space-y-1">
              {guided.steps.map((step, i) => {
                const last = i === guided.steps.length - 1
                return (
                  <li
                    key={step}
                    className="flex items-center gap-3 font-medium text-brand-700"
                    /* 遞增下限 0.8：淡化效果不可讓文字對比低於 WCAG AA */
                    style={{ opacity: 0.8 + (i / (guided.steps.length - 1)) * 0.2 }}
                  >
                    {i > 0 && <span aria-hidden="true">↓</span>}
                    <span className={`${i > 0 ? '' : 'ml-6'} ${last ? 'text-lg font-bold' : ''}`}>
                      {step}
                      {last && (
                        <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-2 inline h-5 w-5 fill-brass-400">
                          <path d="M10 1.6l2.6 5.2 5.8.85-4.2 4.1.99 5.75L10 14.8l-5.19 2.7.99-5.75-4.2-4.1 5.8-.85z" />
                        </svg>
                      )}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">我們相信</p>
          <p className="mt-4 text-2xl leading-snug font-bold text-ink-900 sm:text-3xl">
            {viewpoint.belief.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-6 text-ink-500">
            {viewpoint.close.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
