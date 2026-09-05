import { site } from '../data/site'

/**
 * Poolgress 標誌：公司正式 logo 圖檔（四葉圓潤十字＋準星），黑／白兩版 PNG。
 * 導覽列與登入頁共用；點擊回首頁（相對路徑，子資料夾部署也正確）。
 */
export function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <a href="./" className={`flex shrink-0 items-center gap-2 py-2 ${className}`}>
      {/* 公司正式標誌（2026-09-05 使用者提供，白底 PNG 已去背成透明）。
          深色導覽列用白色版，淺色用黑色版；準星與內圓是鏤空，透出身後底色。 */}
      <img
        src={dark ? './assets/logo/logo-mark-white.png' : './assets/logo/logo-mark.png'}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0"
      />
      {/* 品牌字：淺色態 Primary 灰藍 #6F8FA3、深色（首頁透明導覽列）態 Sand #D2C2AD
          （2026-09-05 使用者指定），不再是舊站的深藍／白 */}
      <span
        className="font-logo text-xl font-semibold tracking-tight transition-colors duration-250"
        style={{ color: dark ? '#D2C2AD' : '#6F8FA3' }}
      >
        {site.brandName}
      </span>
    </a>
  )
}
