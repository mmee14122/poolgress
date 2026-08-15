import { useEffect, useRef } from 'react'
import { sections } from '../content/course'

/**
 * 手機版的段落標籤列：取代桌機左欄，sticky 在導覽列下方，可橫向滑動。
 * 捲動內容時目前段落會自動捲進可視範圍，使用者不必自己找。
 */
export function SectionTabs({ active }: { active: string }) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active])

  return (
    <div className="sticky top-16 z-30 border-b border-line bg-ivory-50/95 backdrop-blur lg:hidden">
      <ul ref={listRef} className="scroll-row flex gap-2 overflow-x-auto px-4 py-2.5">
        {sections.map((section) => {
          const isActive = section.id === active
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-tab={section.id}
                aria-current={isActive ? 'true' : undefined}
                /* py-3 讓觸控目標達到 44px */
                className={`block rounded-full px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-felt-600 font-semibold text-white'
                    : 'bg-white text-ink-500 ring-1 ring-line'
                }`}
              >
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
