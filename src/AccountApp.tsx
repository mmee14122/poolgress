import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Avatar } from './components/Avatar'
import { Button } from './ui/Button'
import {
  useSession,
  displayNameOf,
  readAvatarFile,
  session,
  MAX_NAME_LENGTH,
  type Session,
} from './lib/session'
import { useLibrary, totalStarsOf, type LibraryBooking } from './lib/library'
import { loginUrlWithRedirect, currentPageTarget } from './lib/auth'
import { courseById, flatLessons } from './data/courses'
import { coachById } from './data/coaches'
import { site } from './data/site'
import { toast } from './ui/Toast'

export type AccountPage = 'profile' | 'courses' | 'stars' | 'orders' | 'invite'

const tabs: { key: AccountPage; label: string; href: string }[] = [
  { key: 'profile', label: '個人檔案', href: './account.html' },
  { key: 'courses', label: '我的課程', href: './my-courses.html' },
  { key: 'stars', label: '我的星星', href: './stars.html' },
  { key: 'orders', label: '我的訂單', href: './orders.html' },
  { key: 'invite', label: '邀請好友', href: './invite.html' },
]

/**
 * 登入後的個人頁面（個人檔案／我的星星／邀請好友共用版型）。
 *
 * ⚠️ 後端尚未串接：所有數字、紀錄與規則一律為空狀態或「待補」，
 * 不虛構學員資料。串接後把各區塊的空狀態換成 API 資料即可。
 * 未登入時顯示引導登入畫面，不直接暴露個人區塊。
 */
export default function AccountApp({ page }: { page: AccountPage }) {
  const user = useSession()
  const lib = useLibrary()

  if (!user) return <SignedOutView />

  const stars = totalStarsOf(lib)

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* 身分列：頭像可直接點擊更換、名稱可更名，右側顯示星星數 */}
        <div className="flex items-center gap-4">
          <AvatarPicker user={user} />
          <div className="min-w-0 flex-1">
            <NameEditor user={user} />
            <p className="truncate text-sm text-ink-500">{user.email}</p>
          </div>
          <a
            href="./stars.html"
            className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full bg-brass-400/15 px-5 py-2.5 text-lg font-bold text-brass-700 ring-1 ring-brass-400/40 transition-colors ring-inset hover:bg-brass-400/25"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-brass-600">
              <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z" />
            </svg>
            <span className="tabular-nums">{stars}</span>
          </a>
        </div>

        {/* 分頁切換（各自獨立頁面，維持可分享的網址） */}
        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-line scroll-row">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={tab.href}
              aria-current={tab.key === page ? 'page' : undefined}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                tab.key === page
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-ink-500 hover:text-ink-900'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>

        <div className="mt-8">
          {page === 'profile' && <ProfilePanel user={user} />}
          {page === 'courses' && <CoursesPanel />}
          {page === 'stars' && <StarsPanel />}
          {page === 'orders' && <OrdersPanel />}
          {page === 'invite' && <InvitePanel />}
        </div>
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 我的課程：已購買課程與觀看進度。
 * 資料來源：lib/library.ts（結帳成功即寫入）＋ data/courses.ts 的課程目錄。
 */
function CoursesPanel() {
  return (
    <div className="space-y-6">
      <OnlineCoursesCard />
      <CoachLessonsCard />
    </div>
  )
}

