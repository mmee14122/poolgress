import { site } from '../data/site'

/**
 * Poolgress 標誌：公司正式 logo 圖檔（四葉圓潤十字＋準星）＋品牌字。
 * 導覽列、頁尾與登入頁共用；點擊回首頁（相對路徑，子資料夾部署也正確）。
 *
 * 顏色（2026-09-05 Phase 1）：
 * - 圖標是 PNG，深底用白色版、淺底用 Primary #6F8FA3 版，由 `dark` 選檔
 * - 品牌字顏色不在這裡寫死：.pg-logo-text 讀 CSS 變數 --logo-color
 *   （.pg-logo 預設 Primary、.pg-logo--on-dark 白；Navbar 內由 nav state 的 --nav-logo 接管，
 *   見 styles/nav.css）
 */
export function Logo({
  className = '',
  dark = false,
  href = './',
}: { className?: string; dark?: boolean; href?: string }) {
  /* href 預設回首頁；一頁式 landing 傳 '#top'，點了只回到頁面最上方，不會離開這一頁 */
  return (
    <a
      href={href}
      className={`pg-logo ${dark ? 'pg-logo--on-dark' : ''} flex shrink-0 items-center gap-2 py-2 ${className}`}
    >
      {/* 絕對路徑（2026-09-06）：landing 也被複製到網站根目錄當首頁，
          相對路徑在根目錄會指到 /assets/… 而 404；所有 React 頁面都在 /ui/ 底下，絕對路徑兩邊都對 */}
      <img
        src={dark ? '/ui/assets/logo/logo-mark-white.png' : '/ui/assets/logo/logo-mark-primary.png'}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0"
      />
      <span className="pg-logo-text font-logo text-xl font-semibold tracking-tight transition-colors duration-250">
        {site.brandName}
      </span>
    </a>
  )
}
