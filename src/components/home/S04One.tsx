import { useEffect, useRef, useState } from 'react'
import { home } from '../../data/home'

/**
 * SECTION 04｜The One —— 首頁第一個情緒高潮。
 *
 * 進球動畫為 6 秒無限循環（瞄準線 → 出桿 → 進袋 → 金句 → 淡出重來），
 * 只在區塊進入視窗時掛上 .one-play，離開即移除，畫面外不空轉。
 * 品牌金句「靠，我居然做到了」第二次（也是最大的一次）完整出現。
 */
export function S04One() {
  const { one } = home
  const [playing, setPlaying] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="one"
      className="scroll-mt-24 overflow-hidden bg-brand-950 py-14 text-white lg:py-20"
    >
      <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-2xl text-white sm:text-4xl">
          {one.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        {/* 三段敘事收成一行，縮短篇幅 */}
        <p className="mt-5 text-white/70">{one.story.join('')}</p>

        <p className="mt-4 flex items-center justify-center gap-3 text-base font-semibold text-white/85">
          {one.beats.map((beat, i) => (
            <span key={beat} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-white/30">
                  ·
                </span>
              )}
              {beat}
            </span>
          ))}
        </p>

        {/* 進球動畫（循環播放） */}
        <div className={`relative mx-auto mt-8 max-w-xl ${playing ? 'one-play' : ''}`}>
          <svg viewBox="0 0 800 430" className="w-full" aria-hidden="true">
            {/* 檯面 */}
            <rect x="24" y="24" width="752" height="382" rx="20" fill="#16294d" />
            <rect x="44" y="44" width="712" height="342" rx="10" fill="#1e4276" />
            {/* 袋口（右上） */}
            <circle
              cx="742"
              cy="58"
              r="24"
              fill="#060d1a"
              stroke="rgba(230,196,120,0.5)"
              strokeWidth="2.5"
            />
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

        <p className="one-landed mt-5 text-sm text-white/75">{one.landed}</p>

        <p className="one-quote mt-5 text-2xl leading-snug font-bold text-brass-300 sm:text-4xl">
          {one.quote}
        </p>

        <div className="mx-auto mt-10 max-w-xl border-t border-white/10 pt-6 text-white/70">
          {one.coda.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
