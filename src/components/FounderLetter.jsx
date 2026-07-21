import { useRef } from 'react'
import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'

export default function FounderLetter() {
  const ref = useReveal()
  const portraitRef = useRef(null)

  // subtle 3D depth on the portrait, following the pointer
  const onMove = (e) => {
    const el = portraitRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateZ(10px)`
  }
  const onLeave = () => {
    if (portraitRef.current) portraitRef.current.style.transform = 'perspective(800px)'
  }

  return (
    <section ref={ref} className="relative bg-bg py-16 md:py-22 overflow-hidden">
      <Backdrop src="/images/photos/field-canopy-green.jpg" />
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-[340px_1fr] gap-14 md:gap-20 items-start">
        {/* Portrait column */}
        <div className="reveal mx-auto md:mx-0 max-w-[320px] md:sticky md:top-28">
          <div
            ref={portraitRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative rounded-2xl overflow-hidden shadow-[0_24px_56px_-18px_rgba(20,47,27,0.35)] transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img src="/images/founder.jpg" alt="Mr. Murali Krishna, Founder & Managing Director" className="w-full h-auto block" />
          </div>
          <div className="mt-6 text-center md:text-left">
            <div className="text-2xl text-green-900 font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
              Mr. Murali Krishna
            </div>
            <div className="eyebrow text-green-700 mt-1.5 !tracking-[0.22em] text-[10px]">Founder & Managing Director</div>
            <div className="mt-5 card inline-block px-5 py-4">
              <div className="text-[9px] uppercase tracking-[0.28em] text-ink-mute font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Hyderabad, Telangana</div>
              <div className="italic text-lg text-green-800 mt-1" style={{ fontFamily: 'var(--font-serif)' }}>Where our journey began in 1995.</div>
            </div>
          </div>
        </div>

        {/* Letter column */}
        <div>
          <div className="reveal eyebrow eyebrow-rule text-green-700">A Letter from the Founder</div>
          <h2
            className="reveal mt-5 text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] text-green-950 font-light tracking-tight"
            style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}
          >
            Built on Trust. Driven by Experience.
          </h2>

          <div className="reveal mt-8 space-y-5 text-[15.5px] leading-[1.8] text-ink-soft max-w-2xl" style={{ '--reveal-delay': '160ms' }}>
            <p className="font-medium text-ink">Dear Stakeholder,</p>
            <p>
              Every successful harvest begins with a single seed. For us, producing that seed has
              never been just a business — it has been a responsibility.
            </p>
            <p>
              For more than 31 years, our farms and processing facilities have produced
              hybrid seed for many of India's leading agricultural companies, including Syngenta,
              Pioneer, Advanta, Kaveri, Nath, Shriram Bioseed, Crystal, and several others.
            </p>
            <p>
              Working alongside these industry leaders taught us the highest standards of seed
              production, quality assurance, drying technology, and genetic purity. More importantly,
              it reinforced one simple belief:
            </p>
            <blockquote className="card border-l-4 !border-l-leaf rounded-r-xl px-7 py-6 italic text-[19px] leading-relaxed text-green-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Trust is earned in the field — not in advertisements.
            </blockquote>
            <p>
              As the years passed, one question inspired us:{' '}
              <em className="text-green-800">
                Why shouldn't farmers receive this same quality directly from the people who have been
                producing it for decades?
              </em>
            </p>
            <p>That vision gave birth to Yellina Seeds.</p>
            <p>
              Today, every packet carrying our family name reflects generations of agricultural
              experience, uncompromising quality standards, and our commitment to helping farmers
              achieve stronger, healthier, and more profitable harvests.
            </p>
            <p>
              We may not be the largest seed company in India. But every seed we produce carries
              something equally valuable — <b className="text-ink font-semibold">our reputation.</b>
            </p>
            <p className="italic text-lg text-green-800" style={{ fontFamily: 'var(--font-serif)' }}>
              Thank you for placing your trust in us.
            </p>
          </div>

          <div className="reveal mt-10 max-w-2xl" style={{ '--reveal-delay': '220ms' }}>
            <div className="card px-6 py-5 !bg-sage">
              <div className="text-[9px] uppercase tracking-[0.28em] text-green-700 font-bold mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Our Promise</div>
              <div className="italic text-[17px] leading-snug text-green-900" style={{ fontFamily: 'var(--font-serif)' }}>
                If the seed is right, the season is right.
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                Every packet represents our commitment to quality, consistency, and the success of
                every farmer who chooses Yellina seed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
