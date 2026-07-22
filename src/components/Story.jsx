import { useEffect, useRef, useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'
import SectionCurve from './SectionCurve.jsx'
import { STATS, TIMELINE } from '../data/products.js'

// Numbers that count up from zero when they enter the viewport.
function CountUp({ value }) {
  const m = value.match(/^(\d+)(.*)$/)
  const target = m ? parseInt(m[1], 10) : 0
  const suffix = m ? m[2] : ''
  const [n, setN] = useState(0)
  const elRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        const t0 = performance.now()
        const dur = 1700
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1)
          setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return <span ref={elRef}>{n}{suffix}</span>
}

// Partners: real logos where we have the files, clean text chips for the rest.
const PARTNER_LOGOS = [
  { src: '/images/partners/logo-syngenta.png', alt: 'Syngenta' },
  { src: '/images/partners/logo-pioneer.png', alt: 'Pioneer' },
  { src: '/images/partners/logo-advanta.png', alt: 'Advanta' },
  { src: '/images/partners/logo-kaveri.png', alt: 'Kaveri' },
  { src: '/images/partners/logo-nath.png', alt: 'Nath' },
  { src: '/images/partners/logo-crystal.png', alt: 'Crystal' },
]
const PARTNER_NAMES = [
  'Shriram Bioseed', '+ several others',
]

function SeedDot({ filled }) {
  return (
    <span className={`tl-dot block w-4 h-4 rounded-full border-2 ${filled ? 'bg-leaf border-leaf' : 'bg-white border-green-700'}`} />
  )
}

export default function Story() {
  const ref = useReveal()

  return (
    <section id="story" ref={ref} className="relative bg-sage py-11 md:py-14 overflow-hidden">
      <Backdrop src="/images/photos/field-maize-wide.jpg" color="#F0F4E7" />
      <SectionCurve fill="#FAFAF6" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-12 items-start">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">Our Legacy</div>
            <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              31 years of excellence in the seed supply chain.
            </h2>

            {/* Our Strength */}
            <div className="reveal mt-8 text-[11px] uppercase tracking-[0.24em] font-bold text-ink-mute" style={{ fontFamily: 'var(--font-sans)', '--reveal-delay': '140ms' }}>Our Strength</div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <div key={s.label} className="reveal card card-hover px-6 py-6" style={{ '--reveal-delay': `${i * 80}ms` }}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[42px] leading-none font-medium text-green-700" style={{ fontFamily: 'var(--font-serif)' }}><CountUp value={s.num} /></span>
                    <span className="text-amber-deep text-sm font-medium italic" style={{ fontFamily: 'var(--font-serif)' }}>{s.sub}</span>
                  </div>
                  <div className="mt-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-ink-mute leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Levitating real photos, drifting at different depths */}
          <div className="reveal relative h-[440px] sm:h-[520px] hidden sm:block" style={{ '--reveal-delay': '200ms' }}>
            <div data-parallax="0.16" className="absolute top-0 right-6 w-[62%]">
              <div className="photo-frame relative overflow-hidden" style={{ '--tilt': '2.5deg', animation: 'float-idle 7s ease-in-out infinite alternate' }}>
                <img src="/images/photos/paddy-grain-check.jpg" alt="Checking paddy grain in the field" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute inset-x-0 bottom-0 px-3 pt-9 pb-2.5 text-center text-[10px] uppercase tracking-[0.18em] font-bold text-white" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.72), transparent)', fontFamily: 'var(--font-sans)' }}>Grain check · paddy plot</div>
              </div>
            </div>
            <div data-parallax="-0.13" className="absolute bottom-0 left-0 w-[58%]">
              <div className="photo-frame relative overflow-hidden" style={{ '--tilt': '-3deg', animation: 'float-idle 8.5s ease-in-out 0.9s infinite alternate' }}>
                <img src="/images/photos/cobs-in-hands.jpg" alt="Harvested Yellina cobs held in hands" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-x-0 bottom-0 px-3 pt-9 pb-2.5 text-center text-[10px] uppercase tracking-[0.18em] font-bold text-white" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.72), transparent)', fontFamily: 'var(--font-sans)' }}>Harvest day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline — open, no box, big year markers */}
        <div className="mt-14 reveal" style={{ '--reveal-delay': '120ms' }}>
          <div className="relative">
            <div className="tl-line absolute left-[7px] top-2 bottom-2 w-0.5 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-0.5 md:w-full rounded" />
            <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-4">
              {TIMELINE.map((t, i) => (
                <div key={t.year} className="relative flex md:flex-col items-start gap-5 md:gap-0 md:flex-1 group">
                  <div className="relative z-10 mt-1.5 md:mt-0 transition-transform duration-500 group-hover:scale-125">
                    <SeedDot filled={i < TIMELINE.length - 1} />
                  </div>
                  <div className="md:mt-6 -mt-1">
                    <div className="text-3xl sm:text-4xl font-light text-green-800 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>{t.year}</div>
                    <div className="text-amber-deep text-[10.5px] uppercase tracking-[0.2em] font-bold mt-1.5" style={{ fontFamily: 'var(--font-sans)' }}>{t.label}</div>
                    <div className="mt-1.5 text-ink-soft text-[13px] leading-relaxed max-w-[190px]">{t.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-10 reveal">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
            <h3 className="text-2xl sm:text-3xl text-green-950 font-light" style={{ fontFamily: 'var(--font-serif)' }}>
              Seed companies we have produced for
            </h3>
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-mute font-bold" style={{ fontFamily: 'var(--font-sans)' }}>15+ partners · since 1995</div>
          </div>
          <div className="relative overflow-hidden py-2" style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
            <div className="marquee-track flex gap-4 w-max items-stretch">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex gap-4 items-stretch">
                  {PARTNER_LOGOS.map((p) => (
                    <div key={p.alt + dup} className="card !rounded-xl px-7 py-3 flex items-center justify-center w-[170px] h-[74px]">
                      <img src={p.src} alt={p.alt} className="max-h-[46px] max-w-[130px] object-contain" loading="lazy" />
                    </div>
                  ))}
                  {PARTNER_NAMES.map((n) => (
                    <div key={n + dup} className="card !rounded-xl px-7 flex items-center justify-center h-[74px] whitespace-nowrap text-[15px] font-semibold text-green-900" style={{ fontFamily: 'var(--font-sans)' }}>
                      {n}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
