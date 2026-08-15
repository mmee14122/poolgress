/**
 * 課程主視覺佔位。換成實際圖片或影片時保留外層 aspect-video，
 * 才不會在資源載入時發生版面位移（CLS）。
 */
export function CourseCover({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card bg-felt-900">
      {/* 檯面質感：綠絨底 + 邊緣暗角 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,var(--color-felt-700),var(--color-felt-950))]"
      />

      {/* 球檯上的三顆球，純裝飾 */}
      <div aria-hidden="true" className="absolute inset-0">
        <span className="absolute top-[58%] left-[22%] h-6 w-6 rounded-full bg-ivory-50 shadow-lg" />
        <span className="absolute top-[46%] left-[46%] h-6 w-6 rounded-full bg-brass-400 shadow-lg" />
        <span className="absolute top-[66%] left-[62%] h-6 w-6 rounded-full bg-chalk-500 shadow-lg" />
        <span className="absolute top-[61%] left-[25%] h-px w-[38%] origin-left -rotate-6 bg-white/25" />
      </div>

      <button
        type="button"
        aria-label="播放課程預覽影片"
        className="group absolute inset-0 flex flex-col items-center justify-center gap-3"
      >
        <span
          className={`flex items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur transition-transform group-hover:scale-105 ${
            compact ? 'h-12 w-12' : 'h-16 w-16'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`ml-1 fill-white ${compact ? 'h-5 w-5' : 'h-7 w-7'}`}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        {!compact && <span className="text-sm text-white/70">播放課程預覽</span>}
      </button>
    </div>
  )
}
