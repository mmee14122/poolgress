import { useEffect, useRef, useState } from 'react'
import { SEG, STORY_VH, copy } from './data/motion-demo'

/**
 * 首頁捲動動畫演示：S05（出竿）→ S06（白球遮罩轉場）→ S07（第二位玩家加入）。
 *
 * 進度來源：純 scroll 事件（不套 rAF——rAF 在分頁不可見時不執行，
 * 會讓判定停在舊值且無法自動驗證；瀏覽器本來就把 scroll 對齊到每幀最多一次）。
 * 只寫 transform / opacity，不觸發版面重算。
 *
 * 捲動接管：只有 whiteout 白幕帶（見 SEG.whiteout）。
 * 進入白幕的瞬間自動把這一小段滑完，避免使用者停在全白畫面以為網站壞了。
 * 限桌機（pointer: fine）、只在往下滑時觸發、滾輪／觸控／按鍵隨時可中斷、
 * 開啟「減少動態效果」時完全不接管。
 *
 * prefers-reduced-motion：整頁退成靜態的分鏡說明（無 sticky、無動畫）。
 */

type Range = readonly [number, number]
/** 線性分段進度：p 在 [a,b] 內映射為 0–1 */
const seg = (p: number, [a, b]: Range) => Math.min(1, Math.max(0, (p - a) / (b - a)))
/** ease-out（收尾減速） */
const eo = (t: number) => 1 - (1 - t) * (1 - t)

/** HUD 用：目前落在哪一段（回饋時請引用 p 值） */
function segmentName(p: number): string {
  if (p < SEG.strike[1]) return 'S05 出竿'
  if (p < SEG.whiteout[0]) return 'S06 白球接近'
  if (p < SEG.whiteout[1]) return 'S06 白幕（接管帶）'
  if (p < SEG.reveal[1]) return 'S07 揭曉球桌'
  if (p < SEG.handoff[0]) return 'S07 玩家加入'
  return '交棒 S08'
}

