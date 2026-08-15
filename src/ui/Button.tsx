import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

type Common = {
  children: ReactNode
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
}

type Props = Common &
  (
    | { href: string; onClick?: never; disabled?: never; type?: never }
    | {
        href?: never
        onClick?: () => void
        disabled?: boolean
        type?: 'button' | 'submit'
      }
  )

const variants: Record<Variant, string> = {
  primary:
    'bg-felt-600 text-white shadow-sm hover:bg-felt-700 active:bg-felt-900 active:scale-[0.99]',
  secondary:
    'bg-white text-felt-700 ring-1 ring-felt-200 hover:bg-felt-50 active:bg-felt-100 active:scale-[0.99]',
  quiet: 'text-ink-700 hover:bg-ivory-100 active:bg-ivory-200',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

/**
 * 連結與按鈕共用同一組樣式。
 * 傳 href 產生 <a>（導向外部或其他頁面），傳 onClick 產生 <button>。
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  ...rest
}: Props) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,transform] duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${
    variants[variant]
  } ${sizes[size]} ${block ? 'w-full' : ''} ${className}`

  if ('href' in rest && rest.href) {
    const external = rest.href.startsWith('http')
    return (
      <a
        href={rest.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={base}
      >
        {children}
      </a>
    )
  }

  const { onClick, disabled, type = 'button' } = rest as {
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit'
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  )
}
