import { course } from '../../data/course-detail'
import { Section } from '../../ui/Section'
import { RichLines } from './RichLines'
import { BilliardsAnimation } from '../BilliardsAnimation'

/**
 * SECTION 04｜這堂課怎麼學？
 * 垂直學習路徑：五個寬版步驟卡由上而下，左側大節點與連線串接。
 * 桌機圖文左右交錯（01 文左圖右、02 圖左文右…），
 * 手機單欄：編號 → 圖片 → 標題與文字。
 * 每步驟預留 aspect-video 大型圖像位，之後可直接替換素材。
 */
export function HowSteps() {
  const { how } = course.intro

  return (
    /* 外層包一層，讓動畫與 Section 在 main 的 divide-y 下仍視為同一區塊（中間不出現分隔線） */
    <div>
      {/* 撞球原理動畫（自 Hero 移入）：置於「這堂課怎麼學」標題上方 */}
      <div className="pt-10 lg:pt-14">
        <BilliardsAnimation />
      </div>
      <Section id="how" title={how.title} description={how.sub}>
      <ol>
        {how.steps.map((step, i) => {
          const last = i === how.steps.length - 1
          /* 偶數步驟（02、04）桌機圖左文右 */
          const flip = i % 2 === 1
          return (
            <li key={step.no} className="relative flex gap-5 pb-8 last:pb-0">
              {/* 左：流程節點與垂直連線（手機收進卡片內以放寬圖片區） */}
              <div className="relative hidden w-12 shrink-0 justify-center sm:flex">
                <span
                  className={`z-10 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold ${
                    last ? 'bg-brass-400 text-brand-950' : 'bg-brand-600 text-white'
                  }`}
                >
                  {step.no}
                </span>
                {!last && (
                  <span
                    aria-hidden="true"
                    className="absolute top-12 -bottom-8 w-px bg-brand-200"
                  />
                )}
              </div>

              {/* 寬版步驟卡：手機順序為編號 → 圖片 → 文字 */}
              <div className="min-w-0 flex-1 rounded-card border border-line bg-white p-5 sm:p-6">
                {/* 手機版編號 */}
                <span
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold sm:hidden ${
                    last ? 'bg-brass-400 text-brand-950' : 'bg-brand-600 text-white'
                  }`}
                >
                  {step.no}
                </span>

                <div className="grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-8">
                  <div className={flip ? 'lg:order-1' : 'lg:order-2'}>
                    <StepVisual name={step.name} />
                  </div>

                  <div className={flip ? 'lg:order-2' : 'lg:order-1'}>
                    <h3 className="text-xl">{step.name}</h3>
                    <RichLines lines={step.lines} className="mt-3" />
                    {step.quote && (
                      <p className="mt-4 rounded-lg bg-brand-50 px-4 py-3 text-sm leading-relaxed font-semibold text-brand-700">
                        {step.quote}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      </Section>
    </div>
  )
}

/** 大型圖像素材佔位：確定素材後以 <img> 取代（保留 aspect-video 防位移） */
function StepVisual({ name }: { name: string }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/60">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-9 w-9 fill-brand-200">
        <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v10.6l4-4 4.5 4.5 3-3L21 17.6V5zm3.5 2A1.8 1.8 0 116.7 8.8 1.8 1.8 0 018.5 7z" />
      </svg>
      <p className="text-xs text-ink-500">「{name}」步驟圖像素材待補</p>
    </div>
  )
}
