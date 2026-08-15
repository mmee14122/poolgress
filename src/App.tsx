import { Navbar } from './components/Navbar'
import { PromoBar } from './components/PromoBar'
import { CourseHero } from './components/CourseHero'
import { SectionTabs } from './components/SectionTabs'
import { SideNav } from './components/SideNav'
import { CourseCard } from './components/CourseCard'
import { MobileCtaBar } from './components/MobileCtaBar'
import { Footer } from './components/Footer'
import { CourseInfo } from './components/sections/CourseInfo'
import { Stuck } from './components/sections/Stuck'
import { Outcomes } from './components/sections/Outcomes'
import { HowSteps } from './components/sections/HowSteps'
import { ChallengeSection } from './components/sections/ChallengeSection'
import { FitCheck } from './components/sections/FitCheck'
import { Chapters } from './components/sections/Chapters'
import { Reviews } from './components/sections/Reviews'
import { CoachSection } from './components/sections/CoachSection'
import { Faq } from './components/sections/Faq'
import { sections } from './content/course'
import { useScrollSpy } from './hooks/useScrollSpy'

const sectionIds = sections.map((s) => s.id)

/**
 * 課程簡介頁（獨立模板）。
 * 課程簡介（卡在哪 → 怎麼學 → 得到什麼 → 適合誰 → 特色）
 * → 章節 → 學員評價 → 關於教練 → FAQ
 *
 * 桌機：左錨點導覽｜中內容｜右 sticky 課程卡
 * 手機：錨點導覽變橫向標籤列，底部固定 CTA 列。
 */
export default function App() {
  const active = useScrollSpy(sectionIds)

  return (
    <>
      <PromoBar />
      <Navbar />
      {/* Hero 位於三欄版面之前；下一區包在 .hero-next 隨進度淡入並吸附 */}
      <CourseHero />
      <div className="hero-next">
        <SectionTabs active={active} />

        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)_21rem] lg:items-start lg:gap-8 xl:grid-cols-[13rem_minmax(0,1fr)_23rem] xl:gap-12">
          {/* 左欄：桌機專用錨點導覽。sticky 必須放在格線欄本身，
              內層元素會因 items-start 讓欄高縮成內容高而失效 */}
          <div className="sticky top-[calc(var(--promo-h)+6rem)] hidden pt-10 lg:block">
            <SideNav active={active} />
          </div>

          {/* 中欄：課程簡介六區段（課名與定位由 Hero 呈現）。
              手機版不放內容流購買卡，購買動線由底部固定列（MobileCtaBar）承擔 */}
          <main className="min-w-0 divide-y divide-line">
            <CourseInfo />
            <Stuck />
            <Outcomes />
            <HowSteps />
            <ChallengeSection />
            <FitCheck />
            <Chapters />
            <Reviews />
            <CoachSection />
            <Faq />
          </main>

          {/* 右欄：桌機 sticky 課程卡（id 供 Hero 的立即購買捲動定位） */}
          {/* top 取 promo+1.5rem：加上 pt-10（2.5rem）後，卡片可見上緣貼齊導覽列（4rem）底部 */}
          <aside id="buy-card" className="sticky top-[calc(var(--promo-h)+1.5rem)] hidden scroll-mt-[calc(var(--promo-h)+1.5rem)] pt-10 lg:block">
            <CourseCard />
          </aside>
        </div>
        </div>
      </div>

      <Footer />
      <MobileCtaBar />
    </>
  )
}
