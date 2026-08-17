import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../ui/Button'
import { toast } from '../../ui/Toast'
import { site } from '../../data/site'
import {
  friends,
  friendStats,
  inviteLink,
  demoFriends,
  demoFriendStats,
  demoInviteLink,
  type Friend,
} from '../../data/friends'

/**
 * 我的好友：一起練習的夥伴紀錄。
 *
 * 定位是「學習夥伴的簡潔紀錄」，不是社群平台：
 * 沒有排行榜、按讚、留言、私訊或動態牆。
 * 邀請功能收成頁首的次要動作（modal），不佔主要版面。
 *
 * 預覽：網址加 ?demo=friends 會改用示範好友資料。
 */
export function FriendsPanel() {
  const useDemo = useMemo(
    () => new URLSearchParams(location.search).get('demo') === 'friends',
    [],
  )
  const list: Friend[] = useDemo ? demoFriends : friends
  const stats = useDemo ? demoFriendStats : friendStats
  const link = useDemo ? demoInviteLink : inviteLink
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div>
      {/* 頁首：左標題右次要動作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl">我的好友</h2>
          <p className="mt-2 leading-relaxed text-ink-500">
            和朋友一起記錄練習，也一起看見每一次進步。
          </p>
        </div>
        <Button variant="secondary" onClick={() => setInviteOpen(true)} className="min-h-11 shrink-0">
          邀請朋友
        </Button>
      </div>

      <StatsRow stats={stats} />

      {list.length === 0 ? (
        <EmptyFriends onInvite={() => setInviteOpen(true)} />
      ) : (
        <ul className="mt-8 grid gap-4 lg:grid-cols-2">
          {list.map((f) => (
            <FriendRow key={f.id} friend={f} />
          ))}
        </ul>
      )}

      {inviteOpen && <InviteModal link={link} onClose={() => setInviteOpen(false)} />}
    </div>
  )
}

/** 概覽統計：三個數字，克制呈現，不做成遊戲分數板 */
function StatsRow({
  stats,
}: {
  stats: { friendCount: number | null; monthlyChallenges: number | null; sharedStars: number | null }
}) {
  const items = [
    { label: '我的好友', value: stats.friendCount, unit: '人' },
    { label: '本月一起完成', value: stats.monthlyChallenges, unit: '次 Challenge' },
    { label: '一起累積', value: stats.sharedStars, unit: '顆星星' },
  ]
  return (
    <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-card border border-line bg-white px-4 py-3.5">
          <dt className="text-sm text-ink-500">{s.label}</dt>
          <dd className="mt-1 flex items-baseline gap-1.5">
            {/* 資料未備妥時顯示「＿＿」，不填假數字 */}
            <span className="text-2xl font-bold text-ink-900 tabular-nums">
              {s.value ?? '＿＿'}
            </span>
            <span className="text-sm text-ink-500">{s.unit}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** 好友列：頭像、暱稱、等級、最近公開活動，右側進入公開摘要 */
function FriendRow({ friend }: { friend: Friend }) {
  return (
    <li>
      <a
        href={`./friend.html?id=${encodeURIComponent(friend.id)}`}
        className="flex min-h-16 items-center gap-4 rounded-card border border-line bg-white p-4 transition-colors hover:bg-ivory-50"
      >
        <FriendAvatar name={friend.name} src={friend.avatar} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold text-ink-900">{friend.name}</span>
            {friend.level !== null && (
              <span className="text-xs font-semibold text-brand-700">Lv.{friend.level}</span>
            )}
          </span>
          {/* 最近活動可能較長，允許換行，不壓成小字 */}
          <span className="mt-1 block text-sm leading-relaxed text-ink-500">
            {friend.recentActivity}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-semibold text-brass-700">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-brass-500">
              <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z" />
            </svg>
            <span className="tabular-nums">{friend.stars}</span>
          </span>
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-ink-400">
            <path d="M7.3 4.3l5.7 5.7-5.7 5.7-1.4-1.4 4.3-4.3-4.3-4.3z" />
          </svg>
        </span>
      </a>
    </li>
  )
}

/** 頭像：沒有圖片時用名稱首字，維持圓形一致 */
export function FriendAvatar({
  name,
  src,
  size = 'md',
}: {
  name: string
  src: string | null
  size?: 'md' | 'lg'
}) {
  const box = size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-11 w-11 text-base'
  if (src) {
    return <img src={src} alt="" className={`${box} shrink-0 rounded-full object-cover`} />
  }
  return (
    <span
      aria-hidden="true"
      className={`${box} flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700`}
    >
      {name.slice(0, 1)}
    </span>
  )
}

/** 沒有好友：溫和的空狀態，不放獎勵或金錢誘因 */
function EmptyFriends({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="mt-8 rounded-card border border-line bg-white px-6 py-14 text-center">
      {/* 兩顆球以細線相連：一起練習的概念 */}
      <svg viewBox="0 0 120 64" aria-hidden="true" className="mx-auto w-28">
        <path
          d="M38 32 H82"
          stroke="var(--color-brand-300, #93b4e0)"
          strokeWidth="2"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <circle cx="30" cy="32" r="15" fill="#FBF9F5" stroke="#16294d" strokeWidth="1.5" />
        <circle cx="26" cy="27" r="4" fill="#fff" />
        <circle cx="90" cy="32" r="15" fill="#D9A441" />
        <circle cx="86" cy="27" r="4" fill="#fff" opacity="0.55" />
      </svg>
      <p className="mt-5 font-semibold text-ink-900">還沒有一起練習的朋友</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        邀請朋友加入 Poolgress，一起把每一次練習變得更有方向。
      </p>
      <div className="mt-6">
        <Button onClick={onInvite} size="lg">
          邀請朋友
        </Button>
      </div>
    </div>
  )
}

/**
 * 邀請 modal：只做「取得並分享連結」這一件事。
 * Esc 與背景點擊可關閉，開啟時焦點移入面板、背景不可捲動。
 */
function InviteModal({ link, onClose }: { link: string | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const copy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      toast('已複製邀請連結', 'success')
    } catch {
      toast('複製失敗，請手動選取連結', 'error')
    }
  }

  const share = async () => {
    if (!link) return
    try {
      await navigator.share({ title: 'Poolgress', text: '一起練撞球吧', url: link })
    } catch {
      /* 使用者取消分享：不需要提示 */
    }
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 px-4 py-6 sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-card bg-white p-6 shadow-2xl outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="invite-title" className="text-lg">
            邀請朋友一起練習
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="-m-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ivory-100 hover:text-ink-900"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          把連結傳給朋友，他註冊後就會出現在你的好友清單裡。
        </p>

        <div className="mt-5">
          <label htmlFor="invite-link" className="text-sm font-semibold text-ink-700">
            邀請連結
          </label>
          {link ? (
            <input
              id="invite-link"
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="mt-2 w-full rounded-lg border border-line bg-ivory-50 px-3 py-2.5 text-sm text-ink-900"
            />
          ) : (
            <p className="mt-2 rounded-lg border border-dashed border-line bg-ivory-50 px-3 py-2.5 text-sm text-ink-500">
              邀請連結由後端在帳號建立時產生，串接後會顯示在這裡。
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Button onClick={copy} disabled={!link} block>
            複製連結
          </Button>
          {canShare && (
            <Button onClick={share} variant="secondary" disabled={!link} block>
              分享
            </Button>
          )}
        </div>

        {/* LINE 分享：單色圖示，不用 LINE 品牌綠 */}
        {site.lineUrl && link && (
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-brand-700 ring-1 ring-brand-200 ring-inset hover:bg-brand-50"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M12 3c5 0 9 3.2 9 7.2 0 4-4 7.2-9 7.2-.6 0-1.2 0-1.7-.1l-4 2.4c-.3.2-.7 0-.6-.4l.7-3C4.2 15 3 13.2 3 11.2 3 6.2 7 3 12 3z" />
            </svg>
            用 LINE 傳送
          </a>
        )}
      </div>
    </div>
  )
}
