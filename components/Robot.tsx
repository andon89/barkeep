'use client'
import { useBarState } from './BarState'

const RIVETS: Array<[number, number]> = [[72, 28], [128, 28], [72, 70], [128, 70], [58, 92], [142, 92], [58, 180], [142, 180]]

export function Robot() {
  const { robot, speech } = useBarState()
  return (
    <div className="robot-wrap">
      <p className="speech" role="status" aria-live="polite">{speech}</p>
      <svg className="robot" data-state={robot} viewBox="0 0 200 200" width="220" height="220" role="img" aria-label={`Robot bartender, ${robot}`}>
        <defs>
          <linearGradient id="robot-tin-v" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d9dde1" />
            <stop offset="0.5" stopColor="#b3b8bd" />
            <stop offset="1" stopColor="#7c8388" />
          </linearGradient>
          <linearGradient id="robot-tin-h" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#868d92" />
            <stop offset="0.22" stopColor="#d3d7db" />
            <stop offset="0.55" stopColor="#b8bdc2" />
            <stop offset="1" stopColor="#7c8388" />
          </linearGradient>
          <radialGradient id="robot-lens" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="0.7" stopColor="#f3e7cf" />
            <stop offset="1" stopColor="#d9c9a6" />
          </radialGradient>
          <linearGradient id="robot-leather" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4d372c" />
            <stop offset="0.55" stopColor="#3b2a22" />
            <stop offset="1" stopColor="#221a15" />
          </linearGradient>
          <radialGradient id="robot-brass" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#f2d98a" />
            <stop offset="0.6" stopColor="#c9a24b" />
            <stop offset="1" stopColor="#7d6126" />
          </radialGradient>
          <linearGradient id="robot-steel" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8d9399" />
            <stop offset="0.3" stopColor="#eef1f3" />
            <stop offset="0.6" stopColor="#c4c9ce" />
            <stop offset="1" stopColor="#7e858b" />
          </linearGradient>
          <radialGradient id="robot-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff1c8" />
            <stop offset="0.6" stopColor="#f2b25a" />
            <stop offset="1" stopColor="#c9832f" />
          </radialGradient>
        </defs>

        <line x1="100" y1="22" x2="100" y2="8" stroke="#6f767c" strokeWidth="3" />
        <circle cx="100" cy="6" r="8" fill="#f2b25a" opacity="0.22" />
        <circle className="antenna-tip" cx="100" cy="6" r="4" fill="url(#robot-glow)" />

        <g className="head">
          <rect x="66" y="22" width="68" height="54" rx="10" fill="url(#robot-tin-h)" stroke="#6f767c" strokeWidth="2" />
          <rect x="70" y="26" width="60" height="16" rx="8" fill="#eef1f3" opacity="0.4" />
          <g className="eye">
            <circle cx="86" cy="48" r="10" fill="url(#robot-lens)" stroke="#5d6469" strokeWidth="2" />
            <line x1="86" y1="48" x2="92" y2="43" stroke="#2a1810" strokeWidth="2" strokeLinecap="round" />
            <circle cx="82.5" cy="44.5" r="2.2" fill="#fff" opacity="0.85" />
          </g>
          <g className="eye">
            <circle cx="114" cy="48" r="10" fill="url(#robot-lens)" stroke="#5d6469" strokeWidth="2" />
            <line x1="114" y1="48" x2="120" y2="43" stroke="#2a1810" strokeWidth="2" strokeLinecap="round" />
            <circle cx="110.5" cy="44.5" r="2.2" fill="#fff" opacity="0.85" />
          </g>
          <rect x="88" y="62" width="24" height="6" rx="2" fill="#5d6469" />
          {[94, 100, 106].map((x) => <line key={x} x1={x} y1="62" x2={x} y2="68" stroke="#c4c9ce" strokeWidth="1.5" />)}
        </g>

        <rect x="92" y="76" width="16" height="10" fill="url(#robot-tin-v)" stroke="#6f767c" strokeWidth="1" />
        <rect x="52" y="86" width="96" height="114" rx="12" fill="url(#robot-tin-v)" stroke="#6f767c" strokeWidth="2" />
        <path d="M68 86 L100 120 L132 86 L140 96 L140 200 L60 200 L60 96 Z" fill="url(#robot-leather)" />
        <path d="M74 90 L100 117 L126 90" fill="none" stroke="#5a4235" strokeWidth="1.5" />
        <line x1="100" y1="120" x2="100" y2="200" stroke="#1c130f" strokeWidth="2" />
        {[136, 154, 172].map((y) => <circle key={y} cx="100" cy={y} r="2.8" fill="url(#robot-brass)" />)}
        <path d="M88 90 L100 96 L88 102 Z" fill="#a0222f" />
        <path d="M112 90 L100 96 L112 102 Z" fill="#8c1d2a" />
        <circle cx="100" cy="96" r="3" fill="#6e1e2a" />
        <circle cx="99" cy="95" r="1" fill="#c4525e" opacity="0.8" />
        {RIVETS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="2.3" fill="#5d6469" />
            <circle cx={x - 0.6} cy={y - 0.6} r="0.8" fill="#fff" opacity="0.6" />
          </g>
        ))}

        <g className="arm-rest">
          <rect x="30" y="100" width="22" height="62" rx="10" fill="url(#robot-tin-h)" stroke="#6f767c" strokeWidth="2" transform="rotate(22 41 100)" />
        </g>

        <g className="arm-work">
          <rect x="146" y="90" width="22" height="62" rx="10" fill="url(#robot-tin-h)" stroke="#6f767c" strokeWidth="2" />
          <circle cx="157" cy="152" r="8" fill="url(#robot-tin-v)" stroke="#6f767c" strokeWidth="1" />
          <g className="shaker">
            <rect x="150" y="142" width="14" height="10" rx="3" fill="url(#robot-brass)" />
            <path d="M148 152 L166 152 L170 196 L144 196 Z" fill="url(#robot-steel)" stroke="#6f767c" strokeWidth="2" />
            <line x1="152" y1="156" x2="150" y2="192" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
          </g>
          <g className="glass">
            <path d="M141 126 Q157 150 173 126 Z" fill="rgba(243,231,207,0.5)" stroke="#f3e7cf" strokeWidth="1.5" />
            <path d="M144 128 Q157 146 170 128 Z" fill="#f2b25a" opacity="0.9" />
            <line x1="157" y1="146" x2="157" y2="152" stroke="#f3e7cf" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  )
}
