import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'
import { QUALITY_RINGS, QUALITY_PROMISES } from '../data/products.js'

const RING_COLORS = ['#2C7A3C', '#7DB343', '#E39A2E', '#B87716']

function Ring({ pct, label, sub, color, animate }) {
  const C = 2 * Math.PI * 42
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="qring w-full h-full">
          <circle className="track" cx="50" cy="50" r="42" fill="none" strokeWidth="7" />
          <circle
            className="bar"
            cx="50" cy="50" r="42" fill="none"
            stroke={color} strokeWidth="7"
            strokeDasharray={C}
            strokeDashoffset={animate ? C * (1 - pct / 100) : C}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-green-950" style={{ fontFamily: 'var(--font-serif)' }}>
          {pct}%
        </div>
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.18em] font-bold text-ink" style={{ fontFamily: 'var(--font-sans)' }}>{label}</div>
      <div className="mt-1 text-[11px] text-ink-mute">{sub}</div>
    </div>
  )
}

export default function Quality() {
  const ref = useReveal()
  const ringsRef = useRef(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const el = ringsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true)
          obs.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="quality" ref={ref} className="relative bg-bg py-11 md:py-14 overflow-hidden">
      <Backdrop src="/images/photos/paddy-grain-check.jpg" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="reveal eyebrow eyebrow-rule text-green-700">Our Quality Promise</div>
        <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.12] text-green-950 font-light tracking-tight max-w-3xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
          Quality without compromise.
        </h2>

        <div className="mt-10 grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div>
            <div ref={ringsRef} className="reveal card grid grid-cols-2 gap-x-10 gap-y-10 max-w-lg mx-auto lg:mx-0 px-8 py-10">
              {QUALITY_RINGS.map((r, i) => (
                <Ring key={r.label + r.sub} {...r} color={RING_COLORS[i]} animate={animate} />
              ))}
            </div>

            {/* Grain fill, checked in every plot — real cross-sections, levitating */}
            <div className="reveal mt-10 relative max-w-md mx-auto lg:mx-0 h-[300px]" style={{ '--reveal-delay': '140ms' }}>
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

          <div>
            <h3 className="reveal text-2xl sm:text-[28px] text-green-950 font-light leading-snug" style={{ fontFamily: 'var(--font-serif)' }}>
              Every seed is
            </h3>
            <p className="reveal mt-4 text-ink-soft text-[15px] leading-relaxed" style={{ '--reveal-delay': '80ms' }}>
              We never release a single kilogram of seed without GOT and germination testing. If any
              lot does not meet our standards, the entire quantity is discarded — because it should
              be the best in the industry.
            </p>
            <div className="mt-8 space-y-3">
              {QUALITY_PROMISES.map((q, i) => (
                <div key={q.bold} className="reveal card flex gap-4 items-start px-5 py-4 hover:translate-x-1.5 transition-transform duration-400" style={{ '--reveal-delay': `${i * 70}ms` }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0">
                    <circle cx="10" cy="10" r="9" fill="none" stroke="#7DB343" strokeWidth="1.6" />
                    <path d="M6 10.4l2.6 2.6L14 7.4" fill="none" stroke="#2C7A3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[14px] leading-relaxed text-ink-soft">
                    <b className="text-ink font-semibold">{q.bold}</b>
                    {q.rest}
                  </p>
                </div>
              ))}
            </div>
            <div className="reveal mt-6 card !bg-sage px-6 py-5" style={{ '--reveal-delay': '160ms' }}>
              <div className="font-semibold text-green-900 text-[15px]" style={{ fontFamily: 'var(--font-serif)' }}>The Indian Seeds Act, 1966</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                Every Yellina seed packet complies with the provisions of the Indian Seeds Act, 1966,
                while consistently striving to exceed statutory quality requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
