import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'
import SectionCurve from './SectionCurve.jsx'
import { PILLARS } from '../data/products.js'

// Real photo headers for each pillar.
const PILLAR_PHOTOS = {
  leaf: { src: '/images/photos/field-canopy-green.jpg', alt: 'Green maize canopy in a Yellina field' },
  plant2: { src: '/images/photos/plant-sorting-lines.jpg', alt: 'Sorting lines inside the Yellina processing unit' },
  person: { src: '/images/photos/cobs-in-hands.jpg', alt: 'Yellina cobs held in a farmer’s hands' },
  hands: { src: '/images/photos/paddy-inspection.jpg', alt: 'Yellina team inspecting paddy with a farmer' },
}

const PILLAR_ACCENT = ['#2C7A3C', '#C9A227', '#7DB343']

export default function Pillars() {
  const ref = useReveal()

  return (
    <section id="why" ref={ref} className="relative bg-sage py-11 md:py-14 overflow-hidden">
      <Backdrop src="/images/photos/field-tassels-tree.jpg" color="#F0F4E7" />
      <SectionCurve fill="#FAFAF6" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="reveal eyebrow eyebrow-rule text-green-700">Why Choose Yellina</div>
        <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight max-w-3xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
          Experience that grows better harvests.
        </h2>

        <div className="mt-12 md:mt-16 space-y-14 md:space-y-20">
          {PILLARS.map((p, i) => {
            const photo = PILLAR_PHOTOS[p.icon]
            const reversed = i % 2 === 1
            return (
              <div
                key={p.num}
                className={`reveal relative grid md:grid-cols-2 gap-8 md:gap-14 items-center ${reversed ? '' : ''}`}
                style={{ '--reveal-delay': `${i * 90}ms` }}
              >
                <div
                  className="pointer-events-none select-none absolute -top-10 md:-top-14 text-[110px] md:text-[150px] font-medium leading-none opacity-[0.07]"
                  style={{ fontFamily: 'var(--font-serif)', color: PILLAR_ACCENT[i], [reversed ? 'right' : 'left']: '0' }}
                  aria-hidden="true"
                >
                  {p.num}
                </div>

                <div className={`relative rounded-3xl overflow-hidden h-64 md:h-80 group ${reversed ? 'md:order-2' : ''}`}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.3), transparent 50%)' }} />
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: PILLAR_ACCENT[i] }} />
                </div>

                <div className={`relative ${reversed ? 'md:order-1 md:text-right' : ''}`}>
                  <div
                    className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold ${reversed ? 'md:flex-row-reverse' : ''}`}
                    style={{ fontFamily: 'var(--font-sans)', color: PILLAR_ACCENT[i] }}
                  >
                    <span className="w-6 h-px" style={{ background: PILLAR_ACCENT[i] }} />
                    Pillar {p.num}
                  </div>
                  <h3 className="mt-4 text-[26px] sm:text-[30px] text-green-950 font-normal leading-snug" style={{ fontFamily: 'var(--font-serif)' }}>
                    {p.title}
                  </h3>
                  <p className={`mt-4 text-ink-soft text-[15px] leading-[1.75] max-w-md ${reversed ? 'md:ml-auto' : ''}`}>{p.body}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-14 md:mt-16 flex items-center gap-4" style={{ '--reveal-delay': '260ms' }}>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5))' }} />
          <p className="text-center text-green-800 italic text-[15px] sm:text-base shrink-0 max-w-lg" style={{ fontFamily: 'var(--font-serif)' }}>
            Every principle above traces back to one place — our own production floor.
          </p>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,162,39,0.5), transparent)' }} />
        </div>
      </div>
    </section>
  )
}
