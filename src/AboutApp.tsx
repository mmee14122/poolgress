import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { StoryTable } from './components/home/StoryTable'
import { home } from './data/home'

/**
 * 關於 Poolgress（about.html）：品牌與願景頁。
 *
 * 頁面順序：Hero 主視覺 → 長期願景 → 合作成果 → 頁尾。
 * 這一頁不放課程導流 CTA，收尾是「實際行動與信任證明」而非購買按鈕。
 */
export default function AboutApp() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <VisionSection />
        <ImpactSection />
      </main>
      <Footer theme="dark" />
    </>
  )
}

/**
 * Hero：主視覺放在背景，標題疊在上方。
 * 素材由 data 的 about.heroMedia 決定（image／video／暫代的球桌動畫），
 * 更換素材不需要改這裡的版面。
 */
function AboutHero() {
  const { heroMedia, heroTitle } = home.about

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      {/* 主視覺 */}
      <div aria-hidden={heroMedia.kind === 'animation'} className="absolute inset-0">
        {heroMedia.kind === 'image' && heroMedia.src && (
          <img
            src={heroMedia.src}
            alt={heroMedia.alt ?? ''}
            className="h-full w-full object-cover"
          />
        )}
        {heroMedia.kind === 'video' && heroMedia.src && (
          <video
            src={heroMedia.src}
            poster={heroMedia.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        )}
        {/* 暫代視覺：正式品牌主視覺到位前，沿用首頁 Hero 的球桌球路 */}
        {(heroMedia.kind === 'animation' || !heroMedia.src) && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_35%,rgba(56,126,217,0.28),transparent)]" />
            <StoryTable />
          </>
        )}
      </div>

      {/* 遮罩：確保標題在任何素材上都清楚 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/60 to-brand-950"
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{heroTitle}</h1>
      </div>
    </section>
  )
}

/**
 * 長期願景：文案一字不改，桌機雙欄閱讀版面。
 *
 * 桌機：左欄（標題）約 38%，在區塊範圍內 sticky 當視覺錨點；
 *       右欄（內文）約 62%，限制閱讀寬度 40rem，全部左對齊。
 * 平板手機：單欄、不 sticky，順序為小標 → 主標 → 內文 → 引言。
 * 主標與收束文案的斷行都交給版面寬度決定，不硬拆行。
 */
function VisionSection() {
  const { about } = home

  return (
    <section className="bg-brand-950 py-16 text-white lg:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[38fr_62fr] lg:gap-16">
        {/* 左欄：視覺錨點 */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold tracking-widest text-brass-300 uppercase">
            {about.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl leading-snug text-white sm:text-4xl">
            {about.title.join('')}
          </h2>
        </div>

        {/* 右欄：敘事 */}
        <div className="max-w-[40rem]">
          <div className="space-y-8 text-base leading-[1.9] text-white/70">
            {about.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* 願景引言：左側細線標記，不做成卡片 */}
          <p className="mt-14 border-l-2 border-brass-300/60 pl-5 text-lg leading-[1.9] font-medium text-white/85 sm:text-xl">
            {about.hope.join('')}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * 合作成果：全寬沉浸式區塊。
 * 背景照片未備妥時退回深藍漸層，不放假圖；遮罩固定存在，換圖後對比度仍達標。
 */
function ImpactSection() {
  const { impact } = home.about

  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      {impact.background.src ? (
        <img
          src={impact.background.src}
          alt={impact.background.alt ?? ''}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(56,126,217,0.35),transparent)]"
        />
      )}
      {/* 深色半透明遮罩：文字與數字可讀性 */}
      <div aria-hidden="true" className="absolute inset-0 bg-brand-950/75" />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <h2 className="text-3xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
          {impact.title}
        </h2>
        <p className="mt-5 text-base text-brass-300 sm:text-lg">{impact.subtitle}</p>

        {/* 手機：三欄緊湊排列；桌機：三欄平均 */}
        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8">
          {impact.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-bold text-white tabular-nums sm:text-4xl lg:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-white/75 sm:text-base">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
