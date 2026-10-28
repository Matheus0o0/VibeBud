import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label?: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, className = '', ...rest }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>}
      <input
        {...rest}
        className={`w-full h-10 px-3 bg-elevated border rounded-lg text-sm text-fg placeholder:text-faint outline-none transition-colors ${
          error ? 'border-danger' : 'border-border focus:border-brand/60'
        } ${className}`}
      />
      {error ? (
        <span className="block text-xs text-danger mt-1">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-faint mt-1">{hint}</span>
      ) : null}
    </label>
  )
}

export function TextArea({ label, hint, error, className = '', ...rest }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>}
      <textarea
        {...rest}
        className={`w-full min-h-[88px] px-3 py-2.5 bg-elevated border rounded-lg text-sm text-fg placeholder:text-faint outline-none transition-colors resize-y ${
          error ? 'border-danger' : 'border-border focus:border-brand/60'
        } ${className}`}
      />
      {error ? (
        <span className="block text-xs text-danger mt-1">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-faint mt-1">{hint}</span>
      ) : null}
    </label>
  )
}
