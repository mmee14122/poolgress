import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

type FieldProps = {
  label: string
  required?: boolean
  error?: string | null
  hint?: string
  children: (id: string, invalid: boolean) => ReactNode
}

/** 表單欄位容器：標籤、提示、錯誤訊息與 aria 綁定 */
export function Field({ label, required, error, hint, children }: FieldProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
        {required && (
          <span className="ml-1 text-brand-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {/* ink-500：hint 可能落在 brand-50 等淡色底上，ink-400 會低於 AA */}
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
      <div className="mt-1.5">{children(id, !!error)}</div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

export function TextInput({ invalid = false, className = '', ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink-900 placeholder:text-ink-400 focus:outline-2 focus:outline-offset-1 ${
        invalid
          ? 'border-red-400 focus:outline-red-600'
          : 'border-line focus:outline-brand-600'
      } ${className}`}
    />
  )
}

type ChoiceCardProps = {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  title: string
  description?: string
  children?: ReactNode
}

/**
 * Radio card：付款方式、發票類型、購買方式共用。
 * 原生 radio（sr-only）保留鍵盤與螢幕閱讀器行為，checked 時展開子內容。
 */
export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  children,
}: ChoiceCardProps) {
  return (
    <label
      className={`block cursor-pointer rounded-card border-2 p-4 transition-colors sm:p-5 ${
        checked ? 'border-brand-600 bg-brand-50/50' : 'border-line bg-white hover:border-brand-200'
      }`}
    >
      <span className="flex items-start gap-3">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            checked ? 'border-brand-600' : 'border-ink-400'
          }`}
        >
          {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-ink-900">{title}</span>
          {description && <span className="mt-0.5 block text-sm text-ink-500">{description}</span>}
        </span>
      </span>

      {checked && children && <div className="mt-4 border-t border-line pt-4">{children}</div>}
    </label>
  )
}
