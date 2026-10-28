import { Check } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  description?: string
}

export default function Checkbox({ label, description, className = '', id, ...rest }: Props) {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
      <div className="relative shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={checkboxId}
          className="sr-only"
          {...rest}
        />
        <span
          className={`block w-5 h-5 rounded border-2 grid place-items-center transition-all duration-200 ${
            rest.checked
              ? 'bg-brand border-brand text-[#0A0A0A]'
              : 'bg-elevated border-border-hover hover:border-brand/60'
          }`}
        >
          {rest.checked && <Check size={12} strokeWidth={3} />}
        </span>
      </div>
      <div className="min-w-0">
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description && <span className="block text-xs text-faint mt-0.5">{description}</span>}
      </div>
    </label>
  )
}