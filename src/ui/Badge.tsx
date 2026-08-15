import type { ReactNode } from 'react'

type Tone = 'free' | 'game' | 'unlocked' | 'neutral' | 'offer'

const tones: Record<Tone, string> = {
  free: 'bg-felt-50 text-felt-700 ring-felt-200',
  game: 'bg-chalk-100 text-chalk-700 ring-chalk-500/25',
  unlocked: 'bg-ivory-100 text-ink-500 ring-line',
  neutral: 'bg-ivory-100 text-ink-500 ring-line',
  offer: 'bg-brass-400/15 text-brass-600 ring-brass-400/40',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
