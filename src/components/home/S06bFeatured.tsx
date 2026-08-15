import { Button } from '../../ui/Button'
import { courseCatalog } from '../../data/courses'
import { challenges } from '../../data/challenges'
import { course } from '../../data/course-detail'
import { formatNT } from '../../lib/cart'

/**
 * SECTION 06b｜精選課程 × 實戰闖關 × 教練
 *
 * 首頁到這裡已經講完「為什麼」，這一區給具體入口：
 * 可買的課程、可挑戰的關卡、教這堂課的人。
 * 資料全部來自 src/data/（courses、challenges）與 data/course-detail.ts（教練）。
 */
export function S06bFeatured() {
  const featured = courseCatalog.filter((c) => c.price !== null).slice(0, 3)
  const { coach } = course

  return (
    <section id="featured" className="scroll-mt-24 bg-ivory-50 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* 精選課程 */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-600">線上課程</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">從理解開始，練習才有方向</h2>
          </div>
          <a
            href="./courses.html"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            查看全部課程
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
            </svg>
          </a>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <li key={c.id}>
              <a
                href={c.href ?? './courses.html'}
                className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600">
                  <svg viewBox="0 0 48 24" aria-hidden="true" className="h-10 w-20 opacity-70">
                    <circle cx="12" cy="12" r="6" fill="#fbf9f5" />
                    <circle cx="34" cy="12" r="6" fill="#d9a441" />
                    <line
                      x1="18" y1="12" x2="28" y2="12"
                      stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="3 3"
                    />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                    {c.level}
                  </span>
                  <h3 className="mt-3 text-lg leading-snug">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{c.summary}</p>
                  <p className="mt-4 border-t border-line pt-4 text-lg font-bold text-ink-900 tabular-nums">
                    {formatNT(c.price!)}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* 實戰闖關入口 */}
        <div className="mt-16 overflow-hidden rounded-card bg-brand-950">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest text-pulse-500">實戰闖關</p>
              <h2 className="mt-2 text-2xl text-white sm:text-3xl">
                看懂之後，把它帶到真的球桌上
              </h2>
              <p className="mt-4 leading-relaxed text-white/70">
                Poolgress App 會在球桌旁陪你：怎麼擺球、要達成什麼、有沒有做到。
                每完成一關，累積的不只是星星，是你真的做得到的證據。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="./challenges.html" size="lg">
                  查看實戰闖關
                </Button>
              </div>
            </div>

            {/* 關卡預覽（前四關） */}
            <ul className="grid grid-cols-2 gap-3">
              {challenges.slice(0, 4).map((ch, i) => (
                <li
                  key={ch.id}
                  className="rounded-xl border border-white/15 bg-white/5 p-4 text-center"
                >
                  <span aria-hidden="true" className="font-logo text-2xl font-semibold text-white/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-1 truncate text-xs text-white/60">{ch.level}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 教練信任 */}
        <div className="mt-16 flex flex-col items-center gap-8 rounded-card border border-line bg-white p-8 sm:flex-row sm:p-10">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-900 to-brand-600">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12 fill-white/30">
              <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-sm font-semibold tracking-widest text-brand-600">{coach.title}</p>
            <h2 className="mt-1 text-xl">{coach.name}</h2>
            <p className="mt-3 leading-relaxed text-ink-500 italic">「{coach.philosophy}」</p>
            <div className="mt-5">
              <Button href="./coach.html" variant="secondary">
                認識教練
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
