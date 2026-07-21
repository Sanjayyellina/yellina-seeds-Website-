import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import SectionCurve from './SectionCurve.jsx'
import { CONTACT } from '../data/products.js'

// A real maize kernel — flat crown, tapered tip, lighter germ.
function Kernel({ scale = 1, opacity = 1 }) {
  return (
    <g transform={`scale(${scale})`} opacity={opacity}>
      <path
        d="M -7,-8 C -7,-11 7,-11 7,-8 C 7,-1 4,7 0,10 C -4,7 -7,-1 -7,-8 Z"
        fill="url(#kernelGrad)"
        stroke="#9A6512"
        strokeWidth="0.6"
      />
      <path d="M -2.5,2 C -1,5.5 1,5.5 2.5,2 C 1.5,6 0,8 0,8 C 0,8 -1.5,6 -2.5,2 Z" fill="#F3E3B4" opacity="0.9" />
      <ellipse cx="-3" cy="-6" rx="2" ry="3" fill="#FBE9C0" opacity="0.55" />
    </g>
  )
}

// Soil particles kicked up when the seed lands.
const SOIL_POPS = [
  { dx: -22, dy: -26, r: 2.4, d: 0 }, { dx: 18, dy: -30, r: 2, d: 40 },
  { dx: -12, dy: -34, r: 1.6, d: 80 }, { dx: 26, dy: -18, r: 2.6, d: 20 },
  { dx: -28, dy: -14, r: 1.8, d: 60 }, { dx: 8, dy: -38, r: 1.5, d: 100 },
  { dx: 32, dy: -24, r: 1.4, d: 120 },
]

// Static soil speckle texture (clods and stones).
const SPECKLES = [
  [58, 218, 2.6, '#5C4A2E'], [75, 228, 1.8, '#3A2E1C'], [95, 222, 2.2, '#6B5638'],
  [120, 230, 2.8, '#3A2E1C'], [142, 220, 2, '#5C4A2E'], [160, 227, 2.4, '#6B5638'],
  [70, 212, 1.5, '#6B5638'], [130, 214, 1.7, '#5C4A2E'], [152, 211, 1.4, '#3A2E1C'],
  [88, 233, 1.6, '#4A3A22'], [108, 219, 1.5, '#7A6647'], [170, 216, 1.8, '#4A3A22'],
  [48, 226, 1.9, '#4A3A22'], [182, 224, 1.5, '#5C4A2E'],
]

