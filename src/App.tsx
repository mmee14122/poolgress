import { Navbar } from './components/Navbar'
import { CourseHero } from './components/CourseHero'
import { SectionTabs } from './components/SectionTabs'
import { SideNav } from './components/SideNav'
import { CourseCard } from './components/CourseCard'
import { MobileCtaBar } from './components/MobileCtaBar'
import { Footer } from './components/Footer'
import { Problem } from './components/sections/Problem'
import { HowYouLearn } from './components/sections/HowYouLearn'
import { Gains } from './components/sections/Gains'
import { FitFor } from './components/sections/FitFor'
import { Features } from './components/sections/Features'
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
      <Navbar />
      {/* Hero 位於三欄版面之前；下一區包在 .hero-next 隨進度淡入並吸附 */}
      <CourseHero />
      <div className="hero-next">
        <SectionTabs active={active} />

        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)_21rem] lg:items-start lg:gap-8 xl:grid-cols-[13rem_minmax(0,1fr)_23rem] xl:gap-12">
          {/* 左欄：桌機專用錨點導覽。sticky 必須放在格線欄本身，
              內層元素會因 items-start 讓欄高縮成內容高而失效 */}
          <div className="sticky top-24 hidden pt-10 lg:block">
            <SideNav active={active} />
          </div>

          {/* 中欄：課程簡介六區段（課名與定位由 Hero 呈現）。
              手機版不放內容流購買卡，購買動線由底部固定列（MobileCtaBar）承擔 */}
          <main className="min-w-0 divide-y divide-line">
            <Problem />
            <HowYouLearn />
            <Gains />
            <FitFor />
            <Features />
            <Chapters />
            <Reviews />
            <CoachSection />
            <Faq />
          </main>

          {/* 右欄：桌機 sticky 課程卡（id 供 Hero 的立即購買捲動定位） */}
          <aside id="buy-card" className="sticky top-24 hidden scroll-mt-24 pt-10 lg:block">
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
