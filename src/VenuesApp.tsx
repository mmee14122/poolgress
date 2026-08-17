import { useEffect, useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { StatusIllustration } from './components/StatusIllustration'
import { Button } from './ui/Button'
import { venues, demoVenues, venueContactEmail, type Venue } from './data/venues'

type LoadState = 'loading' | 'ready' | 'error'
/** 定位狀態：未要求／已授權／被拒絕／此裝置不支援 */
type GeoState = 'idle' | 'granted' | 'denied' | 'unsupported'

/**
 * 合作場館頁。
 *
 * 資料來源：src/data/venues.ts（venues 目前為空＝顯示洽談中狀態）。
 * 未來換成 Google Maps API 時，只需把 list 換成 API 回傳，
 * 底下的載入中／載入失敗／無資料／篩選無結果／定位被拒五種狀態都不用改。
 *
 * 開發預覽（不影響正式資料）：
 *   ?demo=venues   載入示範場館，預覽卡片列表與篩選
 *   ?state=loading 停在載入中
 *   ?state=error   載入失敗
 */
export default function VenuesApp() {
  const params = useMemo(() => new URLSearchParams(location.search), [])
  const useDemo = params.get('demo') === 'venues'
  const forced = params.get('state')

  const source = useDemo ? demoVenues : venues
  const [state, setState] = useState<LoadState>('loading')
  const [retry, setRetry] = useState(0)
  const [city, setCity] = useState<string>('all')
  const [geo, setGeo] = useState<GeoState>('idle')

  /* 模擬讀取；後端／Maps API 接上後換成實際請求 */
  useEffect(() => {
    if (forced === 'loading') {
      setState('loading')
      return
    }
    setState('loading')
    const t = window.setTimeout(() => setState(forced === 'error' ? 'error' : 'ready'), 450)
    return () => clearTimeout(t)
  }, [forced, retry])

  const cities = useMemo(() => Array.from(new Set(source.map((v) => v.city))), [source])
  const list = city === 'all' ? source : source.filter((v) => v.city === city)

  /** 使用者主動要求定位；被拒絕時給出可理解的替代方案，不擋住其他內容 */
  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeo('unsupported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => setGeo('granted'),
      () => setGeo('denied'),
      { timeout: 8000 },
    )
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="text-3xl sm:text-4xl">合作場館</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">
          課程學完，實戰闖關需要一張真的球桌。我們正在與各地球館洽談合作，
          讓 Poolgress 學員有更好的練習環境。
        </p>

        {useDemo && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-brass-400/12 px-4 py-3 text-sm text-ink-700 ring-1 ring-brass-400/30 ring-inset"
          >
            目前顯示的是<strong className="font-semibold">示範場館資料</strong>（網址帶 ?demo=venues），
            並非真實合作球館。
          </p>
        )}

        <MapPanel geo={geo} onLocate={locate} count={list.length} />

        {state === 'loading' && <LoadingList />}
        {state === 'error' && <LoadFailed onRetry={() => setRetry((n) => n + 1)} />}

        {state === 'ready' && source.length === 0 && <NoPartnersYet />}

        {state === 'ready' && source.length > 0 && (
          <>
            <CityFilter cities={cities} value={city} onChange={setCity} />
            {list.length === 0 ? (
              <NoResult onReset={() => setCity('all')} city={city} />
            ) : (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {list.map((v) => (
                  <VenueCard key={v.name} venue={v} />
                ))}
              </ul>
            )}
          </>
        )}

        <ContactBlock />
      </main>
      <Footer />
    </>
  )
}

/**
 * 地圖區：正式版改嵌入 Google Maps。
 * 目前為佔位，同時承載「使用附近搜尋」的定位權限狀態。
 */
function MapPanel({
  geo,
  onLocate,
  count,
}: {
  geo: GeoState
  onLocate: () => void
  count: number
}) {
  return (
    <section aria-label="場館地圖" className="mt-8">
      <div className="relative overflow-hidden rounded-card border border-line bg-brand-50">
        {/* 佔位圖：極簡街廓線條，不假裝是真地圖 */}
        <svg
          viewBox="0 0 800 260"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
          className="h-44 w-full sm:h-56"
        >
          <g stroke="#93b4e0" strokeWidth="2" opacity="0.5" fill="none">
            <path d="M0 70 H800 M0 160 H800 M140 0 V260 M330 0 V260 M520 0 V260 M690 0 V260" />
          </g>
          <path d="M0 205 Q200 175 400 205 T800 195" stroke="#7fb3a4" strokeWidth="10" fill="none" opacity="0.35" />
          <g fill="#1f3c6a" opacity="0.75">
            <circle cx="330" cy="70" r="7" />
            <circle cx="520" cy="160" r="7" />
            <circle cx="140" cy="160" r="7" />
          </g>
        </svg>

        <div className="flex flex-col gap-3 border-t border-line bg-white/85 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-ink-500">
            地圖功能準備中，正式版會顯示每間合作球館的位置與導航。
            {count > 0 && <span className="ml-1 tabular-nums">目前列出 {count} 間。</span>}
          </p>
          <Button variant="secondary" onClick={onLocate} className="min-h-11 shrink-0">
            使用我的位置
          </Button>
        </div>
      </div>

      {geo === 'granted' && (
        <p role="status" className="mt-3 text-sm text-ink-500">
          已取得你的位置。地圖功能上線後，這裡會依距離排序最近的球館。
        </p>
      )}
      {geo === 'denied' && (
        <p
          role="status"
          className="mt-3 rounded-lg bg-[#B5645A]/[0.07] px-4 py-3 text-sm leading-relaxed text-ink-700 ring-1 ring-[#B5645A]/25 ring-inset"
        >
          沒有取得定位權限，因此無法依距離排序。你仍然可以用底下的縣市篩選找球館；
          若要開啟定位，請到瀏覽器的網站設定調整。
        </p>
      )}
      {geo === 'unsupported' && (
        <p role="status" className="mt-3 text-sm text-ink-500">
          這個裝置或瀏覽器不支援定位，請改用縣市篩選。
        </p>
      )}
    </section>
  )
}

