import { Fragment } from 'react'
import { appFlow } from '../../data/challenges'

/**
 * App 學習流程：四張實機畫面串成「從一關到下一關」。
 *
 * 版面（不使用整張流程圖，四張截圖各自獨立，隨寬度重排）：
 *   手機   單欄垂直，圖下方接步驟名稱，步驟之間為向下箭頭
 *   平板   2×2，不畫箭頭（折行處的箭頭方向會說謊）
 *   桌機   四張等比橫向排列，中間以品牌色細箭頭連接
 * 標題與說明皆為 HTML 文字，不燒在圖片裡，方便日後調整。
 */
export function AppFlow() {
  return (
    <section className="mt-12 border-t border-line pt-12">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">
          {appFlow.eyebrow}
        </p>
        <h2 className="mt-3 text-xl sm:text-2xl">{appFlow.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
          {appFlow.body}
        </p>
      </div>

      <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:flex lg:items-start lg:gap-4">
        {appFlow.steps.map((step, i) => (
          <Fragment key={step.no}>
            <li className="lg:min-w-0 lg:flex-1">
              {/* 單欄／2×2 時限制寬度，否則單張手機圖會被撐到過高 */}
              <div className="mx-auto w-full max-w-[13rem] sm:max-w-[15rem] lg:max-w-none">
                <PhoneShot src={step.image} alt={step.alt} />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-ink-900">
                <span className="mr-1.5 text-brand-600 tabular-nums">{step.no}</span>
                {step.name}
              </p>
            </li>

            {/* 步驟之間的連接箭頭：桌機向右、手機向下；平板 2×2 不畫 */}
            {i < appFlow.steps.length - 1 && (
              <li aria-hidden="true" className="flex justify-center sm:hidden lg:flex lg:pt-16">
                <Arrow />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </section>
  )
}

/**
 * 手機畫面：維持直式比例（9:19.5），不裁切、不變形。
 * 圖片未備妥時顯示同比例的佔位框，版面不會位移。
 */
function PhoneShot({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[9/19.5] w-full items-center justify-center rounded-2xl bg-ivory-100 ring-1 ring-line ring-inset">
        <span className="px-3 text-center text-xs text-ink-500">App 畫面待補</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-2xl object-contain shadow-sm ring-1 ring-line/70"
    />
  )
}

/** 連接箭頭：桌機向右、手機向下（rotate），品牌藍細線 */
function Arrow() {
  return (
    <svg
      viewBox="0 0 40 16"
      aria-hidden="true"
      className="h-4 w-10 rotate-90 fill-none stroke-brand-400 lg:rotate-0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="8" x2="34" y2="8" />
      <polyline points="28,3 34,8 28,13" />
    </svg>
  )
}
