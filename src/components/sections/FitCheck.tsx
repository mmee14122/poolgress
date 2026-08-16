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

      {/* 結尾標語：純視覺、非互動（無連結、無按鈕、無 hover、不可聚焦）。
          作為「適合對象」的收尾，同時以大量留白自然帶到下一段課程章節。
          上下各一道極淡細線與小圓點作過場，不搶走文字。 */}
      <div className="mt-14 flex flex-col items-center gap-6 px-4 pb-4 text-center lg:mt-20">
        <span aria-hidden="true" className="h-px w-12 bg-brass-400/40" />

        {/* 固定兩行呈現，避免最後只剩一個字落單 */}
        <p className="max-w-xl text-lg leading-loose font-semibold text-brass-700 sm:text-xl">
          {fit.nudgeLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brass-400/50" />
      </div>
    </Section>
  )
}
