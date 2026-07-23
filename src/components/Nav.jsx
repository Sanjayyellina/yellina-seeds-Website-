import { useEffect, useState } from 'react'

// The internal operations platform (dryer intake/dispatch/quality tracking)
// is bundled into this same app as static files under public/ops/ and
// served at this same-origin path — no separate domain or deployment.
const OPS_URL = '/ops/'

const LINKS = [
  { id: 'story', label: 'Our Story' },
  { id: 'fields', label: 'Our Fields' },
  { id: 'why', label: 'Why Yellina' },
  { id: 'quality', label: 'Quality' },
  { id: 'plant', label: 'Our Plant' },
  { id: 'products', label: 'Products' },
  { id: 'agronomy', label: 'Agronomy' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav({ onNavigate }) {
  // computed synchronously at mount (not via effect) so the very first paint
  // already reflects the real scroll position — otherwise a reload that
  // lands mid-page (e.g. a deep link, or scroll position restored by the
  // browser) flips this a beat after mount and the pill visibly snaps
  // through its whole scrolled/unscrolled transition on load
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 60)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  // the transition is only enabled after mount, so that initial state itself
  // (however it resolves) never animates into view
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scrollspy: underline the section currently in view
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          setActive(visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id)
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.5] }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    onNavigate(id)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${mounted ? 'transition-all duration-500' : ''} ${
        scrolled ? 'py-1.5' : 'py-3'
      }`}
    >
      <nav
        className={`relative mx-3 md:mx-6 rounded-full px-4 md:px-6 flex items-center justify-between ${mounted ? 'transition-all duration-500' : ''} ${
          scrolled ? 'glass-nav-solid py-1.5' : 'glass-nav py-2'
        }`}
      >
        <div
          className="absolute inset-x-5 bottom-0 h-px transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.5), transparent)', opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />
        <a href="#home" onClick={go('home')} className="flex items-center gap-2.5 group">
          <img src="/images/logo-green.png" alt="Yellina Seeds leaf mark" className="h-7 w-auto transition-transform duration-500 group-hover:rotate-6" />
          <div className="leading-tight">
            <div className="font-semibold text-[15px] text-green-900 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              Yellina Seeds
            </div>
            <div className="hidden 2xl:block whitespace-nowrap text-[8px] uppercase tracking-[0.26em] text-green-700 font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
              Rooted in Nature · Growing the Future
            </div>
          </div>
        </a>

        <div className="hidden xl:flex items-center gap-4">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              className={`relative whitespace-nowrap text-[11px] uppercase tracking-[0.11em] font-semibold transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:rounded after:bg-leaf after:transition-all ${
                active === l.id
                  ? 'text-green-700 after:w-full'
                  : 'text-ink-soft hover:text-green-700 after:w-0 hover:after:w-full'
              }`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {l.label}
            </a>
          ))}
          <span className="h-4 w-px bg-line" aria-hidden="true" />
          <a
            href={OPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] font-semibold text-ink-soft hover:text-green-700 transition-colors"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Login
          </a>
          <a
            href="/brochure/yellina-seeds-company-profile-2026.html"
            download="Yellina-Seeds-Company-Profile-2026.html"
            className="btn-primary !py-2 !px-4 !text-[10.5px] hover:scale-[1.03] active:scale-[0.98]"
          >
            Brochure
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 3v13m0 0l-5-5m5 5l5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        <button
          className="xl:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-green-800 transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block h-0.5 w-5 bg-green-800 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-green-800 transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`xl:hidden mx-3 mt-2 rounded-2xl glass-nav-solid overflow-hidden transition-all duration-500 ${
          open ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-5 gap-4">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              className="text-sm uppercase tracking-[0.16em] font-semibold text-ink-soft hover:text-green-700 transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/brochure/yellina-seeds-company-profile-2026.html"
            download="Yellina-Seeds-Company-Profile-2026.html"
            className="btn-primary justify-center !py-3"
          >
            Download Brochure
          </a>
          <a
            href={OPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline justify-center !py-3"
          >
            Staff & Dealer Login
          </a>
        </div>
      </div>
    </header>
  )
}
