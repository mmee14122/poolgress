import { course, courseStats } from '../data/course-detail'
import { products } from '../data/catalog'
import { cart } from '../lib/cart'
import { useLibrary, ownsCourse } from '../lib/library'
import { useSession } from '../lib/session'
import { Button } from '../ui/Button'

const product = products[0]

/**
 * 課程頁 Hero：靜態版。
 * 左（桌機約 55%）：課程介紹影片位；右：課程介紹與 CTA，兩側垂直置中。
 *
 * 販售頁以資訊清楚優先，Hero 不隨捲動淡出、不 sticky、不加 spacer：
 * 標題、介紹、資訊列與 CTA 從進站到捲出畫面都保持完全可讀。
 * 桌機高度取 min(760px, 視窗高－導覽－促銷列)，捲過後直接接上課程資訊。
 */
export function CourseHero() {
  const { hero } = course
  const owned = ownsCourse(useLibrary(), product.id, !!useSession())
  /** 立即購買：桌機與手機一致——加入購物車後直接前往結帳 */
  const buyNow = () => {
    cart.add(product)
    location.href = './checkout.html'
  }

  return (
    <section className="flex items-center bg-[#e4eaf3] lg:min-h-[min(760px,calc(100svh-4rem-var(--promo-h,0px)))]">
      <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-4 py-8 pb-14 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12 lg:py-14">
        {/* 左：課程介紹影片位（素材待補） */}
        <div>
          <VideoPlaceholder />
        </div>

        {/* 右：課程介紹 */}
        <div>
          <p className="inline-flex rounded-full bg-brand-50 px-3.5 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
            {hero.category}
          </p>

          {/* 標題以 \n 分段，每段 inline-block 整塊換行——
              「建立」等詞不會被拆到兩行；空間夠時仍可併成一行 */}
          <h1 className="mt-4 text-3xl leading-[1.3] sm:text-4xl">
            {hero.title.split('\n').map((seg) => (
              <span key={seg} className="inline-block">
                {seg}
              </span>
            ))}
          </h1>

          <p className="mt-4 text-lg font-semibold text-brand-700">{hero.value}</p>

          <p className="mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">{hero.intro}</p>

          {/* 課程規模：手機 2×2、桌機同樣兩欄 */}
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-700">
            <li className="flex items-center gap-2">
              <StatIcon d="M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z" />
              共 <strong className="font-semibold text-ink-900">{courseStats.units}</strong>
              個課程單元
            </li>
            <li className="flex items-center gap-2">
              <StatIcon d="M17 4a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 21a3 3 0 01-2.5-1.4L13.4 17h-2.8l-1.5 2.6A3 3 0 016.6 21a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 4zM9 8H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 100 2.4A1.2 1.2 0 0016 8zm2.5 3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
              <strong className="font-semibold text-ink-900">{courseStats.games}</strong>
              個遊戲闖關
            </li>
            <li className="flex items-center gap-2">
              <StatIcon d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3z" />
              總時數約 <strong className="font-semibold text-ink-900">{courseStats.hours}</strong>
              小時
            </li>
            <li className="flex items-center gap-2">
              <StatIcon d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              適合
              <strong className="font-semibold text-ink-900">{hero.level}</strong>
              的學習者
            </li>
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {owned ? (
              /* 已擁有此課程：不再顯示購買（重複購買保護） */
              <Button size="lg" href="./my-courses.html" className="w-full sm:w-auto">
                開始學習
              </Button>
            ) : (
              <Button size="lg" onClick={buyNow} className="w-full sm:w-auto">
                立即購買
              </Button>
            )}
            <Button href="#info" variant="quiet" size="lg" className="w-full text-brand-700 sm:w-auto">
              查看課程資訊
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-brand-600">
      <path d={d} />
    </svg>
  )
}

/**
 * 課程介紹影片佔位：素材確定後以 <video> 或嵌入播放器取代。
 * 比例沿用原球檯動畫（720×460），避免版面位移。
 */
function VideoPlaceholder() {
  return (
    <div className="flex aspect-[720/460] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-card bg-[#16294d] shadow-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-white/80">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <p className="text-sm text-white/60">課程介紹影片待補</p>
    </div>
  )
}
