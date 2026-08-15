import { course } from '../../content/course'
import { Section } from '../../ui/Section'
import { Button } from '../../ui/Button'

/**
 * 06｜課程章節
 * 使用真實課程資料；未提供前顯示待補。章節數量由資料驅動。
 */
export function Chapters() {
  return (
    <Section id="chapters" title="課程章節">
      <ol className="overflow-hidden rounded-card border border-line bg-white">
        {course.chapters.map((chapter) => (
          <li key={chapter.no} className="flex gap-5 border-b border-line px-5 py-5 last:border-b-0 sm:px-6">
            <span className="pt-0.5 text-xs font-bold tracking-widest whitespace-nowrap text-felt-600 uppercase">
              {chapter.no}
            </span>
            <div>
              <h3 className="text-base">{chapter.name}</h3>
              <p className="mt-1 text-sm text-ink-500">{chapter.summary}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 text-center">
        <Button href={course.startUrl} size="lg">
          {course.ctaLabel}
        </Button>
      </div>
    </Section>
  )
}
