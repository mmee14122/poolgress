import { course } from '../../data/course-detail'
import { Section } from '../../ui/Section'

/**
 * SECTION 06｜這堂課適合你嗎？
 * 核取清單 + 低干擾購買引導（點擊捲至購買卡）。
 */
export function FitCheck() {
  const { fit } = course.intro

  const scrollToBuy = () => {
    const target =
      window.innerWidth >= 1024
        ? document.getElementById('buy-card')
        : document.getElementById('stuck')
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

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

      <button
        type="button"
        onClick={scrollToBuy}
        className="mt-6 block w-full rounded-card bg-brand-50 px-5 py-4 text-left text-sm text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-100"
      >
        {fit.nudge}
      </button>
    </Section>
  )
}
