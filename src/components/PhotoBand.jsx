import useReveal from '../hooks/useReveal.js'

// Full-width photo interlude between chapters. The photo itself drifts with
// scroll (data-parallax picked up by the global loop), and the quote surfaces
// word by word.
export default function PhotoBand({ src, eyebrow, quote, attribution }) {
  const ref = useReveal()

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* photo layer, taller than the band so it can drift */}
      <div data-parallax="-0.16" className="absolute -inset-y-[18%] inset-x-0">
        <img src={src} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(20,47,27,0.62), rgba(20,47,27,0.42) 50%, rgba(20,47,27,0.66))' }} />

      <div className="relative max-w-4xl mx-auto px-6 py-12 md:py-14 text-center">
        <div className="reveal eyebrow text-leaf">{eyebrow}</div>
        <p
          className="reveal mt-6 text-white font-light leading-[1.3] text-2xl sm:text-3xl md:text-[40px]"
          style={{ fontFamily: 'var(--font-serif)', textShadow: '0 2px 24px rgba(20,47,27,0.5)', '--reveal-delay': '120ms' }}
        >
          {quote}
        </p>
        {attribution && (
          <div className="reveal mt-7 text-[11px] uppercase tracking-[0.26em] font-bold text-white/75" style={{ fontFamily: 'var(--font-sans)', '--reveal-delay': '260ms' }}>
            {attribution}
          </div>
        )}
      </div>
    </section>
  )
}
