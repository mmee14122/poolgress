import { home } from '../../data/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 05.5｜App 預告
 *
 * 首頁只給一句價值主張＋一到兩張畫面，完整的四步驟流程在實戰闖關頁，
 * 首頁不重複細節（避免首頁資訊過重）。
 * 桌機左文右圖，手機單欄：文字 → 畫面 → CTA。
 */
export function S05bAppTeaser() {
  const { appTeaser } = home

  return (
    <section id="app" className="scroll-mt-24 bg-white pt-16 pb-14 lg:pt-24 lg:pb-14">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">
            {appTeaser.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl">{appTeaser.title}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-500">{appTeaser.body}</p>
          <Button href={appTeaser.cta.href} size="lg" className="mt-7">
            {appTeaser.cta.label}
          </Button>
        </div>

        {/* 一到兩張 App 畫面；圖片未備妥時以同比例佔位框顯示，不放假圖 */}
        <ul className="flex justify-center gap-4 sm:gap-6">
          {appTeaser.images.map((img) => (
            <li key={img.alt}>
              {/* 手機也要看得到兩張（原本第二張被 hidden 藏起來）：
                  縮小寬度讓兩支並排仍放得下 375px 螢幕 */}
              <div className="w-[7.5rem] sm:w-40 lg:w-44">
                {img.src ? (
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full rounded-2xl object-contain shadow-sm ring-1 ring-line/70"
                  />
                ) : (
                  <div className="flex aspect-[9/19.5] w-full items-center justify-center rounded-2xl bg-white ring-1 ring-line ring-inset">
                    <span className="px-3 text-center text-xs text-ink-500">App 畫面待補</span>
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
