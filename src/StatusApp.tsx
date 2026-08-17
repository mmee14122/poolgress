import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { StatusIllustration, type IllustrationStatus } from './components/StatusIllustration'
import { Button } from './ui/Button'
import { site } from './data/site'

type SystemState = 'maintenance' | 'offline' | 'error' | 'not-found'

/**
 * 系統狀態頁（status.html?state=...）。
 *
 * 一頁承載四種全站層級的狀況，共用同一套版型與插圖語言：
 *   maintenance 服務維護中｜offline 網路連線中斷
 *   error       載入失敗（可重試）｜not-found 找不到頁面
 *
 * 網路狀態會即時反映 online／offline 事件：斷線時自動切到 offline，
 * 恢復連線後按鈕變成「重新載入」而不是讓使用者對著死畫面等。
 * 導向規則：這一頁不自動跳轉，永遠由使用者決定下一步。
 */
export default function StatusApp() {
  const initial = (new URLSearchParams(location.search).get('state') as SystemState) || 'error'
  const [state, setState] = useState<SystemState>(initial)
  const [online, setOnline] = useState(navigator.onLine)
  const [retrying, setRetrying] = useState(false)

  /* 連線狀態即時反映：斷線切到 offline，恢復後保留在同一頁但更新提示 */
  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => {
      setOnline(false)
      setState('offline')
    }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  const retry = () => {
    setRetrying(true)
    /* 重新載入前一頁；沒有來源時回首頁，不留在死畫面 */
    window.setTimeout(() => {
      if (document.referrer && document.referrer.startsWith(location.origin)) {
        location.href = document.referrer
      } else {
        location.reload()
      }
    }, 400)
  }

  const view = copyOf(state, online)

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-xl flex-col items-center px-5 py-16 text-center sm:px-6 lg:py-24">
        <div role="status" aria-live="polite">
          <StatusIllustration status={view.illus} />
          <h1 className="mt-6 text-2xl sm:text-3xl">{view.title}</h1>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">{view.body}</p>
        </div>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:justify-center">
          {view.canRetry && (
            <Button size="lg" onClick={retry} disabled={retrying}>
              {retrying ? '重新載入中…' : '重新嘗試'}
            </Button>
          )}
          <Button size="lg" variant={view.canRetry ? 'secondary' : 'primary'} href="./">
            回到首頁
          </Button>
        </div>

        {state === 'offline' && online && (
          <p className="mt-5 text-sm font-semibold text-[#3F7A6C]">
            網路已恢復，可以重新嘗試了。
          </p>
        )}

        <p className="mt-8 text-sm text-ink-500">
          問題持續發生？
          <a
            href={`mailto:${site.supportEmail}`}
            className="ml-1 font-semibold text-brand-700 underline underline-offset-4"
          >
            聯絡我們
          </a>
        </p>

        {/* 常用入口：避免使用者卡在這一頁沒有去處 */}
        <nav aria-label="其他入口" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {[
            { label: '線上課程', href: './course.html' },
            { label: '實戰闖關', href: './challenges.html' },
            { label: '關於教練', href: './coach.html' },
            { label: '常見問題', href: './faq.html' },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-semibold text-brand-700 underline underline-offset-4"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  )
}

/** 每種狀態的插圖、標題與說明；語氣與其他失敗畫面一致 */
function copyOf(
  state: SystemState,
  online: boolean,
): { illus: IllustrationStatus; title: string; body: string; canRetry: boolean } {
  switch (state) {
    case 'maintenance':
      return {
        illus: 'unavailable',
        title: '這張球桌暫時收起來了。',
        body: '我們正在進行系統維護，很快就會回來。期間你的帳號、課程與訂單都不會受到影響。',
        canRetry: true,
      }
    case 'offline':
      return {
        illus: 'offline',
        title: '球路暫時中斷了。',
        body: online
          ? '剛才連線中斷，現在網路看起來已經恢復。重新嘗試就能繼續。'
          : '目前沒有網路連線。確認 Wi-Fi 或行動網路後，再重新嘗試一次。',
        canRetry: true,
      }
    case 'not-found':
      return {
        illus: 'empty-cart',
        title: '這一球打到界外了。',
        body: '找不到這個頁面，可能是網址有誤或內容已經移動。從下面挑一個地方繼續吧。',
        canRetry: false,
      }
    default:
      return {
        illus: 'failed',
        title: '這一桿差一點。',
        body: '頁面沒有載入完成。這通常是暫時的，重新嘗試一次多半就會好。',
        canRetry: true,
      }
  }
}
