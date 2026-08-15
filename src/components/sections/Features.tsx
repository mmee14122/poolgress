import { course } from '../../content/course'
import { Section } from '../../ui/Section'

/**
 * 05｜這堂課的特色
 * 只講「這一堂」的特色，不重複品牌四大支柱。
 */
export function Features() {
  return (
    <Section id="features" title="這堂課的特色">
      <ul className="overflow-hidden rounded-card border border-line bg-white">
        {course.features.map((item) => (
          <li key={item} className="flex items-start gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:px-6">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 fill-brass-400">
              <path d="M10 1.6l2.6 5.2 5.8.85-4.2 4.1.99 5.75L10 14.8l-5.19 2.7.99-5.75-4.2-4.1 5.8-.85z" />
            </svg>
            <span className="text-ink-700">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
