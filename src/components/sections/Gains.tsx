import { course } from '../../content/course'
import { Section } from '../../ui/Section'

const layers = [
  { key: 'understand', label: '你會理解', note: '這堂課的核心原理' },
  { key: 'challenge', label: '你會挑戰', note: '球桌上實際要做的任務' },
  { key: 'outcome', label: '完成後你能做到', note: '具體能力，不是「提升撞球能力」' },
] as const

/**
 * 03｜上完課＋完成闖關，你能得到什麼？
 * 三層拆解：會理解／會挑戰／能做到。內容未提供前顯示待補。
 */
export function Gains() {
  return (
    <Section id="gains" title="上完課＋完成闖關，你能得到什麼？">
      <div className="space-y-4">
        {layers.map((layer, i) => (
          <div key={layer.key} className="flex gap-5 rounded-card border border-line bg-white p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-200">
              {i + 1}
            </span>
            <div>
              <h3 className="text-base">{layer.label}</h3>
              <p className="mt-0.5 text-xs text-ink-400">{layer.note}</p>
              <p className="mt-2 text-ink-700">{course.gains[layer.key]}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
