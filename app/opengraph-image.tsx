import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Barkeep, a robot bartender for the home bar'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const bottles = [
  { h: 200, w: 60, c: '#3e8e3a' }, { h: 240, w: 70, c: '#d9102a' }, { h: 220, w: 64, c: '#b8651b' },
  { h: 260, w: 58, c: '#1f4fb5' }, { h: 210, w: 72, c: '#e8c43a' }, { h: 230, w: 62, c: '#5b3a8c' },
]

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#121d1a,#1c2b26)', color: '#f3e7cf', fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 22, height: 330, paddingTop: 40, background: 'radial-gradient(ellipse at 50% 100%, rgba(242,178,90,0.35), transparent 65%)' }}>
          {bottles.map((b, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: b.w }}>
              <div style={{ width: b.w * 0.4, height: 34, background: b.c, borderRadius: '6px 6px 0 0' }} />
              <div style={{ width: b.w, height: b.h, background: b.c, borderRadius: '10px 10px 4px 4px', boxShadow: '0 10px 20px rgba(0,0,0,.5)' }} />
            </div>
          ))}
        </div>
        <div style={{ height: 16, background: 'linear-gradient(180deg,#6b4128,#4a2c1a,#2a1810)', borderTop: '3px solid #c9a24b' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ fontSize: 96, color: '#c9a24b', letterSpacing: 4, fontFamily: 'Fraunces, Georgia, "Times New Roman", serif' }}>Barkeep</div>
          <div style={{ fontSize: 34, color: '#b9ad97', fontStyle: 'italic', fontFamily: 'Fraunces, Georgia, "Times New Roman", serif' }}>A robot bartender for the home bar</div>
        </div>
      </div>
    ),
    size,
  )
}
