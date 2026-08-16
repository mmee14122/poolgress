import { course } from '../../data/course-detail'
import { Section } from '../../ui/Section'

/**
 * SECTION 06｜這堂課適合你嗎？
 * 核取清單 + 低干擾購買引導（點擊捲至購買卡）。
 */
export function FitCheck() {
  const { fit } = course.intro

  return (
    <Section id="fit" title={fit.title} description={fit.sub}>
      <ul className="space-y-3">
        {fit.items.map((item) => (
          <li key={item} className="flex items-start gap-3 rounded-card border border-line bg-white px-5 py-4">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 fill-brand-600">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1.2 11.4L5.6 10.2 7 8.8l1.8 1.8 4-4 1.4 1.4z" />
            </svg>
            <span className="text-ink-700">{item}</span>
          </li>
        ))}
      </ul>

      {/* 承接段：把讀者帶往下一段「課程章節」，不是導向購買。
          左側直條與向下箭頭都在暗示「繼續往下看」 */}
      <a
        href="#chapters"
        className="group mt-8 flex items-center gap-4 rounded-card border border-line border-l-4 border-l-brand-600 bg-white px-5 py-5 transition-colors hover:bg-brand-50/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:px-6"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-ink-700">{fit.nudge}</p>
          <p className="mt-2.5 flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            {fit.nudgeCta}
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4 fill-current transition-transform duration-150 group-hover:translate-x-0.5"
            >
              <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
            </svg>
          </p>
        </div>
        {/* 向下箭頭：視覺上提示接下來的內容在下方 */}
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-150 group-hover:translate-y-0.5"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
            <path d="M10 14.5L4.3 8.8l1.4-1.4L10 11.7l4.3-4.3 1.4 1.4z" />
          </svg>
        </span>
      </a>
    </Section>
  )
}