export default function MotionDemoApp() {
  const storyRef = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const [reduced, setReduced] = useState(false)
  /* 接管狀態：armed＝允許下一次觸發；active＝正在自動滑動 */
  const take = useRef({ armed: true, active: false, raf: 0, lastP: 0 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }
    const finePointer = window.matchMedia('(pointer: fine)').matches

    const progressOf = () => {
      const el = storyRef.current
      if (!el) return 0
      const total = el.offsetHeight - window.innerHeight
      const y = window.scrollY - (el.offsetTop || 0)
      return total > 0 ? Math.min(1, Math.max(0, y / total)) : 0
    }

    const cancelTakeover = () => {
      if (take.current.active) {
        cancelAnimationFrame(take.current.raf)
        take.current.active = false
      }
    }

    /* 白幕帶接管：從目前位置自動滑到 whiteout 終點（約 0.38 秒，ease-out）。
       執行中使用者一有輸入立即中斷、交還控制權。 */
    const startTakeover = () => {
      const el = storyRef.current
      if (!el) return
      const total = el.offsetHeight - window.innerHeight
      const from = window.scrollY
      const to = el.offsetTop + SEG.whiteout[1] * total
      if (to <= from) return
      take.current.active = true
      take.current.armed = false
      const t0 = performance.now()
      const DUR = 380
      const step = (now: number) => {
        if (!take.current.active) return
        const t = Math.min(1, (now - t0) / DUR)
        window.scrollTo(0, from + (to - from) * eo(t))
        if (t < 1) take.current.raf = requestAnimationFrame(step)
        else take.current.active = false
      }
      take.current.raf = requestAnimationFrame(step)
    }

    const onScroll = () => {
      const next = progressOf()
      const prev = take.current.lastP
      take.current.lastP = next
      setP(next)
      if (take.current.active) return // 自動滑動期間的 scroll 事件是自己觸發的
      const [w0, w1] = SEG.whiteout
      if (
        take.current.armed &&
        finePointer &&
        next > prev && // 只在往下滑時
        prev < w0 &&
        next >= w0 &&
        next < w1 // 一口氣滑過整段就不用接管
      ) {
        startTakeover()
      }
      if (next < w0 - 0.05) take.current.armed = true // 倒回去後重新武裝
    }
    const onCancel = () => cancelTakeover()

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('wheel', onCancel, { passive: true })
    window.addEventListener('touchstart', onCancel, { passive: true })
    window.addEventListener('keydown', onCancel)
    return () => {
      cancelTakeover()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('wheel', onCancel)
      window.removeEventListener('touchstart', onCancel)
      window.removeEventListener('keydown', onCancel)
    }
  }, [])

  if (reduced) return <StaticDemo />

  /* ---------- 由 p 推導各元素的樣式（只有 transform / opacity） ---------- */

  /* S05 球桿：後拉（前半）→ 出桿（後半，快） */
  const st = seg(p, SEG.strike)
  const cueDx = st < 0.5 ? -8 * eo(st / 0.5) : -8 + 20 * eo((st - 0.5) / 0.5)
  const cueOpacity = 1 - seg(p, [SEG.strike[1], SEG.approach[0] + 0.06])

  /* S06a 母球接近：t² 放大（越近越快），並向畫面中央漂移 */
  const ap = seg(p, SEG.approach)
  const ballScale = 0.35 + 15.65 * ap * ap
  const ballX = 58 - 8 * ap
  const ballY = 62 - 12 * ap

  /* S06a 目標球進袋（左後方） */
  const pk = seg(p, SEG.pocket)
  const pkX = 30 - 18 * eo(pk)
  const pkY = 40 - 22 * eo(pk)
  const pkOpacity = pk < 0.85 ? 1 : 1 - (pk - 0.85) / 0.15

  /* S06b 白幕 */
  const whiteOpacity = p >= SEG.reveal[0] ? 0 : seg(p, [SEG.whiteout[0], SEG.whiteout[0] + 0.03])

  /* S07a 白圓縮回成球桌上的白球（縮到 1 倍後它就是那顆母球） */
  const rv = seg(p, SEG.reveal)
  const revealScale = 60 - 59 * eo(rv)
  const tableOpacity = seg(p, [SEG.reveal[0] + 0.02, SEG.reveal[1]])

  /* S07b–d 玩家加入 */
  const pb = seg(p, SEG.playerB)
  const lk = seg(p, SEG.link)
  const pg = seg(p, SEG.progress)

  /* 交棒：整個舞台淡出 */
  const stageOpacity = 1 - 0.92 * seg(p, SEG.handoff)

  const showS05 = p < SEG.whiteout[1]
  const showS07 = p >= SEG.reveal[0]

  return (
    <main className="bg-brand-950 text-white">
      {/* ---------- 開場說明（靜態，模擬從 S04 滑下來） ---------- */}
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-logo text-2xl font-semibold sm:text-4xl">{copy.intro.title}</h1>
        <div className="max-w-xl space-y-2 text-sm leading-relaxed text-white/70 sm:text-base">
          {copy.intro.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <p className="mt-6 animate-bounce text-sm text-brass-300">{copy.intro.hint} ↓</p>
      </section>

      {/* ---------- 故事本體：sticky 舞台＋捲動距離 ---------- */}
      <div ref={storyRef} style={{ height: `${STORY_VH}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden" style={{ opacity: stageOpacity }}>
          {/* 背景：球館深藍（S05）→ 揭曉後仍沿用，維持同一個世界 */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950 via-brand-925 to-brand-950" />

          {/* ===== S05｜出竿（影片佔位） ===== */}
          {showS05 && (
            <div className="absolute inset-0">
              {/* 影片佔位框 */}
              <div
                className="absolute inset-[8%] rounded-2xl border-2 border-dashed border-white/25"
                style={{ opacity: 1 - seg(p, [SEG.approach[0], SEG.approach[0] + 0.12]) }}
              >
                <span className="absolute top-3 left-4 text-xs text-white/60 sm:text-sm">
                  {copy.s05Label}
                </span>
              </div>

              {/* 目標球：滾向左上袋口 */}
              <div
                className="absolute h-[4.5vmin] w-[4.5vmin] rounded-full"
                style={{
                  left: `${pkX}%`,
                  top: `${pkY}%`,
                  opacity: pkOpacity,
                  background: 'radial-gradient(circle at 35% 30%, #e8b45a, #9a6f1f)',
                }}
              />
              {/* 左上袋口 */}
              <div
                className="absolute left-[10%] top-[15%] h-[6vmin] w-[6vmin] rounded-full bg-black/70"
                style={{ opacity: 0.4 + 0.6 * seg(p, SEG.pocket) }}
              />

              {/* 球桿（出竿後淡出） */}
              <div
                className="absolute left-[18%] top-[74%] h-[1.1vmin] w-[46vmin] origin-right rounded-full"
                style={{
                  transform: `rotate(-24deg) translateX(${cueDx}vmin)`,
                  opacity: cueOpacity,
                  background: 'linear-gradient(90deg, #7c5813, #d9a441 70%, #f4f1e9 97%)',
                }}
              />

              {/* 母球：離桿 → 朝鏡頭放大（最後與白幕融合） */}
              <div
                className="absolute h-[22vmin] w-[22vmin] rounded-full"
                style={{
                  left: `${ballX}%`,
                  top: `${ballY}%`,
                  transform: `translate(-50%, -50%) scale(${ballScale})`,
                  background:
                    'radial-gradient(circle at 38% 32%, #ffffff 55%, #dfe5ec 78%, #b9c2cc)',
                }}
              />
            </div>
          )}

          {/* ===== S06b｜白幕（保險層，球體放大到極限後蓋滿） ===== */}
          <div
            className="pointer-events-none absolute inset-0 bg-white"
            style={{ opacity: whiteOpacity }}
          />

          {/* ===== S07｜球桌俯視＋玩家加入 ===== */}
          {showS07 && (
            <div className="absolute inset-0">
              {/* 球桌俯視圖（佔位，之後換設計師的正上方球桌圖層） */}
              <div
                className="absolute left-1/2 top-[54%] aspect-[16/9] w-[min(80vw,140vh)] -translate-x-1/2 -translate-y-1/2"
                style={{ opacity: tableOpacity }}
              >
                <svg viewBox="0 0 800 450" className="h-full w-full">
                  <rect x="0" y="0" width="800" height="450" rx="28" fill="#0c1626" />
                  <rect x="34" y="34" width="732" height="382" rx="10" fill="#2b66b4" />
                  {[
                    [34, 34],
                    [400, 26],
                    [766, 34],
                    [34, 416],
                    [400, 424],
                    [766, 416],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="17" fill="#060c16" />
                  ))}
                  {/* 兩顆目標球 */}
                  <circle cx="560" cy="180" r="13" fill="#d9a441" />
                  <circle cx="620" cy="300" r="13" fill="#c22222" />
                </svg>

                {/* 白圓遮罩縮回成母球：縮到 1 倍後它就是桌上的白球 */}
                <div
                  className="absolute left-[32%] top-[52%] h-[3.2%] w-[1.8%] min-h-[12px] min-w-[12px] rounded-full bg-white"
                  style={{
                    transform: `translate(-50%, -50%) scale(${revealScale})`,
                    boxShadow: rv > 0.9 ? '0 2px 6px rgba(0,0,0,.45)' : 'none',
                  }}
                />

                {/* 玩家 A（原本就在） */}
                <Avatar x={22} y={-14} label="A" active opacity={tableOpacity} />
                {/* 玩家 B（亮起） */}
                <Avatar x={58} y={-14} label="B" active={pb > 0.55} opacity={pb} />

                {/* 兩人連線 */}
                <svg
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="absolute left-[26%] top-[-9%] h-[6%] w-[32%]"
                >
                  <line
                    x1="0"
                    y1="5"
                    x2="100"
                    y2="5"
                    stroke="#e6c478"
                    strokeWidth="2.5"
                    strokeDasharray="100"
                    strokeDashoffset={100 - 100 * eo(lk)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* 關卡進度：單人 → 雙人 */}
              <div
                className="absolute bottom-[10%] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-sm"
                style={{ opacity: tableOpacity }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-brass-300" />
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: pg > 0.5 ? '#e6c478' : 'rgba(255,255,255,.25)' }}
                />
                <span className="text-sm font-medium text-white/85">
                  {pg > 0.5 ? copy.playersTwo : copy.playersOne}
                </span>
              </div>

              {/* 說明字（不搶戲，小字即可） */}
              <p
                className="absolute top-[12%] left-1/2 -translate-x-1/2 text-base font-semibold text-brass-300 sm:text-xl"
                style={{ opacity: pb }}
              >
                {copy.s07Caption}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- S08 停留頁佔位（靜態） ---------- */}
      <section className="flex min-h-screen flex-col items-center justify-center gap-5 bg-brand-925 px-6 text-center">
        <h2 className="max-w-2xl text-2xl leading-snug font-bold sm:text-4xl">{copy.s08.title}</h2>
        <p className="max-w-xl text-base text-white/75 sm:text-lg">{copy.s08.sub}</p>
        <p className="mt-8 max-w-md text-xs text-white/40 sm:text-sm">{copy.s08.note}</p>
      </section>

      {/* ---------- HUD：目前進度（回饋時請引用 p 值） ---------- */}
      <div className="fixed right-3 bottom-3 z-50 rounded-lg bg-black/75 px-3 py-2 font-mono text-xs text-white tabular-nums">
        p={p.toFixed(3)}｜{segmentName(p)}
      </div>
    </main>
  )
}

/** 玩家圖示（佔位）：圓底＋代號 */
function Avatar({
  x,
  y,
  label,
  active,
  opacity,
}: {
  x: number
  y: number
  label: string
  active: boolean
  opacity: number
}) {
  return (
    <div
      className="absolute flex h-[9%] min-h-[34px] w-[5%] min-w-[34px] items-center justify-center rounded-full border-2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        borderColor: active ? '#e6c478' : 'rgba(255,255,255,.3)',
        background: active ? 'rgba(230,196,120,.18)' : 'rgba(255,255,255,.06)',
        transform: `scale(${active ? 1 : 0.85})`,
      }}
    >
      <span
        className="text-xs font-bold"
        style={{ color: active ? '#e6c478' : 'rgba(255,255,255,.5)' }}
      >
        {label}
      </span>
    </div>
  )
}

/** 減少動態效果：退成靜態分鏡說明 */
function StaticDemo() {
  return (
    <main className="bg-brand-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-xl space-y-10">
        <h1 className="font-logo text-2xl font-semibold">{copy.intro.title}</h1>
        <p className="text-white/70">你的系統開啟了「減少動態效果」，此頁改以文字說明分鏡：</p>
        <ol className="list-decimal space-y-4 pl-5 text-white/85">
          <li>S05｜女兒出竿，母球離開桿頭（影片佔位）。</li>
          <li>S06｜母球朝鏡頭滾來並放大，左後方目標球滾進袋，畫面短暫全白。</li>
          <li>S07｜白圓縮回成球桌上的母球，第二位玩家亮起、兩人連線，關卡進度變成雙人。</li>
        </ol>
        <div className="rounded-2xl bg-brand-925 p-6">
          <h2 className="text-xl font-bold">{copy.s08.title}</h2>
          <p className="mt-2 text-white/75">{copy.s08.sub}</p>
        </div>
      </div>
    </main>
  )
}
