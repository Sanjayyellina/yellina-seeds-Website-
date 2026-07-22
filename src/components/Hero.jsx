import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { HERO_BG_IMAGE } from '../data/heroImage.js'

const HeroLeafParticles = lazy(() => import('../three/HeroLeafParticles.jsx'))

// The hero is a thesis: one monumental emblem — the Yellina leaf mark with our
// real fields living inside it — centered like a crest, grounded by a trust
// bar of the companies we've produced for since 1995. Big, quiet, certain.

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
  const glowRef = useRef(null)
  const copyRef = useRef(null)
  const emblemSpacerRef = useRef(null)
  const rotationBoxRef = useRef(null)
  const heroFrameRef = useRef(null)
  const [anchorPx, setAnchorPx] = useState(null)

  // where the logo should form, measured relative to the full-hero particle
  // canvas — captured once up front so the fly-in intro lands in the right spot
  useEffect(() => {
    const measure = () => {
      if (!emblemSpacerRef.current || !heroFrameRef.current) return
      const box = emblemSpacerRef.current.getBoundingClientRect()
      const frame = heroFrameRef.current.getBoundingClientRect()
      setAnchorPx({
        x: box.left + box.width / 2 - frame.left,
        y: box.top + box.height / 2 - frame.top,
        boxHeight: box.height,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // a sun glow follows the cursor; the field photo inside the logo stays frozen
  useEffect(() => {
    const onMove = (e) => {
      if (window.scrollY > window.innerHeight) return
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
      <div ref={heroFrameRef} className="relative overflow-hidden flex flex-col bg-bg">
        {/* cornfield backdrop — sits behind the particle canvas so it shows
            through the gaps while the particles are still flying in/scattered,
            fading out toward the copy below so the text stays legible */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-screen bg-cover bg-center"
          style={{
            zIndex: 0,
            backgroundImage: `url('${HERO_BG_IMAGE}')`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 82%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0) 82%)',
          }}
        />
        {/* particle logo canvas — spans the whole hero so particles can fly in
            from its true edges, converging on the anchored emblem spot below */}
        <div className="absolute inset-x-0 top-0 h-screen pointer-events-none" style={{ zIndex: 1 }}>
          <Suspense fallback={null}>
            <HeroLeafParticles anchorPx={anchorPx} boxRef={rotationBoxRef} heroFrameRef={heroFrameRef} />
          </Suspense>
        </div>

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
        <div ref={copyRef} className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[180px_1fr_150px] items-center gap-8 pt-16 md:pt-20 will-change-transform">
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

          {/* the emblem */}
          <div className="relative mt-8 select-none" aria-hidden="true" style={{ width: 'min(72vw, 520px)' }}>
            <div className="logo-halo absolute -inset-[14%]" />
            <div ref={rotationBoxRef} className="relative aspect-[456/371]">
              {/* invisible spacer marking where the particle logo (rendered in the
                  full-hero canvas above) should anchor and how big it should read */}
              <div ref={emblemSpacerRef} className="absolute -inset-[10%] pointer-events-none" />
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
        <div className="relative mt-7 md:mt-8 border-t" style={{ borderColor: 'rgba(201,162,39,0.35)' }}>
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
