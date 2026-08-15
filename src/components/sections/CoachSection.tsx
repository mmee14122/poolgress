import { course } from '../../data/course-detail'
import { Section } from '../../ui/Section'

/**
 * D｜關於教練
 * 形象照、理念引言、經歷與信任數字、IG。
 * 呈現「有系統、有方法論」的專業感，而非單次教學服務。
 */
export function CoachSection() {
  const { coach } = course

  return (
    <Section id="coach" title="關於教練">
      <div className="overflow-hidden rounded-card border border-line bg-white">
        <div className="grid sm:grid-cols-[13rem_1fr]">
          {/* 形象照佔位：鎖高度避免圖片載入時位移 */}
          <div className="aspect-[4/5] bg-brand-900 sm:aspect-auto">
            <div className="flex h-full min-h-52 items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,var(--color-brand-700),var(--color-brand-950))] text-sm text-white/70">
              教練形象照
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <h3 className="text-xl">{coach.name}</h3>
            <p className="mt-1 text-sm text-ink-500">{coach.title}</p>

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

            {/* IG 資訊：帳號確定後把外層換成 <a href="https://instagram.com/..."> */}
            <p className="mt-5 flex items-center gap-2 text-sm text-ink-700">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-ink-500">
                <path d="M12 2.2c3.2 0 3.6 0 4.85.07a6.7 6.7 0 012.24.42 4.5 4.5 0 011.63 1.06 4.5 4.5 0 011.06 1.63c.24.6.38 1.28.42 2.24.06 1.26.07 1.65.07 4.85s0 3.6-.07 4.85a6.7 6.7 0 01-.42 2.24 4.7 4.7 0 01-2.7 2.7c-.6.24-1.27.38-2.23.42-1.26.06-1.65.07-4.85.07s-3.6 0-4.85-.07a6.7 6.7 0 01-2.24-.42 4.5 4.5 0 01-1.63-1.06 4.5 4.5 0 01-1.06-1.63 6.7 6.7 0 01-.42-2.24C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.04-.96.18-1.63.42-2.24A4.5 4.5 0 013.75 3.3a4.5 4.5 0 011.63-1.06 6.7 6.7 0 012.24-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.52 0-4.76.07-.88.04-1.36.19-1.68.31-.42.16-.72.36-1.04.68-.32.32-.52.62-.68 1.04-.12.32-.27.8-.31 1.68C3.6 8.48 3.6 8.85 3.6 12s0 3.52.07 4.76c.04.88.19 1.36.31 1.68.16.42.36.72.68 1.04.32.32.62.52 1.04.68.32.12.8.27 1.68.31 1.24.06 1.61.07 4.76.07s3.52 0 4.76-.07c.88-.04 1.36-.19 1.68-.31a2.9 2.9 0 001.04-.68 2.9 2.9 0 00.68-1.04c.12-.32.27-.8.31-1.68.06-1.24.07-1.61.07-4.76s0-3.52-.07-4.76c-.04-.88-.19-1.36-.31-1.68a2.9 2.9 0 00-.68-1.04 2.9 2.9 0 00-1.04-.68c-.32-.12-.8-.27-1.68-.31C15.52 4 15.15 4 12 4zm0 3a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-3.1a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
              Instagram：{coach.instagram}
            </p>
          </div>
        </div>

        {/* 信任數字 */}
        <dl className="grid grid-cols-3 divide-x divide-line border-t border-line bg-ivory-50">
          {coach.stats.map((stat) => (
            <div key={stat.label} className="px-4 py-5 text-center">
              <dt className="text-xs text-ink-500">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-brand-700">{stat.value}</dd>
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
