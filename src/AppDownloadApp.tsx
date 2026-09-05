import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

/**
 * App 下載（app.html）— Coming Soon（2026-09-06）。
 * App 預計 2026 年底上架；上架後這頁改成偵測裝置跳轉 App Store／Google Play，
 * 首頁手機「下載 Poolgress App」連結指到這裡。
 */
export default function AppDownloadApp() {
  return (
    <div className="min-h-screen bg-[#F2EEE6] text-[#252C30]">
      <Navbar />

      <main className="site-container flex min-h-[calc(100svh-64px)] items-center py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="pg-t-eyebrow">POOLGRESS APP · LATE 2026</p>

          <h1 className="pg-t-serif-editorial mt-4 text-[38px] leading-[1.12] sm:text-[56px]">
            App 還在最後一桿。
          </h1>

          <p className="pg-t-body mt-7 max-w-lg text-[17px] leading-[1.8]">
            Poolgress App 預計 2026 年底上架 App Store 與 Google Play。
            <br />
            闖關、學習、找一起打球的朋友，都會在同一個地方。
            <br />
            上架那天，這一頁會直接帶你去下載。
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="./challenges.html" className="pg-btn pg-btn-shape bg-[#D2C2AD] text-[#252C30] hover:bg-[#DACCB9]">
              先在網頁版闖關
            </a>
            <a href="./" className="pg-btn pg-btn-shape border border-[rgba(20,30,35,.32)] text-[#252C30] hover:bg-[#252C30]/5">
              回首頁
            </a>
          </div>

          <p className="mt-12 text-[10px] tracking-[0.2em] text-[#252C30]/55 uppercase">iOS · Android · Late 2026</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
