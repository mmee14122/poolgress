import { course } from '../../content/course'
import { Section } from '../../ui/Section'

/**
 * 04｜這堂課適合誰？
 * 比首頁 TA 更精準。有前置課程時顯示提醒。
 */
export function FitFor() {
  return (
    <Section id="fit" title="這堂課適合誰？">
      <ul className="space-y-3">
        {course.fit.items.map((item) => (
          <li key={item} className="flex items-start gap-3 rounded-card border border-line bg-white px-5 py-4">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 fill-felt-600">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1.2 11.4L5.6 10.2 7 8.8l1.8 1.8 4-4 1.4 1.4z" />
            </svg>
            <span className="text-ink-700">{item}</span>
          </li>
        ))}
      </ul>

      {course.fit.prereq && (
        <p className="mt-5 flex items-start gap-2.5 rounded-card bg-chalk-100 px-5 py-4 text-sm text-chalk-700">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 fill-chalk-700">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3.5a1 1 0 011 1V11a1 1 0 11-2 0V6.5a1 1 0 011-1zm0 9.5a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
          </svg>
          {course.fit.prereq}
        </p>
      )}
    </Section>
  )
}
