import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

/**
 * 預約場館（booking.html）— Coming Soon（2026-09-06）。
 * 場館 2028 才開，先用一頁品牌口吻的「還沒開」接住點進來的人；
 * 正式訂位流程已做好在 BookingForm.tsx，接系統時把這裡換成 <BookingForm />。
 */
export default function BookingApp() {
  return (
    <div className="min-h-screen bg-[#F2EEE6] text-[#252C30]">
      <Navbar />

      <main className="site-container flex min-h-[calc(100svh-64px)] items-center py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="pg-t-eyebrow">RESERVATION · COMING 2028</p>

          <h1 className="pg-t-serif-editorial mt-4 text-[38px] leading-[1.12] sm:text-[56px]">
            球桌還在路上。
          </h1>

          <p className="pg-t-body mt-7 max-w-lg text-[17px] leading-[1.8]">
            Poolgress Club 預計於 2028 年在台北開幕。
            <br />
            在那之前，先從 App 開始你的下一局。
            <br />
            開幕那天，我們球桌見。
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="./#app-download" className="pg-btn pg-btn-shape bg-[#D2C2AD] text-[#252C30] hover:bg-[#DACCB9]">
              先下載 Poolgress App
            </a>
            <a href="./" className="pg-btn pg-btn-shape border border-[rgba(20,30,35,.32)] text-[#252C30] hover:bg-[#252C30]/5">
              回首頁
            </a>
          </div>

          <p className="mt-12 text-[10px] tracking-[0.2em] text-[#252C30]/55 uppercase">Taipei · 2028 · Poolgress Club</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
