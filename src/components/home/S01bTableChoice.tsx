import { useEffect, useRef, useState } from 'react'
import { routes, layout, finale, sectionCopy, type Route } from '../../data/table-choice'
import { Button } from '../../ui/Button'

type Phase = 'choose' | 'playing' | 'insight' | 'cta'

const SEEN_KEY = 'poolgress.tableChoice.v1'

/**
 * 首頁 Hero 下方的互動：「這顆球，你會怎麼打？」
 *
 * 流程刻意是「選擇 → 看結果 → 理解 → 再導流」，
 * 點選項不會直接跳頁，否則這一區會退化成包裝漂亮的導覽列。
 *
 * 動畫用 CSS offset-path 驅動兩顆球沿預先設計的路徑移動（無物理引擎、無新套件）。
 * 路線資料在 data/table-choice.ts，換球型或改球路不必動這支元件。
 * prefers-reduced-motion：略過移動，直接顯示球的最終位置與結果。
 */
export function S01bTableChoice() {
  const [selected, setSelected] = useState<Route | null>(null)
  const [phase, setPhase] = useState<Phase>('choose')
  const [preview, setPreview] = useState<string | null>(null)
  const [seen, setSeen] = useState<string[]>([])
  const [showFinale, setShowFinale] = useState(false)
  const timers = useRef<number[]>([])

  /* 已體驗過的打法只記在本次瀏覽（sessionStorage），不做成任務清單 */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SEEN_KEY)
      if (raw) setSeen(JSON.parse(raw))
    } catch {
      /* 隱私模式：忽略，改為單次體驗 */
    }
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const play = (route: Route) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setSelected(route)
    setShowFinale(false)
    setPhase('playing')

    const total = reduced ? 0 : Math.max(route.cueDuration, route.collisionAt + route.objectDuration)
    /* 球停下來之後才給結論：先停頓，再出 Insight，最後才出 CTA */
    timers.current.push(window.setTimeout(() => setPhase('insight'), total + (reduced ? 200 : 500)))
    timers.current.push(
      window.setTimeout(() => {
        setPhase('cta')
        const next = seen.includes(route.id) ? seen : [...seen, route.id]
        setSeen(next)
        try {
          sessionStorage.setItem(SEEN_KEY, JSON.stringify(next))
        } catch {
          /* 忽略 */
        }
        /* 三條都看過，第三條結束後才出現品牌收尾 */
        if (next.length === routes.length) {
          timers.current.push(window.setTimeout(() => setShowFinale(true), 700))
        }
      }, total + (reduced ? 400 : 1400)),
    )
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setSelected(null)
    setPhase('choose')
    setShowFinale(false)
    setPreview(null)
  }

  return (
    <section
      id="table-choice"
      aria-labelledby="table-choice-title"
      className="scroll-mt-24 bg-brand-950 py-16 text-white lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <h2 id="table-choice-title" className="text-2xl sm:text-4xl">
            {sectionCopy.title}
          </h2>
          {phase === 'choose' && (
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-white/65">
              三種打法都合理。選一條，看看球會怎麼走。
            </p>
          )}
        </div>

        <div className="mt-10 lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12">
          <PoolTable
            selected={selected}
            preview={preview}
            phase={phase}
            reduced={reduced}
          />

          <div className="mt-8 lg:mt-0">
            {phase === 'choose' ? (
              <RouteChooser
                seen={seen}
                onPreview={setPreview}
                onPick={play}
              />
            ) : (
              <ResultPanel
                route={selected!}
                phase={phase}
                onReset={reset}
                showFinale={showFinale}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 球桌：俯視、極簡、看得清楚球與球路。
 * 選定後其他兩條虛線淡出，只留下這一條。
 */
function PoolTable({
  selected,
  preview,
  phase,
  reduced,
}: {
  selected: Route | null
  preview: string | null
  phase: Phase
  reduced: boolean
}) {
  const playing = phase !== 'choose'

  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 240"
        className="w-full rounded-card shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]"
        role="img"
        aria-label="俯視撞球桌，母球與目標球，以及三條可選的球路"
      >
        {/* 檯面與庫邊 */}
        <rect x="0" y="0" width="400" height="240" rx="16" fill="#123055" />
        <rect x="12" y="12" width="376" height="216" rx="8" fill="#1B4C7E" />
        <rect
          x="12"
          y="12"
          width="376"
          height="216"
          rx="8"
          fill="none"
          stroke="#0d223c"
          strokeWidth="2"
        />
        {/* 袋口 */}
        {[
          [20, 20],
          [380, 20],
          [20, 220],
          [380, 220],
          [200, 14],
          [200, 226],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="11" fill="#08192c" />
        ))}

        {/* 三條球路虛線：未選擇時全部顯示，選定後只留當前那一條 */}
        {routes.map((r) => {
          const isActive = selected?.id === r.id
          const isPreview = preview === r.id
          const dimmed = (selected && !isActive) || (preview && !isPreview && !selected)
          return (
            <g key={r.id} className="pg-route" style={{ opacity: dimmed ? 0 : isPreview || isActive ? 1 : 0.5 }}>
              <path
                d={r.objectBallPath}
                fill="none"
                stroke={isActive || isPreview ? '#E8C97A' : '#9dc0e8'}
                strokeWidth={isActive || isPreview ? 2.4 : 1.6}
                strokeDasharray="6 7"
                strokeLinecap="round"
              />
              {!selected && (
                <path
                  d={r.cueBallPath}
                  fill="none"
                  stroke={isPreview ? '#ffffff' : '#7fa6d6'}
                  strokeWidth="1.4"
                  strokeDasharray="3 6"
                  strokeLinecap="round"
                  opacity={isPreview ? 0.9 : 0.45}
                />
              )}
              {selected?.id === r.id && (
                <path
                  d={r.cueBallPath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  strokeDasharray="3 6"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              )}
            </g>
          )
        })}

        {/* 下一顆球：A 與 B 的差別靠它才看得懂 */}
        <circle cx={layout.nextBall.x} cy={layout.nextBall.y} r="9" fill="#D9A441" opacity="0.9" />
        <circle cx={layout.nextBall.x - 3} cy={layout.nextBall.y - 3} r="2.6" fill="#fff" opacity="0.5" />

        {/* 目標球 */}
        <g
          className={playing && !reduced ? 'pg-ball-object' : ''}
          style={
            playing && !reduced && selected
              ? ({
                  offsetPath: `path('${selected.objectBallPath}')`,
                  animationDuration: `${selected.objectDuration}ms`,
                  animationDelay: `${selected.collisionAt}ms`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <circle
            cx={playing && !reduced ? 0 : layout.objectBall.x}
            cy={playing && !reduced ? 0 : layout.objectBall.y}
            r="10"
            fill="#EE5B4B"
          />
          <circle
            cx={(playing && !reduced ? 0 : layout.objectBall.x) - 3}
            cy={(playing && !reduced ? 0 : layout.objectBall.y) - 3}
            r="3"
            fill="#fff"
            opacity="0.55"
          />
        </g>

        {/* 母球 */}
        <g
          className={playing && !reduced ? 'pg-ball-cue' : ''}
          style={
            playing && !reduced && selected
              ? ({
                  offsetPath: `path('${selected.cueBallPath}')`,
                  animationDuration: `${selected.cueDuration}ms`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <circle
            cx={playing && !reduced ? 0 : layout.cueBall.x}
            cy={playing && !reduced ? 0 : layout.cueBall.y}
            r="10"
            fill="#FBF9F5"
          />
          <circle
            cx={(playing && !reduced ? 0 : layout.cueBall.x) - 3}
            cy={(playing && !reduced ? 0 : layout.cueBall.y) - 3}
            r="3"
            fill="#fff"
          />
        </g>
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 打法選擇：不是三張功能卡，而是「在球桌上選一條打法」。
 * 桌機滑過即預覽該球路，手機以點擊選擇（不依賴 hover）。
 */
function RouteChooser({
  seen,
  onPreview,
  onPick,
}: {
  seen: string[]
  onPreview: (id: string | null) => void
  onPick: (r: Route) => void
}) {
  return (
    <ul className="space-y-3">
      {routes.map((r, i) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => onPick(r)}
            onMouseEnter={() => onPreview(r.id)}
            onMouseLeave={() => onPreview(null)}
            onFocus={() => onPreview(r.id)}
            onBlur={() => onPreview(null)}
            className="group flex w-full min-h-16 items-center gap-4 rounded-card border border-white/15 bg-white/[0.04] px-4 py-3.5 text-left transition-colors hover:border-brass-300/60 hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-brass-300">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">{r.label}</span>
              <span className="mt-0.5 block text-sm text-white/60">{r.hint}</span>
            </span>
            {/* 已看過的提示：極輕微，不做成任務打勾清單 */}
            {seen.includes(r.id) && (
              <span className="shrink-0 text-xs text-white/40" title="這條你看過了">
                看過
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */

/** 結果：先 Insight，最後才出現 CTA 與「換一種打法看看」 */
const ResultPanel = ({
  route,
  phase,
  onReset,
  showFinale,
}: {
  route: Route
  phase: Phase
  onReset: () => void
  showFinale: boolean
}) => {
  const revealed = phase === 'insight' || phase === 'cta'

  return (
    <div aria-live="polite" className="min-h-[13rem]">
      {phase === 'playing' && (
        <p className="text-sm text-white/45">球正在走⋯⋯</p>
      )}

      {revealed && (
        <div className="pg-reveal">
          <h3 className="text-xl leading-snug font-bold text-white sm:text-2xl">
            {route.resultTitle}
          </h3>
          <p className="mt-3 leading-relaxed text-white/70">{route.resultDescription}</p>
          {route.resultNote && (
            <p className="mt-2 text-sm text-brass-300">{route.resultNote}</p>
          )}
        </div>
      )}

      {phase === 'cta' && (
        <div className="pg-reveal mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href={route.ctaHref} size="lg" className="min-h-11">
            {route.ctaLabel}
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
            </svg>
          </Button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white/75 underline underline-offset-4 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12 5V2L7 6l5 4V7a5 5 0 11-5 5H5a7 7 0 107-7z" />
            </svg>
            {sectionCopy.replay}
          </button>
        </div>
      )}

      {/* 三條都看過之後的品牌收尾：安靜、有重量，不做過關慶祝 */}
      {showFinale && (
        <div className="pg-reveal mt-8 border-t border-white/15 pt-6">
          <p className="text-lg leading-snug font-bold text-white sm:text-xl">{finale.title}</p>
          <p className="mt-2 text-brass-300">{finale.subtitle}</p>
        </div>
      )}
    </div>
  )
}
