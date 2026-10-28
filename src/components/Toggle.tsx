import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  description?: string
}

export default function Toggle({ label, description, className = '', id, ...rest }: Props) {
  const toggleId = id || `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
      <div className="relative shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only"
          {...rest}
        />
        <span
          className={`block w-11 h-6 rounded-full border transition-all duration-200 ${
            rest.checked
              ? 'bg-brand border-brand'
              : 'bg-elevated border-border'
          }`}
        >
          <span
            className={`block w-5 h-5 rounded-full bg-fg shadow-lg transition-transform duration-200 ${
              rest.checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </span>
      </div>
      <div className="min-w-0">
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description && <span className="block text-xs text-faint mt-0.5">{description}</span>}
      </div>
    </label>
  )
}