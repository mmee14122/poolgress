import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { venues, venueContactEmail } from './data/venues'

/**
 * 合作場館頁。
 * 資料來源：src/data/venues.ts（目前為空陣列＝顯示洽談中狀態；
 * 新增場館後自動變成清單）。
 */
export default function VenuesApp() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="text-3xl sm:text-4xl">合作場館</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">
          課程學完，實戰闖關需要一張真的球桌。我們正在與各地球館洽談合作，
          讓 Poolgress 學員有更好的練習環境。
        </p>

        {venues.length === 0 ? (
          <div className="mt-10 rounded-card border border-dashed border-line bg-ivory-50/60 px-6 py-16 text-center">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-auto h-10 w-10 fill-ink-400/60">
              <path d="M12 2a7 7 0 00-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
            </svg>
            <p className="mt-4 font-semibold text-ink-900">合作場館洽談中</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
              確定合作的球館會陸續公布在這裡，包含地址、地圖與學員專屬優惠。
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {venues.map((v) => (
              <li
                key={v.name}
                className="flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-sm"
              >
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600">
                  {v.image ? (
                    <img src={v.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 fill-white/30">
                      <path d="M12 2a7 7 0 00-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold text-brand-700">{v.city}</p>
                  <h2 className="mt-1 text-lg">{v.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-ink-500">{v.address}</p>
                  {v.note && <p className="mt-2 text-sm text-brass-700">{v.note}</p>}
                  {v.mapUrl && (
                    <div className="mt-4">
                      <Button href={v.mapUrl} variant="secondary" size="sm">
                        在地圖中開啟
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 場館合作洽談 */}
        <div className="mt-12 rounded-card bg-brand-950 p-8 text-center sm:p-10">
          <h2 className="text-xl text-white">你是球館經營者嗎？</h2>
          <p className="mx-auto mt-3 max-w-lg leading-relaxed text-white/70">
            我們正在尋找願意一起把撞球教育做好的合作夥伴。歡迎來信聊聊。
          </p>
          <div className="mt-6">
            <Button href={`mailto:${venueContactEmail}`} size="lg">
              洽談合作
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
