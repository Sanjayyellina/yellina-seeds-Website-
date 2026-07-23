import { Fragment } from 'react'
import useReveal from '../hooks/useReveal.js'
import Backdrop from './Backdrop.jsx'
import { AGRONOMY_SUPPORT } from '../data/products.js'

// month cells: s = sowing, g = growth, h = harvest
const CALENDAR = [
  { crop: 'Maize', sub: 'Kharif & Rabi', cells: ['h', '', '', '', '', 's', 'g', 'g', 'g', 'h', 's', 'g'] },
  { crop: 'Paddy', sub: 'Kharif', cells: ['', '', '', '', 's', 's', 'g', 'g', 'g', 'h', 'h', ''] },
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CELL_STYLE = {
  s: { background: '#E39A2E' },
  g: { background: '#DDEAD2' },
  h: { background: '#2C7A3C' },
  '': { background: '#F4F6EE' },
}

const AREA_ICONS = [
  // land preparation — soil layers
  <svg key="i0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M3 18h18M3 14c3-2 6 2 9 0s6-2 9 0M5 8l2 2 3-3 3 3 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  // sowing — seed dropping
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 3v8m0 0l-3-3m3 3l3-3M4 21c2-4 5-6 8-6s6 2 8 6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  // nutrients — droplet + leaf
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 3s5 5.5 5 9a5 5 0 01-10 0c0-3.5 5-9 5-9zM12 21v-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  // pest & disease — shield
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  // calendar
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4M16 3v4M4 11h16" strokeLinecap="round" /></svg>,
]

export default function Agronomy() {
  const ref = useReveal()

  return (
    <section id="agronomy" ref={ref} className="relative bg-bg py-11 md:py-14 overflow-hidden">
      <Backdrop src="/images/photos/harvest-mesh-bag.jpg" opacity={0.15} />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="reveal eyebrow eyebrow-rule text-green-700">Agronomy Support</div>
        <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.12] text-green-950 font-light tracking-tight max-w-3xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
          Our agronomy specialists guide farmers through every stage of cultivation.
        </h2>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-6">
          {AGRONOMY_SUPPORT.map((area, i) => (
            <div key={area} className="reveal group flex flex-col items-center gap-3.5 text-center" style={{ '--reveal-delay': `${i * 70}ms` }}>
              <span
                className="relative w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-400 group-hover:-translate-y-1"
                style={{ background: 'linear-gradient(145deg, var(--color-sage), #fff)', boxShadow: '0 1px 2px rgba(31,42,33,0.04), 0 14px 28px -14px rgba(31,42,33,0.22)' }}
              >
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: 'linear-gradient(145deg, #2C7A3C, #1D4426)' }} />
                <span className="relative text-green-700 group-hover:text-white transition-colors duration-400">{AREA_ICONS[i]}</span>
              </span>
              <span className="text-[13px] font-semibold text-green-950 leading-snug max-w-[110px]" style={{ fontFamily: 'var(--font-serif)' }}>{area}</span>
            </div>
          ))}
        </div>

        {/* Crop calendar */}
        <div className="reveal mt-8 card p-7 md:p-8 overflow-x-auto" style={{ '--reveal-delay': '120ms' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h3 className="text-xl text-green-950" style={{ fontFamily: 'var(--font-serif)' }}>
              Seasonal crop calendar
            </h3>
            <div className="text-[11px] text-ink-mute">Typical cropping schedule · adjust for your local zone</div>
          </div>
          <div className="min-w-[640px]">
            <div className="grid gap-1" style={{ gridTemplateColumns: '110px repeat(12, 1fr)' }}>
              <div />
              {MONTHS.map((m) => (
                <div key={m} className="text-center text-[10px] uppercase tracking-wider font-bold text-ink-mute pb-1" style={{ fontFamily: 'var(--font-sans)' }}>{m}</div>
              ))}
              {CALENDAR.map((row) => (
                <Fragment key={row.crop}>
                  <div className="pr-3 py-1">
                    <b className="block text-[13px] text-green-900 font-semibold">{row.crop}</b>
                    <span className="text-[10.5px] text-ink-mute">{row.sub}</span>
                  </div>
                  {row.cells.map((c, i) => (
                    <div key={`${row.crop}-${i}`} className="h-9 rounded-md transition-transform hover:scale-y-110" style={CELL_STYLE[c]} />
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-6 text-[11.5px] text-ink-soft">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#E39A2E' }} />Sowing window</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#DDEAD2', border: '1px solid #C9D9BC' }} />Crop growth</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#2C7A3C' }} />Harvest</span>
          </div>
        </div>

        <p className="reveal mt-8 text-center text-ink-soft italic text-[15.5px]" style={{ fontFamily: 'var(--font-serif)' }}>
          Helping farmers achieve higher productivity from sowing to harvest.
        </p>
      </div>
    </section>
  )
}
