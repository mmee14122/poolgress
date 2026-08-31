import { useEffect, useRef, useState } from 'react'
import { SEG, STORY_VH, copy } from './data/motion-demo'

/**
 * 首頁捲動動畫演示：S05（出竿）→ S06（白球遮罩轉場）→ S07（玩家標記）→ S08（揭曉擊掌）。
 *
 * S07 的設計（2026-08-17 依使用者定稿）：
 * 白幕不縮回球桌，而是直接作為 App 介面的底——
 * 第一位玩家頭像先出現 → 第二位亮起 → 連線 → 進度條推進；
 * 這組「標記」接著縮小移到左下角，白幕同時淡出，
 * 露出後面的擊掌照片與右側文字，完成 S07 → S08 的交接。
 *
 * 進度來源：純 scroll 事件（不套 rAF——rAF 在分頁不可見時不執行，
 * 會讓判定停在舊值且無法自動驗證）。只寫 transform / opacity。
 *
 * 捲動接管：只有 whiteout 白幕帶。桌機（pointer: fine）限定、
 * 只在往下滑時觸發、滾輪／觸控／按鍵隨時可中斷、減少動態模式不接管。
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
  if (p < SEG.avatarB[0]) return 'S07 玩家A'
  if (p < SEG.progress[0]) return 'S07 玩家B加入'
  if (p < SEG.dock[0]) return 'S07 進度推進'
  return 'S07→S08 揭曉'
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

  /* S07 各階段 */
  const aA = seg(p, SEG.avatarA)
  const aB = seg(p, SEG.avatarB)
  const lk = seg(p, SEG.link)
  const pg = seg(p, SEG.progress)
  const dk = seg(p, SEG.dock)

  /* 白幕：whiteout 進場 → 整個 S07 維持全白 → dock 時淡出露出 S08 */
  const whiteOpacity =
    p < SEG.whiteout[0]
      ? 0
      : p < SEG.dock[0]
        ? seg(p, [SEG.whiteout[0], SEG.whiteout[0] + 0.03])
        : 1 - seg(p, [SEG.dock[0], SEG.dock[0] + 0.7 * (SEG.dock[1] - SEG.dock[0])])

  /* 標記（頭像組合）：置中 → 縮小移到左下角。
     手機停靠點內縮（14% 會讓卡片左緣超出螢幕約 15px） */
  const dockX = typeof window !== 'undefined' && window.innerWidth < 640 ? 26 : 14
  const markX = 50 - (50 - dockX) * eo(dk)
  const markY = 45 + 36 * eo(dk)
  const markScale = 1 - 0.55 * eo(dk)

  /* S08 右側文字：dock 後段滑入 */
  const s08TextOpacity = seg(p, [SEG.dock[0] + 0.04, SEG.dock[1]])

  const showS05 = p < SEG.whiteout[1]
  const showMark = p >= SEG.avatarA[0]
  const showS08 = p >= SEG.dock[0]

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
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 背景：球館深藍 */}
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

          {/* ===== S08｜擊掌照片＋右側文字（在白幕之下，白幕淡出後露出） ===== */}
          {showS08 && (
            <div className="absolute inset-0">
              {/* 照片佔位（之後換成 3200×1800 中央裁切版擊掌定格） */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-925 to-brand-950">
                <div className="absolute inset-[6%] rounded-2xl border-2 border-dashed border-white/20">
                  <span className="absolute top-3 left-4 text-xs text-white/50 sm:text-sm">
                    {copy.s08.photoLabel}
                  </span>
                </div>
              </div>

              {/* 右側文字介紹 */}
              <div
                className="absolute right-[8%] top-1/2 max-w-[38%] -translate-y-1/2 text-right max-sm:right-[6%] max-sm:max-w-[55%]"
                style={{
                  opacity: s08TextOpacity,
                  transform: `translateY(calc(-50% + ${16 * (1 - eo(s08TextOpacity))}px))`,
                }}
              >
                <h2 className="text-xl leading-snug font-bold sm:text-3xl">{copy.s08.title}</h2>
                <p className="mt-3 text-sm text-white/75 sm:text-base">{copy.s08.sub}</p>
              </div>
            </div>
          )}

          {/* ===== 白幕（S06 進場 → S07 底色 → dock 淡出） ===== */}
          <div
            className="pointer-events-none absolute inset-0 bg-white"
            style={{ opacity: whiteOpacity }}
          />

          {/* ===== S07｜玩家標記（在白幕之上；dock 時縮小移到左下角） ===== */}
          {showMark && (
            <div
              className="absolute"
              style={{
                left: `${markX}%`,
                top: `${markY}%`,
                transform: `translate(-50%, -50%) scale(${markScale})`,
              }}
            >
              <MarkCard aA={aA} aB={aB} lk={lk} pg={pg} docked={dk > 0.5} />
            </div>
          )}
        </div>
      </div>

      {/* ---------- S08 停留頁（靜態版，sticky 釋放後銜接；版面同舞台終格） ---------- */}
      <section className="relative flex min-h-screen items-center bg-gradient-to-br from-brand-925 to-brand-950 px-6">
        <div className="absolute inset-[6%] rounded-2xl border-2 border-dashed border-white/20">
          <span className="absolute top-3 left-4 text-xs text-white/50 sm:text-sm">
            {copy.s08.photoLabel}
          </span>
        </div>
        <div className="absolute right-[8%] top-1/2 max-w-[38%] -translate-y-1/2 text-right max-sm:right-[6%] max-sm:max-w-[55%]">
          <h2 className="text-xl leading-snug font-bold sm:text-3xl">{copy.s08.title}</h2>
          <p className="mt-3 text-sm text-white/75 sm:text-base">{copy.s08.sub}</p>
          <p className="mt-6 text-xs text-white/40">{copy.s08.note}</p>
        </div>
        <div className="absolute bottom-[9%] left-[7%] origin-bottom-left scale-[.45]">
          <MarkCard aA={1} aB={1} lk={1} pg={1} docked />
        </div>
      </section>

      {/* ---------- HUD：目前進度（回饋時請引用 p 值） ---------- */}
      <div className="fixed right-3 bottom-3 z-50 rounded-lg bg-black/75 px-3 py-2 font-mono text-xs text-white tabular-nums">
        p={p.toFixed(3)}｜{segmentName(p)}
      </div>
    </main>
  )
}

