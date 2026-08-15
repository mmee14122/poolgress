import { useEffect, useRef, useState } from 'react'
import { home } from '../../content/home'

/**
 * SECTION 04｜The One —— 首頁第一個情緒高潮。
 * 捲動進入視窗時播放：瞄準線 → 出桿 → 進袋 → 金句浮現。
 * 品牌金句「靠，我居然做到了」第二次（也是最大的一次）完整出現。
 */
export function S04One() {
  const { one } = home
  const [run, setRun] = useState(0) // 0 = 未播放；每 +1 重播一次
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || run > 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(1)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [run])

  return (
    <section
      ref={sectionRef}
      id="one"
      className="scroll-mt-32 overflow-hidden bg-brand-950 py-16 text-white lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-2xl text-white sm:text-4xl">
          {one.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-6 space-y-1 text-white/70">
          {one.story.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <p className="mt-5 flex items-center justify-center gap-3 text-lg font-semibold text-white/85">
          {one.beats.map((beat, i) => (
            <span key={beat} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="text-white/30">·</span>}
              {beat}
            </span>
          ))}
        </p>

        {/* 進球動畫：key 換值即重播 */}
        <div key={run} className={`relative mx-auto mt-10 max-w-2xl ${run > 0 ? 'one-play' : ''}`}>
          <svg viewBox="0 0 800 430" className="w-full" aria-hidden="true">
            {/* 檯面 */}
            <rect x="24" y="24" width="752" height="382" rx="20" fill="#16294d" />
            <rect x="44" y="44" width="712" height="342" rx="10" fill="#1e4276" />
            {/* 袋口（右上） */}
            <circle cx="742" cy="58" r="24" fill="#060d1a" stroke="rgba(230,196,120,0.5)" strokeWidth="2.5" />
            {/* 瞄準線：母球 → 子球 → 袋口 */}
            <line
              className="one-line"
              x1="300"
              y1="300"
              x2="742"
              y2="58"
              stroke="rgba(230,196,120,0.75)"
              strokeWidth="2.5"
              strokeDasharray="520"
            />
            {/* 子球 */}
            <circle className="one-obj" cx="521" cy="179" r="15" fill="#e6c478" />
            {/* 母球 */}
            <circle className="one-cue" cx="300" cy="300" r="15" fill="#fbf9f5" />
          </svg>

          {/* 螢幕閱讀器版本的動畫內容 */}
          <p className="sr-only">瞄準、出桿，球進袋了。</p>
        </div>

        <p className="one-landed mt-6 text-white/75">{one.landed}</p>

        <p className="one-quote mt-8 text-3xl leading-snug font-bold text-brass-300 sm:text-5xl">
          {one.quote}
        </p>

        {run > 0 && (
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/50 ring-1 ring-white/15 transition-colors hover:text-white/80"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M10 3a7 7 0 016.32 4H14v2h6V3h-2v2.1A9 9 0 001.1 9h2.03A7 7 0 0110 3zm6.87 8A7 7 0 013.68 13H6v-2H0v6h2v-2.1A9 9 0 0018.9 11h-2.03z" />
            </svg>
            再看一次
          </button>
        )}

        <div className="mx-auto mt-12 max-w-xl space-y-2 border-t border-white/10 pt-8 text-white/70">
          {one.coda.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
