import { useEffect, useRef } from 'react'

// The hero is a thesis: one monumental emblem — the Yellina leaf mark with our
// real fields living inside it — centered like a crest, grounded by a trust
// bar of the companies we've produced for since 1995. Big, quiet, certain.

const LOGO_MASK = {
  WebkitMaskImage: 'url(/images/logo-mask.png)',
  maskImage: 'url(/images/logo-mask.png)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}

const SEALS = [
  ['100%', 'GENUINE', 'SEEDS'],
  ['QUALITY', 'TESTED', 'GERMINATION ASSURED'],
  ['TRUTHFULLY', 'LABELLED', ''],
]

const PARTNER_LOGOS = [
  { src: '/images/partners/logo-syngenta.png', alt: 'Syngenta' },
  { src: '/images/partners/logo-pioneer.png', alt: 'Pioneer' },
  { src: '/images/partners/logo-advanta.png', alt: 'Advanta' },
  { src: '/images/partners/logo-kaveri.png', alt: 'Kaveri' },
  { src: '/images/partners/logo-nath.png', alt: 'Nath' },
  { src: '/images/partners/logo-crystal.png', alt: 'Crystal' },
  { src: '/images/partners/logo-kanchan.png', alt: 'Kanchan' },
]

function Seal({ lines }) {
  return (
    <div
      className="w-[78px] h-[78px] rounded-full flex flex-col items-center justify-center text-center shrink-0 bg-green-950 shadow-[0_8px_20px_-8px_rgba(20,47,27,0.5)]"
      style={{ border: '2px solid var(--color-gold)', outline: '1px dashed rgba(201,162,39,0.55)', outlineOffset: '-6px' }}
    >
      <span className="text-[9px] font-bold leading-tight" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-gold-soft)' }}>{lines[0]}</span>
      <span className="text-white text-[8px] font-bold leading-tight tracking-[0.08em]" style={{ fontFamily: 'var(--font-sans)' }}>{lines[1]}</span>
      {lines[2] && <span className="text-white/70 text-[6px] font-semibold leading-tight tracking-[0.06em] mt-0.5 px-2" style={{ fontFamily: 'var(--font-sans)' }}>{lines[2]}</span>}
    </div>
  )
}