/** 縣市篩選：目前資料量小，用橫向膠囊即可，不做下拉選單 */
function CityFilter({
  cities,
  value,
  onChange,
}: {
  cities: string[]
  value: string
  onChange: (v: string) => void
}) {
  const options = ['all', ...cities]
  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-ink-700">依縣市篩選</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scroll-row">
        {options.map((c) => {
          const active = c === value
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-pressed={active}
              className={`flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-ink-700 ring-1 ring-line ring-inset hover:bg-ivory-100'
              }`}
            >
              {c === 'all' ? '全部' : c}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-sm">
      <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600">
        {venue.image ? (
          <img src={venue.image} alt={venue.name} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 48 24" aria-hidden="true" className="h-8 w-16 opacity-70">
            <circle cx="12" cy="12" r="6" fill="#fbf9f5" />
            <circle cx="34" cy="12" r="6" fill="#d9a441" />
          </svg>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          {venue.city}
        </span>
        <p className="mt-2 font-semibold break-words text-ink-900">{venue.name}</p>
        <p className="mt-1 text-sm break-words text-ink-500">{venue.address}</p>
        {venue.note && <p className="mt-2 text-sm text-ink-700">{venue.note}</p>}
        <div className="mt-4 pt-1">
          {venue.mapUrl ? (
            <Button href={venue.mapUrl} variant="secondary" className="min-h-11">
              在 Google 地圖開啟
            </Button>
          ) : (
            /* 沒有地圖連結時不放假連結，改為停用樣式並說明 */
            <span className="inline-flex min-h-11 items-center rounded-full bg-ivory-100 px-4 text-sm font-semibold text-ink-500">
              地圖連結待補
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

/** 載入中：卡片骨架 */
function LoadingList() {
  return (
    <div role="status" aria-live="polite" className="mt-8">
      <span className="sr-only">場館載入中</span>
      <ul className="grid gap-6 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <li key={i} className="overflow-hidden rounded-card border border-line bg-white">
            <div className="aspect-video w-full animate-pulse bg-ivory-100" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-ivory-100" />
              <div className="h-4 w-full animate-pulse rounded bg-ivory-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-ivory-100" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 載入失敗：可重試 */
function LoadFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="mt-8 rounded-card border border-line bg-white px-6 py-12 text-center">
      <StatusIllustration status="offline" />
      <p className="mt-5 text-lg font-semibold text-ink-900">球路暫時中斷了。</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        場館資料沒有載入成功，可能是連線不穩。請稍後再試一次。
      </p>
      <div className="mt-6">
        <Button onClick={onRetry} size="lg">
          重新載入
        </Button>
      </div>
    </div>
  )
}

/** 尚無合作場館（正式資料為空時的狀態） */
function NoPartnersYet() {
  return (
    <div className="mt-8 rounded-card border border-dashed border-line bg-ivory-50/60 px-6 py-14 text-center">
      <StatusIllustration status="unavailable" />
      <p className="mt-5 font-semibold text-ink-900">合作場館洽談中</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        確定合作的球館會陸續公布在這裡，包含地址、地圖與學員專屬優惠。
      </p>
    </div>
  )
}

/** 篩選後沒有結果 */
function NoResult({ city, onReset }: { city: string; onReset: () => void }) {
  return (
    <div role="status" className="mt-6 rounded-card border border-line bg-white px-6 py-12 text-center">
      <StatusIllustration status="empty-cart" />
      <p className="mt-5 font-semibold text-ink-900">{city} 目前沒有合作球館。</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        我們仍在洽談中。可以先看看其他縣市，或把你希望合作的球館告訴我們。
      </p>
      <div className="mt-6">
        <Button onClick={onReset} variant="secondary">
          查看全部縣市
        </Button>
      </div>
    </div>
  )
}

/** 場館合作洽談窗口 */
function ContactBlock() {
  return (
    <section className="mt-12 rounded-card bg-ivory-50 p-6 text-center sm:p-8">
      <h2 className="text-lg">想成為合作球館？</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-500">
        我們持續尋找願意一起把撞球變得更好玩的球館夥伴。歡迎來信聊聊。
      </p>
      <div className="mt-5">
        <Button href={`mailto:${venueContactEmail}`} variant="secondary">
          {venueContactEmail}
        </Button>
      </div>
    </section>
  )
}
