import { useEffect, useRef, useState } from 'react'
import { brand, sections, type Section } from './data/premium-demo'

/**
 * 首頁定案版演示：Poolhouse 式滿版分段敘事。
 *
 * - 保留 S01–S09 故事線，壓縮為 5 個滿版段落，每段一張大圖＋一句話
 * - 唯一的動效：段落進入視窗下緣 78% 時內容淡入上移一次（單向，不倒放）
 * - 淡入用 scroll 事件＋getBoundingClientRect 判定（不用 IntersectionObserver／rAF，
 *   兩者在分頁不可見時不執行，無法自動驗證）
 * - CTA 第一屏就在：頂欄常駐一顆（Poolhouse 的 BOOK A TABLE 位置）
 * - prefers-reduced-motion：全部直接顯示，無淡入
 */

export default function PremiumDemoApp() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const refs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setRevealed(new Set(sections.map((s) => s.id)))
      return
    }
    const check = () => {
      const line = window.innerHeight * 0.78
      setRevealed((prev) => {
        let changed = false
        const next = new Set(prev)
        refs.current.forEach((el, id) => {
          if (!next.has(id) && el.getBoundingClientRect().top < line) {
            next.add(id)
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <main className="bg-brand-950 text-white">
      {/* 頂欄：品牌字標＋常駐 CTA（趕時間的人第一屏就能走） */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b from-brand-950/90 to-transparent px-5 sm:px-8">
        <span className="font-logo text-lg font-semibold tracking-wide">{brand.name}</span>
        <a
          href={brand.navCta.href}
          className="inline-flex min-h-10 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-brass-300 hover:text-brass-300"
        >
          {brand.navCta.label}
        </a>
      </header>

      {sections.map((s) => (
        <Screen key={s.id} s={s} shown={revealed.has(s.id)} refs={refs} />
      ))}

    </main>
  )
}

/** 一個滿版段落：大圖（或佔位）＋定位文字，進場時淡入一次 */
function Screen({
  s,
  shown,
  refs,
}: {
  s: Section
  shown: boolean
  refs: React.MutableRefObject<Map<string, HTMLElement>>
}) {
  const alignCls =
    s.align === 'center'
      ? 'items-center text-center left-1/2 -translate-x-1/2'
      : s.align === 'right'
        ? 'items-end text-right right-[6%] max-sm:right-5'
        : 'items-start text-left left-[6%] max-sm:left-5'

  return (
    <section
      ref={(el) => {
        if (el) refs.current.set(s.id, el)
      }}
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      {/* 背景大圖／佔位 */}
      {s.image ? (
        <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-925 to-brand-950">
          <div className="absolute inset-[4%] rounded-2xl border border-dashed border-white/15" />
        </div>
      )}
      {/* 文字可讀性：由文字側往外的暗角 */}
      <div
        className={`absolute inset-0 ${
          s.align === 'center'
            ? 'bg-brand-950/45'
            : s.align === 'right'
              ? 'bg-gradient-to-l from-brand-950/75 via-brand-950/30 to-transparent'
              : 'bg-gradient-to-r from-brand-950/75 via-brand-950/30 to-transparent'
        }`}
      />
      {/* 幕別標籤（演示用，正式版移除） */}
      <span className="absolute top-20 left-5 text-[11px] text-white/35 sm:left-8">
        {s.scenes}
      </span>

      {/* 文字：進場淡入一次 */}
      <div
        className={`absolute bottom-[12%] flex max-w-xl flex-col ${alignCls} transition-all duration-700 ease-out ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}
      >
        {s.eyebrow && (
          <span className="mb-4 text-xs font-medium tracking-[0.25em] text-brass-300">
            {s.eyebrow}
          </span>
        )}
        <h2 className="text-3xl leading-tight font-bold sm:text-5xl">{s.title}</h2>
        {s.body && (
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            {s.body}
          </p>
        )}
        {s.cta && (
          <a
            href={s.cta.href}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-500 px-8 text-base font-semibold text-white transition-colors hover:bg-brand-600"
          >
            {s.cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
