import type { ReactNode } from 'react'

type Props = {
  id?: string
  children: ReactNode
  /** 淺色 / 米色 / 深色底，用來區隔相鄰區塊 */
  tone?: 'white' | 'sand' | 'ink'
  className?: string
}

const tones = {
  white: 'bg-white',
  sand: 'bg-sand-50',
  ink: 'bg-ink-900 text-white',
} as const

export function Section({ id, children, tone = 'white', className = '' }: Props) {
  return (
    <section
      id={id}
      className={`py-section lg:py-section-lg ${tones[tone]} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  )
}

type HeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  /** 深色底時反轉文字顏色 */
  inverted?: boolean
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
  align = 'center',
}: HeadingProps) {
  return (
    <header
      className={`mb-12 max-w-2xl lg:mb-16 ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-semibold tracking-widest uppercase ${
            inverted ? 'text-accent-400' : 'text-brand-600'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl sm:text-4xl ${inverted ? 'text-white' : ''}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-lg ${inverted ? 'text-white/70' : 'text-ink-600'}`}>
          {description}
        </p>
      )}
    </header>
  )
}