// The closing interaction: plant a real kernel, water it, watch it germinate.
function PlantASeed() {
  const [stage, setStage] = useState('idle') // idle | planting | planted | watering | growing | grown
  const [sparks, setSparks] = useState([])
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const after = (ms, fn) => timers.current.push(setTimeout(fn, ms))

  const tap = () => {
    if (stage === 'idle') {
      setStage('planting')
      after(1050, () => setStage('planted'))
    } else if (stage === 'planted') {
      setStage('watering')
      after(1500, () => setStage('growing'))
      after(3400, () => {
        setStage('grown')
        setSparks(
          [...Array(12)].map((_, i) => ({
            id: i,
            sx: `${Math.cos((i / 12) * Math.PI * 2) * (34 + (i % 3) * 20)}px`,
            sy: `${Math.sin((i / 12) * Math.PI * 2) * (26 + (i % 3) * 16) - 55}px`,
            delay: `${(i % 5) * 60}ms`,
            size: 3 + (i % 3) * 2,
          }))
        )
      })
    } else if (stage === 'grown') {
      setStage('idle')
      setSparks([])
    }
  }

  const planted = ['planted', 'watering', 'growing', 'grown'].includes(stage)
  const wet = ['watering', 'growing', 'grown'].includes(stage)
  const sprouted = ['growing', 'grown'].includes(stage)

  const LABELS = {
    idle: 'Tap the soil · plant a seed',
    planting: 'Planting…',
    planted: 'Good. Now tap again to water it',
    watering: 'Watering…',
    growing: 'Germinating…',
    grown: 'It grew — like every Yellina seed. Tap to replant',
  }

  return (
    <div className="flex flex-col items-center select-none">
      <button
        onClick={stage === 'planting' || stage === 'watering' || stage === 'growing' ? undefined : tap}
        className="relative w-56 h-64 cursor-pointer group focus:outline-none"
        aria-label={LABELS[stage]}
      >
        {/* golden sparks on full growth */}
        {sparks.map((s) => (
          <span
            key={s.id}
            className="absolute left-1/2 bottom-20 rounded-full"
            style={{
              width: s.size,
              height: s.size,
              background: 'radial-gradient(circle, #F3D98F, #E39A2E)',
              '--sx': s.sx,
              '--sy': s.sy,
              animation: `spark-pop 1.1s ease-out ${s.delay} both`,
            }}
          />
        ))}

        <svg viewBox="0 0 220 250" className="seed-scene w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="kernelGrad" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#F0C25C" />
              <stop offset="55%" stopColor="#E39A2E" />
              <stop offset="100%" stopColor="#B87716" />
            </linearGradient>
            <radialGradient id="soilGrad" cx="50%" cy="28%">
              <stop offset="0%" stopColor="#54422A" />
              <stop offset="60%" stopColor="#3B2E1B" />
              <stop offset="100%" stopColor="#241C10" />
            </radialGradient>
            <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="#4C8B4F" />
              <stop offset="100%" stopColor="#8FBF5A" />
            </linearGradient>
          </defs>

          {/* soil mound with texture */}
          <g className="transition-transform duration-300 group-hover:scale-[1.03]" style={{ transformOrigin: '110px 225px' }}>
            <path d="M 22,212 Q 110,178 198,212 Q 204,238 110,244 Q 16,238 22,212 Z" fill="url(#soilGrad)" />
            <path d="M 22,212 Q 110,178 198,212 Q 160,200 110,199 Q 60,200 22,212 Z" fill="#4A3A22" opacity="0.85" />
            {SPECKLES.map(([cx, cy, r, f], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={f} />
            ))}
            <ellipse cx="66" cy="235" rx="3.2" ry="2" fill="#6E6353" opacity="0.8" />
            <ellipse cx="154" cy="236" rx="2.6" ry="1.7" fill="#7A7264" opacity="0.7" />
            {/* wet patch after watering */}
            <ellipse
              cx="110" cy="207" rx="34" ry="9"
              fill="#1B140B"
              style={{ opacity: wet ? 0.65 : 0, transition: 'opacity 1.2s ease' }}
            />
          </g>

          {/* idle: kernel hovering with glow */}
          {stage === 'idle' && (
            <g style={{ animation: 'cue-drop 2s ease-in-out infinite' }}>
              <circle cx="110" cy="118" r="20" fill="#F3D98F" opacity="0.18" />
              <g transform="translate(110, 118)">
                <Kernel scale={1.5} />
              </g>
            </g>
          )}

          {/* planting: kernel falls into the soil */}
          {stage === 'planting' && (
            <>
              <g className="anim" style={{ animation: 'seed-fall 1s cubic-bezier(0.45, 0, 0.7, 1.1) both' }}>
                <g transform="translate(110, 200)">
                  <Kernel scale={1.35} />
                </g>
              </g>
              {SOIL_POPS.map((p, i) => (
                <circle
                  key={i}
                  className="anim"
                  cx="110" cy="204" r={p.r}
                  fill="#4A3A22"
                  style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animation: `soil-pop 0.55s ease-out ${620 + p.d}ms both` }}
                />
              ))}
            </>
          )}

          {/* seed resting in the soil */}
          {planted && !sprouted && (
            <g transform="translate(110, 202)">
              <Kernel scale={1.2} />
            </g>
          )}

          {/* watering: droplets + splash */}
          {stage === 'watering' && (
            <>
              {[
                { x: 101, d: 0 }, { x: 110, d: 260 }, { x: 119, d: 520 }, { x: 106, d: 760 },
              ].map((w, i) => (
                <g key={i} className="anim" style={{ animation: `drop-fall 0.85s cubic-bezier(0.5, 0, 0.85, 1) ${w.d}ms both` }}>
                  <path
                    d={`M ${w.x},196 C ${w.x - 3.2},201 ${w.x - 3.2},205 ${w.x},206.5 C ${w.x + 3.2},205 ${w.x + 3.2},201 ${w.x},196 Z`}
                    transform={`translate(0,-6) rotate(180 ${w.x} 201)`}
                    fill="#8CC3E8"
                    opacity="0.9"
                  />
                </g>
              ))}
              <ellipse
                className="anim"
                cx="110" cy="205" rx="16" ry="4.5"
                fill="none" stroke="#8CC3E8" strokeWidth="1.4"
                style={{ animation: 'splash-ring 0.7s ease-out 700ms both' }}
              />
            </>
          )}

          {/* germination: roots, shoot, unfurling maize blades */}
          {sprouted && (
            <g
              className="anim"
              style={stage === 'grown' ? { animation: 'plant-sway 4.5s ease-in-out infinite', transformOrigin: '110px 205px' } : undefined}
            >
              {/* mother kernel, spent */}
              <g transform="translate(110, 203)">
                <Kernel scale={1.05} opacity={0.85} />
              </g>

              {/* roots reaching down through the soil */}
              {[
                'M 110,208 C 104,216 96,222 90,232',
                'M 110,208 C 111,218 112,226 110,238',
                'M 110,208 C 117,215 126,220 132,229',
                'M 110,210 C 106,214 100,216 97,222',
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none" stroke="#D8C49A" strokeWidth={i === 3 ? 1 : 1.5} strokeLinecap="round" opacity="0.75"
                  strokeDasharray="48" strokeDashoffset="48"
                  style={{ animation: `root-grow 1.1s ease-out ${200 + i * 180}ms both` }}
                />
              ))}

              {/* shoot */}
              <g className="anim" style={{ animation: 'shoot-grow 1.15s cubic-bezier(0.34, 1.3, 0.64, 1) 350ms both', transformOrigin: '110px 200px' }}>
                {/* stem */}
                <path d="M 110,200 C 110,182 109.5,166 110,142" fill="none" stroke="#4C8B4F" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 110,200 C 110,182 109.5,166 110,142" fill="none" stroke="#6FA34F" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

                {/* lower left blade */}
                <g className="anim" style={{ animation: 'leaf-unfurl 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 1150ms both', transformOrigin: '100% 100%' }}>
                  <path d="M 110,176 C 96,172 82,172 68,180 C 63,183 60,187 59,191 C 72,193 92,190 102,184 C 106,181 109,178 110,176 Z" fill="url(#bladeGrad)" />
                  <path d="M 110,176 C 96,174 78,177 62,189" fill="none" stroke="#3E7642" strokeWidth="0.8" opacity="0.6" />
                </g>

                {/* right blade */}
                <g className="anim" style={{ animation: 'leaf-unfurl 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 1400ms both', transformOrigin: '0% 100%' }}>
                  <path d="M 110,164 C 124,158 140,157 154,163 C 159,165 162,169 164,173 C 150,177 130,176 118,171 C 113,168 111,166 110,164 Z" fill="url(#bladeGrad)" />
                  <path d="M 110,164 C 126,160 144,162 161,171" fill="none" stroke="#3E7642" strokeWidth="0.8" opacity="0.6" />
                </g>

                {/* upper left blade, younger */}
                <g className="anim" style={{ animation: 'leaf-unfurl 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) 1650ms both', transformOrigin: '100% 100%' }}>
                  <path d="M 110,152 C 100,146 88,143 76,146 C 72,147 69,150 68,153 C 80,158 96,158 104,156 C 107,155 109,153 110,152 Z" fill="url(#bladeGrad)" opacity="0.95" />
                </g>

                {/* newest leaf, still rolled, reaching up */}
                <g className="anim" style={{ animation: 'leaf-unfurl 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1850ms both', transformOrigin: '50% 100%' }}>
                  <path d="M 110,146 C 107,134 107,122 111,112 C 114,120 115,132 113,142 C 112,144 111,145 110,146 Z" fill="#8FBF5A" />
                  <path d="M 110,146 C 109,134 110,120 111,112" fill="none" stroke="#5FA45B" strokeWidth="0.8" opacity="0.7" />
                </g>

                {/* dew glint */}
                <circle cx="152" cy="164" r="1.6" fill="#EAF6FF" opacity="0" style={{ animation: 'fade-in 0.6s ease 2300ms both' }} />
              </g>
            </g>
          )}
        </svg>
      </button>
      <div className="mt-1 h-4 text-[10px] uppercase tracking-[0.3em] text-leaf font-bold text-center px-4" style={{ fontFamily: 'var(--font-sans)' }}>
        {LABELS[stage]}
      </div>
    </div>
  )
}

