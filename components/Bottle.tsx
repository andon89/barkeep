import { useId } from 'react'
import { SHAPES } from '@/lib/bottle-shapes'
import type { BottleStyle } from '@/lib/types'

function labelLines(text: string): string[] {
  if (text.length <= 9 || !text.includes(' ')) return [text]
  const words = text.split(' ')
  let best = 1
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length
    const b = words.slice(i).join(' ').length
    const diff = Math.abs(a - b)
    if (diff < bestDiff) { bestDiff = diff; best = i }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

export function Bottle({ style, height = 120, className }: { style: BottleStyle; height?: number; className?: string }) {
  const spec = SHAPES[style.shape]
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const clipId = `clip-${uid}`
  const sheenId = `sheen-${uid}`
  const lines = labelLines(style.labelText)
  const longest = Math.max(...lines.map((l) => l.length), 1)
  const fontSize = Math.max(4.5, Math.min(8, (spec.label.w * 1.7) / longest))
  const lineHeight = fontSize * 1.1
  const textY = spec.label.y + spec.label.h / 2 - ((lines.length - 1) * lineHeight) / 2

  return (
    <svg viewBox="0 0 60 160" height={height} width={height * 0.375} className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}><path d={spec.path} /></clipPath>
        <linearGradient id={sheenId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="60" height="160" fill={style.glass} opacity="0.9" />
        <rect x="0" y={spec.fillTop} width="60" height={160 - spec.fillTop} fill={style.liquid} opacity="0.92" />
        <rect x="0" y="0" width="60" height="160" fill={`url(#${sheenId})`} />
        <rect x="9" y="0" width="5" height="160" fill="#fff" opacity="0.16" />
      </g>
      <path d={spec.path} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
      <rect x={spec.cap.x} y={spec.cap.y} width={spec.cap.w} height={spec.cap.h} rx="2" fill={style.accent} />
      <rect x={spec.label.x} y={spec.label.y} width={spec.label.w} height={spec.label.h} rx="1.5" fill={style.label} />
      <text
        x={spec.label.x + spec.label.w / 2}
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontWeight="700"
        fontSize={fontSize}
        fill={style.accent}
      >
        {lines.map((line, i) => (
          <tspan key={line} x={spec.label.x + spec.label.w / 2} y={textY + i * lineHeight} dominantBaseline="middle">{line}</tspan>
        ))}
      </text>
    </svg>
  )
}