/** 線上課程：已購買課程與觀看進度 */
function OnlineCoursesCard() {
  const lib = useLibrary()
  const list = lib.courses
    .map((c) => {
      const info = courseById(c.courseId)
      const total = flatLessons(c.courseId).length
      const progress = total ? Math.round((c.completedLessons.length / total) * 100) : 0
      return { c, info, progress }
    })
    .filter((x) => x.info)

  if (list.length === 0) {
    return (
      <Card title="線上課程">
        <EmptyState
          icon="M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z"
          title="還沒有已購買的課程"
          description="購買後這裡會顯示課程與觀看進度。"
          action={
            <Button href="./course.html" size="lg">
              探索線上課程
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <Card title="線上課程">
      <ul className="space-y-4">
        {list.map(({ c, info, progress }) => (
          <li
            key={c.courseId}
            className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center"
          >
            {/* 封面（無圖時漸層佔位） */}
            <div className="flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-900 to-brand-600 sm:w-44">
              <svg viewBox="0 0 48 24" aria-hidden="true" className="h-8 w-16 opacity-70">
                <circle cx="12" cy="12" r="6" fill="#fbf9f5" />
                <circle cx="34" cy="12" r="6" fill="#d9a441" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink-900">{info!.title}</p>
              <p className="mt-1 text-xs text-ink-500">
                {progress >= 100
                  ? '已完成 🎉'
                  : c.lastLessonId
                    ? `上次學到：單元 ${c.lastLessonId}`
                    : '尚未開始'}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${info!.title} 學習進度`}
                  className="h-2 flex-1 overflow-hidden rounded-full bg-ivory-100"
                >
                  <span
                    className="block h-full rounded-full bg-brand-600"
                    style={{ width: `${progress}%` }}
                  />
                </span>
                <span className="text-xs font-semibold text-ink-700 tabular-nums">{progress}%</span>
              </div>
            </div>

            <Button
              href={`./learn.html?course=${c.courseId}${c.lastLessonId ? `&lesson=${c.lastLessonId}` : ''}`}
              className="shrink-0"
            >
              {!c.lastLessonId ? '開始學習' : progress >= 100 ? '再看一次' : '繼續學習'}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 我的教練課：預約成功後寫入 lib/library.ts 的 bookings。
 * 每一筆顯示教練、時段與上課地點，並提供「加入 Google 行事曆」提醒連結。
 */
function CoachLessonsCard() {
  const lib = useLibrary()
  const now = new Date()

  /* 依上課時間排序 */
  const list = [...lib.bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  if (list.length === 0) {
    return (
      <Card title="我的教練課">
        <EmptyState
          icon="M7 2v2h10V2h2v2h1a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V2zm13 8H4v10h16zM6 12h5v4H6z"
          title="還沒有預約的教練課"
          description="預約成功後，這裡會顯示上課的教練、時段與地點。"
          action={
            <Button href="./coach.html" size="lg">
              找教練預約
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <Card title="我的教練課">
      <ul className="space-y-4">
        {list.map((b) => {
          const start = lessonStart(b.date, b.time)
          const past = start.getTime() + (b.durationMin ?? 60) * 60000 < now.getTime()

          return (
            <li
              key={b.id}
              className={`overflow-hidden rounded-xl border border-line ${past ? 'opacity-60' : ''}`}
            >
              {/* 左：預約資訊（狀態接在課程名右側）／右：操作按鈕 */}
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="text-lg font-bold text-ink-900">{b.serviceName}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        past ? 'bg-ivory-100 text-ink-500' : 'bg-pulse-100 text-pulse-700'
                      }`}
                    >
                      {past ? '已結束' : '已確認'}
                    </span>
                  </div>

                <dl className="mt-3 space-y-2">
                  <div className="flex gap-2 text-sm">
                    <dt className="w-10 shrink-0 text-ink-500">教練</dt>
                    <dd className="font-semibold text-ink-900">{b.coachName}</dd>
                  </div>
                  {/* 日期時間是第二重要資訊：字級與字重都拉高，用品牌深藍 */}
                  <div className="flex gap-2">
                    <dt className="mt-0.5 w-10 shrink-0 text-sm text-ink-500">時段</dt>
                    <dd className="text-base font-bold text-brand-900 tabular-nums">
                      {formatLessonTime(b.date, b.time)}
                      {b.durationMin !== null && `（${b.durationMin} 分鐘）`}
                    </dd>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <dt className="w-10 shrink-0 text-ink-500">地點</dt>
                    <dd className="text-ink-700">
                      {b.venueName ?? '場館待補'}
                      {b.venueAddress && (
                        /* 待補資料也維持可讀字級，只降低對比 */
                        <span className="mt-0.5 block text-ink-500">{b.venueAddress}</span>
                      )}
                    </dd>
                  </div>
                </dl>
                </div>

                {/* 操作區：桌機在右上直向堆疊，手機為滿寬堆疊 */}
                <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto">
                  {/* 加入 Google 行事曆並由行事曆發出提醒 */}
                  <Button
                    href={googleCalendarUrl(b)}
                    className="min-h-11 w-full whitespace-nowrap sm:w-auto"
                  >
                    <CalendarIcon />
                    加入 Google 行事曆
                  </Button>

                  <ContactCoachButton coachId={b.coachId} />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        ⚠️ 目前預約為前端示範，紀錄只存在這台裝置的瀏覽器，尚未串接實際排程系統。
      </p>
    </Card>
  )
}

/**
 * 聯絡教練：以教練的 LINE 連結加好友。
 *
 * 連結來自 data/coaches.ts 該位教練的 socialLinks.line；
 * 未填時退回 site.lineUrl（Poolgress 官方帳號）；
 * 兩者都沒有就顯示為停用並標示「即將開放」，不放假連結。
 */
function ContactCoachButton({ coachId, className = '' }: { coachId: string; className?: string }) {
  const coach = coachById(coachId)
  const href = coach?.socialLinks.line ?? site.lineUrl

  /* 尚未設定 LINE：停用樣式＋明確提示，不導向空連結 */
  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="這位教練的 LINE 尚未開放"
        className={`inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap text-ink-400 ring-1 ring-line sm:w-auto ${className}`}
      >
        <ChatIcon />
        聯絡教練
      </span>
    )
  }

  return (
    <Button
      href={href}
      aria-label={`使用 LINE 聯絡${coach?.name ?? '教練'}`}
      title="使用 LINE 聯絡教練"
      variant="secondary"
      className={`min-h-11 w-full whitespace-nowrap sm:w-auto ${className}`}
    >
      <ChatIcon />
      聯絡教練
    </Button>
  )
}

/**
 * 通用訊息圖示（對話泡泡）。
 * 刻意不用 LINE 官方綠，改為 fill-current 跟隨按鈕文字色，
 * 才不會在深藍／暖白／淺金的配色裡像外掛廣告；
 * 「使用 LINE 聯絡」的資訊由 aria-label 與 title 明確提供。
 */
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 fill-current">
      <path d="M5 4h14a3 3 0 013 3v8a3 3 0 01-3 3H9.6l-4 3.2A1 1 0 014 20.4V18a3 3 0 01-3-3V7a3 3 0 013-3zm2 5.5a1 1 0 100 2h10a1 1 0 100-2zm0 4a1 1 0 100 2h6a1 1 0 100-2z" />
    </svg>
  )
}

