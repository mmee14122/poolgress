import { site } from '../data/site'

/**
 * Poolgress 標誌：公司正式 logo 圖檔（四葉圓潤十字＋準星），黑／白兩版 PNG。
 * 導覽列與登入頁共用；點擊回首頁（相對路徑，子資料夾部署也正確）。
 */
export function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <a href="./" className={`flex shrink-0 items-center gap-2 py-2 ${className}`}>
      {/* 公司正式標誌（2026-09-05 使用者提供，白底 PNG 已去背成透明）。
          深色導覽列用白色版，淺色用 Primary #6F8FA3 版（2026-09-05 使用者指定圖標與品牌字同色）；
          準星與內圓是鏤空，透出身後底色。黑色版保留作其他用途。 */}
      <img
        src={dark ? './assets/logo/logo-mark-white.png' : './assets/logo/logo-mark-primary.png'}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0"
      />
      {/* 品牌字＝brand identity 層：淺色態 Primary #6F8FA3（locked，不跟導覽 hover 的 Secondary 統一）；
          深色態白字，與導覽列文字（Sand）分開，維持 Logo／導覽／互動三層色階 */}
      <span
        className="font-logo text-xl font-semibold tracking-tight transition-colors duration-250"
        style={{ color: dark ? '#ffffff' : '#6F8FA3' }}
      >
        {site.brandName}
      </span>
    </a>
  )
}
