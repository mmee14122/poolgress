import { useEffect, useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { FriendAvatar } from './components/account/FriendsPanel'
import { StatusIllustration } from './components/StatusIllustration'
import { Button } from './ui/Button'
import { useSession } from './lib/session'
import { loginUrlWithRedirect, currentPageTarget } from './lib/auth'
import { friendById } from './data/friends'

/**
 * 好友公開摘要（friend.html?id=friend-1）。
 *
 * ⚠️ 只顯示適合公開的內容：頭像、暱稱、等級、公開 Challenge 數、
 * 累積星星、最近完成的公開成就。
 * 不顯示 Email、電話、訂單、完整學習歷程、私人預約或位置。
 *
 * 靜態站沒有動態路由，因此用 friend.html?id= 取代 /friends/[friendId]；
 * 後端接上後改為 GET /friends/:id 的公開摘要，畫面不用改。
 */
export default function FriendProfileApp() {
  const user = useSession()
  const id = useMemo(() => new URLSearchParams(location.search).get('id') ?? '', [])
  const [ready, setReady] = useState(false)

  /* 好友清單屬於登入後的內容 */
  useEffect(() => {
    if (!user) location.replace(loginUrlWithRedirect(currentPageTarget()))
  }, [user])

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  if (!user) return null

  const friend = friendById(id)

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <a
          href="./invite.html"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M12.7 4.3l-5.7 5.7 5.7 5.7 1.4-1.4-4.3-4.3 4.3-4.3z" />
          </svg>
          我的好友
        </a>

        {!ready && <LoadingProfile />}

        {ready && !friend && (
          <div className="py-12 text-center sm:py-16">
            <StatusIllustration status="empty-cart" />
            <h1 className="mt-6 text-2xl sm:text-3xl">找不到這位好友。</h1>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
              這個連結可能已失效，或對方調整了公開範圍。
            </p>
            <div className="mt-8">
              <Button href="./invite.html" size="lg">
                回到我的好友
              </Button>
            </div>
          </div>
        )}

        {ready && friend && (
          <>
            <header className="mt-6 flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
              <FriendAvatar name={friend.name} src={friend.avatar} size="lg" />
              <div className="mt-4 min-w-0 sm:mt-0">
                <h1 className="text-2xl break-words sm:text-3xl">{friend.name}</h1>
                <p className="mt-1.5 text-sm text-ink-500">
                  {friend.level !== null ? `Lv.${friend.level}` : '等級計算中'}
                  <span className="mx-2 text-ink-400">・</span>
                  {new Date(friend.joinedAt).toLocaleDateString('zh-TW')} 加入
                </p>
              </div>
            </header>

            <dl className="mt-8 grid grid-cols-2 gap-3">
              <Stat label="完成的公開 Challenge" value={friend.challengesCompleted} unit="關" />
              <Stat label="累積星星" value={friend.stars} unit="顆" />
            </dl>

            <section className="mt-8 rounded-card border border-line bg-white p-5 sm:p-6">
              <h2 className="text-lg">最近的公開成就</h2>
              {friend.recentAchievements.length === 0 ? (
                <p className="mt-3 text-sm text-ink-500">目前沒有公開的成就紀錄。</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {friend.recentAchievements.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm text-ink-700">
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 fill-brass-500"
                      >
                        <path d="M10 1.6l2.6 5.2 5.8.85-4.2 4.1.99 5.75L10 14.8l-5.19 2.7.99-5.75-4.2-4.1 5.8-.85z" />
                      </svg>
                      <span className="min-w-0 break-words">{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <p className="mt-6 text-xs leading-relaxed text-ink-400">
              這是好友的公開摘要，只包含對方願意公開的學習紀錄。
              Email、訂單、預約與完整學習歷程都不會顯示。
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-card border border-line bg-white px-4 py-3.5">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-ink-900 tabular-nums">{value}</span>
        <span className="text-sm text-ink-500">{unit}</span>
      </dd>
    </div>
  )
}

function LoadingProfile() {
  return (
    <div role="status" aria-live="polite" className="mt-6">
      <span className="sr-only">好友資料載入中</span>
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 animate-pulse rounded-full bg-ivory-100" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-32 animate-pulse rounded bg-ivory-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-ivory-100" />
        </div>
      </div>
    </div>
  )
}
