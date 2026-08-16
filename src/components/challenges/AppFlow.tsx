import { Fragment } from 'react'
import { appFlow } from '../../data/challenges'

/**
 * App 學習流程：四張實機畫面串成「從一關到下一關」。放在實戰闖關頁最上方。
 *
 * 桌機（sm 以上）：一張連續整圖（四張畫面＋箭頭），
 *   圖片已把簡報深綠底與手機黑色外框去成透明，直接落在頁面暖白底上。
 * 手機：整圖縮到 375px 內會看不清字，改為單欄垂直流程，
 *   每張畫面下方接步驟名稱、之間為向下箭頭。
 * 標題與說明皆為 HTML 文字，不燒在圖片裡。
 */
export function AppFlow() {
  return (
    <section className="mb-12">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">
          {appFlow.eyebrow}
        </p>
        <h2 className="mt-3 text-xl sm:text-2xl">{appFlow.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">
          {appFlow.body}
        </p>
      </div>

      {/* 桌機／平板：連續整圖 */}
      {appFlow.fullImage && (
        <figure className="mt-8 hidden sm:block">
          <img
            src={appFlow.fullImage}
            alt={appFlow.fullImageAlt}
            className="mx-auto w-full max-w-4xl"
          />
          <figcaption className="mx-auto mt-4 grid max-w-4xl grid-cols-4 gap-4 text-center text-sm font-semibold text-ink-900">
            {appFlow.steps.map((step) => (
              <span key={step.no}>
                <span className="mr-1.5 text-brand-600 tabular-nums">{step.no}</span>
                {step.name}
              </span>
            ))}
          </figcaption>
        </figure>
      )}

      {/* 手機：單欄垂直流程 */}
      <ol className="mt-8 grid grid-cols-1 gap-6 sm:hidden">
        {appFlow.steps.map((step, i) => (
          <Fragment key={step.no}>
            <li>
              <div className="mx-auto w-full max-w-[13rem]">
                <PhoneShot src={step.image} alt={step.alt} />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-ink-900">
                <span className="mr-1.5 text-brand-600 tabular-nums">{step.no}</span>
                {step.name}
              </p>
            </li>
            {i < appFlow.steps.length - 1 && (
              <li aria-hidden="true" className="flex justify-center">
                <Arrow />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </section>
  )
}

/** 手機畫面：維持直式比例，不裁切、不變形；未備妥時同比例佔位 */
function PhoneShot({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[9/19.5] w-full items-center justify-center rounded-2xl bg-ivory-100 ring-1 ring-line ring-inset">
        <span className="px-3 text-center text-xs text-ink-500">App 畫面待補</span>
      </div>
    )
  }
  return <img src={src} alt={alt} className="w-full rounded-2xl object-contain" />
}

/** 手機版步驟之間的向下箭頭（品牌藍細線） */
function Arrow() {
  return (
    <svg
      viewBox="0 0 40 16"
      aria-hidden="true"
      className="h-4 w-10 rotate-90 fill-none stroke-brand-400"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="8" x2="34" y2="8" />
      <polyline points="28,3 34,8 28,13" />
    </svg>
  )
}
