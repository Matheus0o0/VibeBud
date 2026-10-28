import type { ReactNode } from 'react'

type Props = {
  actions?: ReactNode
  children: ReactNode
  width?: 'narrow' | 'default' | 'wide' | 'full'
}

const widthMap = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
}

// Padrão: ações no topo-direita (opcional), conteúdo centralizado vertical+horizontal.
// Se o conteúdo for maior que o viewport, scrolla a partir do topo naturalmente.
export default function PageShell({ actions, children, width = 'default' }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col w-full">
      {actions && (
        <div className="flex items-center justify-end gap-2 shrink-0">
          {actions}
        </div>
      )}
      <div className={`page-content flex flex-col ${widthMap[width]} mx-auto w-full py-8`}>
        {children}
      </div>
    </div>
  )
}
