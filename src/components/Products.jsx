import { useEffect, useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'
import { PRODUCTS, CATEGORIES } from '../data/products.js'

const CATEGORY_ACCENT = { maize: '#2C7A3C', sweetcorn: '#C9A227', paddy: '#B87716' }

const CATEGORY_ICONS = {
  maize: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 3c2 3 2 6 0 9-2-3-2-6 0-9zM7 8c1.5 2 1.5 4 0 6M17 8c-1.5 2-1.5 4 0 6M12 12v9" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  sweetcorn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><rect x="8" y="3" width="8" height="15" rx="4" /><path d="M12 18v3" strokeLinecap="round" /></svg>,
  paddy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><path d="M12 21V9M12 9c-3-1-4-4-4-6 3 0 5 2 6 4M12 9c3-1 4-4 4-6-3 0-5 2-6 4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
}

function ProductCard({ p, onOpen, delay, accent }) {
  return (
    <button
      onClick={() => onOpen(p)}
      className="reveal group text-left relative rounded-2xl overflow-hidden card card-hover cursor-pointer"
      style={{ '--reveal-delay': `${delay}ms` }}
      aria-label={`View ${p.name} details`}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] z-[1]" style={{ background: accent }} />
      <div
        className="relative overflow-hidden pt-4 px-3"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${accent}14, transparent 70%)` }}
      >
        <img
          src={p.image}
          alt={`${p.name} — ${p.type} seed pack`}
          loading="lazy"
          className="w-full aspect-[4/5] object-contain transition-transform duration-700 group-hover:scale-[1.045]"
        />
        <div className="pack-shine" />
      </div>
      <div className="absolute top-3 left-3">
        <span className="rounded-full bg-white/90 backdrop-blur border border-line px-3 py-1 text-[8.5px] uppercase tracking-[0.18em] font-bold text-green-800 shadow-sm" style={{ fontFamily: 'var(--font-sans)' }}>
          {p.type}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[18px] text-green-950 font-medium leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>{p.name}</h3>
          {p.code && <span className="text-[8.5px] uppercase tracking-[0.16em] font-bold text-ink-mute shrink-0" style={{ fontFamily: 'var(--font-sans)' }}>{p.code}</span>}
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft line-clamp-2">{p.tagline}</p>

        {/* truthful-label facts, surfaced right on the tile instead of hidden behind a click */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {p.truthful.slice(0, 2).map((t) => (
            <div key={t.label} className="rounded-lg bg-sage px-2 py-1.5 text-center">
              <div className="text-[7.5px] uppercase tracking-[0.1em] text-green-700 font-bold" style={{ fontFamily: 'var(--font-sans)' }}>{t.label}</div>
              <div className="text-[11.5px] font-semibold text-green-950">{t.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex items-center justify-between text-[9.5px] uppercase tracking-[0.18em] font-bold group-hover:translate-x-0.5 transition-transform duration-500" style={{ fontFamily: 'var(--font-sans)', color: accent }}>
          Full details
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14m0 0l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </button>
  )
}

function ProductModal({ p, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  if (!p) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={`${p.name} details`}>
      <div className="modal-backdrop absolute inset-0" onClick={onClose} />
      <div className="modal-panel relative glass-light w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white border border-line shadow flex items-center justify-center text-ink-soft hover:text-green-700 hover:rotate-90 transition-all duration-400 cursor-pointer"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
        </button>

        {/* browse varieties without leaving the modal */}
        <button
          onClick={onPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-line shadow-lg flex items-center justify-center text-green-800 hover:bg-green-700 hover:text-white transition-all duration-300 cursor-pointer"
          aria-label="Previous variety"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={onNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-line shadow-lg flex items-center justify-center text-green-800 hover:bg-green-700 hover:text-white transition-all duration-300 cursor-pointer"
          aria-label="Next variety"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <div className="grid md:grid-cols-[1fr_1.2fr]">
          {/* Pack design — no 3D viewer, just the real pack artwork */}
          <div className="relative min-h-[280px] md:min-h-full flex flex-col items-center justify-center p-8" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(125,179,67,0.18), rgba(240,244,231,0.9) 75%)' }}>
            <img src={p.image} alt={`${p.name} pack design`} className="w-full max-w-[220px] object-contain" />
            <div className="mt-5 text-[9px] uppercase tracking-[0.2em] text-amber-deep font-bold" style={{ fontFamily: 'var(--font-sans)' }}>Pack Design · 2026 Release</div>
          </div>

          {/* Details */}
          <div className="p-7 md:p-10">
            <div className="eyebrow text-green-700 !text-[10px]">{p.type}{p.code ? ` · ${p.code}` : ''}</div>
            <h3 className="mt-2 text-4xl text-green-950 font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{p.name}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.badges.map((b) => (
                <span key={b} className="rounded-full bg-green-100 px-3 py-1 text-[9.5px] uppercase tracking-[0.14em] font-bold text-green-900" style={{ fontFamily: 'var(--font-sans)' }}>
                  {b}
                </span>
              ))}
            </div>

            {/* Truthful label — surfaced right under the badges, not buried at the bottom */}
            <div className="mt-5 rounded-2xl border border-line bg-white p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-amber-deep font-bold mb-3.5" style={{ fontFamily: 'var(--font-sans)' }}>
                Truthful Label · per Indian Seed Act 1966
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                {p.truthful.map((t) => (
                  <div key={t.label} className="flex flex-col">
                    <span className="text-[10px] text-ink-mute">{t.label}</span>
                    <b className="text-green-900 text-[13px] font-semibold">{t.value}</b>
                  </div>
                ))}
              </div>
            </div>

            {p.claim && (
              <p className="mt-5 italic text-[17px] leading-relaxed text-green-900" style={{ fontFamily: 'var(--font-serif)' }}>
                “{p.claim}”
              </p>
            )}

            {p.stats.length > 0 && (
              <div className="mt-7 grid grid-cols-2 gap-2.5">
                {p.stats.map((s) => (
                  <div key={s.label} className="rounded-xl bg-sage px-3 py-3.5 text-center">
                    <div className="text-[8.5px] uppercase tracking-[0.18em] text-green-700 font-bold" style={{ fontFamily: 'var(--font-sans)' }}>{s.label}</div>
                    <div className="mt-1 text-green-950 font-semibold text-[15px] leading-tight">
                      {s.value}
                      {s.unit && <span className="block text-[10px] font-normal text-ink-mute mt-0.5">{s.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Products({ cat = 'maize', onCatChange }) {
  const ref = useReveal()
  const [active, setActive] = useState(null)
  const setCat = onCatChange || (() => {})

  const current = CATEGORIES.find((c) => c.id === cat)
  const items = PRODUCTS.filter((p) => p.category === cat)

  return (
    <section id="products" ref={ref} className="relative py-11 md:py-14 bg-bg overflow-hidden">
      <Backdrop src="/images/photos/field-canopy-green.jpg" opacity={0.15} />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">Our Products</div>
            <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight max-w-xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              Our varieties, under our own name.
            </h2>
          </div>

          {/* Category switcher — icon pills */}
          <div className="reveal inline-flex flex-wrap gap-2" style={{ '--reveal-delay': '150ms' }}>
            {CATEGORIES.map((c) => {
              const isActive = cat === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] font-bold transition-all duration-400 cursor-pointer border"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    background: isActive ? CATEGORY_ACCENT[c.id] : 'var(--color-card)',
                    color: isActive ? '#fff' : 'var(--color-ink-soft)',
                    borderColor: isActive ? CATEGORY_ACCENT[c.id] : 'var(--color-line)',
                  }}
                >
                  <span style={{ color: isActive ? '#fff' : CATEGORY_ACCENT[c.id] }}>{CATEGORY_ICONS[c.id]}</span>
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        <div key={cat} className="mt-9">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <p className="reveal is-visible text-ink-soft text-base leading-relaxed max-w-2xl">
              <span className="italic text-green-900 text-lg block mb-1.5" style={{ fontFamily: 'var(--font-serif)' }}>{current.heading}</span>
              {current.intro || null}
            </p>
            <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-ink-mute" style={{ fontFamily: 'var(--font-sans)' }}>
              {items.length} {items.length === 1 ? 'variety' : 'varieties'}
            </span>
          </div>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} p={p} onOpen={setActive} delay={i * 80} accent={CATEGORY_ACCENT[cat]} />
            ))}
          </div>
        </div>
      </div>

      {active && (
        <ProductModal
          p={active}
          onClose={() => setActive(null)}
          onPrev={() => {
            const i = items.findIndex((x) => x.id === active.id)
            setActive(items[(i - 1 + items.length) % items.length])
          }}
          onNext={() => {
            const i = items.findIndex((x) => x.id === active.id)
            setActive(items[(i + 1) % items.length])
          }}
        />
      )}
    </section>
  )
}
