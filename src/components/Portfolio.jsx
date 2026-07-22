import { useEffect, useRef } from 'react'
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
  const base = 'relative shrink-0 w-[230px] sm:w-[264px] h-48 sm:h-56 corner-leaf overflow-hidden group shadow-[0_14px_30px_-14px_rgba(20,47,27,0.35)]'
  return available ? (
    <button onClick={() => onCrop(c.crop)} aria-label={`Browse ${c.name}`} className={`${base} text-left cursor-pointer hover:shadow-[0_22px_44px_-16px_rgba(20,47,27,0.5)] transition-shadow duration-500`}>{inner}</button>
  ) : (
    <div className={base} title={`${c.name} · Coming Soon`}>{inner}</div>
  )
}

// Auto-scrolls on its own, but hands control straight to the visitor:
// drag/swipe/wheel it and the auto-scroll backs off, resuming a little
// after you let go. Looks like the old CSS marquee but is a real scroll
// container, so it's fully user-drivable.
function River({ items, reverse, onCrop, label }) {
  const trackRef = useRef(null)
  const pausedUntil = useRef(0)
  const draggingRef = useRef(false)
  const dragStartX = useRef(0)
  const dragStartScroll = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const halfWidth = track.scrollWidth / 2
    track.scrollLeft = halfWidth / 2

    const SPEED = 34 // px/sec
    let raf
    let last = performance.now()
    const step = (now) => {
      const dt = (now - last) / 1000
      last = now
      if (!draggingRef.current && now > pausedUntil.current) {
        track.scrollLeft += (reverse ? -1 : 1) * SPEED * dt
      }
      // wrap seamlessly through the duplicated item list
      if (track.scrollLeft <= 0) track.scrollLeft += halfWidth
      else if (track.scrollLeft >= halfWidth * 2 - track.clientWidth) track.scrollLeft -= halfWidth
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    // native listener (not React's synthetic onWheel) so preventDefault
    // actually sticks — lets a plain vertical scroll-wheel drive this
    // horizontal river instead of scrolling the page
    const onWheelNative = (e) => {
      pausedUntil.current = performance.now() + 1800
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        track.scrollLeft += e.deltaY
      }
    }
    track.addEventListener('wheel', onWheelNative, { passive: false })

    // safety net: if a pointerup/cancel is ever missed by the track itself
    // (seen on some touch/trackpad combos), this guarantees dragging never
    // gets stuck "on" and silently freezes the auto-scroll for good
    const onWindowPointerEnd = () => {
      draggingRef.current = false
    }
    window.addEventListener('pointerup', onWindowPointerEnd)
    window.addEventListener('pointercancel', onWindowPointerEnd)

    return () => {
      cancelAnimationFrame(raf)
      track.removeEventListener('wheel', onWheelNative)
      window.removeEventListener('pointerup', onWindowPointerEnd)
      window.removeEventListener('pointercancel', onWindowPointerEnd)
    }
  }, [reverse])

  const resumeSoon = () => {
    pausedUntil.current = performance.now() + 1800
  }

  const onPointerDown = (e) => {
    const track = trackRef.current
    if (!track) return
    draggingRef.current = true
    dragStartX.current = e.clientX
    dragStartScroll.current = track.scrollLeft
    track.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!draggingRef.current || !trackRef.current) return
    trackRef.current.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current)
  }
  const endDrag = () => {
    draggingRef.current = false
    resumeSoon()
  }

  return (
    <div>
      <div className="reveal flex items-center gap-4 mb-4 max-w-6xl mx-auto px-6">
        <div className="text-[11px] uppercase tracking-[0.26em] font-bold text-green-800 whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>{label}</div>
        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,162,39,0.5), transparent)' }} />
      </div>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onTouchStart={resumeSoon}
        className="no-scrollbar overflow-x-auto cursor-grab active:cursor-grabbing"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <div className="flex gap-4 w-max py-2">
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
    <section id="coming" ref={ref} className="relative bg-sage pt-9 pb-10 md:pt-10 md:pb-12 overflow-hidden">
      <SectionCurve fill="#FAFAF6" />

      {/* corner ribbon, clipped by the section's own overflow-hidden */}
      <div className="reveal absolute top-0 right-0 w-44 h-44 pointer-events-none z-[2]" style={{ '--reveal-delay': '150ms' }} aria-hidden="true">
        <div
          className="absolute top-[30px] right-[-46px] w-[190px] rotate-45 text-center py-1.5 text-[9.5px] uppercase tracking-[0.2em] font-bold text-white shadow-[0_4px_10px_-2px_rgba(20,47,27,0.35)]"
          style={{ background: 'var(--color-gold)', fontFamily: 'var(--font-sans)' }}
        >
          New · Arriving 2027
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="reveal eyebrow eyebrow-rule text-green-700">Our Portfolio</div>
        <h2 className="reveal mt-4 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight max-w-2xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
          Field crops and vegetable seeds.
        </h2>
      </div>

      <div className="relative mt-7 space-y-6">
        <River items={FIELD} reverse label="Field Crops" onCrop={onCrop} />
        <River items={VEGETABLE} label="Vegetable Seeds" onCrop={onCrop} />
      </div>
    </section>
  )
}
