import { course } from '../../content/course'
import { Section } from '../../ui/Section'
import { Stars } from '../../ui/Stars'

const average =
  course.reviews.reduce((sum, r) => sum + r.rating, 0) / (course.reviews.length || 1)

export function Reviews() {
  return (
    <Section id="reviews" title="學員評價">
      <div className="mb-6 flex items-center gap-3">
        <Stars rating={Math.round(average)} label={`平均 ${average.toFixed(1)} 顆星`} />
        <p className="text-sm text-ink-500">
          <strong className="font-semibold text-ink-900">{average.toFixed(1)}</strong> ／ 5
          <span aria-hidden="true" className="mx-2 text-line">
            ·
          </span>
          {course.reviews.length} 則評價
        </p>
      </div>

      {/* 手機橫向 scroll-snap、桌機兩欄 grid，不用 carousel 套件 */}
      <ul className="scroll-row -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
        {course.reviews.map((review) => (
          <li
            key={review.name}
            className="flex w-[80vw] max-w-sm shrink-0 snap-center flex-col rounded-card border border-line bg-white p-5 sm:w-auto sm:max-w-none"
          >
            <div className="flex items-center gap-3">
              {/* 頭像佔位：換成 <img> 時保留相同尺寸避免版面位移 */}
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-felt-100 text-sm font-semibold text-felt-700"
              >
                {review.name.slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {review.name}
                </span>
                <span className="block text-xs text-ink-400">{review.title}</span>
              </span>
              <span className="ml-auto">
                <Stars rating={review.rating} />
              </span>
            </div>

            <p className="mt-4 text-sm font-semibold text-felt-700">{review.result}</p>
            <p className="mt-2 text-sm text-ink-500">{review.comment}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
