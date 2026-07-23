import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'
import { QUALITY_RINGS, QUALITY_PROMISES } from '../data/products.js'

const RING_COLORS = ['#2C7A3C', '#7DB343', '#E39A2E', '#B87716']

// one icon per metric, in QUALITY_RINGS order: genetic purity, physical
// purity, maize germination, paddy germination
const RING_ICONS = [
  <svg key="q0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M7 3c5 3 5 15 10 18M17 3c-5 3-5 15-10 18M7.5 8h9M6.5 16h11" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="q1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="q2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 3c2 3 2 6 0 9-2-3-2-6 0-9zM7 8c1.5 2 1.5 4 0 6M17 8c-1.5 2-1.5 4 0 6M12 12v9" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="q3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 21V9M12 9c-3-1-4-4-4-6 3 0 5 2 6 4M12 9c3-1 4-4 4-6-3 0-5 2-6 4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
]

function QualityIcon({ pct, label, sub, color, icon }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <span
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(145deg, var(--color-sage), #fff)', color, boxShadow: '0 1px 2px rgba(31,42,33,0.04), 0 10px 22px -12px rgba(31,42,33,0.25)' }}
      >
        {icon}
      </span>
      <div className="text-lg font-semibold text-green-950" style={{ fontFamily: 'var(--font-serif)' }}>{pct}%</div>
      <div>
        <div className="text-[9.5px] uppercase tracking-[0.14em] font-bold text-ink" style={{ fontFamily: 'var(--font-sans)' }}>{label}</div>
        <div className="mt-0.5 text-[10px] text-ink-mute">{sub}</div>
      </div>
    </div>
  )
}

export default function Quality() {
  const ref = useReveal()

  return (
    <section id="quality" ref={ref} className="relative bg-bg py-11 md:py-14 overflow-hidden">
      <Backdrop src="/images/photos/paddy-grain-check.jpg" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">Our Quality Promise</div>
            <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.12] text-green-950 font-light tracking-tight max-w-xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              Quality without compromise.
            </h2>
          </div>
          <p className="reveal max-w-xs text-ink-soft text-[14px] leading-relaxed" style={{ '--reveal-delay': '120ms' }}>
            We never release a single kilogram of seed without GOT and germination testing. If any
            lot fails, the entire quantity is discarded.
          </p>
        </div>

        {/* certified-standards — plain icons, no card tile around them */}
        <div className="mt-9 flex flex-wrap justify-center sm:justify-start gap-x-10 gap-y-8">
          {QUALITY_RINGS.map((r, i) => (
            <div key={r.label + r.sub} className="reveal" style={{ '--reveal-delay': `${i * 70}ms` }}>
              <QualityIcon {...r} color={RING_COLORS[i]} icon={RING_ICONS[i]} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
          <div>
            <h3 className="reveal text-2xl sm:text-[28px] text-green-950 font-light leading-snug" style={{ fontFamily: 'var(--font-serif)' }}>
              Every seed is
            </h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {QUALITY_PROMISES.map((q, i) => (
                <div key={q.bold} className="reveal card flex gap-3.5 items-start px-5 py-4 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(31,42,33,0.05),0_18px_36px_-16px_rgba(31,42,33,0.18)] transition-all duration-400" style={{ '--reveal-delay': `${i * 60}ms` }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0">
                    <circle cx="10" cy="10" r="9" fill="none" stroke="#7DB343" strokeWidth="1.6" />
                    <path d="M6 10.4l2.6 2.6L14 7.4" fill="none" stroke="#2C7A3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[13.5px] leading-relaxed text-ink-soft">
                    <b className="text-ink font-semibold">{q.bold}</b>
                    {q.rest}
                  </p>
                </div>
              ))}
            </div>
            <div className="reveal mt-6 card !bg-sage px-6 py-5" style={{ '--reveal-delay': '260ms' }}>
              <div className="font-semibold text-green-900 text-[15px]" style={{ fontFamily: 'var(--font-serif)' }}>The Indian Seeds Act, 1966</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                Every Yellina seed packet complies with the provisions of the Indian Seeds Act, 1966,
                while consistently striving to exceed statutory quality requirements.
              </p>
            </div>
          </div>

          {/* Grain fill, checked in every plot — real cross-sections, levitating (unchanged) */}
          <div className="reveal relative max-w-md mx-auto lg:mx-0 h-[300px] lg:mt-8" style={{ '--reveal-delay': '140ms' }}>
            <div data-parallax="0.15" className="absolute top-0 left-0 w-[54%]">
              <div className="photo-frame" style={{ '--tilt': '-3deg', animation: 'float-idle 7.5s ease-in-out infinite alternate' }}>
                <img src="/images/photos/grain-cross-hand.jpg" alt="Cross-sections of Yellina maize cobs showing grain depth" className="w-full aspect-[3/4] object-cover" />
              </div>
            </div>
            <div data-parallax="-0.12" className="absolute top-6 right-0 w-[54%]">
              <div className="photo-frame" style={{ '--tilt': '2.5deg', animation: 'float-idle 8.8s ease-in-out 1.1s infinite alternate' }}>
                <img src="/images/photos/grain-cross-closeup.jpg" alt="Close-up of maize grain cross-section" className="w-full aspect-[3/4] object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 card !rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.22em] font-bold text-green-800 whitespace-nowrap z-[2]" style={{ fontFamily: 'var(--font-sans)' }}>
              Grain fill, checked in every plot
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
