import { Fragment, useEffect, useRef, useState } from 'react'
import { finale, hero, palette as P, pillarSections, type Pillar } from './data/premium-demo'
import { Navbar } from './components/Navbar'

/**
 * 首頁定案版：NAV → HERO → 01 場館 → 02 轉場 → 02–04 內容 → FINAL CTA → FOOTER。
 *
 * 進場動畫（2026-08-17 依使用者規格改版）：left-to-right masked reveal。
 * 內容一開始就在最終位置，不飛入、不上浮——用 clip-path: inset(0 100% 0 0)
 * → inset(0 0 0 0) 由左往右「揭開」，僅配極輕的 opacity .85→1 與 translateX -8px→0。
 * 圖片另配極微 scale 1.03→1。easing 用 cubic-bezier(0.25,1,0.5,1)（≈ power4.out）。
 * 文字 0.9s、大標 1.1s、圖片 1.25s；同一區內依閱讀順序 stagger 0.12–0.15s。
 *
 * 觸發：沿用既有 scroll 判定（元素頂緣進入視窗 80% 觸發、單向 once）。
 * 專案無 GSAP/ScrollTrigger，依約不新增 animation library。
 * prefers-reduced-motion：全部直接顯示（revealed 預填）。
 */

const SERIF = "'Noto Serif TC', 'Noto Sans TC', serif"
/** ≈ GSAP power4.out */
const EASE = 'cubic-bezier(0.25, 1, 0.5, 1)'

