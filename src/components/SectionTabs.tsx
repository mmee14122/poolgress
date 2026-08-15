import { useEffect, useRef } from 'react'
import { sections } from '../content/course'

/**
 * 手機版的段落標籤列：取代桌機左欄，sticky 在導覽列下方，可橫向滑動。
 * 捲動內容時目前段落會自動捲進可視範圍，使用者不必自己找。
 */
export function SectionTabs({ active }: { active: string }) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    const el = list?.querySelector<HTMLElement>(`[data-tab="${active}"]`)
    if (!list || !el) return

    /*
     * 只捲動標籤列本身，不用 scrollIntoView——
     * scrollIntoView 會連帶捲動視窗去對齊 sticky 標籤列，
     * 與使用者的滾輪捲動互相打架，導致頁面無法正常下滑。
     */
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const target =
      list.scrollLeft + (elRect.left - listRect.left) - (listRect.width - elRect.width) / 2

    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [active])

  return (
    <div className="sticky top-[calc(var(--promo-h)+4rem)] z-30 border-b border-line bg-ivory-50 lg:hidden">
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
                    ? 'bg-brand-600 font-semibold text-white'
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
