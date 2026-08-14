import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-white text-ink-900 ring-1 ring-sand-200 hover:bg-sand-50',
  ghost: 'text-white ring-1 ring-white/30 hover:bg-white/10',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-4 text-base',
}

/**
 * 所有 CTA 都是 <a> —— 純 UI 專案不處理送出行為，
 * 目的地一律來自 content/site.ts。
 */
export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: Props) {
  const external = href.startsWith('http')

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
