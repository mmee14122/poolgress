import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { shopCategories, shopProducts, shopSections, type ShopProduct } from './data/shop'

/**
 * 球具選物（shop.html）— 2026-09-06。
 * 架構參考 kshop（Peak Design 台灣）：分類導覽列 → 主視覺 → 分類入口 → 各系列商品列 → 促銷區 → 頁尾。
 * 視覺沿用首頁 premium palette 與 tokens（eyebrow／serif 標題／Functional CTA 10px／.site-container）。
 * 商品尚未開賣：卡片顯示「即將開賣」，不接購物車；資料在 data/shop.ts。
 */

const nt = (n: number) => `NT$${n.toLocaleString('zh-TW')}`

function ProductCard({ p }: { p: ShopProduct }) {
  return (
    <article className="group">
      {/* 圖：4:5、10px 圓角、極淡框；沒圖時用 Secondary→Primary 的佔位漸層 */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] border border-[rgba(37,44,48,.08)] bg-white/50">
        {p.image ? (
          <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="pg-media-placeholder absolute inset-0 opacity-70" />
        )}
        {p.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-[#D2C2AD] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#252C30]">
            {p.badge}
          </span>
        )}
      </div>
      <p className="mt-3 text-[10px] tracking-[0.18em] text-[#816B59] uppercase">{p.brand}</p>
      <h3 className="mt-1 text-[15px] leading-snug font-medium text-[#252C30]">{p.name}</h3>
      <p className="mt-1.5 flex items-baseline gap-2 text-sm">
        <span className="font-semibold text-[#252C30]">{nt(p.price)}</span>
        {p.comparePrice && <span className="text-[#252C30]/45 line-through">{nt(p.comparePrice)}</span>}
      </p>
      <p className="mt-1 text-xs text-[#5d666e]">即將開賣</p>
    </article>
  )
}

export default function ShopApp() {
  return (
    <div className="min-h-screen bg-[#F2EEE6] text-[#252C30]">
      <Navbar />

      {/* 分類導覽列（kshop 的第二層 category bar）：sticky 在 Navbar 下方，橫向可捲 */}
      <nav aria-label="商品分類" className="sticky top-16 z-30 border-b border-[rgba(37,44,48,.08)] bg-[#F2EEE6]/92 backdrop-blur">
        <div className="site-container scroll-row flex gap-1 overflow-x-auto py-2">
          {shopCategories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="pg-nav-link shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap">
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        {/* 主視覺：文字為主的 editorial hero（沒有商品圖前不放假圖） */}
        <section className="site-container pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="max-w-2xl">
            <p className="pg-t-eyebrow">POOLGRESS SELECT</p>
            <h1 className="pg-t-serif-editorial mt-4 text-[36px] leading-[1.12] sm:text-[52px]">
              球具選物
            </h1>
            <p className="pg-t-body mt-6 max-w-lg text-[17px] leading-[1.8]">
              從第一支球桿到比賽用的前節，我們只放自己也在用的東西。
              <br />
              闖關拿到的星星，未來可以在這裡折抵。
            </p>
          </div>
        </section>

        {/* 分類入口 tiles */}
        <section className="site-container pb-16 lg:pb-20">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {shopCategories.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="group rounded-[10px] border border-[rgba(37,44,48,.1)] bg-white/50 p-4 transition-colors hover:bg-white/80"
              >
                <p className="text-[10px] tracking-[0.18em] text-[#816B59] uppercase">{c.en}</p>
                <p className="mt-2 text-base font-medium">{c.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#5d666e]">{c.blurb}</p>
              </a>
            ))}
          </div>
        </section>

        {/* 各系列商品列 */}
        {shopSections.map((s) => {
          const items = shopProducts.filter((p) => p.category === s.category)
          return (
            <section key={s.category} id={s.category} className="site-container scroll-mt-32 pb-16 lg:pb-24">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="pg-t-eyebrow-feature !mb-0">{s.eyebrow}</p>
                  <h2 className="pg-t-serif-editorial mt-2 text-[28px] leading-[1.15] sm:text-[36px]">{s.title}</h2>
                </div>
                <a href={`#${s.category}`} className="hidden text-sm font-medium text-[#816B59] hover:text-[#252C30] sm:block">
                  查看全部 →
                </a>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </section>
          )
        })}

        {/* 促銷區：星星折抵（kshop 的 promo block 位置） */}
        <section className="site-container pb-20 lg:pb-28">
          <div className="grid gap-6 rounded-[10px] bg-[#252C30] px-6 py-10 text-[#F2EEE6] sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:py-14">
            <div className="max-w-xl">
              <p className="pg-t-manifesto text-[#D2C2AD]">STARS TO SAVINGS</p>
              <h2 className="pg-t-serif-editorial mt-3 text-[26px] leading-[1.2] text-[#F2EEE6] sm:text-[34px]">
                闖關拿到的星星，之後可以折抵球具。
              </h2>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.75] text-[#F2EEE6]/80">
                球具開賣時，App 裡的星星會同步成折抵額度。現在多練幾局，之後的第一支球桿就便宜一點。
              </p>
            </div>
            <a href="./challenges.html" className="pg-btn pg-btn-shape w-fit bg-[#D2C2AD] text-[#252C30] hover:bg-[#DACCB9]">
              去闖關拿星星
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
