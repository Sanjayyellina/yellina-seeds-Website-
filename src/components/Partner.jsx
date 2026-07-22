import useReveal from '../hooks/useReveal.js'
import { DEALER_BENEFITS } from '../data/products.js'

const BENEFIT_ICONS = [
  <svg key="b0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 17l4-6 4 3 4-7 6 10M3 21h18" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M12 3v6m0 0c-3 0-6 2-6 6a6 6 0 0012 0c0-4-3-6-6-6zM8 21h8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M8 10h8M8 14h5M21 12a9 9 0 11-4-7.5L21 3v9z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="b4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M4 7h13l3 5v5h-2M4 7v10h10M4 7l2-3h8l2 3M7 20a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
]

export default function Partner({ onNavigate }) {
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

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DEALER_BENEFITS.map((b, i) => (
            <div key={b} className="reveal card card-hover corner-leaf p-6 flex flex-col gap-3" style={{ '--reveal-delay': `${i * 70}ms` }}>
              <span className="w-11 h-11 rounded-full bg-sage flex items-center justify-center text-green-700">{BENEFIT_ICONS[i]}</span>
              <span className="text-[14.5px] font-semibold text-green-950 leading-snug" style={{ fontFamily: 'var(--font-serif)' }}>{b}</span>
            </div>
          ))}
        </div>

        {/* CTA — full contact details (team, address, email) live once,
            down in the site's Contact section; this just points there
            instead of repeating that whole card again */}
        <div className="reveal mt-8 rounded-3xl bg-green-950 px-8 py-7 md:px-10 md:py-8 relative overflow-hidden flex flex-wrap items-center justify-between gap-5" style={{ '--reveal-delay': '120ms' }}>
          <img src="/images/photos/field-maize-wide.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.14]" loading="lazy" />
          <div className="relative">
            <h3 className="text-xl sm:text-2xl text-white font-light" style={{ fontFamily: 'var(--font-serif)' }}>
              Ready to become a Yellina dealer?
            </h3>
            <p className="mt-1.5 text-[14px] text-white/75">Reach our team directly — call, WhatsApp, or visit.</p>
          </div>
          <button
            onClick={() => onNavigate?.('contact')}
            className="relative btn-primary !bg-leaf !text-green-950 hover:!bg-white shrink-0"
          >
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  )
}
