import { useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { challenges, challengeById, appLinks, type Challenge } from './data/challenges'
import { AppFlow } from './components/challenges/AppFlow'

/**
 * 實戰闖關：課程延伸到真實球桌的 App 實戰任務（非遊戲介面）。
 * 網址不帶參數＝列表；?id=challenge-1＝詳情。
 * 資料來源：src/data/challenges.ts。
 */
export default function ChallengesApp() {
  const id = useMemo(() => new URLSearchParams(location.search).get('id'), [])
  const detail = id ? challengeById(id) : undefined

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        {id && !detail && <NotFound />}
        {detail && <ChallengeDetail challenge={detail} />}
        {!id && <ChallengeList />}
      </main>
      <Footer />
    </>
  )
}

function ChallengeList() {
  /* 完成狀態由 App 回傳；串接前一律顯示「未完成」 */
  return (
    <>
      <h1 className="text-3xl sm:text-4xl">實戰闖關</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">
        看懂只是開始。每一關都是課程的延伸——照著 App 的指示在真實球桌上擺球、
        完成任務條件，把「聽懂了」變成「做得到」。
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {challenges.map((c, i) => (
          <li key={c.id}>
            <a
              href={`./challenges.html?id=${c.id}`}
              className="block h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-sm transition-shadow hover:shadow-md">
                <ChallengeImage challenge={c} index={i} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700 ring-1 ring-brand-200">
                      {c.level}
                    </span>
                    <StarBadge stars={c.stars} />
                  </div>
                  <h2 className="mt-3 text-lg leading-snug">{c.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{c.goal}</p>
                  <p className="mt-4 flex items-center gap-1.5 border-t border-line pt-4 text-sm font-semibold text-brand-700">
                    查看任務
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                      <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
                    </svg>
                  </p>
                </div>
              </article>
            </a>
          </li>
        ))}
      </ul>

      <AppFlow />
      <AppPromo />
    </>
  )
}

function ChallengeDetail({ challenge }: { challenge: Challenge }) {
  return (
    <>
      <a
        href="./challenges.html"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M12.7 15.7L7 10l5.7-5.7 1.4 1.4L9.8 10l4.3 4.3z" />
        </svg>
        返回實戰闖關
      </a>

      <div className="mt-6 overflow-hidden rounded-card border border-line bg-white shadow-sm">
        <ChallengeImage challenge={challenge} index={0} tall />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700 ring-1 ring-brand-200">
              {challenge.level}
            </span>
            <StarBadge stars={challenge.stars} />
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl">{challenge.name}</h1>

          <dl className="mt-8 space-y-6">
            <DetailBlock title="任務目標">
              <p>{challenge.goal}</p>
            </DetailBlock>
            <DetailBlock title="球桌情境">
              <p>{challenge.scenario}</p>
            </DetailBlock>
            <DetailBlock title="完成條件">
              <ul className="list-disc space-y-1 pl-5">
                {challenge.conditions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </DetailBlock>
            <DetailBlock title="準備事項">
              <ul className="list-disc space-y-1 pl-5">
                {challenge.prep.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </DetailBlock>
            {challenge.lessonHint && (
              <DetailBlock title="對應課程單元">
                <p>{challenge.lessonHint}</p>
              </DetailBlock>
            )}
          </dl>

          {/* App 開啟區：deep link 未串接前顯示佔位（QR code 位置預留） */}
          <div className="mt-10 rounded-xl bg-brand-950 p-6 text-center sm:p-8">
            <p className="font-semibold text-white">準備好了嗎？</p>
            <p className="mt-1 text-sm text-white/70">
              {challenge.appUrl
                ? '開啟 Poolgress App 開始這一關。'
                : 'App 上架後，這裡會提供直接開啟這一關的按鈕與 QR code。'}
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {challenge.appUrl ? (
                <Button href={challenge.appUrl} size="lg">
                  在 App 中開啟
                </Button>
              ) : (
                <span className="inline-flex items-center rounded-full bg-white/10 px-6 py-3.5 text-base font-semibold text-white/60 ring-1 ring-white/20">
                  App 即將上架
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-semibold tracking-wide text-brand-700">{title}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-ink-700">{children}</dd>
    </div>
  )
}

function StarBadge({ stars }: { stars: number | null }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brass-400/15 px-2.5 py-0.5 font-semibold text-brass-700 ring-1 ring-brass-400/40 ring-inset">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 fill-brass-600">
        <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z" />
      </svg>
      {stars ?? '？'}
    </span>
  )
}

/** 情境圖：有圖用圖，沒圖用球桌視角的漸層佔位 */
function ChallengeImage({
  challenge,
  index,
  tall = false,
}: {
  challenge: Challenge
  index: number
  tall?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const cls = tall ? 'aspect-[21/9] w-full object-cover' : 'aspect-video w-full object-cover'
  if (challenge.image && !failed) {
    return <img src={challenge.image} alt="" onError={() => setFailed(true)} className={cls} />
  }
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-brand-950 to-brand-700 ${
        tall ? 'aspect-[21/9]' : 'aspect-video'
      }`}
    >
      <span aria-hidden="true" className="font-logo text-3xl font-semibold text-white/35">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}

/** App 下載區：商店連結上架後由 data/challenges.ts 的 appLinks 提供 */
function AppPromo() {
  return (
    <div className="mt-12 rounded-card border border-line bg-white p-6 text-center sm:p-8">
      <h2 className="text-xl">Poolgress App</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        闖關由 App 帶著你在球桌上進行：擺球指示、完成判定與星星紀錄都在 App 裡。
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {appLinks.appStore ? (
          <Button href={appLinks.appStore} variant="secondary">
            App Store
          </Button>
        ) : (
          <span className="rounded-full bg-ivory-100 px-5 py-2.5 text-sm font-semibold text-ink-500">
            App Store（即將上架）
          </span>
        )}
        {appLinks.googlePlay ? (
          <Button href={appLinks.googlePlay} variant="secondary">
            Google Play
          </Button>
        ) : (
          <span className="rounded-full bg-ivory-100 px-5 py-2.5 text-sm font-semibold text-ink-500">
            Google Play（即將上架）
          </span>
        )}
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <p className="text-lg text-ink-500">找不到這個 Challenge</p>
      <div className="mt-6">
        <Button href="./challenges.html" size="lg">
          回實戰闖關列表
        </Button>
      </div>
    </div>
  )
}
