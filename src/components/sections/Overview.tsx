import { course } from '../../content/course'
import { CourseCover } from '../CourseCover'

/**
 * 課程簡介。這一段不用 <Section> 包，因為它需要先放主視覺與課名，
 * 標題階層與其他段落不同（課名是 h1，段內小標是 h2）。
 */
export function Overview() {
  return (
    <section id="overview" className="scroll-mt-32 pt-6 pb-10 lg:scroll-mt-24 lg:pt-10 lg:pb-14">
      <CourseCover />

      <h1 className="mt-7 text-3xl leading-[1.3] sm:text-4xl">{course.title}</h1>
      <p className="mt-4 text-lg text-felt-700 sm:text-xl">{course.hook}</p>

      <div className="mt-6 space-y-4">
        {course.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {/* 課程亮點數字 */}
      <ul className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
        {course.highlights.map((item) => (
          <li key={item.label} className="rounded-card border border-line bg-white p-4 text-center">
            <p className="text-xs text-ink-400">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-felt-700 sm:text-3xl">{item.value}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-400">{item.note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <h2 className="text-lg">適合對象</h2>
          <ul className="mt-4 space-y-3">
            {course.audience.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 fill-felt-500"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1.2 11.4L5.6 10.2 7 8.8l1.8 1.8 4-4 1.4 1.4z" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg">學完後能做到什麼</h2>
          <ul className="mt-4 space-y-4">
            {course.outcomes.map((item, i) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-felt-50 text-xs font-bold text-felt-700">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{item.title}</span>
                  <span className="mt-1 block text-sm text-ink-500">{item.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