/**
 * 玩家標記：兩個頭像＋連線＋進度條（依使用者提供的示意圖）。
 * 白底卡片，縮小停到左下角後在照片上仍讀得清楚。
 */
function MarkCard({
  aA,
  aB,
  lk,
  pg,
  docked,
}: {
  aA: number
  aB: number
  lk: number
  pg: number
  docked: boolean
}) {
  const fill = 40 + 45 * eo(pg) // 進度條填充％：單人 40 → 雙人 85
  return (
    <div
      className="w-[300px] rounded-2xl border px-7 py-6"
      style={{
        opacity: aA,
        transform: `scale(${0.85 + 0.15 * eo(aA)})`,
        background: 'rgba(255,255,255,.96)',
        borderColor: '#dbe9f9',
        boxShadow: docked ? '0 8px 28px rgba(15,30,51,.35)' : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <AvatarIcon opacity={1} active />
        {/* 兩人連線 */}
        <svg viewBox="0 0 100 8" className="mx-3 h-2 flex-1" preserveAspectRatio="none">
          <line
            x1="2"
            y1="4"
            x2="98"
            y2="4"
            stroke="#387ed9"
            strokeWidth="3"
            strokeDasharray="96"
            strokeDashoffset={96 - 96 * eo(lk)}
            strokeLinecap="round"
          />
        </svg>
        <AvatarIcon opacity={aB} active={aB > 0.55} />
      </div>
      {/* 進度條 */}
      <div className="mt-5 h-3 overflow-hidden rounded-full border border-brand-200 bg-white">
        <div
          className="h-full rounded-full bg-brand-500"
          style={{ width: `${fill}%` }}
        />
      </div>
      <p className="mt-2.5 text-center text-xs font-medium text-ink-500">
        {pg > 0.5 ? copy.playersTwo : copy.playersOne}
      </p>
    </div>
  )
}

/** 頭像 icon（藍色人形，照使用者示意圖） */
function AvatarIcon({ opacity, active }: { opacity: number; active: boolean }) {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full border-2"
      style={{
        opacity,
        borderColor: active ? '#387ed9' : '#b7d3f2',
        background: active ? '#dbe9f9' : '#f4f7fb',
        transform: `scale(${active ? 1 : 0.88})`,
      }}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill={active ? '#387ed9' : '#b7d3f2'}>
        <circle cx="12" cy="9" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7v1H4z" />
      </svg>
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
          <li>
            S07｜白底上出現第一位玩家頭像，第二位亮起、兩人連線，關卡進度推進成雙人。
          </li>
          <li>
            S08｜玩家標記縮小移到左下角，白幕淡出露出父女擊掌照片與右側文字介紹。
          </li>
        </ol>
        <div className="rounded-2xl bg-brand-925 p-6">
          <h2 className="text-xl font-bold">{copy.s08.title}</h2>
          <p className="mt-2 text-white/75">{copy.s08.sub}</p>
        </div>
      </div>
    </main>
  )
}
