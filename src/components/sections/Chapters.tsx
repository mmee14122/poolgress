import { course } from '../../content/course'
import type { LessonStatus } from '../../content/course'
import { Section } from '../../ui/Section'
import { Accordion } from '../../ui/Accordion'
import { Badge } from '../../ui/Badge'

const statusLabel: Record<LessonStatus, string> = {
  free: '免費試看',
  unlocked: '已解鎖',
  game: '遊戲闖關',
}

const totalLessons = course.chapters.reduce((sum, c) => sum + c.lessons.length, 0)

export function Chapters() {
  return (
    <Section
      id="chapters"
      title="課程章節"
      description={`共 ${course.chapters.length} 章、${totalLessons} 個單元。點開章節可看到每個單元的內容與時長。`}
    >
      <div className="overflow-hidden rounded-card border border-line bg-white">
        {course.chapters.map((chapter, i) => (
          <Accordion
            key={chapter.title}
            summary={chapter.title}
            meta={`${chapter.lessons.length} 個單元`}
            defaultOpen={i === 0}
          >
            <p className="mb-4 rounded-lg bg-felt-50 px-4 py-3 text-sm text-felt-700">
              <span className="font-semibold">本章目標：</span>
              {chapter.goal}
            </p>

            <ul className="divide-y divide-line">
              {chapter.lessons.map((lesson) => (
                <li key={lesson.title} className="flex items-center gap-3 py-3">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 ${
                      lesson.status === 'game' ? 'fill-chalk-500' : 'fill-ink-400'
                    }`}
                  >
                    {lesson.status === 'game' ? (
                      <path d="M17 5a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 22a3 3 0 01-2.5-1.4L13.4 18h-2.8l-1.5 2.6A3 3 0 016.6 22a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 5zM9 9H7v2H5v2h2v2h2v-2h2v-2H9z" />
                    ) : (
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM10 7.5l6 4.5-6 4.5z" />
                    )}
                  </svg>

                  <span className="flex-1 text-sm text-ink-700">{lesson.title}</span>

                  {lesson.status && (
                    <Badge tone={lesson.status}>{statusLabel[lesson.status]}</Badge>
                  )}

                  <span className="w-16 shrink-0 text-right text-xs text-ink-400 tabular-nums">
                    {lesson.duration}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
      </div>
    </Section>
  )
}