/** 行事曆圖示（與訊息圖示同尺寸，維持兩顆按鈕的視覺重量一致） */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 fill-current">
      <path d="M7 2v2h10V2h2v2h1a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V2zm13 8H4v10h16zM6 12h5v4H6z" />
    </svg>
  )
}

/** 'YYYY-MM-DD' + 'HH:mm' → Date（本地時間） */
function lessonStart(date: string, time: string) {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}

/** 顯示用：2026 年 8 月 18 日（週二）19:00 */
function formatLessonTime(date: string, time: string) {
  const d = lessonStart(date, time)
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（週${week}）${time}`
}

/**
 * 產生 Google 行事曆「新增活動」連結。
 * 按下後開啟 Google 行事曆並帶入標題、時間、地點；
 * 提醒時間由使用者行事曆的預設值決定（在 Google 端設定）。
 *
 * 時長未確認時以 60 分鐘估算，並在說明欄註明。
 */
function googleCalendarUrl(b: LibraryBooking) {
  const start = lessonStart(b.date, b.time)
  const minutes = b.durationMin ?? 60
  const end = new Date(start.getTime() + minutes * 60000)

  const stamp = (d: Date) =>
    [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
      'T',
      String(d.getHours()).padStart(2, '0'),
      String(d.getMinutes()).padStart(2, '0'),
      '00',
    ].join('')

  const details = [
    `教練：${b.coachName}`,
    `項目：${b.serviceName}`,
    b.durationMin === null ? '（課程時長待確認，此活動以 60 分鐘估算）' : '',
  ]
    .filter(Boolean)
    .join('\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Poolgress 教練課｜${b.coachName}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: 'Asia/Taipei',
    details,
    location: [b.venueName, b.venueAddress].filter(Boolean).join(' '),
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/* ------------------------------------------------------------------ */

/** 我的訂單：來自 lib/library.ts（結帳成功即產生） */
function OrdersPanel() {
  const lib = useLibrary()

  if (lib.orders.length === 0) {
    return (
      <Card title="我的訂單">
        <EmptyState
          icon="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z"
          title="還沒有訂單"
          description="完成購買後，訂單編號、金額與發票資訊會顯示在這裡。"
          action={
            <Button href="./course.html" size="lg" variant="secondary">
              探索線上課程
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <Card title="我的訂單">
      <ul className="divide-y divide-line">
        {lib.orders.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink-900 tabular-nums">{o.id}</p>
              <p className="mt-0.5 truncate text-xs text-ink-500">
                {new Date(o.date).toLocaleDateString('zh-TW')}・{o.items.map((i) => i.title).join('、')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  o.status === '已完成'
                    ? 'bg-pulse-100 text-pulse-700'
                    : o.status === '待繳費'
                      ? 'bg-brass-400/15 text-brass-700'
                      : 'bg-ivory-100 text-ink-500'
                }`}
              >
                {o.status}
              </span>
              <span className="font-semibold text-ink-900 tabular-nums">NT${o.total.toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-400">
        ⚠️ 目前為前端示範訂單（未實際付款），金流串接後改由後端提供。
      </p>
    </Card>
  )
}

