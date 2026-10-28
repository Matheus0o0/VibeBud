import type { SVGProps } from 'react'

type Props = {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showGlow?: boolean
} & Omit<SVGProps<SVGSVGElement>, 'r' | 'cx' | 'cy' | 'strokeDasharray' | 'strokeDashoffset'>

const CIRCUMFERENCE = 2 * Math.PI * 76

export default function ProgressRing({
  value,
  size = 192,
  strokeWidth = 5,
  className = '',
  showGlow = true,
  ...rest
}: Props) {
  const pct = Math.max(0, Math.min(100, value))
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  return (
    <svg
      viewBox="0 0 192 192"
      width={size}
      height={size}
      className={`-rotate-90 ${className}`}
      {...rest}
    >
      <circle cx="96" cy="96" r={76} stroke="var(--color-border)" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx="96"
        cy="96"
        r={76}
        stroke="#FF7900"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.5s linear',
          filter: showGlow ? 'drop-shadow(0 0 10px rgba(255,121,0,0.7))' : 'none',
        }}
      />
    </svg>
  )
}