export default function Hero({ onNavigate }) {
  const maskPhotoRef = useRef(null)
  const glowRef = useRef(null)
  const copyRef = useRef(null)

  // the field inside the logo drifts with the pointer; a sun glow follows it
  useEffect(() => {
    const onMove = (e) => {
      if (window.scrollY > window.innerHeight) return
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      if (maskPhotoRef.current) maskPhotoRef.current.style.translate = `${-x * 28}px ${-y * 18}px`
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // hero content lifts away only as it actually leaves the viewport
  useEffect(() => {
    const onScroll = () => {
      if (!copyRef.current) return
      const vh = window.innerHeight
      const bottom = copyRef.current.getBoundingClientRect().bottom
      // untouched while its bottom is in the lower 60% of the screen;
      // fully gone once the bottom passes the top 10%
      const p = Math.min(Math.max((vh * 0.6 - bottom) / (vh * 0.5), 0), 1)
      copyRef.current.style.opacity = String(1 - p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="home" className="relative">
      <div className="relative overflow-hidden flex flex-col bg-bg">
        {/* sun glow chasing the cursor */}
        <div ref={glowRef} className="sun-glow hidden md:block" />

        {/* symmetric faint gold arcs behind the emblem */}
        <div aria-hidden="true" className="absolute left-1/2 top-[8%] -translate-x-1/2 w-[880px] h-[880px] rounded-full border opacity-50" style={{ borderColor: 'rgba(201,162,39,0.22)' }} />
        <div aria-hidden="true" className="absolute left-1/2 top-[16%] -translate-x-1/2 w-[620px] h-[620px] rounded-full border opacity-60" style={{ borderColor: 'rgba(201,162,39,0.18)' }} />

        {/* golden pollen motes */}
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="pollen"
            style={{
              left: `${8 + ((i * 8.3) % 86)}%`,
              width: `${4 + (i % 4) * 2}px`,
              height: `${4 + (i % 4) * 2}px`,
              '--p-dur': `${10 + (i % 5) * 3.5}s`,
              '--p-delay': `${-i * 1.7}s`,
              '--p-drift': `${(i % 2 ? 1 : -1) * (28 + i * 6)}px`,
              '--p-op': 0.45 + (i % 4) * 0.12,
            }}
          />
        ))}

        {/* monument with side rails */}
        <div ref={copyRef} className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[180px_1fr_150px] items-center gap-8 pt-24 md:pt-28 will-change-transform">
          {/* left rail — the numbers */}
          <div className="hidden lg:flex flex-col gap-8 justify-self-start" aria-hidden="true">
            {[['31+', 'Years in Seed'], ['15+', 'Partner Companies'], ['2,000+ MT', 'Drying Capacity']].map(([n, l]) => (
              <div key={l} className="reveal is-visible pl-4 border-l-2" style={{ borderColor: 'var(--color-gold)' }}>
                <div className="text-3xl font-medium text-green-800 leading-none" style={{ fontFamily: 'var(--font-serif)' }}>{n}</div>
                <div className="mt-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-ink-mute" style={{ fontFamily: 'var(--font-sans)' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* center column */}
          <div className="flex flex-col items-center text-center">
          <div className="reveal is-visible inline-flex items-center gap-2.5 rounded-full bg-white/85 border border-line px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-leaf" />
            <span className="text-[10.5px] uppercase tracking-[0.24em] font-bold text-green-800" style={{ fontFamily: 'var(--font-sans)' }}>
              Since 1995 · Khammam District, Telangana
            </span>
          </div>

          {/* the emblem */}
          <div className="relative mt-8 select-none" aria-hidden="true" style={{ width: 'min(72vw, 520px)' }}>
            <div className="logo-halo absolute -inset-[14%]" />
            <div className="absolute -inset-[4%] rounded-full" style={{ animation: 'spin-slow 46s linear infinite' }}>
              <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: 'rgba(201,162,39,0.38)' }} />
              <span className="absolute left-1/2 -top-1.5 w-3 h-3 -translate-x-1/2 rotate-45" style={{ background: 'var(--color-gold)' }} />
            </div>
            <div
              className="relative aspect-[456/371]"
              style={{ animation: 'float-idle 10s ease-in-out infinite alternate', '--famp': '8px', '--frot': '0.4deg', '--fsway': '3px' }}
            >
              <div className="absolute inset-0 overflow-hidden" style={{ ...LOGO_MASK, filter: 'drop-shadow(0 26px 36px rgba(20,47,27,0.26))' }}>
                <img
                  ref={maskPhotoRef}
                  src="/images/photos/field-maize-rows.jpg"
                  alt=""
                  className="w-[112%] h-[112%] max-w-none object-cover transition-[translate] duration-700 ease-out"
                  fetchPriority="high"
                />
                <div
                  className="absolute inset-y-0 -left-1/3 w-1/3"
                  style={{ background: 'linear-gradient(100deg, transparent, rgba(255,244,205,0.5), transparent)', animation: 'logo-sheen 7s ease-in-out infinite' }}
                />
              </div>
            </div>
            <div
              className="absolute left-1/2 -bottom-6 h-8 w-[60%] -translate-x-1/2 rounded-[50%]"
              style={{ background: 'radial-gradient(ellipse, rgba(20,47,27,0.2), transparent 70%)', filter: 'blur(6px)' }}
            />
          </div>

          {/* wordmark lockup */}
          <div className="mt-7">
            <div className="text-4xl sm:text-5xl font-semibold text-green-800 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Yellina Seeds</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.34em] font-bold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-gold)' }}>
              Rooted in Nature · Growing the Future
            </div>
          </div>

          {/* thesis */}
          <h1
            className="mt-6 text-green-950 leading-[1.12] tracking-tight font-light text-3xl sm:text-4xl lg:text-[44px] max-w-3xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Seed you can trust. <span className="text-green-700">Harvests you can count on.</span>
          </h1>

          <p className="mt-5 text-ink-soft text-[15.5px] sm:text-base max-w-2xl leading-relaxed">
            From 1995 we have quietly produced premium-quality seed for some of India's most
            respected seed companies. Today, that same commitment is proudly delivered to
            farmers under one name — Yellina Seeds Private Limited.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button className="btn-primary" onClick={() => onNavigate('products')}>
              See Our Varieties
            </button>
            <a
              href="/brochure/yellina-seeds-company-profile-2026.html"
              download="Yellina-Seeds-Company-Profile-2026.html"
              className="btn-outline"
            >
              Download Brochure
            </a>
          </div>

          <div className="mt-8 flex lg:hidden items-center justify-center gap-4">
            {SEALS.map((s) => (
              <Seal key={s[0] + s[1]} lines={s} />
            ))}
          </div>
          </div>

          {/* right rail — the seals */}
          <div className="hidden lg:flex flex-col gap-5 items-center justify-self-end">
            {SEALS.map((s) => (
              <Seal key={'r' + s[0] + s[1]} lines={s} />
            ))}
          </div>
        </div>

        {/* trust bar — the receipts */}
        <div className="relative mt-10 md:mt-12 border-t" style={{ borderColor: 'rgba(201,162,39,0.35)' }}>
          <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-ink-mute text-center lg:text-left lg:max-w-[210px] leading-relaxed shrink-0" style={{ fontFamily: 'var(--font-sans)' }}>
              Trusted production partner to India's leading seed companies
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4 flex-1">
              {PARTNER_LOGOS.map((p) => (
                <img
                  key={p.alt}
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-7 sm:h-8 w-auto object-contain opacity-55 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-400"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
