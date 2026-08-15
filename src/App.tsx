import { Navbar } from './components/Navbar'
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
import { course, sections } from './content/course'
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
      <SectionTabs active={active} />

      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)_21rem] lg:items-start lg:gap-8 xl:grid-cols-[13rem_minmax(0,1fr)_23rem] xl:gap-12">
          {/* 左欄：桌機專用錨點導覽。sticky 必須放在格線欄本身，
              內層元素會因 items-start 讓欄高縮成內容高而失效 */}
          <div className="sticky top-24 hidden pt-10 lg:block">
            <SideNav active={active} />
          </div>

          {/* 中欄：課程簡介六區段 */}
          <main className="min-w-0 divide-y divide-line">
            {/* 頁首：課名與定位 */}
            <header className="pt-8 pb-10 lg:pt-12">
              <p className="text-sm font-semibold tracking-widest text-felt-600 uppercase">
                Poolgress 課程
              </p>
              <h1 className="mt-3 text-3xl leading-[1.3] sm:text-4xl">{course.name}</h1>
              <p className="mt-3 text-lg text-ink-500">{course.tagline}</p>
            </header>

            {/* 手機：購買卡改為一般內容區塊（桌機由右欄 sticky 呈現） */}
            <div id="purchase" className="scroll-mt-32 py-8 lg:hidden">
              <CourseCard />
            </div>

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

          {/* 右欄：桌機 sticky 課程卡 */}
          <aside className="sticky top-24 hidden pt-10 lg:block">
            <CourseCard />
          </aside>
        </div>
      </div>

      <Footer />
      <MobileCtaBar />
    </>
  )
}
