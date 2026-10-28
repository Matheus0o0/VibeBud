import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({ isOpen, onClose, title, description, children, size = 'md', showClose = true }: Props) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative w-full ${sizeMap[size]} bg-card border border-border rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {(title || showClose) && (
          <header className="flex items-start justify-between gap-4 p-5 border-b border-border">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-fg">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-muted mt-1">
                  {description}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-elevated border border-border grid place-items-center text-dim hover:text-fg hover:border-border-hover transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            )}
          </header>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}