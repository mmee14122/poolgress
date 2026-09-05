import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

type Common = {
  children: ReactNode
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
  /** 按鈕文字之外的說明（例：icon 按鈕、需要補充用途時） */
  'aria-label'?: string
  title?: string
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

/* 2026-09-05 Button Design System：形狀／尺寸／字體／hover 由 styles/buttons.css 的 .pg-btn 決定，
   這裡只掛 variant 與 size class（顏色仍是品牌藍系）。md＝lg＝標準 CTA（桌機 54／手機 50、radius 10）；
   sm＝表單／面板內小按鈕（36 高、radius 8）。 */
const variants: Record<Variant, string> = {
  primary: 'pg-btn--primary',
  secondary: 'pg-btn--secondary',
  quiet: 'pg-btn--quiet',
}

const sizes: Record<Size, string> = {
  sm: 'pg-btn--sm',
  md: '',
  lg: '',
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
  'aria-label': ariaLabel,
  title,
  ...rest
}: Props) {
  const base = `pg-btn disabled:cursor-not-allowed disabled:opacity-60 ${
    variants[variant]
  } ${sizes[size]} ${block ? 'w-full' : ''} ${className}`

  if ('href' in rest && rest.href) {
    const external = rest.href.startsWith('http')
    return (
      <a
        href={rest.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={ariaLabel}
        title={title}
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={base}
    >
      {children}
    </button>
  )
}
