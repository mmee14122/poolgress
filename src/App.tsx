import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PainPoints } from './components/PainPoints'
import { Outcomes } from './components/Outcomes'
import { Curriculum } from './components/Curriculum'
import { Instructor } from './components/Instructor'
import { Testimonials } from './components/Testimonials'
import { Pricing } from './components/Pricing'
import { Faq } from './components/Faq'
import { Guarantee } from './components/Guarantee'
import { FinalCta } from './components/FinalCta'
import { StickyBar } from './components/StickyBar'
import { Footer } from './components/Footer'

/**
 * 長頁式銷售頁。區塊順序即轉換動線，調整順序前先想清楚理由：
 * 痛點 → 成果 → 內容 → 信任 → 價格 → 疑慮 → 保證 → 收尾 CTA
 */
export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Outcomes />
        <Curriculum />
        <Instructor />
        <Testimonials />
        <Pricing />
        <Faq />
        <Guarantee />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
    </>
  )
}
