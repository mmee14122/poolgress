import { sections } from '../content/course'

/**
 * 桌機左欄錨點導覽。sticky 於視窗左側，
 * 目前所在區段由 App 傳入的 active 決定高亮。
 */
export function SideNav({ active }: { active: string }) {
  return (
    <nav aria-label="課程內容導覽" className="sticky top-24 hidden lg:block">
      <p className="mb-3 px-3 text-xs font-semibold tracking-widest text-ink-500 uppercase">
        本頁內容
      </p>

      <ul className="space-y-0.5">
        {sections.map((section) => {
          const isActive = section.id === active
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`group relative flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-felt-50 font-semibold text-felt-700'
                    : 'text-ink-500 hover:bg-ivory-100 hover:text-ink-900'
                }`}
              >
                {/* 左側指示條：高亮時實心，hover 時淡出現 */}
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full transition-colors ${
                    isActive ? 'bg-felt-600' : 'bg-transparent group-hover:bg-line'
                  }`}
                />
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
