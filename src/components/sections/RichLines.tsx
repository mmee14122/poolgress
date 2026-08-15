import type { RichLine } from '../../data/course-detail'

/** 依原文節奏逐行渲染，粗體行加重呈現 */
export function RichLines({ lines, className = '' }: { lines: RichLine[]; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, i) =>
        line.bold ? (
          <p key={i} className="text-[0.95rem] leading-relaxed font-bold text-ink-900">
            {line.text}
          </p>
        ) : (
          <p key={i} className="text-sm leading-relaxed text-ink-500">
            {line.text}
          </p>
        ),
      )}
    </div>
  )
}
