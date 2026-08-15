import { course } from '../../data/course-detail'
import { Section } from '../../ui/Section'
import { Stars } from '../../ui/Stars'

const average =
  course.reviews.reduce((sum, r) => sum + r.rating, 0) / (course.reviews.length || 1)

/**
 * C｜學員評價
 * 手機橫向 scroll-snap、桌機兩欄 grid。
 * 評語搭配具體學習成果，避免制式電商假評論感。
 */
export function Reviews() {
  return (
    <Section id="reviews" title="學員評價">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Stars rating={Math.round(average)} label={`平均 ${average.toFixed(1)} 顆星`} />
        <p className="text-sm text-ink-500">
          <strong className="font-semibold text-ink-900">{average.toFixed(1)}</strong> ／ 5
          <span aria-hidden="true" className="mx-2 text-ink-400">·</span>
          {course.reviews.length} 則評價
        </p>
        <p className="w-full text-xs text-ink-500 sm:ml-auto sm:w-auto">
          ＊範例評價，上線前請替換為真實學員回饋
        </p>
      </div>

      <ul className="scroll-row -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
        {course.reviews.map((review) => (
          <li
            key={review.name + review.result}
            className="flex w-[80vw] max-w-sm shrink-0 snap-center flex-col rounded-card border border-line bg-white p-5 sm:w-auto sm:max-w-none"
          >
            <div className="flex items-center gap-3">
              {/* 頭像佔位：換成 <img> 時保留相同尺寸避免版面位移 */}
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
              >
                {review.name.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {review.name}
                </span>
                <span className="block text-xs text-ink-500">{review.title}</span>
              </span>
              <span className="ml-auto shrink-0">
                <Stars rating={review.rating} />
              </span>
            </div>

            <p className="mt-4 text-sm font-semibold text-brand-700">{review.result}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{review.comment}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
