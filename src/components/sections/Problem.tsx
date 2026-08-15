import { course } from '../../content/course'
import { Section } from '../../ui/Section'

/**
 * 01｜你現在可能卡在哪裡？
 * 這堂課的「具體問題」——不重寫首頁的大問題。
 */
export function Problem() {
  return (
    <Section id="problem" title="你現在可能卡在哪裡？">
      <div className="rounded-card border border-line bg-white p-6 sm:p-8">
        <p className="text-lg leading-loose text-ink-700">
          {course.problem.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </Section>
  )
}
