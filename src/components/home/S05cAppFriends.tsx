import { home } from '../../data/home'
import { Button } from '../../ui/Button'
import { useSession } from '../../lib/session'
import { loginUrlWithRedirect } from '../../lib/auth'

/**
 * SECTION 05.6｜App 第二段：好友與星星。
 *
 * 與上一段（個人闖關）同屬 POOLGRESS APP 主題，但價值不同：
 * 這一段講「一起挑戰、一起前進」，因此排版與上一段交錯——
 * 上一段文字左／手機右，這一段手機左／文字右。
 *
 * ⚠️ 不做排行榜或手遊 HUD：進度只是好友之間的輕量互動，
 * 重點是陪伴與持續練習。
 * 截圖待補時顯示同比例的佔位框，拿到真圖只要填 data 的 src。
 */
export function S05cAppFriends() {
  const { appFriends } = home
  const user = useSession()
  /* 未登入先去登入頁，登入後回到我的好友；已登入直接進去 */
  const ctaHref = user ? './invite.html' : loginUrlWithRedirect('./invite.html')

  return (
    <section id="app-friends" className="scroll-mt-24 bg-brand-50 pt-14 pb-16 lg:pt-14 lg:pb-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[auto_1fr] lg:gap-16">
        {/* contents：手機時讓文字與 CTA 各自成為格線項目，
            才能排成 文字 → 圖片 → CTA；桌機恢復為同一欄 */}
        <div className="contents lg:block">
          <div className="order-1 lg:order-none">
            <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">
              {appFriends.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl">{appFriends.title}</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-500">{appFriends.body}</p>
          </div>
          <div className="order-3 lg:order-none lg:mt-7">
            <Button href={ctaHref} size="lg">
              {appFriends.cta.label}
            </Button>
          </div>
        </div>
        {/* 手機：文字 → 圖片 → CTA（DOM 順序即手機順序）；
            桌機用 lg:order-first 把手機畫面移到左邊，與上一段左右交錯 */}
        <ul className="order-2 flex justify-center gap-2.5 sm:gap-5 lg:order-first">
          {appFriends.screenshots.map((shot) => (
            <li key={shot.alt}>
              {/* 三支在手機也全部顯示，寬度縮小以容納 375px 螢幕 */}
              <div className="w-[6.25rem] sm:w-32 lg:w-40">
                {shot.src ? (
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="w-full rounded-2xl object-contain shadow-sm ring-1 ring-line/70"
                  />
                ) : (
                  <div className="flex aspect-[9/19.5] w-full items-center justify-center rounded-2xl bg-white ring-1 ring-line ring-inset">
                    <span className="px-3 text-center text-xs text-ink-500">
                      {shot.caption}
                      <br />
                      畫面待補
                    </span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}
