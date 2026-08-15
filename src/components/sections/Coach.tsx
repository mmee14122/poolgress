import { course } from '../../content/course'
import { Section } from '../../ui/Section'

export function Coach() {
  const { coach } = course

  return (
    <Section id="coach" title="關於教練">
      <div className="overflow-hidden rounded-card border border-line bg-white">
        <div className="grid sm:grid-cols-[13rem_1fr]">
          {/* 形象照佔位：鎖比例避免圖片載入時位移 */}
          <div className="aspect-[4/5] bg-felt-900 sm:aspect-auto">
            <div className="flex h-full min-h-52 items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,var(--color-felt-700),var(--color-felt-950))] text-sm text-white/40">
              教練形象照
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <h3 className="text-xl">{coach.name}</h3>
            <p className="mt-1 text-sm text-ink-400">{coach.title}</p>

            <blockquote className="mt-5 border-l-2 border-brass-400 pl-4 text-ink-700 italic">
              {coach.philosophy}
            </blockquote>

            <div className="mt-5 space-y-3 text-sm">
              {coach.bio.map((paragraph) => (
                <p key={paragraph} className="text-ink-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 信任數字 */}
        <dl className="grid grid-cols-3 divide-x divide-line border-t border-line bg-ivory-50">
          {coach.stats.map((stat) => (
            <div key={stat.label} className="px-4 py-5 text-center">
              {/* 米色底比純白暗，這裡需要用更深的 ink-500 才過 AA */}
              <dt className="text-xs text-ink-500">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-felt-700">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {coach.credentials.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-lg bg-white px-4 py-3 text-sm text-ink-700 ring-1 ring-line"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 fill-brass-400"
            >
              <path d="M12 2l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 8.4l6.1-.8z" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  )
}
