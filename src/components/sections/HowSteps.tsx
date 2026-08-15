import { course } from '../../content/course'
import { Section } from '../../ui/Section'
import { RichLines } from './RichLines'

/**
 * SECTION 04｜這堂課怎麼學？
 * 五步驟：理解 → 觀察 → 實踐 → 挑戰 → 確認。
 * 桌機橫向五欄、手機垂直；末端以循環箭頭示意
 * 「理解 → 練習 → 確認」是不斷重複的迴圈，而非單向時間軸。
 */
export function HowSteps() {
  const { how } = course.intro

  return (
    <Section id="how" title={how.title} description={how.sub}>
      <ol className="grid gap-4 lg:grid-cols-5 lg:gap-3">
        {how.steps.map((step, i) => {
          const last = i === how.steps.length - 1
          return (
            <li key={step.no} className="relative flex gap-4 rounded-card border border-line bg-white p-5 lg:flex-col lg:gap-0">
              {/* 手機：左側連接線 */}
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute top-14 left-[2.1rem] -bottom-4 w-px bg-brand-100 lg:hidden"
                />
              )}

              <div className="relative flex shrink-0 items-center lg:mb-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    last ? 'bg-brass-400 text-brand-950' : 'bg-brand-600 text-white'
                  }`}
                >
                  {step.no}
                </span>
                {/* 桌機：右向連接箭頭；最後一步改為循環箭頭 */}
                {!last ? (
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="ml-2 hidden h-4 w-4 fill-brand-200 lg:block"
                  >
                    <path d="M7 4l6 6-6 6V4z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="ml-2 hidden h-4 w-4 fill-brass-400 lg:block"
                  >
                    <path d="M10 3a7 7 0 016.32 4H14v2h6V3h-2v2.1A9 9 0 001.1 9h2.03A7 7 0 0110 3zm6.87 8A7 7 0 013.68 13H6v-2H0v6h2v-2.1A9 9 0 0018.9 11h-2.03z" />
                  </svg>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-base">{step.name}</h3>
                <RichLines lines={step.lines} className="mt-2" />
                {step.quote && (
                  <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed font-semibold text-brand-700">
                    {step.quote}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
