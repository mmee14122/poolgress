import { useEffect, useRef, useState } from 'react'
import { finale, hero, palette as P, pillarSections, type Pillar, appChapter } from './data/premium-demo'
import { site } from './data/site'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ProgressPoint } from './components/ProgressPoint'

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

/* 襯線字體與 easing 全部讀 styles/tokens.css；這裡只留 transition 字串用的 easing 名 */
/** ≈ GSAP power4.out */
const EASE = 'var(--pg-ease-out-4)'

/** 文字類 reveal：clip 由左而右揭開＋極輕 opacity 與 translateX */
const reveal = (on: boolean, delay: number, dur = 0.9): React.CSSProperties => ({
  clipPath: on ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
  opacity: on ? 1 : 0.85,
  transform: on ? 'translateX(0)' : 'translateX(-8px)',
  transition: `clip-path ${dur}s ${EASE} ${delay}s, opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
  willChange: 'clip-path',
})

/** ≈ GSAP power3.out（Final CTA 中文標題的落定感） */
const EASE3 = 'var(--pg-ease-out-3)'

/** ≈ GSAP power2.out（02–04 的安靜 fade 用） */
const EASE2 = 'var(--pg-ease-out-2)'

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
                  : id === 'intro01'
                    ? 0.9 /* 桌機 01：peek 露出的 intro 頂端在 844，滑鼠一往下（約 30px）就觸發 */
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
        className="pg-hero relative flex items-end overflow-hidden"
        style={{ background: P.text, color: P.bg }}
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
          <picture>
            {/* 手機可換獨立直式圖；沒有就沿用桌機圖＋ .pg-hero-img 的手機 object-position */}
            <source media="(max-width: 767px)" srcSet={hero.posterMobile ?? hero.poster} />
            <img
              src={hero.poster}
              alt=""
              fetchPriority="high"
              className="pg-hero-img absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        ) : (
          <div className="pg-hero-placeholder absolute inset-0">
            <div
              className="absolute inset-[4%] rounded-2xl border border-dashed"
              style={{ borderColor: 'rgba(var(--pg-ivory-rgb),.18)' }}
            />
            <span className="absolute top-20 left-6 text-xs sm:left-10" style={{ color: 'rgba(var(--pg-ivory-rgb),.45)' }}>
              HERO｜8 秒品牌影片佔位（1600×900 循環播放）
            </span>
          </div>
        )}
        {/* 文字可讀性暗角 */}
        <div className="pg-hero-vignette absolute inset-0" />
        {/* 兩層獨立 scrim（2026-09-05 使用者規格，桌機 ≥768 才有；手機維持原設計）。
            位於底圖之上、所有文字與 fixed Navbar 之下（文字容器是 relative，
            Navbar 是 fixed z-40）。只用 Charcoal 的透明漸層，不動圖片亮度。 */}
        {/* 1) Top Navbar scrim：頂部 150px 垂直漸層，讓透明 Navbar 的 Logo／導覽在亮部仍可讀，
              Navbar 本身仍是透明的、不形成矩形底 */}
        <div
          aria-hidden="true"
          className="pg-hero-scrim-top pointer-events-none absolute inset-x-0 top-0 hidden md:block"
        />
        {/* 2) Hero copy scrim：左側水平漸層，只墊在文案後方，68% 之後完全透明，右側場館維持原亮度 */}
        <div
          aria-hidden="true"
          className="pg-hero-scrim-copy pointer-events-none absolute inset-0 hidden md:block"
        />

        <div className="site-container pg-hero-copy relative">
          {/* 宣言：由左至右快速連續 reveal——字與箭頭各自 clip 揭開，
              箭頭先畫出、35ms 後帶出下一個字，整串約 0.5s 一氣呵成。
              文字位置不動（無 translateX），完成後全部靜止。 */}
          <p
            className="pg-t-manifesto flex flex-wrap items-center gap-x-3 gap-y-1"
            style={{ color: P.neutral }}
          >
            {hero.manifesto.map((w, i) => {
              /* 與 CTA 填色同一條 master timeline：整串 0–0.75s 完成 */
              const wordDelay = [0, 0.12, 0.27, 0.45][i]
              const arrowDelay = [0, 0.07, 0.2, 0.38][i]
              const mReveal = (delay: number): React.CSSProperties => ({
                clipPath: shown('hero') ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                opacity: shown('hero') ? 1 : 0,
                transition: `clip-path 0.3s var(--pg-ease-spring) ${delay}s, opacity 0.3s var(--pg-ease-spring) ${delay}s`,
              })
              return (
                <span key={w} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="pg-manifesto-sep"
                      style={{ color: 'rgba(var(--pg-ivory-rgb),.35)', ...mReveal(arrowDelay) }}
                    >
                      {/* 桌機箭頭；手機改用「·」（2026-09-06 降低 magazine 感） */}
                      <span className="hidden md:inline">→</span>
                      <span className="md:hidden">·</span>
                    </span>
                  )}
                  <span style={mReveal(wordDelay)}>{w}</span>
                </span>
              )
            })}
          </p>
          {/* 主標：line-mask 包一層，內層由左而右揭開（2026-09-05 使用者改回中文大字，
              英文與副標刪除；固定斷行「讓撞球成為／一家人的共同記憶」） */}
          <div className="overflow-hidden">
            <h1
              className="pg-t-h1 mt-5 max-w-3xl"
              style={{ color: P.bg, ...reveal(shown('hero'), 0.12, 1.15) }}
            >
              {hero.titleLines[0]}
              <br />
              {hero.titleLines[1]}
            </h1>
          </div>
          {/* Hero Booking CTA（2026-09-06，參考 pool.house「Book a Table」）：磨砂玻璃 pill＋右側 Sand 圓形箭頭；
              hover 時 Sand 圓從右往左長開填滿整顆（CSS @property 補間 --pg-book-fill，不用 JS）。
              進場與眉標／主標同一套 reveal()。 */}
          <a
            href={hero.cta.href}
            className="pg-hero-cta pg-cta-book"
            style={reveal(shown('hero'), 0.26, 0.9)}
          >
            <span aria-hidden="true" className="pg-cta-book__fill" />
            <span className="pg-cta-text">{hero.cta.label}</span>
            <span aria-hidden="true" className="pg-cta-book__icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* ---------- Hero → 01 Editorial Typography Transition ----------
          Typography first, graphic second：乾淨水平交界，140–220px 呼吸空間，
          先讀到 01 / THE SPACE，再讀到大字標題（逐行 mask reveal），最後才進場館圖。
          撞球軌跡是第二層細節：1.5px、13%、走大字右側負空間，不穿過文字。 */}
      {/* id 給 Hero 的「探索 Poolgress」跳轉用：落在 01 章節開場（眉標＋大標），
          不是直接跳到照片。錨點偏移由 html 的 scroll-padding-top 統一處理
          （首頁用 :has(.pg-home-root) 覆寫成 4rem＝fixed Navbar 高，見 index.css），
          這裡不再加 scroll-mt，否則兩者相加會多出 96px。 */}
      <div ref={reg('intro01')} id="the-space" className="relative">
        {/* Typography：eyebrow 左緣約 10vw，大字兩行不對稱、逐行 mask reveal。
            2026-09-05 使用者調整 optical balance：整組（眉標＋徽章＋大字）視為一個
            composition，用 justify-center 置中後再以「下留白大於上留白」的 padding
            把視覺中心壓到 section 高度 46–48%，下方留白較多，帶眼睛往場館圖走。
            高度改由 .pg-intro01 的 min/max-height 控制（見 styles/index.css）。 */}
        <div className="site-container pg-intro01 flex flex-col justify-center">
          {/* 眉標列＝chapter heading system：01 / THE SPACE ─ ● COMING SOON。
              動線由左而右：文字 reveal → Progress Point 由左滑入 → 外圈淡入 → 徽章 reveal，
              之後才輪到大標兩行（見下方 delay）。 */}
          <p
            className="pg-t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span style={reveal(on01, 0, 0.9)}>01 / THE SPACE</span>
            <ProgressPoint on={on01} delay={0.35} />
            <span
              className="pg-t-badge rounded-full px-3 py-1 normal-case"
              style={reveal(on01, 0.45, 0.6)}
            >
              COMING SOON
            </span>
          </p>
          <h2
            ref={reg('intro01h')}
            className="pg-t-serif-editorial mt-5 sm:mt-6"
          >
            {pillarSections[0].en.split('. ').map((line, i) => (
              /* 垂直 reveal（2026-08-17 使用者定稿）：line-mask 保留（overflow hidden），
                 內層自下而上浮現——opacity 0→1＋translateY 8px→0（0.52s ease-out），
                 第二行晚 100ms；整體延到眉標列（文字→Progress Point→徽章）之後 0.95s 起。 */
              <span
                key={line}
                className="block overflow-hidden"
                style={
                  /* editorial stagger（2026-09-05 使用者定義）：第二行起點＝第一行
                     文字寬度的 30%。"YOUR TABLE." 實測寬 6.858em，故 0.30 × 6.858
                     ≈ 2.05em；用大字自己的 clamp 換算，桌機／手機自動等比縮放。 */
                  i === 1 ? { marginLeft: 'calc(var(--pg-fs-display) * var(--pg-display-stagger))' } : undefined
                }
              >
                <span
                  className="pg-t-display block"
                  style={{
                    opacity: on01 ? 1 : 0,
                    transform: on01 ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.52s ${EASE2} ${0.3 + i * 0.1}s, transform 0.52s ${EASE2} ${0.3 + i * 0.1}s`,
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
      {/* 01 THE SPACE：暖米白世界（main 的 Background 底） */}
      <PillarBlock
        s={pillarSections[0]}
        flip={false}
        on={shown(pillarSections[0].id)}
        refCb={reg(pillarSections[0].id)}
        imgRefCb={reg(pillarSections[0].id + '-img')}
        maskProgress={maskP[pillarSections[0].id] ?? 0}
        hideHeading
        quick={narrow}
      />

      {/* 02 THE APP：從章節開場到 04 結束共享同一個極淡灰藍底
          （Secondary 22% × Background，見 .pg-app-world），用顏色說
          「實體空間（暖）→ 數位體驗（冷）」；眉標仍 Walnut、大標仍 Charcoal */}
      <div className="pg-app-world">
        <ChapterTransition on={onTrans02} refCb={reg('trans02')} headRefCb={reg('trans02h')} />
        {pillarSections.slice(1).map((s, i) => (
          <PillarBlock
            key={s.id}
            s={s}
            flip={i % 2 === 0}
            on={shown(s.id)}
            refCb={reg(s.id)}
            imgRefCb={reg(s.id + '-img')}
            maskProgress={maskP[s.id] ?? 0}
            hideChapterHead
            quick={narrow}
          />
        ))}
      </div>

      {/* ---------- FINAL CTA：三入口 ---------- */}
      <section
        ref={reg('finale')}
        className="pg-finale text-center"
        style={{ background: P.bg, color: P.text }}
      >
        <div className="site-container">
        <p
          className="pg-t-manifesto"
          style={{ color: P.accent, ...fadeUp(shown('finale'), 0, 0.46, 10) }}
        >
          {finale.en}
        </p>
        <h2
          className="pg-t-finale-h2 mt-4"
          style={{
            color: P.text,
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
              className={`pg-t-cta relative inline-flex w-full max-w-xs items-center justify-center sm:w-auto ${
                i === 0 ? 'pg-primary-cta' : 'pg-outline-cta'
              }`}
              style={
                i === 0
                  ? { background: P.neutral, color: P.text }
                  : { border: '1px solid var(--button-outline-on-light)', color: P.text }
              }
            >
              {/* outline 按鈕限定：進場後邊框光帶繞一圈（第二顆晚 0.15s） */}
              {i > 0 && shown('finale') && (
                <span
                  aria-hidden="true"
                  className="pg-cta-sweep pg-btn-shape pointer-events-none absolute inset-0"
                  style={i === 2 ? { animationDelay: '0.6s' } : undefined}
                />
              )}
              <span className="pg-cta-text relative z-[1]">{c.label}</span>
            </a>
          ))}
        </div>
        </div>
      </section>

      {/* ---------- FOOTER：沿用全站 Footer（桌機與手機皆同）。
          charcoal 主題：與上方頁尾 CTA「你想怎麼玩？」同一個 #252C30 底（使用者 2026-09-05 指定），
          兩段連成一片深底收尾；分隔靠 Ivory 10% 的上邊線 ---------- */}
      <Footer theme="charcoal" />
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
      className="pg-app-intro site-container"
    >
      {/* 2026-09-06 v2：兩欄 editorial composition——左：眉標／大標／體驗文案；右（≥768）：QR 下載單元；
          手機（<768）：單欄，QR 不顯示，改「下載 Poolgress App」Functional CTA。 */}
      <div className="pg-app-intro__grid">
        <div className="pg-app-intro__copy">
          <p
            className="pg-t-eyebrow"
            style={{
              opacity: on ? 1 : 0,
              transform: on ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.34s ${EASE2}, transform 0.34s ${EASE2}`,
            }}
          >
            {appChapter.eyebrow}
          </p>
          <h2
            ref={headRefCb}
            className="pg-t-serif-editorial mt-3 sm:mt-4"
          >
            {appChapter.titleLines.map((t, i) => (
              <span
                key={t}
                className="block overflow-hidden"
                style={
                  /* 與 01 同一套 editorial stagger：第二行起點＝第一行文字寬度的 30%。
                     "THE GAME" 實測寬 5.494em，0.30 × 5.494 ≈ 1.65em；
                     用大字自己的 clamp 換算，桌機／手機自動等比。 */
                  i === 1 ? { marginLeft: 'calc(var(--pg-fs-chapter) * var(--pg-chapter-stagger))' } : undefined
                }
              >
                <span
                  className="pg-t-chapter block"
                  style={{
                    ...line(on, 0.06 + i * 0.08),
                  }}
                >
                  {t}
                </span>
              </span>
            ))}
          </h2>
          {/* 文案列：說明文字與 QR 單元並排——QR 上緣對齊文字第一行、「下載 Poolgress App」底緣對齊最後一行
              （2026-09-06 使用者手繪版面）。手機：QR 隱藏、改下載 CTA。 */}
          <div className="pg-app-intro__row">
            <p className="pg-t-body pg-app-intro__desc whitespace-pre-line" style={line(on, 0.26)}>
              {appChapter.body}
            </p>
            <div className="pg-qr-unit hidden md:flex" style={line(on, 0.3)}>
              <div className="pg-qr-unit__code">
                {site.appDownload.qrCode ? (
                  <img src={site.appDownload.qrCode} alt="下載 Poolgress App 的 QR code" />
                ) : (
                  <svg viewBox="0 0 24 24" aria-label="QR code 待補" className="h-7 w-7 fill-current opacity-40">
                    <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zm-2 8h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm2 2h2v2h-2zm2 0h2v2h-2z" />
                  </svg>
                )}
              </div>
              <p className="pg-qr-unit__label">{appChapter.cta.label}</p>
            </div>
          </div>
          {/* 手機專用下載 CTA */}
          <a
            href={appChapter.cta.href}
            className="pg-t-cta pg-primary-cta pg-app-intro__cta inline-flex items-center justify-center md:hidden"
            style={{ background: P.neutral, color: P.text, ...line(on, 0.34) }}
          >
            {appChapter.cta.label}
          </a>
        </div>
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
        className="site-container site-container--bleed-sm pg-venue-section relative overflow-hidden"
      >
        {/* 場館願景圖不做特效（2026-08-17 使用者指定）：靜態顯示，只有玻璃卡保留 reveal */}
        <div
          className="pg-venue-banner relative isolate"
        >
          {/* 滿版底圖（佔位：灰藍漸層） */}
          {s.image ? (
            <picture>
              {/* 手機可換獨立直式圖（imageMobile）；沒有就沿用桌機圖＋ .pg-venue-img 的手機 object-position */}
              <source media="(max-width: 767px)" srcSet={s.imageMobile ?? s.image} />
              <img
                src={s.image}
                alt={s.zh}
                className="pg-venue-img absolute inset-0 h-full w-full object-cover"
              />
            </picture>
          ) : (
            <div className="pg-media-placeholder absolute inset-0">
              <span className="absolute top-4 left-5 text-[11px]" style={{ color: 'rgba(var(--pg-charcoal-rgb),.6)' }}>
                {s.imageHint}（滿版橫幅）
              </span>
            </div>
          )}
          {/* FUTURE SPACE teaser v2（2026-09-05 使用者規格，cinematic editorial）：這不是已落成的場館，
              是概念視覺。全圖 Charcoal veil 約 28%，另在左側文字區加 localized gradient（最深 60% → 中央 0，
              佔寬約 55%），文字從場景浮現、無框／無卡／無陰影。內容：COMING SOON pill／POOLGRESS SPACE（主視覺）／
              短 rule／一句中文／TAIWAN · 2026。桌機：左側垂直置中；手機：4:5 直式、文字組 74vw、人物在右。 */}
          {/* 中央水平霧化帶（2026-09-06 v6 Coming Soon）：backdrop blur 8px＋mask 上下漸隱＋極輕深色 overlay；
              上下照片維持清晰，沒有 card／框／陰影。進場：跟著 on 緩慢淡入（1.2s）。 */}
          {/* v7 soft focus（2026-09-06）：兩層滿版、用橢圓 mask 定形——外層 blur 2px＋極淡橢圓 veil、
              長 feather；內層 blur 3px 只集中在 POOLGRESS CLUB 核心區。沒有任何矩形邊界。 */}
          <div
            aria-hidden="true"
            className="pg-venue-soft pointer-events-none absolute inset-0"
            style={{ opacity: on ? 1 : 0, transition: `opacity 1.4s ${EASE2} 0.1s` }}
          />
          <div
            aria-hidden="true"
            className="pg-venue-soft pg-venue-soft--core pointer-events-none absolute inset-0"
            style={{ opacity: on ? 1 : 0, transition: `opacity 1.4s ${EASE2} 0.2s` }}
          />
          {s.teaser && (
          <div
            className="pg-venue-teaser absolute"
            style={{
              opacity: on ? 1 : 0,
              transform: on ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.8s ${EASE2} 0.2s, transform 0.8s ${EASE2} 0.2s`,
            }}
          >
            <p>
              <span className="pg-venue-teaser__pill inline-flex items-center rounded-full">{s.teaser.eyebrow}</span>
            </p>
            <h3 className="pg-venue-teaser__title">
              {s.teaser.titleLines[0]}
              <br />
              {s.teaser.titleLines[1]}
            </h3>
            <p className="pg-venue-teaser__zh">{s.teaser.zh}</p>
            <p className="pg-venue-teaser__meta">{s.teaser.meta}</p>
          </div>
          )}
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
    <section ref={refCb} id={s.id} className="site-container pg-feature scroll-mt-16">
      {/* 章節頭：編號＋英文句橫跨整個版面。02 由上方 ChapterTransition 承擔，
          03/04 使用者指定不要（只留圖片＋旁邊的字），故僅在未隱藏時輸出 */}
      {!hideHeading && !hideChapterHead && (
        <div className="mb-8 lg:mb-10">
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
        className={`pg-feature-row flex flex-col lg:items-center ${
          flip ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        {/* 文字欄：手機依 DOM 自然順序 標籤 → 標題 → 內文 → 圖（2026-09-06 editorial storytelling order，
            不再用 flex-col-reverse 反轉）；桌機 lg:flex-row／row-reverse 左右交錯不受影響。
            桌機上整欄再往上抬 22px——與圖片同組閱讀時，
            文字視覺中心落在圖高的 42–48%（1440 實測 45.0%），略高於數學置中。 */}
        <div className="pg-feature-text">
          {/* 敘事標記：01 / PLAY → 02 / PROGRESS → 03 / TOGETHER。
              與「02 / THE APP」同一套 uppercase＋字距語言，但更小（10px／0.28em）。 */}
          {s.eyebrow && (
            <p
              className="pg-t-eyebrow-feature mb-4"
              style={up(d.no)}
            >
              {s.eyebrow}
            </p>
          )}
          {!hideHeading && (
            <div className="overflow-hidden">
              <h2
                className="pg-t-feature-h2"
                style={up(d.zh)}
              >
                {s.zh}
              </h2>
            </div>
          )}
          <p
            className="pg-t-body mt-4 max-w-md whitespace-pre-line sm:mt-5"
            style={up(d.body)}
          >
            {s.body}
          </p>
        </div>
        {/* 大圖：本體全程靜態（無 opacity/transform 動畫）。
            揭開由上層遮罩負責：底色遮罩隨捲動往下移出，底部 25% 羽化。 */}
        <div
          ref={imgRefCb}
          className="pg-feature-media relative overflow-hidden"
        >
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="pg-media-placeholder absolute inset-0">
              <div
                className="absolute inset-[5%] rounded-xl border border-dashed"
                style={{ borderColor: 'rgba(var(--pg-charcoal-rgb),.25)' }}
              />
              <span className="absolute top-3 left-4 text-[11px]" style={{ color: 'rgba(var(--pg-charcoal-rgb),.6)' }}>
                {s.imageHint}
              </span>
            </div>
          )}
          {/* 薄紗遮罩：半透明底色 tint（上稍清、下稍霧），隨捲動整層溶解。
              圖片從一開始就看得到，只是柔霧；不做 translateY 移板。 */}
          <div
            aria-hidden="true"
            className="pg-feature-mask pointer-events-none absolute inset-0 z-[2]"
            style={{ opacity: 1 - maskProgress }}
          />
        </div>
      </div>
    </section>
  )
}