const QUICK_LINKS = {
  Products: [
    { label: 'Hybrid Maize', crop: 'maize' },
    { label: 'Sweet Corn', crop: 'sweetcorn' },
    { label: 'Paddy', crop: 'paddy' },
    { label: 'Full Portfolio', crop: 'coming' },
  ],
  Company: [
    { label: 'Our Story', id: 'story' },
    { label: 'Our Fields', id: 'fields' },
    { label: 'Why Yellina', id: 'why' },
    { label: 'Quality Promise', id: 'quality' },
    { label: 'Our Plant', id: 'plant' },
  ],
  Farmers: [
    { label: 'Field Guide', id: 'agronomy' },
    { label: 'Become a Dealer', id: 'partner' },
    { label: 'Contact Us', id: 'contact' },
  ],
}

export default function Footer({ onNavigate, onCrop }) {
  const ref = useReveal()

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden bg-green-950">
      <SectionCurve fill="#FAFAF6" className="z-[3]" />
      {/* real field, barely-there, grounding the footer */}
      <img src="/images/photos/field-tassels-tree.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.10]" loading="lazy" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(20,47,27,0.4), rgba(20,47,27,0.95) 70%)' }} />

      {/* fireflies over the evening field */}
      {[
        [12, 22, 46, -30, 10, 0, 5], [28, 38, -38, -22, 13, 2, 4], [45, 18, 30, 26, 9, 4, 6],
        [62, 30, -26, -38, 12, 1, 5], [76, 15, 42, 18, 14, 3, 4], [88, 40, -34, -26, 10.5, 5, 6],
        [20, 60, 36, -20, 12.5, 2.5, 5], [70, 55, -30, 30, 11, 4.5, 4],
        [8, 45, 52, -36, 11.5, 1.5, 3], [37, 8, -44, 24, 13.5, 3.5, 5], [55, 65, 38, -42, 10, 0.8, 6],
        [82, 62, -48, -18, 12.8, 2.2, 4], [95, 20, 30, 34, 9.5, 5.5, 3], [50, 42, -36, -30, 14.5, 1.8, 5],
      ].map(([left, top, fx, fy, fd, fdelay, fs], i) => (
        <span
          key={i}
          className="firefly"
          style={{ left: `${left}%`, top: `${top}%`, '--fx': `${fx}px`, '--fy': `${fy}px`, '--fd': `${fd}s`, '--fdelay': `${fdelay}s`, '--fs': `${fs}px` }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-8 relative">
        {/* Closing statement */}
        <div className="text-center">
          <img src="/images/logo-white.png" alt="" className="reveal h-12 mx-auto" />
          <div className="reveal mt-4 text-3xl sm:text-4xl text-white font-light tracking-tight" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '80ms' }}>
            Yellina Seeds
          </div>
          <div className="reveal mt-3 eyebrow text-leaf" style={{ '--reveal-delay': '140ms' }}>Rooted in Nature · Growing the Future</div>
          <div className="reveal mx-auto mt-5 w-24 h-px bg-white/25" style={{ '--reveal-delay': '180ms' }} />
          <p className="reveal mt-5 italic text-lg sm:text-xl text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '220ms' }}>
            If the seed is right, the season is right.
            <br />
            Come meet us in Telangana.
          </p>
        </div>

        {/* Plant a seed */}
        <div className="reveal mt-8 flex justify-center scale-90" style={{ '--reveal-delay': '150ms' }}>
          <PlantASeed />
        </div>

        {/* Contact card */}
        <div className="reveal mt-8 rounded-3xl bg-white/[0.07] backdrop-blur border border-white/15 p-7 md:p-9">
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-8">
            <div>
              <div className="eyebrow text-leaf !text-[10px] mb-3">{CONTACT.corporate.label}</div>
              <h5 className="text-xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>{CONTACT.corporate.name}</h5>
              <p className="mt-3 text-white/70 text-[13.5px] leading-[1.8]">{CONTACT.corporate.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kompally, Hyderabad, Telangana')}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-leaf text-[11px] uppercase tracking-[0.18em] font-bold hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>
                View on map
              </a>
            </div>
            <div>
              <div className="eyebrow text-leaf !text-[10px] mb-3">{CONTACT.plant.label}</div>
              <h5 className="text-xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>{CONTACT.plant.name}</h5>
              <p className="mt-3 text-white/70 text-[13.5px] leading-[1.8]">{CONTACT.plant.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Banda Mallaram Village, Telangana')}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-leaf text-[11px] uppercase tracking-[0.18em] font-bold hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>
                View on map
              </a>
            </div>
            <div className="space-y-6">
              <div>
                <div className="eyebrow text-leaf !text-[10px] mb-2">Direct</div>
                <a href={`tel:${CONTACT.phoneRaw}`} className="block text-xl text-white hover:text-leaf transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                  {CONTACT.phone}
                </a>
                <a href={`tel:${CONTACT.phone2Raw}`} className="block text-xl text-white hover:text-leaf transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                  {CONTACT.phone2}
                </a>
                <div className="text-white/55 text-[12px] mt-2">Customer Care</div>
                <a href={`tel:${CONTACT.customerCareRaw}`} className="text-white/85 text-[15px] hover:text-leaf transition-colors">{CONTACT.customerCare}</a>
              </div>
              <div>
                <div className="eyebrow text-leaf !text-[10px] mb-2">Email</div>
                <a href={`mailto:${CONTACT.email}`} className="text-white/85 text-[14.5px] hover:text-leaf transition-colors break-all">{CONTACT.email}</a>
              </div>
              <a
                href="/brochure/yellina-seeds-company-profile-2026.html"
                download="Yellina-Seeds-Company-Profile-2026.html"
                className="btn-primary !bg-leaf !text-green-950 hover:!bg-white !py-3 !px-6 !text-[11px]"
              >
                Company Profile
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 3v13m0 0l-5-5m5 5l5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="reveal mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <img src="/images/logo-white.png" alt="" className="h-10" />
            <p className="mt-4 text-white/60 text-[12.5px] leading-relaxed">
              Family-grown hybrid maize, sweet corn & paddy seed from Telangana — since 1995.
            </p>
          </div>
          {Object.entries(QUICK_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="eyebrow text-leaf !text-[10px] mb-4">{group}</div>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => (l.crop ? onCrop?.(l.crop) : onNavigate?.(l.id))}
                      className="text-white/75 text-[13px] hover:text-leaf transition-colors cursor-pointer text-left"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badges + baseline */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-leaf px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-green-950" style={{ fontFamily: 'var(--font-sans)' }}>★ Since 1995</span>
          <span className="rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/85" style={{ fontFamily: 'var(--font-sans)' }}>Make in India</span>
          <span className="rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/85" style={{ fontFamily: 'var(--font-sans)' }}>Yellina Family</span>
        </div>

        <div className="mt-8 pt-6 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <div className="text-white/45 text-[12px]">
            © {new Date().getFullYear()} Yellina Seeds Private Limited · Khammam District · Telangana, India
          </div>
          <div className="italic text-[13.5px] text-white/60" style={{ fontFamily: 'var(--font-serif)' }}>
            Seed you can trust · to the field · every season
          </div>
        </div>
      </div>
    </footer>
  )
}
