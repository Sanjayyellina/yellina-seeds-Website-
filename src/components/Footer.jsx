import useReveal from '../hooks/useReveal.js'
import SectionCurve from './SectionCurve.jsx'
import { CONTACT } from '../data/products.js'

const QUICK_LINKS = {
  Products: [
    { label: 'Hybrid Maize', crop: 'maize' },
    { label: 'Sweet Corn', crop: 'sweetcorn' },
    { label: 'Paddy', crop: 'paddy' },
    { label: 'Full Portfolio', crop: 'coming' },
  ],
  Company: [
    { label: 'Our Story', id: 'story' },
    { label: 'Our Fields', id: 'fields' },
    { label: 'Why Yellina', id: 'why' },
    { label: 'Quality Promise', id: 'quality' },
    { label: 'Our Plant', id: 'plant' },
  ],
  Farmers: [
    { label: 'Field Guide', id: 'agronomy' },
    { label: 'Become a Dealer', id: 'partner' },
    { label: 'Contact Us', id: 'contact' },
  ],
}

export default function Footer({ onNavigate, onCrop }) {
  const ref = useReveal()

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden bg-green-950">
      <SectionCurve fill="#FAFAF6" className="z-[3]" />
      {/* real field, barely-there, grounding the footer */}
      <img src="/images/photos/field-tassels-tree.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.10]" loading="lazy" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(20,47,27,0.4), rgba(20,47,27,0.95) 70%)' }} />

      <div className="max-w-6xl mx-auto px-6 pt-7 md:pt-8 pb-6 relative">
        {/* Contact card — the site's one canonical contact block (address,
            named team, email); Partner's dealer CTA points here instead of
            repeating all of this itself */}
        <div className="reveal rounded-3xl bg-white/[0.07] backdrop-blur border border-white/15 p-5 md:p-7">
          <div className="grid md:grid-cols-[1fr_auto] gap-6">
            <div>
              <div className="eyebrow text-leaf !text-[10px] mb-3">{CONTACT.corporate.label}</div>
              <h5 className="text-xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>{CONTACT.corporate.name}</h5>
              <p className="mt-3 text-white/70 text-[13.5px] leading-[1.8]">{CONTACT.corporate.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kompally, Hyderabad, Telangana')}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-leaf text-[11px] uppercase tracking-[0.18em] font-bold hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>
                View on map
              </a>
            </div>
            <div className="space-y-4">
              <div>
                <div className="eyebrow text-leaf !text-[10px] mb-2">Direct</div>
                <div className="space-y-2.5">
                  {CONTACT.team.map((m) => (
                    <a key={m.name} href={`tel:${m.tel}`} className="flex items-baseline gap-2 group">
                      <span className="text-white group-hover:text-leaf transition-colors text-lg" style={{ fontFamily: 'var(--font-serif)' }}>{m.note}</span>
                      <span className="text-white/50 text-[11px]">{m.name.split(' ')[0]} · {m.role.split(' · ').pop()}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div className="eyebrow text-leaf !text-[10px] mb-2">Email</div>
                <a href={`mailto:${CONTACT.email}`} className="text-white/85 text-[14.5px] hover:text-leaf transition-colors break-all">{CONTACT.email}</a>
              </div>
              <a
                href="/brochure/yellina-seeds-company-profile-2026.html"
                download="Yellina-Seeds-Company-Profile-2026.html"
                className="btn-primary !bg-leaf !text-green-950 hover:!bg-white !py-3 !px-6 !text-[11px]"
              >
                Company Profile
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 3v13m0 0l-5-5m5 5l5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="reveal mt-6 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
          <div>
            <img src="/images/logo-white.png" alt="" className="h-9" />
            <p className="mt-2.5 text-white/60 text-[12.5px] leading-relaxed">
              Family-grown hybrid maize, sweet corn & paddy seed from Telangana — since 1995.
            </p>
          </div>
          {Object.entries(QUICK_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="eyebrow text-leaf !text-[10px] mb-2.5">{group}</div>
              <ul className="space-y-1.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => (l.crop ? onCrop?.(l.crop) : onNavigate?.(l.id))}
                      className="text-white/75 text-[13px] hover:text-leaf transition-colors cursor-pointer text-left"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badges + baseline */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-leaf px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-green-950" style={{ fontFamily: 'var(--font-sans)' }}>★ Since 1995</span>
          <span className="rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/85" style={{ fontFamily: 'var(--font-sans)' }}>Make in India</span>
          <span className="rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/85" style={{ fontFamily: 'var(--font-sans)' }}>Yellina Family</span>
        </div>

        <div className="mt-5 pt-4 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <div className="text-white/45 text-[12px]">
            © {new Date().getFullYear()} Yellina Seeds Private Limited · Khammam District · Telangana, India
          </div>
          <div className="italic text-[13.5px] text-white/60" style={{ fontFamily: 'var(--font-serif)' }}>
            Seed you can trust · to the field · every season
          </div>
        </div>
      </div>
    </footer>
  )
}
