import { course } from '../content/course'
import { Section } from '../ui/Section'

export function Instructor() {
  const { instructor } = course

  return (
    <Section id="instructor">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
        {/* 講師照片位置：鎖 aspect-ratio 避免圖片載入時版面跳動 */}
        <div className="aspect-[4/5] overflow-hidden rounded-card bg-sand-100 ring-1 ring-sand-200">
          <div className="flex h-full items-center justify-center text-sm text-ink-400">
            講師照片
          </div>
        </div>

        <div className="lg:pt-4">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brand-600 uppercase">
            關於講師
          </p>
          <h2 className="text-3xl sm:text-4xl">{instructor.name}</h2>
          <p className="mt-2 text-lg text-ink-600">{instructor.title}</p>

          <div className="mt-6 space-y-4">
            {instructor.bio.map((paragraph) => (
              <p key={paragraph} className="text-ink-600">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {instructor.credentials.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg bg-sand-50 px-4 py-3 text-sm text-ink-800"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="mt-0.5 h-4 w-4 shrink-0 fill-brand-600"
                  aria-hidden="true"
                >
                  <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
