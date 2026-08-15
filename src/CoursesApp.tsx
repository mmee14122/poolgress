import { useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { formatNT } from './lib/cart'
import { courseCatalog, courseLevels, type CourseLevel, type CourseSummary } from './data/courses'
import { SafeImage, CoverFallback } from './ui/SafeImage'

/**
 * 線上課程列表頁。
 * 資料來源：src/data/courses.ts（新增課程改那裡即可，此頁自動更新）。
 * 難度篩選＋關鍵字搜尋；無結果顯示空狀態。
 */
export default function CoursesApp() {
  const [level, setLevel] = useState<CourseLevel | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    return courseCatalog.filter(
      (c) =>
        (level === 'all' || c.level === level) &&
        (!q || c.title.includes(q) || c.summary.includes(q) || c.category.includes(q)),
    )
  }, [level, query])

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="text-3xl sm:text-4xl">線上課程</h1>
        <p className="mt-3 text-ink-500">從理解開始，讓每一次練習都有方向。</p>

        {/* 篩選列：難度 + 搜尋 */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto scroll-row" role="group" aria-label="難度篩選">
            {(['all', ...courseLevels] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setLevel(v as CourseLevel | 'all')}
                aria-pressed={level === v}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  level === v
                    ? 'bg-brand-600 text-white'
                    : 'bg-white text-ink-700 ring-1 ring-line hover:bg-ivory-100'
                }`}
              >
                {v === 'all' ? '全部' : v}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 fill-ink-400"
            >
              <path d="M10 2a8 8 0 105.3 14l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋課程"
              aria-label="搜尋課程"
              className="w-full rounded-full border border-line bg-white py-2.5 pr-4 pl-10 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-2 focus:outline-offset-1 focus:outline-brand-600"
            />
          </div>
        </div>

        {/* 課程卡片 */}
        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-card border border-dashed border-line bg-ivory-50/60 px-4 py-16 text-center">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-9 w-9 fill-ink-400/60">
              <path d="M10 2a8 8 0 105.3 14l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
            </svg>
            <p className="mt-3 font-semibold text-ink-900">找不到符合的課程</p>
            <p className="mt-1 text-sm text-ink-500">換個關鍵字，或先看看全部課程。</p>
            <div className="mt-5">
              <Button
                variant="secondary"
                onClick={() => {
                  setLevel('all')
                  setQuery('')
                }}
              >
                清除篩選
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <li key={c.id}>
                <CourseCard course={c} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}

function CourseCard({ course }: { course: CourseSummary }) {
  const coming = course.price === null
  const inner = (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-sm transition-shadow ${
        coming ? 'opacity-80' : 'hover:shadow-md'
      }`}
    >
      <Cover course={course} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700 ring-1 ring-brand-200">
            {course.level}
          </span>
          <span className="rounded-full bg-ivory-100 px-2.5 py-0.5 text-ink-500">
            {course.category}
          </span>
        </div>
        <h2 className="mt-3 text-lg leading-snug">{course.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{course.summary}</p>

        {!coming && (
          <p className="mt-3 text-xs text-ink-500">
            {course.units} 個單元・約 {course.hours} 小時
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-2 border-t border-line pt-4">
          {coming ? (
            <span className="text-sm font-semibold text-ink-500">即將推出</span>
          ) : (
            <>
              <span className="text-xl font-bold text-ink-900 tabular-nums">
                {formatNT(course.price!)}
              </span>
              {course.originalPrice && (
                <span className="text-sm text-ink-400 line-through tabular-nums">
                  {formatNT(course.originalPrice)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )

  return course.href ? (
    <a href={course.href} className="block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
      {inner}
    </a>
  ) : (
    inner
  )
}

/** 封面：有圖用圖（載入失敗自動回退），沒圖用品牌漸層佔位 */
function Cover({ course }: { course: CourseSummary }) {
  return (
    <div className="aspect-video w-full overflow-hidden">
      <SafeImage
        src={course.cover}
        className="h-full w-full object-cover"
        fallback={<CoverFallback />}
      />
    </div>
  )
}
