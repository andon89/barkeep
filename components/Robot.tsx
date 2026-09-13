'use client'
import { useBarState } from './BarState'

const RIVETS: Array<[number, number]> = [[72, 28], [128, 28], [72, 70], [128, 70], [58, 92], [142, 92], [58, 180], [142, 180]]

export function Robot() {
  const { robot, speech } = useBarState()
  return (
    <div className="robot-wrap">
      <p className="speech" role="status" aria-live="polite">{speech}</p>
      <svg className="robot" data-state={robot} viewBox="0 0 200 200" width="220" height="220" role="img" aria-label={`Robot bartender, ${robot}`}>
        <line x1="100" y1="22" x2="100" y2="8" stroke="#7e858b" strokeWidth="3" />
        <circle className="antenna-tip" cx="100" cy="6" r="4" fill="#f2b25a" />

        <g className="head">
          <rect x="66" y="22" width="68" height="54" rx="10" fill="#b8bdc2" stroke="#7e858b" strokeWidth="2" />
          <rect x="70" y="26" width="60" height="18" rx="8" fill="#e3e6e9" opacity="0.45" />
          <g className="eye">
            <circle cx="86" cy="48" r="10" fill="#f3e7cf" stroke="#6a7075" strokeWidth="2" />
            <line x1="86" y1="48" x2="92" y2="43" stroke="#2a1810" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="eye">
            <circle cx="114" cy="48" r="10" fill="#f3e7cf" stroke="#6a7075" strokeWidth="2" />
            <line x1="114" y1="48" x2="120" y2="43" stroke="#2a1810" strokeWidth="2" strokeLinecap="round" />
          </g>
          <rect x="88" y="62" width="24" height="6" rx="2" fill="#6a7075" />
          {[94, 100, 106].map((x) => <line key={x} x1={x} y1="62" x2={x} y2="68" stroke="#b8bdc2" strokeWidth="1.5" />)}
        </g>

        <rect x="92" y="76" width="16" height="10" fill="#7e858b" />
        <rect x="52" y="86" width="96" height="114" rx="12" fill="#b8bdc2" stroke="#7e858b" strokeWidth="2" />
        <path d="M68 86 L100 120 L132 86 L140 96 L140 200 L60 200 L60 96 Z" fill="#3b2a22" />
        <line x1="100" y1="120" x2="100" y2="200" stroke="#2a1810" strokeWidth="2" />
        {[136, 154, 172].map((y) => <circle key={y} cx="100" cy={y} r="2.5" fill="#c9a24b" />)}
        <path d="M88 90 L100 96 L88 102 Z M112 90 L100 96 L112 102 Z" fill="#8c1d2a" />
        <circle cx="100" cy="96" r="3" fill="#6e1e2a" />
        {RIVETS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#6a7075" />)}

        <g className="arm-rest">
          <rect x="30" y="100" width="22" height="62" rx="10" fill="#b8bdc2" stroke="#7e858b" strokeWidth="2" transform="rotate(22 41 100)" />
        </g>

        <g className="arm-work">
          <rect x="146" y="90" width="22" height="62" rx="10" fill="#b8bdc2" stroke="#7e858b" strokeWidth="2" />
          <circle cx="157" cy="152" r="8" fill="#7e858b" />
          <g className="shaker">
            <rect x="150" y="142" width="14" height="10" rx="3" fill="#c9a24b" />
            <path d="M148 152 L166 152 L170 196 L144 196 Z" fill="#d2d6da" stroke="#7e858b" strokeWidth="2" />
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
