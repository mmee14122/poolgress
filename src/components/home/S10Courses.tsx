import { home } from '../../content/home'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

/**
 * SECTION 10｜課程商品入口
 * ⚠️ 真實課程資料尚未提供，卡片全部是「待補」佔位——不虛構課名與內容。
 * 手機橫向 scroll-snap，桌機三欄。
 */
export function S10Courses() {
  const { courses } = home
  const labels = courses.fieldLabels

  return (
    <section id="courses" className="scroll-mt-24 bg-ivory-50 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-4xl">{courses.title}</h2>
          <p className="mt-4 text-ink-500">
            {courses.subtitleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          {/* 品牌金句最後一次呼應 */}
          <p className="mt-5 text-sm font-semibold text-felt-700">{courses.echo}</p>
        </div>

        <ul className="scroll-row -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-5">
          {courses.cards.map((card, i) => (
            <li
              key={i}
              className="flex w-[82vw] max-w-sm shrink-0 snap-center flex-col rounded-card border border-line bg-white p-6 sm:w-auto sm:max-w-none"
            >
              <div className="flex items-center justify-between">
                <Badge tone="free">{card.level}</Badge>
                <span className="text-xs text-ink-400">課程資料待補</span>
              </div>

              <h3 className="mt-4 text-xl">{card.name}</h3>

              <dl className="mt-5 flex-1 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-felt-700">{labels.understand}</dt>
                  <dd className="mt-1 text-ink-500">{card.understand}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-felt-700">{labels.challenge}</dt>
                  <dd className="mt-1 text-ink-500">{card.challenge}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-felt-700">{labels.outcome}</dt>
                  <dd className="mt-1 text-ink-500">{card.outcome}</dd>
                </div>
              </dl>

              <Button href={card.cta.href} block className="mt-6">
                {card.cta.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