/** 個人檔案：帳號設定 */
function ProfilePanel({ user }: { user: Session }) {
  const named = !!user.name?.trim()
  return (
    <div className="space-y-8">
      <Card title="帳號設定">
        <dl className="divide-y divide-line">
          <Row label="電子信箱" value={user.email} />
          <Row
            label="顯示名稱"
            value={named ? displayNameOf(user) : '尚未設定'}
            muted={!named}
            action={<span className="text-xs text-ink-400">可於上方名稱旁的鉛筆圖示更改</span>}
          />
          <Row
            label="密碼"
            value="••••••••"
            action={
              /* 變更密碼需後端驗證舊密碼，串接後接上 */
              <span className="text-xs text-ink-400">變更密碼功能待後端串接</span>
            }
          />
        </dl>
      </Card>
    </div>
  )
}

/**
 * 顯示名稱編輯：名稱旁的鉛筆鈕進入編輯，Enter 儲存、Esc 取消。
 * 未編輯時在名稱下方顯示「可更名」小提示，讓使用者知道能改。
 */
function NameEditor({ user }: { user: Session }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(displayNameOf(user))
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const start = () => {
    setValue(displayNameOf(user))
    setError(null)
    setEditing(true)
    requestAnimationFrame(() => inputRef.current?.select())
  }

  const save = () => {
    const next = value.trim()
    if (!next) {
      setError('請輸入顯示名稱')
      return
    }
    if (next.length > MAX_NAME_LENGTH) {
      setError(`顯示名稱最多 ${MAX_NAME_LENGTH} 個字`)
      return
    }
    session.setName(next)
    setEditing(false)
    toast('名稱已更新', 'success')
  }

  if (editing) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') setEditing(false)
            }}
            maxLength={MAX_NAME_LENGTH}
            aria-label="顯示名稱"
            aria-invalid={error ? true : undefined}
            className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-xl font-bold text-ink-900 focus:outline-2 focus:outline-offset-1 ${
              error ? 'border-red-400 focus:outline-red-600' : 'border-line focus:outline-brand-600'
            }`}
          />
          <Button size="sm" onClick={save}>
            儲存
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
            取消
          </Button>
        </div>
        {error ? (
          <p role="alert" className="mt-1 text-xs text-red-700">
            {error}
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink-400">
            最多 {MAX_NAME_LENGTH} 個字；按 Enter 儲存、Esc 取消
          </p>
        )}
      </div>
    )
  }

  return (
    /* 整個名稱就是編輯入口；鉛筆圖示保留作為可編輯的視覺提示 */
    <h1 className="text-2xl sm:text-3xl">
      {/* 桌機點兩下進入編輯；觸控裝置維持點一下（雙擊在手機很難操作）；
          鍵盤 Enter／空白鍵同樣可進入 */}
      <button
        type="button"
        onDoubleClick={start}
        onPointerUp={(e) => {
          if (e.pointerType !== 'mouse') start()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            start()
          }
        }}
        title="點兩下更改顯示名稱"
        className="group flex max-w-full items-center gap-2 rounded-lg text-left transition-colors select-none hover:text-brand-700"
      >
        <span className="truncate">{displayNameOf(user)}</span>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors group-hover:bg-ivory-100 group-hover:text-brand-700"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M3 17.2V21h3.8L17.8 10 14 6.2zm17.7-12.9a1 1 0 000-1.4L18.1.3a1 1 0 00-1.4 0l-1.8 1.8L18.7 6z" />
          </svg>
        </span>
        <span className="sr-only">（更改顯示名稱）</span>
      </button>
    </h1>
  )
}

/** 頭像上傳：點擊選檔，瀏覽器端裁切縮圖後存入 session */
function AvatarPicker({ user }: { user: Session }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const pick = async (file?: File) => {
    if (!file) return
    setError(null)
    try {
      session.setAvatar(await readAvatarFile(file))
      toast('頭像已更新', 'success')
    } catch (e) {
      setError(e instanceof Error ? e.message : '頭像更換失敗')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        aria-label="更換頭像"
        className="group relative rounded-full"
      >
        <Avatar user={user} className="h-16 w-16 text-xl" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
            <path d="M9 3l-1.7 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.3L15 3zm3 5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

/** 我的星星：累積數量與取得方式（規則待補，不自行定義） */
function StarsPanel() {
  const lib = useLibrary()
  const total = totalStarsOf(lib)

  return (
    <div className="space-y-8">
      <Card title="目前星星數">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass-400/15 ring-1 ring-brass-400/40 ring-inset">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-brass-600">
              <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z" />
            </svg>
          </span>
          <div>
            <p className="text-3xl font-bold text-ink-900 tabular-nums">{total}</p>
            <p className="text-sm text-ink-500">完成課程單元與實戰闖關可以獲得星星。</p>
          </div>
        </div>
      </Card>

      <Card title="如何獲得星星">
        {/* ⚠️ 實際規則與數量尚未確認，不可自行定義 */}
        <ul className="space-y-3 text-sm text-ink-500">
          <li className="flex items-start gap-2.5">
            <Dot />
            完成課程單元：獲得星星數【待確認】
          </li>
          <li className="flex items-start gap-2.5">
            <Dot />
            完成遊戲闖關：獲得星星數【待確認】
          </li>
          <li className="flex items-start gap-2.5">
            <Dot />
            星星可兌換的項目與條件【待確認】
          </li>
        </ul>
      </Card>

      <Card title="星星紀錄">
        {lib.stars.length === 0 ? (
          <EmptyState
            icon="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z"
            title="還沒有星星紀錄"
            description="開始上課或挑戰闖關後，取得與使用紀錄會顯示在這裡。"
            action={
              <Button href="./challenges.html" size="lg" variant="secondary">
                查看實戰闖關
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {lib.stars.map((s, i) => (
              <li key={`${s.date}-${i}`} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-900">{s.source}</p>
                  <p className="text-xs text-ink-400 tabular-nums">
                    {new Date(s.date).toLocaleDateString('zh-TW')}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 font-semibold text-brass-700 tabular-nums">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-brass-600">
                    <path d="M12 2l2.9 6.3 6.8.8-5 4.6 1.3 6.8L12 17.2 6 20.5l1.3-6.8-5-4.6 6.8-.8z" />
                  </svg>
                  +{s.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

/** 邀請好友：邀請連結與獎勵（皆待後端與行銷方案確認） */
function InvitePanel() {
  return (
    <div className="space-y-8">
      <Card title="你的邀請連結">
        <p className="text-sm leading-relaxed text-ink-500">
          邀請連結由後端在帳號建立時產生，串接後會顯示在這裡並提供複製與分享。
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-line bg-ivory-50 px-4 py-3">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-ink-400">
            <path d="M10.6 13.4a1 1 0 001.4 0l3.5-3.5a3 3 0 10-4.2-4.2L9.6 7.4 11 8.8l1.7-1.7a1 1 0 111.4 1.4l-3.5 3.5a1 1 0 000 1.4zm2.8-2.8a1 1 0 00-1.4 0l-3.5 3.5a1 1 0 11-1.4-1.4l1.7-1.7-1.4-1.4-1.7 1.7a3 3 0 104.2 4.2l3.5-3.5a1 1 0 000-1.4z" />
          </svg>
          <span className="truncate text-sm text-ink-400">邀請連結待補</span>
        </div>
      </Card>

      <Card title="邀請獎勵">
        {/* ⚠️ 獎勵內容與條件尚未確認 */}
        <p className="text-sm leading-relaxed text-ink-500">
          邀請成功後雙方可獲得的獎勵內容與條件【待確認】。
        </p>
      </Card>

      <Card title="已邀請的朋友">
        <EmptyState
          icon="M15 12a4 4 0 10-4-4 4 4 0 004 4zm0 2c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4zM6 9V6H4v3H1v2h3v3h2v-3h3V9z"
          title="還沒有邀請紀錄"
          description="朋友透過你的連結註冊後，會顯示在這裡。"
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 未登入時直接導向登入頁（帶 redirect，登入後回到原本要看的分頁）。
 *
 * 原本這裡是「請先登入 ＋ 前往登入」的攔截畫面，等於多按一次；
 * 改為自動導向，個人區塊一樣不會外洩。
 * 用 replace 不留下這一頁的歷史紀錄，登入頁按上一頁不會又被彈回來。
 */
function SignedOutView() {
  const loginHref = loginUrlWithRedirect(currentPageTarget())
  useEffect(() => {
    location.replace(loginHref)
  }, [loginHref])
  return null
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 sm:p-6">
      <h2 className="text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Row({
  label,
  value,
  muted,
  action,
}: {
  label: string
  value: string
  muted?: boolean
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="flex items-center gap-3">
        <span className={`text-sm ${muted ? 'text-ink-400' : 'text-ink-900'}`}>{value}</span>
        {action}
      </dd>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-ivory-50/60 px-4 py-10 text-center">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-ink-400/60">
        <path d={icon} />
      </svg>
      <p className="mt-3 font-semibold text-ink-900">{title}</p>
      <p className="mt-1 text-sm text-ink-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

function Dot() {
  return <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
}
