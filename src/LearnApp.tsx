import { useEffect, useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Button } from './ui/Button'
import { courseById, flatLessons } from './data/courses'
import { library, useLibrary } from './lib/library'
import { useSession } from './lib/session'
import { toast } from './ui/Toast'

/**
 * 課程學習頁（learn.html?course=<課程id>&lesson=<章序-單元序>）。
 *
 * 單元內容來自 src/data/courses.ts 的 chaptersByCourse
 * （主課程實際資料在 src/content/course.ts）。
 * 影片為可替換佔位：在單元資料填入 videoUrl 即顯示播放器。
 * 進度寫入 lib/library.ts（localStorage），後端接上後改為 API。
 */
export default function LearnApp() {
  const user = useSession()
  const lib = useLibrary()
  const params = useMemo(() => new URLSearchParams(location.search), [])
  const courseId = params.get('course') ?? 'course-tbd-1'
  const courseInfo = courseById(courseId)
  const lessons = useMemo(() => flatLessons(courseId), [courseId])

  const state = lib.courses.find((c) => c.courseId === courseId) ?? null
  const owned = !!state
  const requestedLesson = params.get('lesson') ?? state?.lastLessonId ?? lessons[0]?.id
  const current = lessons.find((l) => l.id === requestedLesson) ?? lessons[0]
  const index = current ? lessons.indexOf(current) : -1
  const prev = index > 0 ? lessons[index - 1] : null
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null

  const [listOpen, setListOpen] = useState(false)

  // 記錄「最後看到哪」，回到我的課程時可續看
  useEffect(() => {
    if (owned && current) library.touchLesson(courseId, current.id)
  }, [owned, courseId, current])

  if (!user || !owned) {
    return (
      <>
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl sm:text-3xl">{!user ? '請先登入' : '尚未購買此課程'}</h1>
          <p className="mt-3 text-ink-500">
            {!user ? '登入後即可繼續你的學習進度。' : '購買課程後即可開始學習。'}
          </p>
          <div className="mt-8 w-full">
            <Button href={!user ? './login.html' : './course.html'} size="lg" block>
              {!user ? '前往登入' : '探索線上課程'}
            </Button>
          </div>
        </main>
      </>
    )
  }

  if (!current) {
    return (
      <>
        <Navbar />
        <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
          <h1 className="text-2xl">這堂課的單元內容待補</h1>
          <p className="mt-3 text-ink-500">章節資料填入後即可開始學習。</p>
          <div className="mt-8 w-full">
            <Button href="./my-courses.html" size="lg" block>
              回我的課程
            </Button>
          </div>
        </main>
      </>
    )
  }

  const done = new Set(state!.completedLessons)
  const progress = lessons.length ? Math.round((done.size / lessons.length) * 100) : 0
  const isGame = current.lesson.type === 'game'

  const markDone = () => {
    library.completeLesson(courseId, current.id)
    toast('已標記完成', 'success')
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        {/* 頂部：返回與進度 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a
            href="./my-courses.html"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12.7 15.7L7 10l5.7-5.7 1.4 1.4L9.8 10l4.3 4.3z" />
            </svg>
            {courseInfo?.title ?? '我的課程'}
          </a>
          <div className="flex items-center gap-3 text-sm text-ink-500">
            <span>課程進度</span>
            <span
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="課程進度"
              className="h-2 w-32 overflow-hidden rounded-full bg-ivory-100"
            >
              <span
                className="block h-full rounded-full bg-brand-600 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </span>
            <span className="font-semibold text-ink-900 tabular-nums">{progress}%</span>
          </div>
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
          <div className="min-w-0">
            {isGame ? (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-card bg-brand-950 px-6 text-center">
                <span className="rounded-full bg-pulse-100 px-3 py-1 text-sm font-semibold text-pulse-700">
                  實戰闖關
                </span>
                <p className="text-lg font-semibold text-white">{current.lesson.title}</p>
                {current.lesson.goal && (
                  <p className="text-sm text-white/70">{current.lesson.goal}</p>
                )}
                <Button href="./challenges.html" size="lg">
                  前往實戰闖關
                </Button>
              </div>
            ) : current.lesson.videoUrl ? (
              <video
                src={current.lesson.videoUrl}
                controls
                className="aspect-video w-full rounded-card bg-black"
              />
            ) : (
              /* 影片佔位：在單元資料填入 videoUrl 即自動換成播放器 */
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-card bg-brand-950">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-white/80">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <p className="text-sm text-white/60">影片素材待補</p>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm text-ink-500">
                Chapter {String(current.chapterIndex + 1).padStart(2, '0')}｜{current.chapterName}
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl">{current.lesson.title}</h1>
              {current.lesson.duration && (
                <p className="mt-1 text-sm text-ink-500 tabular-nums">{current.lesson.duration}</p>
              )}

              {current.lesson.points && current.lesson.points.length > 0 && (
                <section className="mt-6 rounded-card border border-line bg-white p-5">
                  <h2 className="text-base font-semibold">本單元重點</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-700">
                    {current.lesson.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
              )}

              {isGame && current.lesson.ability && (
                <section className="mt-6 rounded-card border border-line bg-white p-5">
                  <h2 className="text-base font-semibold">完成後你將能夠</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {current.lesson.ability}
                  </p>
                </section>
              )}

              {/* 練習提示：導向實戰闖關 */}
              {!isGame && (
                <section className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-line bg-ivory-50 p-5">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold">帶到球桌上練</h2>
                    <p className="mt-1 text-sm text-ink-500">
                      看懂之後，用實戰闖關把它變成做得到。
                    </p>
                  </div>
                  <Button href="./challenges.html" variant="secondary">
                    查看實戰闖關
                  </Button>
                </section>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                {prev && (
                  <Button
                    href={`./learn.html?course=${courseId}&lesson=${prev.id}`}
                    variant="secondary"
                  >
                    ← 上一單元
                  </Button>
                )}
                <Button onClick={markDone} disabled={done.has(current.id)}>
                  {done.has(current.id) ? '已完成 ✓' : '完成此單元'}
                </Button>
                {next && (
                  <Button
                    href={`./learn.html?course=${courseId}&lesson=${next.id}`}
                    variant="secondary"
                    className="ml-auto"
                  >
                    下一單元 →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 章節清單：桌機常駐、手機可收合 */}
          <aside className="mt-10 lg:sticky lg:top-[calc(var(--promo-h)+5rem)] lg:mt-0">
            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
              aria-expanded={listOpen}
              className="flex w-full items-center justify-between rounded-card border border-line bg-white px-4 py-3 text-left font-semibold lg:hidden"
            >
              課程章節（{done.size}／{lessons.length}）
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-4 w-4 fill-ink-400 transition-transform ${listOpen ? 'rotate-180' : ''}`}
              >
                <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
              </svg>
            </button>

            <nav
              aria-label="課程章節"
              className={`${listOpen ? 'mt-3 block' : 'hidden'} max-h-[70vh] overflow-y-auto rounded-card border border-line bg-white lg:mt-0 lg:block`}
            >
              {(Object.values(groupByChapter(lessons)) as GroupedChapter[]).map((group) => (
                <div key={group.name}>
                  <p className="border-b border-line bg-ivory-50 px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-500">
                    Chapter {String(group.index + 1).padStart(2, '0')}｜{group.name}
                  </p>
                  <ul>
                    {group.items.map((l) => {
                      const active = l.id === current.id
                      return (
                        <li key={l.id}>
                          <a
                            href={`./learn.html?course=${courseId}&lesson=${l.id}`}
                            aria-current={active ? 'page' : undefined}
                            className={`flex items-center gap-2.5 border-b border-line px-4 py-3 text-sm transition-colors last:border-b-0 ${
                              active
                                ? 'bg-brand-50 font-semibold text-brand-700'
                                : 'text-ink-700 hover:bg-ivory-50'
                            }`}
                          >
                            {done.has(l.id) ? (
                              <svg
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 fill-pulse-500"
                              >
                                <path d="M10 1.7a8.3 8.3 0 100 16.6 8.3 8.3 0 000-16.6zm-1.4 12L4.8 9.9l1.4-1.4 2.4 2.4 5.2-5.2 1.4 1.4z" />
                              </svg>
                            ) : l.lesson.type === 'game' ? (
                              <span
                                className="h-2 w-2 shrink-0 rounded-full bg-pulse-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                className="h-2 w-2 shrink-0 rounded-full bg-ink-400/40"
                                aria-hidden="true"
                              />
                            )}
                            <span className="min-w-0 flex-1 truncate">{l.lesson.title}</span>
                            {l.lesson.duration && (
                              <span className="shrink-0 text-xs text-ink-400 tabular-nums">
                                {l.lesson.duration}
                              </span>
                            )}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      </main>
    </>
  )
}

type GroupedChapter = { index: number; name: string; items: ReturnType<typeof flatLessons> }

function groupByChapter(lessons: ReturnType<typeof flatLessons>): Record<number, GroupedChapter> {
  const out: Record<number, GroupedChapter> = {}
  for (const l of lessons) {
    out[l.chapterIndex] ??= { index: l.chapterIndex, name: l.chapterName, items: [] }
    out[l.chapterIndex].items.push(l)
  }
  return out
}
