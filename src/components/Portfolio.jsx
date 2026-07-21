import useReveal from '../hooks/useReveal.js'
import SectionCurve from './SectionCurve.jsx'

// The whole portfolio as two rivers of real crop photos. Field crops flow
// left → right, vegetable seeds flow right → left. Available crops click
// through to their varieties; the rest carry a Coming Soon tag.

const FIELD = [
  { name: 'Hybrid Maize', sub: '3 hybrids', img: '/images/photos/field-maize-rows.jpg', crop: 'maize' },
  { name: 'Hybrid Paddy', sub: '2 varieties', img: '/images/photos/paddy-panicle.jpg', crop: 'paddy' },
  { name: 'Research Paddy', sub: '2 varieties', img: '/images/photos/paddy-grain-check.jpg', crop: 'paddy' },
  { name: 'Wheat', sub: 'Coming 2027', img: '/images/photos/crops/wheat.jpg' },
  { name: 'Mustard', sub: 'Research & Hybrid', img: '/images/photos/crops/mustard.jpg' },
  { name: 'Fodder Bajra', sub: 'Coming 2027', img: '/images/photos/crops/bajra.jpg' },
  { name: 'Fodder Sorghum', sub: 'Coming 2027', img: '/images/photos/crops/sorghum.jpg' },
]

const VEGETABLE = [
  { name: 'Sweet Corn', sub: '2 hybrids', img: '/images/photos/sweetcorn-cobs.jpg', crop: 'sweetcorn' },
  { name: 'Okra', sub: 'Research & Hybrids', img: '/images/photos/crops/okra.jpg' },
  { name: 'Cowpea', sub: 'Coming 2027', img: '/images/photos/crops/cowpea.jpg' },
  { name: 'Radish', sub: 'Coming 2027', img: '/images/photos/crops/radish.jpg' },
  { name: 'Cluster Beans', sub: 'Coming 2027', img: '/images/photos/crops/clusterbeans.jpg' },
  { name: 'Cucumber', sub: 'Coming 2027', img: '/images/photos/crops/cucumber.jpg' },
  { name: 'Beans', sub: 'Coming 2027', img: '/images/photos/crops/beans.jpg' },
]

function Tile({ c, onCrop }) {
  const available = !!c.crop
  const inner = (
    <>
      <img src={c.img} alt={`${c.name} crop`} loading="lazy" className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08] ${available ? '' : 'saturate-[0.92]'}`} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.85), rgba(20,47,27,0.05) 52%)' }} />
      <span
        className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[8.5px] uppercase tracking-[0.14em] font-bold ${available ? 'bg-white/90 text-green-800' : 'text-white'}`}
        style={{ fontFamily: 'var(--font-sans)', background: available ? undefined : 'var(--color-gold)' }}
      >
        {available ? 'Available' : 'Coming Soon'}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="text-white text-[17px] font-medium leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>{c.name}</div>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-white/72 text-[9.5px] uppercase tracking-[0.14em] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>{c.sub}</span>
          {available && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-white -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><path d="M5 12h14m0 0l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </div>
      </div>
    </>
  )
  const base = 'relative shrink-0 w-[210px] sm:w-[240px] h-44 sm:h-52 corner-leaf overflow-hidden group shadow-[0_14px_30px_-14px_rgba(20,47,27,0.35)]'
  return available ? (
    <button onClick={() => onCrop(c.crop)} aria-label={`Browse ${c.name}`} className={`${base} text-left cursor-pointer hover:shadow-[0_22px_44px_-16px_rgba(20,47,27,0.5)] transition-shadow duration-500`}>{inner}</button>
  ) : (
    <div className={base} title={`${c.name} · Coming Soon`}>{inner}</div>
  )
}

function River({ items, reverse, onCrop, label }) {
  return (
    <div>
      <div className="reveal flex items-center gap-4 mb-4 max-w-6xl mx-auto px-6">
        <div className="text-[11px] uppercase tracking-[0.26em] font-bold text-green-800 whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>{label}</div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,162,39,0.5), transparent)' }} />
      </div>
      <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)' }}>
        <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''} flex gap-4 w-max py-2`}>
          {[...items, ...items].map((c, i) => (
            <Tile key={`${c.name}-${i}`} c={c} onCrop={onCrop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Portfolio({ onCrop }) {
  const ref = useReveal()

  return (
    <section id="coming" ref={ref} className="relative bg-sage pt-14 pb-16 md:pt-16 md:pb-20 overflow-hidden">
      <SectionCurve fill="#FAFAF6" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">Our Portfolio</div>
            <h2 className="reveal mt-4 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight max-w-2xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              Field crops and vegetable seeds.
            </h2>
          </div>
          <div className="reveal inline-flex items-center gap-2 rounded-full bg-white border border-line px-4 py-2 text-[10.5px] uppercase tracking-[0.2em] font-bold text-amber-deep" style={{ fontFamily: 'var(--font-sans)', '--reveal-delay': '150ms' }}>
            <span className="w-2 h-2 rotate-45" style={{ background: 'var(--color-gold)' }} />
            New improved varieties arriving in 2027
          </div>
        </div>
      </div>

      <div className="relative mt-10 space-y-8">
        <River items={FIELD} reverse label="Field Crops" onCrop={onCrop} />
        <River items={VEGETABLE} label="Vegetable Seeds" onCrop={onCrop} />
      </div>
    </section>
  )
}
