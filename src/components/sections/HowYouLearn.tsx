import { course } from '../../content/course'
import { Section } from '../../ui/Section'

/**
 * 02｜這堂課會怎麼帶你學？
 * 詳細學習流程只放這裡，不放首頁。
 * 理解 → 示範 → 實踐 → 闖關 → 確認，垂直串接。
 */
export function HowYouLearn() {
  return (
    <Section
      id="how"
      title="這堂課會怎麼帶你學？"
      description="這是單堂課的學習方式：每一步都知道自己在做什麼，最後確認自己真的做到。"
    >
      <ol className="rounded-card border border-line bg-white p-6 sm:p-8">
        {course.flow.map((stage, i) => {
          const last = i === course.flow.length - 1
          return (
            <li key={stage.name} className="relative flex gap-5 pb-8 last:pb-0">
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute top-11 left-[1.2rem] bottom-0 w-px bg-felt-200"
                />
              )}
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  last ? 'bg-brass-400 text-felt-950' : 'bg-felt-600 text-white'
                }`}
              >
                {last ? (
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
                    <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <div className="pt-1.5">
                <h3 className="text-lg">{stage.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{stage.body}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