/** 文字類 reveal：clip 由左而右揭開＋極輕 opacity 與 translateX */
const reveal = (on: boolean, delay: number, dur = 0.9): React.CSSProperties => ({
  clipPath: on ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
  opacity: on ? 1 : 0.85,
  transform: on ? 'translateX(0)' : 'translateX(-8px)',
  transition: `clip-path ${dur}s ${EASE} ${delay}s, opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
  willChange: 'clip-path',
})

/** ≈ GSAP power3.out（Final CTA 中文標題的落定感） */
const EASE3 = 'cubic-bezier(0.33, 1, 0.68, 1)'

/** ≈ GSAP power2.out（02–04 的安靜 fade 用） */
const EASE2 = 'cubic-bezier(0.5, 1, 0.89, 1)'

/** 02–04 文字：極輕的 fade-up（y 20px→0），不是飛入 */
const fadeUp = (on: boolean, delay: number, dur = 0.7, y = 20): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? 'translateY(0)' : `translateY(${y}px)`,
  transition: `opacity ${dur}s ${EASE2} ${delay}s, transform ${dur}s ${EASE2} ${delay}s`,
})

/* 02–04 圖片遮罩的捲動區間：[圖頂在視窗高度比例的起點, 終點] */
const MASK_RANGES: Record<string, [number, number]> = {
  s02: [0.95, 0.62],
  s03: [0.96, 0.64],
  s04: [0.95, 0.62],
}

export default function PremiumDemoApp() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  /* <768px 視為手機：01／02 大標的 reveal 觸發對象改成大標本體（見 lineFor 註解） */
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )
  /* 圖片遮罩揭開進度（0=全遮、1=全開），只作用於 overlay，不作用於圖片 */
  const [maskP, setMaskP] = useState<Record<string, number>>({})
  const refs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const ids = ['hero', 'intro01', 'intro01h', 'trans02', 'trans02h', ...pillarSections.map((s) => s.id), 'finale']
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(new Set(ids))
      setMaskP({ s02: 1, s03: 1, s04: 1 })
      return
    }
    const check = () => {
      /* 觸發線：元素頂緣越過視窗高度的這個比例就觸發（單向鎖存）。
         手機（<768px）：01／02 大標改成以「大標本體」為觸發對象（id 結尾 h），
         線 0.92——之前用外層容器判定，容器頂緣到大標之間隔著 padding＋眉標約 105px，
         0.80 嫌晚、0.97 又讓動畫在畫面外就播完（使用者兩次回饋）。
         看大標自己，大標露出約 8% 視窗高（812 時約 65px）就開始浮現，與視窗高無關。
         02–04 三段文字同理：section 頂緣到文字只隔 40px padding，線提前到 0.87。 */
      const narrow = window.innerWidth < 768
      const lineFor = (id: string) =>
        window.innerHeight *
          (id === 'intro01h' || id === 'trans02h'
            ? 0.85 /* 手機大標：露出約 15% 視窗高（812 時約 120px）才開始，
                      0.92 時使用者一撥就滑過去，動畫在指尖下播完看不到 */
            : id === 'trans02'
              ? 0.85 /* 章節轉場：section 進視窗約 15% 就開始 reveal，不等到畫面中央 */
              : id === 'finale'
                ? 0.92
                : id === 's02' || id === 's03' || id === 's04'
                  ? (narrow ? 0.8 : 0.9) /* 02–04 內容提前淡入；手機要等文字進來約 90px 才動 */
                  : 0.8)
      setRevealed((prev) => {
        let changed = false
        const next = new Set(prev)
        refs.current.forEach((el, id) => {
          if (!next.has(id) && el.getBoundingClientRect().top < lineFor(id)) {
            next.add(id)
            changed = true
          }
        })
        return changed ? next : prev
      })
      /* 圖片遮罩進度：圖頂到達視窗 90% 開始、約 58% 完成（各段微差）。
         值四捨五入到 1%，快速捲動時不會過度重繪；平滑由 CSS transition 負責 */
      setMaskP((prev) => {
        let changed = false
        const next = { ...prev }
        for (const [id, [a, b]] of Object.entries(MASK_RANGES)) {
          const el = refs.current.get(id + '-img')
          if (!el) continue
          const t = el.getBoundingClientRect().top / window.innerHeight
          const p = Math.round(Math.min(1, Math.max(0, (a - t) / (a - b))) * 100) / 100
          if (next[id] !== p) {
            next[id] = p
            changed = true
          }
        }
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

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setNarrow(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const reg = (id: string) => (el: HTMLElement | null) => {
    if (el) refs.current.set(id, el)
  }
  const shown = (id: string) => revealed.has(id)
  const on01 = shown(narrow ? 'intro01h' : 'intro01')
  const onTrans02 = shown(narrow ? 'trans02h' : 'trans02')

  return (
    <main className="pg-home-root" style={{ background: P.bg, color: P.text }}>
      {/* ---------- NAV：與其他頁同一顆 Navbar，首頁走透明玻璃變體（方案 B）。
          深色區塊加 data-nav-dark 讓它切成透明漸層＋白字，其餘落回米白玻璃 ---------- */}
      <Navbar theme="hero" glass />

      {/* ---------- HERO：滿屏，8 秒品牌影片（暫空置） ---------- */}
      <section
        ref={reg('hero')}
        data-nav-dark="#252C30"
        className="relative flex items-end overflow-hidden"
        style={{ background: P.text, color: P.bg, minHeight: 'calc(100svh - var(--pg-peek, 56px))' }}
      >
        {hero.video ? (
          <video
            src={hero.video}
            poster={hero.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : hero.poster ? (
          /* 影片還沒到之前先放靜態主視覺（2026-09-05 使用者提供的場館入口圖）；
             影片一填進 hero.video 就自動改播影片、這張變 poster */
          <img
            src={hero.poster}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${P.textSoft}, ${P.text})` }}
          >
            <div
              className="absolute inset-[4%] rounded-2xl border border-dashed"
              style={{ borderColor: 'rgba(242,238,230,.18)' }}
            />
            <span className="absolute top-20 left-6 text-xs sm:left-10" style={{ color: 'rgba(242,238,230,.45)' }}>
              HERO｜8 秒品牌影片佔位（1600×900 循環播放）
            </span>
          </div>
        )}
        {/* 文字可讀性暗角 */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(37,44,48,.85), transparent 55%)' }}
        />

        <div className="relative w-full px-5 pb-16 sm:px-10 sm:pb-20">
          {/* 宣言：由左至右快速連續 reveal——字與箭頭各自 clip 揭開，
              箭頭先畫出、35ms 後帶出下一個字，整串約 0.5s 一氣呵成。
              文字位置不動（無 translateX），完成後全部靜止。 */}
          <p
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-[0.3em] sm:text-sm"
            style={{ color: P.neutral }}
          >
            {hero.manifesto.map((w, i) => {
              /* 與 CTA 填色同一條 master timeline：整串 0–0.75s 完成 */
              const wordDelay = [0, 0.12, 0.27, 0.45][i]
              const arrowDelay = [0, 0.07, 0.2, 0.38][i]
              const mReveal = (delay: number): React.CSSProperties => ({
                clipPath: shown('hero') ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                opacity: shown('hero') ? 1 : 0,
                transition: `clip-path 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
              })
              return (
                <span key={w} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      style={{ color: 'rgba(242,238,230,.35)', ...mReveal(arrowDelay) }}
                    >
                      →
                    </span>
                  )}
                  <span style={mReveal(wordDelay)}>{w}</span>
                </span>
              )
            })}
          </p>
          {/* 主標：line-mask 包一層，內層由左而右揭開 */}
          <div className="overflow-hidden">
            <h1
              className="mt-5 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl lg:text-7xl"
              style={{ fontFamily: SERIF, color: P.bg, ...reveal(shown('hero'), 0.12, 1.15) }}
            >
              {hero.title}
            </h1>
          </div>
          {/* CTA 本體完全靜態：初始只有邊框＋文字，米杏色 fill 隨 Hero 標題節奏
              由左而右灌入（獨立 fill layer 做 clip-path，按鈕本體零位移）。 */}
          <a
            href={hero.cta.href}
            className="pg-hero-cta relative mt-9 inline-flex min-h-16 items-center justify-center overflow-hidden rounded-full border px-10 text-base font-semibold sm:text-lg"
            style={{ background: 'transparent', borderColor: 'rgba(210,194,173,.85)' }}
          >
            {/* fill layer：左→右填滿，停在實心米杏色 */}
            <span
              aria-hidden="true"
              className="pg-cta-fill pointer-events-none absolute inset-0 z-0 rounded-full"
              style={{
                background: P.neutral,
                clipPath: shown('hero') ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                transition:
                  'clip-path 0.76s cubic-bezier(0.22, 1, 0.36, 1) 0.03s, background-color 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            {/* fill 前緣柔光：同步右移，填滿時消失 */}
            {shown('hero') && (
              <span aria-hidden="true" className="pg-cta-fill-edge pointer-events-none absolute z-[1]" />
            )}
            <span
              className="pg-cta-text relative z-[2]"
              style={{
                color: shown('hero') ? P.text : 'rgba(242,238,230,.92)',
                transition: 'color 0.35s ease 0.33s',
              }}
            >
              {hero.cta.label}
            </span>
          </a>
        </div>
      </section>

      {/* ---------- Hero → 01 Editorial Typography Transition ----------
          Typography first, graphic second：乾淨水平交界，140–220px 呼吸空間，
          先讀到 01 / THE SPACE，再讀到大字標題（逐行 mask reveal），最後才進場館圖。
          撞球軌跡是第二層細節：1.5px、13%、走大字右側負空間，不穿過文字。 */}
      <div ref={reg('intro01')} className="relative">
        {/* 軌跡（桌機）：自 Hero 右下越界，收在標題右側負空間 */}
        <svg
          viewBox="0 0 1440 460"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="pointer-events-none absolute inset-x-0 -top-[220px] hidden h-[460px] w-full sm:block"
          aria-hidden="true"
        >
          <path
            d="M 1345 26 C 1230 130, 1130 220, 1050 292 C 985 350, 930 396, 872 428"
            stroke={P.primary}
            strokeWidth="1.5"
            strokeOpacity="0.13"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={on01 ? 0 : 1}
            style={{ transition: `stroke-dashoffset 1.1s ${EASE} 0.15s` }}
          />
          <circle
            cx="872"
            cy="428"
            r="4"
            fill={P.primary}
            style={{
              opacity: on01 ? 0.3 : 0,
              transform: on01 ? 'none' : 'translate(-22px, -12px)',
              transition: `opacity 0.9s ${EASE} 0.5s, transform 0.9s ${EASE} 0.5s`,
            }}
          />
        </svg>
        {/* 軌跡（手機）：縮短、只保留局部 */}
        <svg
          viewBox="0 0 375 190"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="pointer-events-none absolute inset-x-0 -top-[95px] h-[190px] w-full sm:hidden"
          aria-hidden="true"
        >
          <path
            d="M 344 16 C 312 62, 282 100, 244 132"
            stroke={P.primary}
            strokeWidth="1.2"
            strokeOpacity="0.13"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={on01 ? 0 : 1}
            style={{ transition: `stroke-dashoffset 1s ${EASE} 0.15s` }}
          />
          <circle
            cx="244"
            cy="132"
            r="3"
            fill={P.primary}
            style={{
              opacity: on01 ? 0.3 : 0,
              transform: on01 ? 'none' : 'translate(-12px, -7px)',
              transition: `opacity 0.8s ${EASE} 0.4s, transform 0.8s ${EASE} 0.4s`,
            }}
          />
        </svg>

        {/* Typography：eyebrow 左緣約 10vw，大字兩行不對稱、逐行 mask reveal。
            2026-09-05 使用者調整 optical balance：整組（眉標＋徽章＋大字）視為一個
            composition，用 justify-center 置中後再以「下留白大於上留白」的 padding
            把視覺中心壓到 section 高度 46–48%，下方留白較多，帶眼睛往場館圖走。
            高度改由 .pg-intro01 的 min/max-height 控制（見 styles/index.css）。 */}
        <div className="pg-intro01 flex flex-col justify-center pt-12 pb-14 sm:pt-[70px] sm:pb-[88px]">
          <p
            className="px-5 text-[11px] font-medium tracking-[0.3em] uppercase sm:pr-10 sm:pl-[10vw] sm:text-xs"
            style={{ color: P.accent, ...reveal(on01, 0, 0.9) }}
          >
            01 / THE SPACE
            <span
              className="ml-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.15em] normal-case"
              style={{ background: P.neutral, color: P.text }}
            >
              COMING SOON
            </span>
          </p>
          <h2
            ref={reg('intro01h')}
            className="mt-5 px-5 sm:mt-6 sm:pr-10 sm:pl-[10vw]"
            style={{ fontFamily: SERIF, fontWeight: 500, color: P.text }}
          >
            {pillarSections[0].en.split('. ').map((line, i) => (
              /* 垂直 reveal（2026-08-17 使用者定稿）：line-mask 保留（overflow hidden），
                 內層自下而上浮現——opacity 0→1＋translateY 8px→0（0.52s ease-out），
                 第二行晚 80ms。無 translateX、無水平慣性，完成後完全靜止。 */
              <span
                key={line}
                className="block overflow-hidden"
                style={
                  /* editorial stagger（2026-09-05 使用者定義）：第二行起點＝第一行
                     文字寬度的 30%。"YOUR TABLE." 實測寬 6.858em，故 0.30 × 6.858
                     ≈ 2.05em；用大字自己的 clamp 換算，桌機／手機自動等比縮放。 */
                  i === 1 ? { marginLeft: 'calc(clamp(36px, 7vw, 108px) * 2.05)' } : undefined
                }
              >
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(36px, 7vw, 108px)',
                    lineHeight: 1.05,
                    opacity: on01 ? 1 : 0,
                    transform: on01 ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.52s ${EASE2} ${0.12 + i * 0.08}s, transform 0.52s ${EASE2} ${0.12 + i * 0.08}s`,
                  }}
                >
                  {line.endsWith('.') ? line : line + '.'}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* ---------- 01–04 價值階梯（奶油白底，隨內容高） ---------- */}
      {pillarSections.map((s, i) => (
        <Fragment key={s.id}>
          {s.id === 's02' && <ChapterTransition on={onTrans02} refCb={reg('trans02')} headRefCb={reg('trans02h')} />}
          <PillarBlock
            s={s}
            flip={i % 2 === 1}
            on={shown(s.id)}
            refCb={reg(s.id)}
            imgRefCb={reg(s.id + '-img')}
            maskProgress={maskP[s.id] ?? 0}
            hideHeading={i === 0}
            hideChapterHead={i > 0}
            quick={narrow}
          />
        </Fragment>
      ))}

      {/* ---------- FINAL CTA：三入口 ---------- */}
      <section
        ref={reg('finale')}
        data-nav-dark="#252C30"
        className="px-5 py-14 text-center sm:px-10 lg:py-20"
        style={{ background: P.text, color: P.bg }}
      >
        <p
          className="text-xs font-medium tracking-[0.3em] sm:text-sm"
          style={{ color: P.neutral, ...fadeUp(shown('finale'), 0, 0.46, 10) }}
        >
          {finale.en}
        </p>
        <h2
          className="mt-4 text-3xl font-bold sm:text-5xl"
          style={{
            fontFamily: SERIF,
            color: P.bg,
            opacity: shown('finale') ? 1 : 0,
            transform: shown('finale') ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.6s ${EASE3} 0.1s, transform 0.6s ${EASE3} 0.1s`,
          }}
        >
          {finale.zh}
        </h2>
        {/* 按鈕完全靜態：無任何進場動畫，從頭就鎖在最終位置與樣式 */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {finale.ctas.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              className={`relative inline-flex min-h-16 w-full max-w-xs items-center justify-center rounded-full px-10 text-base font-semibold sm:w-auto ${
                i === 0 ? 'pg-primary-cta' : 'pg-outline-cta'
              }`}
              style={
                i === 0
                  ? { background: P.neutral, color: P.text }
                  : { border: '2px solid rgba(242,238,230,.55)', color: P.bg }
              }
            >
              {/* outline 按鈕限定：進場後邊框光帶繞一圈（第二顆晚 0.15s） */}
              {i > 0 && shown('finale') && (
                <span
                  aria-hidden="true"
                  className="pg-cta-sweep pointer-events-none absolute inset-0 rounded-full"
                  style={i === 2 ? { animationDelay: '0.6s' } : undefined}
                />
              )}
              <span className="pg-cta-text relative z-[1]">{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- FOOTER（佔位；正式版沿用全站 Footer） ---------- */}
      <footer
        className="px-5 pb-10 text-center text-xs sm:px-10"
        style={{ background: P.text, color: 'rgba(242,238,230,.4)' }}
      >
        FOOTER｜正式版沿用全站頁尾
      </footer>
    </main>
  )
}

/** 01–04 段：編號＋英文視覺標＋中文主述＋說明＋大圖，左右交錯；
 *  各元素依閱讀順序 left-to-right mask reveal（stagger 0.13s） */
/**
 * 01 → 02 章節轉場（2026-09-05 使用者規格）。
 *
 * 定位：**不是**第二個 Hero、也不是章節封面，只是一次「翻頁」——
 * 從實體空間 THE SPACE 進入數位體驗 THE APP。因此刻意克制：
 * - 高度 30vh（桌機 33vh），遠低於 01 的滿屏
 * - 大字 clamp(22px, 2.9vw, 44px) ≈ 01（clamp 48/7vw/108px）的 41%（2026-09-05 使用者再縮小）
 * - 第二行只縮排 3vw（01 是 14vw），不做大幅左右錯位
 * - 無 CTA、無內文、無卡片、無圖片
 * - 眉標與大標間距 12/16px（01 是 24px），兩者讀成同一個 block
 * - 對齊既有 content grid（max-w-7xl + px-5/sm:px-10），與下方 App 區同一條左緣
 *
 * 動效：延用 01 的 line-mask + opacity 語言，但更快更輕。
 * 眉標 0s/0.34s → THE GAME 0.06s/0.46s → GOES WITH YOU. 0.14s/0.46s
 * （第二行晚 80ms），整串 0.60s 收完；位移只有 6px，完成後完全靜止。
 */
function ChapterTransition({
  on,
  refCb,
  headRefCb,
}: {
  on: boolean
  refCb: (el: HTMLElement | null) => void
  /** 手機用的觸發對象：大標本體（見 lineFor 註解） */
  headRefCb?: (el: HTMLElement | null) => void
}) {
  const line = (on: boolean, delay: number): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? 'translateY(0)' : 'translateY(6px)',
    transition: `opacity 0.46s ${EASE2} ${delay}s, transform 0.46s ${EASE2} ${delay}s`,
  })
  return (
    <section
      ref={refCb}
      id="s02-transition"
      className="flex items-center px-5 pt-16 pb-8 sm:px-10 lg:pt-20 lg:pb-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p
          className="text-[11px] font-medium tracking-[0.3em] uppercase sm:text-xs"
          style={{
            color: P.accent,
            opacity: on ? 1 : 0,
            transform: on ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity 0.34s ${EASE2}, transform 0.34s ${EASE2}`,
          }}
        >
          02 / THE APP
        </p>
        <h2
          ref={headRefCb}
          className="mt-3 sm:mt-4"
          style={{ fontFamily: SERIF, fontWeight: 500, color: P.text }}
        >
          {['THE GAME', 'GOES WITH YOU.'].map((t, i) => (
            <span
              key={t}
              className="block overflow-hidden"
              style={
                /* 與 01 同一套 editorial stagger：第二行起點＝第一行文字寬度的 30%。
                   "THE GAME" 實測寬 5.494em，0.30 × 5.494 ≈ 1.65em；
                   用大字自己的 clamp 換算，桌機／手機自動等比。 */
                i === 1 ? { marginLeft: 'calc(clamp(26px, 2.9vw, 44px) * 1.65)' } : undefined
              }
            >
              <span
                className="block"
                style={{
                  fontSize: 'clamp(26px, 2.9vw, 44px)',
                  lineHeight: 1.08,
                  ...line(on, 0.06 + i * 0.08),
                }}
              >
                {t}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}

function PillarBlock({
  s,
  flip,
  on,
  refCb,
  imgRefCb,
  maskProgress = 0,
  hideHeading = false,
  hideChapterHead = false,
  quick = false,
}: {
  s: Pillar
  flip: boolean
  on: boolean
  refCb: (el: HTMLElement | null) => void
  imgRefCb?: (el: HTMLElement | null) => void
  /** 圖片遮罩揭開進度 0–1（捲動連動，只動遮罩） */
  maskProgress?: number
  /** 編號＋眉標＋標題已在上方轉場區出現時隱藏（僅 01） */
  hideHeading?: boolean
  /** 隱藏全寬章節頭（編號＋英文句）：02 由上方轉場區承擔，03/04 使用者指定不要 */
  hideChapterHead?: boolean
  /** 手機：縮短時長與接力延遲（使用者回饋「字幕出現的太慢」） */
  quick?: boolean
}) {
  /* 01（標題在轉場區）：滿版橫幅＋玻璃卡。圖先揭開、卡片後進（0.35s） */
  if (hideHeading) {
    return (
      <section
        ref={refCb}
        id={s.id}
        className="relative mt-2 w-full overflow-hidden sm:mt-5"
      >
        {/* 場館願景圖不做特效（2026-08-17 使用者指定）：靜態顯示，只有玻璃卡保留 reveal */}
        <div
          className="pg-venue-banner relative min-h-[400px]"
        >
          {/* 滿版底圖（佔位：灰藍漸層） */}
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}
            >
              <span className="absolute top-4 left-5 text-[11px]" style={{ color: 'rgba(37,44,48,.6)' }}>
                {s.imageHint}（滿版橫幅）
              </span>
            </div>
          )}
          {/* 可讀性漸層：往卡片側加深 */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, transparent 30%, rgba(37,44,48,.35))' }}
          />
          {/* 玻璃卡：桌機置右垂直置中，手機貼底滿寬 */}
          <div
            className="absolute inset-x-4 bottom-5 rounded-2xl p-6 sm:inset-x-auto sm:top-1/2 sm:right-[6%] sm:bottom-auto sm:max-w-xl sm:-translate-y-1/2 sm:p-10"
            style={{
              background: 'rgba(37,44,48,.55)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: P.bg,
              ...fadeUp(on, 0.2, 0.8), /* 玻璃卡改漸層浮出（使用者指定），不再左至右揭開 */
            }}
          >
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.15em]"
              style={{ background: P.neutral, color: P.text }}
            >
              {s.badge}
            </span>
            <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'rgba(242,238,230,.9)' }}>
              {s.body}
            </p>
          </div>
        </div>
      </section>
    )
  }

  /* 依閱讀順序 stagger 0.06s：label → 標題 → 內文 → 圖。
     手機（quick）反而拉長到 0.8s：手機是用撥的，0.45s 在指尖離開前就播完，
     使用者回饋「完全看不到動畫」；拉長讓 ease-out 的尾巴在畫面停下後還看得到。 */
  const st = 0.06
  const dur = quick ? 0.8 : 0.7
  const d = { no: 0, en: st, zh: st * 2, body: st * 3, img: st * 4 }
  const up = (delay: number) => fadeUp(on, delay, dur)
  return (
    <section ref={refCb} id={s.id} className="scroll-mt-16 px-5 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:pt-10 lg:pb-8">
      {/* 章節頭：編號＋英文句橫跨整個版面。02 由上方 ChapterTransition 承擔，
          03/04 使用者指定不要（只留圖片＋旁邊的字），故僅在未隱藏時輸出 */}
      {!hideHeading && !hideChapterHead && (
        <div className="mx-auto mb-8 max-w-7xl lg:mb-10">
          <span
            className="flex items-center gap-3 text-sm font-bold"
            style={{ color: P.accent, ...up(d.no) }}
          >
            {s.no}
            {s.badge && (
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.15em]"
                style={{ background: P.neutral, color: P.text }}
              >
                {s.badge}
              </span>
            )}
          </span>
          <p
            className="mt-3 text-xs font-semibold tracking-[0.25em] sm:text-sm"
            style={{ color: P.accent, ...up(d.en) }}
          >
            {s.en}
          </p>
        </div>
      )}
      <div
        className={`pg-feature-row mx-auto flex max-w-7xl flex-col gap-8 lg:items-center lg:gap-14 ${
          flip ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        {/* 文字欄。桌機上整欄再往上抬 22px——與圖片同組閱讀時，
            文字視覺中心落在圖高的 42–48%（1440 實測 45.0%），略高於數學置中。 */}
        <div className="lg:w-[38%] lg:-translate-y-[22px]">
          {/* 敘事標記：01 / PLAY → 02 / PROGRESS → 03 / TOGETHER。
              與「02 / THE APP」同一套 uppercase＋字距語言，但更小（10px／0.28em）。 */}
          {s.eyebrow && (
            <p
              className="mb-4 text-[10px] font-medium tracking-[0.28em] uppercase"
              style={{ color: P.accent, ...up(d.no) }}
            >
              {s.eyebrow}
            </p>
          )}
          {!hideHeading && (
            <div className="overflow-hidden">
              <h2
                className="text-[clamp(24px,6.6vw,32px)] leading-snug font-bold sm:text-5xl"
                style={{ fontFamily: SERIF, color: P.text, ...up(d.zh) }}
              >
                {s.zh}
              </h2>
            </div>
          )}
          <p
            className="mt-4 max-w-md text-base leading-relaxed sm:mt-5"
            style={{ color: 'rgba(37,44,48,.78)', ...up(d.body) }}
          >
            {s.body}
          </p>
        </div>
        {/* 大圖：本體全程靜態（無 opacity/transform 動畫）。
            揭開由上層遮罩負責：底色遮罩隨捲動往下移出，底部 25% 羽化。 */}
        <div
          ref={imgRefCb}
          className="relative overflow-hidden rounded-2xl lg:w-[62%]"
          style={{ aspectRatio: '16/9' }}
        >
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}
            >
              <div
                className="absolute inset-[5%] rounded-xl border border-dashed"
                style={{ borderColor: 'rgba(37,44,48,.25)' }}
              />
              <span className="absolute top-3 left-4 text-[11px]" style={{ color: 'rgba(37,44,48,.6)' }}>
                {s.imageHint}
              </span>
            </div>
          )}
          {/* 薄紗遮罩：半透明底色 tint（上稍清、下稍霧），隨捲動整層溶解。
              圖片從一開始就看得到，只是柔霧；不做 translateY 移板。 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(242,238,230,0.38) 0%, rgba(242,238,230,0.48) 55%, rgba(242,238,230,0.55) 100%)',
              opacity: 1 - maskProgress,
              transition: 'opacity 0.18s linear',
            }}
          />
        </div>
      </div>
    </section>
  )
}
