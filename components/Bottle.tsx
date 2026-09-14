import { memo, useId } from 'react'
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

// amount in [-1, 1]: negative darkens toward black, positive lightens toward white
function shade(hex: string, amount: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex
  const n = parseInt(hex.slice(1), 16)
  const mix = (v: number) => Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp(mix((n >> 16) & 255))
  const g = clamp(mix((n >> 8) & 255))
  const b = clamp(mix(n & 255))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// Memoised: the back bar re-renders every bottle on each optimistic toggle, and each one
// runs a dozen colour computations that only depend on its own style.
export const Bottle = memo(function Bottle({ style, height = 120 }: { style: BottleStyle; height?: number }) {
  const spec = SHAPES[style.shape] ?? SHAPES.standard
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = (k: string) => `${k}-${uid}`
  const { glass, liquid, label, accent } = style
  const lines = labelLines(style.labelText)
  const longest = Math.max(...lines.map((l) => l.length), 1)
  const fontSize = Math.max(4.5, Math.min(8, (spec.label.w * 1.7) / longest))
  const lineHeight = fontSize * 1.1
  const textY = spec.label.y + spec.label.h / 2 - ((lines.length - 1) * lineHeight) / 2
  const collarY = spec.cap.y + spec.cap.h
  const labelCx = spec.label.x + spec.label.w / 2

  return (
    <svg viewBox="0 0 60 160" height={height} width={height * 0.375} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id('clip')}><path d={spec.path} /></clipPath>
        <linearGradient id={id('body')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(glass, -0.5)} />
          <stop offset="0.16" stopColor={shade(glass, 0.4)} />
          <stop offset="0.42" stopColor={glass} />
          <stop offset="0.78" stopColor={shade(glass, -0.22)} />
          <stop offset="1" stopColor={shade(glass, -0.6)} />
        </linearGradient>
        <linearGradient id={id('liquid')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(liquid, -0.45)} />
          <stop offset="0.18" stopColor={shade(liquid, 0.2)} />
          <stop offset="0.45" stopColor={liquid} />
          <stop offset="0.8" stopColor={shade(liquid, -0.28)} />
          <stop offset="1" stopColor={shade(liquid, -0.6)} />
        </linearGradient>
        <linearGradient id={id('bottom')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={id('cap')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade(accent, 0.45)} />
          <stop offset="0.5" stopColor={accent} />
          <stop offset="1" stopColor={shade(accent, -0.4)} />
        </linearGradient>
        <linearGradient id={id('label')} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={shade(label, 0.06)} />
          <stop offset="1" stopColor={shade(label, -0.08)} />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${id('clip')})`}>
        <rect x="0" y="0" width="60" height="160" fill={`url(#${id('body')})`} />
        <rect x="0" y={spec.fillTop} width="60" height={160 - spec.fillTop} fill={`url(#${id('liquid')})`} opacity="0.96" />
        <ellipse cx="30" cy={spec.fillTop} rx="27" ry="2.4" fill={shade(liquid, 0.3)} opacity="0.55" />
        <rect x="0" y="138" width="60" height="22" fill={`url(#${id('bottom')})`} />
        <rect x="8" y="0" width="5" height="160" rx="2.5" fill="#fff" opacity="0.22" />
        <rect x="15" y="0" width="1.5" height="160" fill="#fff" opacity="0.1" />
        <rect x="50" y="0" width="2" height="160" fill="#fff" opacity="0.07" />
      </g>
      <path d={spec.path} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />

      <rect x={spec.cap.x - 1} y={collarY} width={spec.cap.w + 2} height="4" fill={shade(accent, -0.35)} />
      <rect x={spec.cap.x} y={spec.cap.y} width={spec.cap.w} height={spec.cap.h} rx="2" fill={`url(#${id('cap')})`} />
      <rect x={spec.cap.x + 2} y={spec.cap.y + 1.5} width={spec.cap.w - 4} height="1.2" rx="0.6" fill="#fff" opacity="0.35" />

      <rect x={spec.label.x} y={spec.label.y} width={spec.label.w} height={spec.label.h} rx="1.5" fill={`url(#${id('label')})`} stroke={shade(label, -0.35)} strokeWidth="0.6" />
      <rect x={spec.label.x + 1.6} y={spec.label.y + 1.6} width={spec.label.w - 3.2} height={spec.label.h - 3.2} rx="1" fill="none" stroke={shade(label, -0.18)} strokeWidth="0.4" />
      <line x1={spec.label.x + 5} x2={spec.label.x + spec.label.w - 5} y1={spec.label.y + 5} y2={spec.label.y + 5} stroke={accent} strokeWidth="0.5" opacity="0.55" />
      <line x1={spec.label.x + 5} x2={spec.label.x + spec.label.w - 5} y1={spec.label.y + spec.label.h - 5} y2={spec.label.y + spec.label.h - 5} stroke={accent} strokeWidth="0.5" opacity="0.55" />
      <text
        x={labelCx}
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontWeight="700"
        fontSize={fontSize}
        fill={accent}
        style={{ letterSpacing: '0.05em' }}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={labelCx} y={textY + i * lineHeight} dominantBaseline="middle">{line}</tspan>
        ))}
      </text>
    </svg>
  )
})
