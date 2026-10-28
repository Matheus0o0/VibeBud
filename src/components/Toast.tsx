import { useEffect, useState } from 'react'
import { X, Check, AlertCircle, Info } from 'lucide-react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none" role="region" aria-label="Notificações">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 200)
    }, toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast, onRemove])

  const icons = {
    success: <Check size={18} className="text-success" />,
    error: <AlertCircle size={18} className="text-danger" />,
    warning: <AlertCircle size={18} className="text-warning" />,
    info: <Info size={18} className="text-info" />,
  }

  const backgrounds = {
    success: 'bg-success/15 border-success/30',
    error: 'bg-danger/15 border-danger/30',
    warning: 'bg-warning/15 border-warning/30',
    info: 'bg-info/15 border-info/30',
  }

  if (!visible) return null

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 min-w-[300px] max-w-md rounded-lg border shadow-lg animate-in slide-in-from-right duration-300 ${backgrounds[toast.type]}`}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-fg">{toast.title}</p>
        {toast.message && <p className="text-sm text-muted mt-0.5">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 200) }}
        className="shrink-0 w-6 h-6 rounded-lg hover:bg-white/10 transition-colors grid place-items-center text-faint hover:text-fg"
        aria-label="Dispensar"
      >
        <X size={14} />
      </button>
    </div>
  )
}

import React from 'react'