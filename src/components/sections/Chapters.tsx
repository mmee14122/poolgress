import { useEffect, useRef, useState } from 'react'
import { course, courseStats, type Chapter, type Lesson } from '../../content/course'
import { products } from '../../content/catalog'
import { cart } from '../../lib/cart'
import { Button } from '../../ui/Button'

const product = products[0]

/* ---------- 時長計算：全部由資料驅動 ---------- */

const toSeconds = (d: string) => {
  const [m, s] = d.split(':').map(Number)
  return m * 60 + s
}
const fmtDuration = (sec: number) =>
  `${Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`

const chapterSeconds = (c: Chapter) =>
  c.lessons.reduce((sum, l) => sum + (l.duration ? toSeconds(l.duration) : 0), 0)

// 總規模統一由 courseStats 提供（與 Hero、購買卡同源）

/* ---------- 單元彈窗 ---------- */

type ModalState = { lesson: Lesson; chapterName: string } | null

function LessonModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!state) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [state, onClose])

  if (!state) return null
  const { lesson } = state
  const isTrial = lesson.type === 'video' && lesson.free
  const isGame = lesson.type === 'game'

  const buyNow = () => {
    cart.add(product)
    location.href = './checkout.html'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* 背景遮罩 */}
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-ink-900/50" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={lesson.title}
        className="relative w-full max-w-lg rounded-t-card bg-white p-6 shadow-2xl sm:rounded-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-brand-600">{state.chapterName}</p>
            <h3 className="mt-1 text-lg">{lesson.title}</h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-ink-700">
              <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
            </svg>
          </button>
        </div>

        {/* 試看：影片播放區（影片平台接入後以 videoUrl 播放） */}
        {isTrial && (
          <div className="mt-5">
            {lesson.videoUrl ? (
              <video src={lesson.videoUrl} controls className="aspect-video w-full rounded-xl bg-ink-900" />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-[radial-gradient(ellipse_at_50%_35%,var(--color-brand-700),var(--color-brand-950))]">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-6 w-6 fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <p className="text-sm text-white/70">試看影片待補（接入影片平台後於此播放）</p>
              </div>
            )}
            {lesson.duration && (
              <p className="mt-3 text-sm text-ink-500">片長 {lesson.duration}</p>
            )}
          </div>
        )}

        {/* 付費單元：鎖定縮圖 + 內容重點 + 購買 CTA */}
        {!isTrial && !isGame && (
          <div className="mt-5">
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-[radial-gradient(ellipse_at_50%_35%,var(--color-brand-700),var(--color-brand-950))]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white">
                  <path d="M12 2a5 5 0 015 5v3h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v3h6V7a3 3 0 00-3-3zm0 9a2 2 0 00-1 3.73V19h2v-2.27A2 2 0 0012 13z" />
                </svg>
              </span>
            </div>

            {lesson.points && lesson.points.length > 0 && (
              <ul className="mt-4 space-y-2">
                {lesson.points.slice(0, 3).map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 fill-brand-600">
                      <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {lesson.duration && <p className="mt-3 text-sm text-ink-500">片長 {lesson.duration}</p>}

            <p className="mt-4 rounded-lg bg-ivory-50 px-4 py-3 text-sm text-ink-500">
              購買課程後即可觀看完整內容
            </p>
            <Button block size="lg" className="mt-4" onClick={buyNow}>
              立即購買課程
            </Button>
          </div>
        )}

        {/* 遊戲闖關：目標與能力，不需播放器 */}
        {isGame && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-pulse-100 p-4">
              <p className="text-xs font-bold tracking-widest text-pulse-700 uppercase">闖關目標</p>
              <p className="mt-1.5 text-sm text-ink-700">{lesson.goal ?? '闖關目標待補'}</p>
            </div>
            <div className="rounded-xl bg-brand-50 p-4">
              <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">
                完成後你能獲得
              </p>
              <p className="mt-1.5 text-sm text-ink-700">{lesson.ability ?? '完成後能力待補'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- 課程內容主區塊 ---------- */

/**
 * 06｜課程內容：課綱展示（販售頁，非購後學習介面）。
 * 互斥 accordion——同一時間只展開一個章節，第一章預設展開；
 * 展開收合用 grid-rows 過渡做平滑動畫。
 */
export function Chapters() {
  const [openIndex, setOpenIndex] = useState(0)
  const [modal, setModal] = useState<ModalState>(null)

  return (
    <section id="chapters" className="scroll-mt-40 py-10 lg:scroll-mt-32 lg:py-14">
      {/* 標題列：左標題、右總規模 */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="text-2xl sm:text-3xl">課程內容</h2>
        <p className="text-sm text-ink-500">
          共 <strong className="font-semibold text-ink-900">{courseStats.units}</strong> 個單元
          <span aria-hidden="true" className="mx-2 text-ink-400">·</span>
          總時數約 <strong className="font-semibold text-ink-900">{courseStats.hours}</strong> 小時
        </p>
      </div>

      <div className="mt-6 space-y-3 lg:mt-8">
        {course.chapters.map((chapter, i) => {
          const open = openIndex === i
          const chapterNo = `Chapter ${String(i + 1).padStart(2, '0')}`
          return (
            <div key={chapter.name + i} className="overflow-hidden rounded-card border border-line bg-white">
              {/* 章節標題列 */}
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-ivory-50 sm:px-5"
              >
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 fill-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                >
                  <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">
                    {chapterNo}
                  </span>
                  <span className="mt-0.5 block font-semibold text-ink-900">{chapter.name}</span>
                </span>
                <span className="shrink-0 text-right text-xs text-ink-500 sm:text-sm">
                  <span className="block sm:inline">共 {chapter.lessons.filter((l) => l.type === 'video').length} 個單元</span>
                  <span aria-hidden="true" className="mx-2 hidden text-ink-400 sm:inline">·</span>
                  <span className="block tabular-nums sm:inline">
                    {fmtDuration(chapterSeconds(chapter))}
                  </span>
                </span>
              </button>

              {/* 展開內容：grid-rows 平滑過渡 */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="border-t border-line">
                    {chapter.lessons.map((lesson, j) => (
                      <li key={lesson.title + j} className="border-b border-line last:border-b-0">
                        <button
                          type="button"
                          onClick={() => setModal({ lesson, chapterName: chapter.name })}
                          className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ivory-50 sm:px-5"
                        >
                          {lesson.type === 'game' ? (
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 fill-pulse-500">
                              <path d="M17 5a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 22a3 3 0 01-2.5-1.4L13.4 18h-2.8l-1.5 2.6A3 3 0 016.6 22a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 5zM9 9H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 101.2 1.2A1.2 1.2 0 0016 9zm2.5 3a1.2 1.2 0 101.2 1.2 1.2 1.2 0 00-1.2-1.2z" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 fill-ink-400">
                              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM10 7.5l6 4.5-6 4.5z" />
                            </svg>
                          )}

                          <span className="min-w-0 flex-1 text-sm text-ink-700">
                            {lesson.title}
                            {lesson.type === 'game' && (
                              <span className="ml-2 text-xs text-pulse-700">遊戲闖關</span>
                            )}
                          </span>

                          {lesson.free && (
                            <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                              試看
                            </span>
                          )}
                          {lesson.duration && (
                            <span className="w-12 shrink-0 text-right text-xs text-ink-500 tabular-nums">
                              {lesson.duration}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <LessonModal state={modal} onClose={() => setModal(null)} />
    </section>
  )
}
