import useReveal from '../hooks/useReveal.js'
import { DEALER_BENEFITS } from '../data/products.js'

const BENEFIT_ICONS = [
  <svg key="b0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 17l4-6 4 3 4-7 6 10M3 21h18" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 3v6m0 0c-3 0-6 2-6 6a6 6 0 0012 0c0-4-3-6-6-6zM8 21h8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M8 10h8M8 14h5M21 12a9 9 0 11-4-7.5L21 3v9z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 7h13l3 5v5h-2M4 7v10h10M4 7l2-3h8l2 3M7 20a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
]

export default function Partner() {
  const ref = useReveal()

  return (
    <section id="partner" ref={ref} className="relative py-11 md:py-14 bg-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="reveal eyebrow eyebrow-rule text-green-700">For Dealers & Distributors</div>
        <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight max-w-3xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
          Grow your business with Yellina.
        </h2>
        <p className="reveal mt-6 text-ink-soft text-base sm:text-lg leading-relaxed max-w-2xl" style={{ '--reveal-delay': '150ms' }}>
          Partner with a company backed by decades of production expertise.
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-6">
          {DEALER_BENEFITS.map((b, i) => (
            <div key={b} className="reveal group flex flex-col items-center gap-3.5 text-center" style={{ '--reveal-delay': `${i * 70}ms` }}>
              <span
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-400 group-hover:-translate-y-1"
                style={{ background: 'linear-gradient(145deg, var(--color-sage), #fff)', boxShadow: '0 1px 2px rgba(31,42,33,0.04), 0 14px 28px -14px rgba(31,42,33,0.22)' }}
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: 'linear-gradient(145deg, #2C7A3C, #1D4426)' }} />
                <span className="relative text-green-700 group-hover:text-white transition-colors duration-400">{BENEFIT_ICONS[i]}</span>
              </span>
              <span className="text-[13px] font-semibold text-green-950 leading-snug max-w-[120px]" style={{ fontFamily: 'var(--font-serif)' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
