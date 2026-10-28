import { Link } from 'react-router-dom'

export default function Brand() {
  return (
    <Link to="/" className="brand" aria-label="VibeBud — início">
      <svg viewBox="0 0 32 36" width="28" height="32" fill="none" aria-hidden="true">
        <path d="m17 1 9 5 1 8 5 7-4 10-10 4-5-6-8 1-5-8 6-8 2-9z" fill="currentColor" />
        <path d="m13 12 7 4-1 7-7 2-4-6z" stroke="var(--color-bg)" strokeWidth="2.6" strokeLinejoin="round" />
        <circle cx="16.5" cy="18.5" r="2" fill="var(--color-bg)" />
      </svg>
      <span>VibeBud</span>
    </Link>
  )
}
