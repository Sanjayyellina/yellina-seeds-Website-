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

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => {
            const photo = PILLAR_PHOTOS[p.icon]
            return (
              <div
                key={p.num}
                className="reveal card card-hover corner-leaf overflow-hidden group"
                style={{ '--reveal-delay': `${i * 100}ms` }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.35), transparent 55%)' }} />
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-green-800 font-medium text-lg shadow" style={{ fontFamily: 'var(--font-serif)' }}>
                    {p.num}
                  </div>
                </div>
                <div className="p-7 md:p-8">
                  <h3 className="text-[22px] text-green-950 font-normal leading-snug" style={{ fontFamily: 'var(--font-serif)' }}>
                    {p.title}
                  </h3>
                  <p className="mt-3.5 text-ink-soft text-[14.5px] leading-[1.75]">{p.body}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="reveal mt-8 flex items-center gap-4" style={{ '--reveal-delay': '260ms' }}>
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
