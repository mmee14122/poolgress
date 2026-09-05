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
    /* 背景分三層：Hero（最深）→ 互動空間（亮一階）→ 球桌（再亮一階），
       用色階與光線變化區分空間，不用分隔線或波浪切角 */
    <section
      id="table-choice"
      aria-labelledby="table-choice-title"
      /* 導覽列捲到本區上方時一起變成這個底色（見 Navbar 的 data-nav-dark） */
      data-nav-dark="#142c4a"
      className="relative flex scroll-mt-24 items-center overflow-hidden bg-[var(--color-brand-925)] py-16 text-white lg:min-h-[calc(100svh-4rem)] lg:py-24"
    >
      {/* 與 Hero 的柔和交界：頂部 120px 由 Hero 的深藍漸層到本區底色，沒有硬切線 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-950 to-transparent sm:h-32"
      />
      {/* 球館燈光：球桌上方非常淡的一圈亮度，克制、不做 spotlight 特效 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_38%_48%,rgba(120,170,225,0.13),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <h2 id="table-choice-title" className="text-2xl text-brass-300 sm:text-4xl">
            {sectionCopy.title}
          </h2>
          {/* 副標只在選擇前出現，但空間一直保留：
              否則它消失時整個球桌會往上跳一行 */}
          <p
            aria-hidden={phase !== 'choose'}
            className={`mx-auto mt-4 max-w-md leading-relaxed text-white/65 transition-opacity duration-300 ${
              phase === 'choose' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            選一條，看看球會怎麼走
          </p>
        </div>

        <div className="mt-10 lg:grid lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12">
          <PoolTable
            selected={selected}
            preview={preview}
            phase={phase}
            reduced={reduced}
            onPreview={setPreview}
            onPick={play}
          />

          {/* 右欄固定最小高度：選擇區與 Result Panel 內容量不同，
              預留空間才不會在切換時把球桌推上推下 */}
          <div className="mt-8 min-h-[15rem] lg:mt-0 lg:min-h-[19rem]">
            {phase === 'choose' ? (
              <RouteChooser
                seen={seen}
                onPreview={setPreview}
                onPick={play}
              />
            ) : (
              <ResultPanel route={selected!} phase={phase} onReset={reset} />
            )}
          </div>
        </div>

        {/*
          品牌收尾：屬於整段體驗，不屬於 A／B／C 任何一條路線，
          因此獨立於左右雙欄之外、橫跨整個 Section 並置中。
          不放卡片、邊框或 badge——它是體驗結束後的一句話，不是第四個 UI 元件。
          仍維持原本的顯示條件：三條都體驗過才淡入。
        */}
        {/* Closing Zone：空間從一開始就保留（min-height），
            三條都體驗過後只是把文字 reveal 進來——不改變舞台高度。
            用 opacity/visibility 而非條件渲染，避免 layout shift。 */}
        <div
          className="mt-12 flex min-h-[7.5rem] items-center justify-center text-center lg:mt-16 lg:min-h-[9rem]"
          aria-hidden={!showFinale}
        >
          <div
            className={`transition-all duration-500 ${
              showFinale ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
            }`}
          >
            <p className="text-xl leading-snug font-bold text-white sm:text-2xl">{finale.title}</p>
            <p className="mt-3 text-base text-brass-300 sm:text-lg">{finale.subtitle}</p>
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
  onPreview,
  onPick,
}: {
  selected: Route | null
  preview: string | null
  phase: Phase
  reduced: boolean
  onPreview: (id: string | null) => void
  onPick: (r: Route) => void
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
        <rect x="0" y="0" width="400" height="240" rx="16" fill="#153A61" />
        <rect x="12" y="12" width="376" height="216" rx="8" fill="#1E5786" />
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

        {/* 球路本身即可點選：透明粗線提供足夠的點擊範圍（手機也好按），
            旁邊放中性的 A／B／C 標記——不寫任何說明 */}
        {!selected &&
          routes.map((r, i) => (
            <g
              key={`hit-${r.id}`}
              role="button"
              tabIndex={0}
              aria-label={`選擇球路 ${String.fromCharCode(65 + i)}`}
              className="pg-route-hit"
              onClick={() => onPick(r)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onPick(r)
                }
              }}
              onMouseEnter={() => onPreview(r.id)}
              onMouseLeave={() => onPreview(null)}
              onFocus={() => onPreview(r.id)}
              onBlur={() => onPreview(null)}
            >
              <path d={r.objectBallPath} fill="none" stroke="transparent" strokeWidth="26" />
              <path d={r.cueBallPath} fill="none" stroke="transparent" strokeWidth="22" />
              <circle
                cx={r.marker.x}
                cy={r.marker.y}
                r="13"
                fill={preview === r.id ? '#E8C97A' : 'rgba(8,25,44,0.75)'}
                stroke={preview === r.id ? '#E8C97A' : '#9dc0e8'}
                strokeWidth="1.4"
              />
              <text
                x={r.marker.x}
                y={r.marker.y + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill={preview === r.id ? '#0f1e33' : '#dce9f7'}
              >
                {String.fromCharCode(65 + i)}
              </text>
            </g>
          ))}

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
 * 選擇前的右欄：極簡。
 *
 * ⚠️ 這裡刻意只出現中性的 A／B／C——打法名稱、說明、結果與 CTA
 * 全部要等動畫播完才揭曉。提前公布會讓整段互動退化成產品導覽。
 * 視覺重心留給球桌，使用者是憑球路直覺選，不是讀說明做選擇題。
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
    <div className="text-center lg:text-left">
      <p className="text-white/70">選一條你直覺會走的球路</p>
      <ul className="mt-5 flex justify-center gap-3 lg:justify-start">
        {routes.map((r, i) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onPick(r)}
              onMouseEnter={() => onPreview(r.id)}
              onMouseLeave={() => onPreview(null)}
              onFocus={() => onPreview(r.id)}
              onBlur={() => onPreview(null)}
              aria-label={`選擇球路 ${String.fromCharCode(65 + i)}`}
              className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-xl font-bold text-white transition-colors hover:border-brass-300 hover:bg-white/10 hover:text-brass-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-300"
            >
              {String.fromCharCode(65 + i)}
              {/* 已看過：極輕微的一點，不做成任務清單 */}
              {seen.includes(r.id) && (
                <span
                  aria-hidden="true"
                  className="absolute right-3 bottom-2.5 h-1.5 w-1.5 rounded-full bg-brass-300/70"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
      {seen.length > 0 && (
        <p className="mt-4 text-xs text-white/35">
          點過的球路會留下一個小點，你可以把三條都看過。
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

/** 結果：先 Insight，最後才出現 CTA 與「換一種打法看看」 */
const ResultPanel = ({
  route,
  phase,
  onReset,
}: {
  route: Route
  phase: Phase
  onReset: () => void
}) => {
  const revealed = phase === 'insight' || phase === 'cta'

  return (
    <div aria-live="polite" className="min-h-[13rem]">
      {phase === 'playing' && (
        <p className="text-sm text-white/45">球正在走⋯⋯</p>
      )}

      {revealed && (
        <div className="pg-reveal">
          {/* 這一刻才揭曉：使用者剛才選的是哪一種打法 */}
          <p className="text-sm font-semibold tracking-wide text-brass-300">
            {route.id.toUpperCase()}｜{route.label}
          </p>
          <p className="mt-1 text-sm text-white/50">{route.hint}</p>
          <h3 className="mt-4 text-xl leading-snug font-bold text-white sm:text-2xl">
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
            className="pg-btn-shape inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-medium text-white/75 underline underline-offset-4 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12 5V2L7 6l5 4V7a5 5 0 11-5 5H5a7 7 0 107-7z" />
            </svg>
            {sectionCopy.replay}
          </button>
        </div>
      )}

    </div>
  )
}
