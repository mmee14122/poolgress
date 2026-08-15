import { PromoBar } from './components/PromoBar'
import { Navbar } from './components/Navbar'
import { SectionTabs } from './components/SectionTabs'
import { SideNav } from './components/SideNav'
import { PurchaseCard } from './components/PurchaseCard'
import { MobileBuyBar } from './components/MobileBuyBar'
import { Footer } from './components/Footer'
import { Overview } from './components/sections/Overview'
import { Chapters } from './components/sections/Chapters'
import { Reviews } from './components/sections/Reviews'
import { Coach } from './components/sections/Coach'
import { Faq } from './components/sections/Faq'
import { sections } from './content/course'
import { useScrollSpy } from './hooks/useScrollSpy'

const sectionIds = sections.map((s) => s.id)

/**
 * 課程詳情頁。
 *
 * 桌機：左錨點導覽｜中內容｜右購買卡（三欄）
 * 手機：導覽收成漢堡選單，左欄變成橫向標籤列，購買卡插進內容流，
 *       底部另有固定購買列。
 */
export default function App() {
  const active = useScrollSpy(sectionIds)

  return (
    <>
      <PromoBar />
      <Navbar />
      <SectionTabs active={active} />

      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)_21rem] lg:items-start lg:gap-8 xl:grid-cols-[13rem_minmax(0,1fr)_23rem] xl:gap-12">
          {/* 左欄：桌機專用，SideNav 內部自行 sticky */}
          <div className="hidden pt-10 lg:block">
            <SideNav active={active} />
          </div>

          {/* 中欄：主要閱讀內容 */}
          <main className="min-w-0 divide-y divide-line">
            <Overview />

            {/* 手機版的購買卡：插在簡介之後，是使用者建立興趣後的第一個決策點 */}
            <div id="purchase" className="scroll-mt-32 py-8 lg:hidden">
              <PurchaseCard />
            </div>

            <Chapters />
            <Reviews />
            <Coach />
            <Faq />
          </main>

          {/* 右欄：桌機 sticky 購買卡 */}
          <aside className="sticky top-24 hidden pt-10 lg:block">
            <PurchaseCard />
          </aside>
        </div>
      </div>

      <Footer />
      <MobileBuyBar />
    </>
  )
}
