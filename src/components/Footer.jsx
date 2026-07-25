import useReveal from '../hooks/useReveal.js'
import SectionCurve from './SectionCurve.jsx'
import { CONTACT } from '../data/products.js'
import { useLang } from '../i18n/LanguageContext.jsx'

const QUICK_LINKS = {
  Products: [
    { key: 'hybridMaize', crop: 'maize' },
    { key: 'sweetCorn', crop: 'sweetcorn' },
    { key: 'paddy', crop: 'paddy' },
    { key: 'fullPortfolio', crop: 'coming' },
  ],
  Company: [
    { key: 'ourStory', id: 'story' },
    { key: 'ourFields', id: 'fields' },
    { key: 'whyYellina', id: 'why' },
    { key: 'qualityPromise', id: 'quality' },
    { key: 'ourPlant', id: 'plant' },
  ],
  Farmers: [
    { key: 'fieldGuide', id: 'agronomy' },
    { key: 'becomeDealer', id: 'partner' },
    { key: 'contactUs', id: 'contact' },
  ],
}

export default function Footer({ onNavigate, onCrop }) {
  const ref = useReveal()
  const { t } = useLang()

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden bg-green-950">
      <SectionCurve fill="#FAFAF6" className="z-[3]" />
      {/* real field, barely-there, grounding the footer */}
      <img src="/images/photos/field-tassels-tree.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.10]" loading="lazy" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(20,47,27,0.4), rgba(20,47,27,0.95) 70%)' }} />

      <div className="max-w-6xl mx-auto px-6 pt-7 md:pt-8 pb-6 relative">
        {/* Dealer CTA — flows straight into the contact card below as one
            continuous dark closing block, instead of a separate floating
            banner up in the Partner section */}
        <div className="reveal flex flex-wrap items-center justify-between gap-5 pb-7 mb-7 border-b border-white/12" style={{ '--reveal-delay': '0ms' }}>
          <div>
            <h3 className="text-xl sm:text-2xl text-white font-light" style={{ fontFamily: 'var(--font-serif)' }}>
              {t('footer.ctaHeading')}
            </h3>
            <p className="mt-1.5 text-[14px] text-white/70">{t('footer.ctaParagraph')}</p>
          </div>
          <a
            href={`tel:${CONTACT.customerCareRaw}`}
            className="btn-primary !bg-leaf !text-green-950 hover:!bg-white shrink-0"
          >
            {t('footer.ctaButton')}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>

        {/* Contact card — the site's one canonical contact block (address,
            named team, email) */}
        <div className="reveal rounded-3xl bg-white/[0.07] backdrop-blur border border-white/15 p-5 md:p-7" style={{ '--reveal-delay': '60ms' }}>
          <div className="grid md:grid-cols-[1fr_auto] gap-6">
            <div>
              <div className="eyebrow text-leaf !text-[10px] mb-3">{t('footer.corporateLabel')}</div>
              <h5 className="text-xl text-white" style={{ fontFamily: 'var(--font-serif)' }}>{CONTACT.corporate.name}</h5>
              <p className="mt-3 text-white/70 text-[13.5px] leading-[1.8]">{CONTACT.corporate.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.corporate.address)}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-leaf text-[11px] uppercase tracking-[0.18em] font-bold hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></svg>
                {t('footer.viewOnMap')}
              </a>

              <div className="mt-5">
                <div className="eyebrow text-leaf !text-[10px] mb-2">{t('footer.plantLabel')}</div>
                <p className="text-white/70 text-[13.5px] leading-[1.8]">{CONTACT.plant.address}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="eyebrow text-leaf !text-[10px] mb-2">{t('footer.directLabel')}</div>
                <div className="space-y-2.5">
                  <a href={`tel:${CONTACT.customerCareRaw}`} className="flex items-baseline gap-2 group">
                    <span className="text-white group-hover:text-leaf transition-colors text-lg" style={{ fontFamily: 'var(--font-serif)' }}>{CONTACT.customerCare}</span>
                    <span className="text-white/50 text-[11px]">{t('common.customerCareLabel')}</span>
                  </a>
                </div>
              </div>
              <div>
                <div className="eyebrow text-leaf !text-[10px] mb-2">{t('footer.emailLabel')}</div>
                <a href={`mailto:${CONTACT.email}`} className="text-white/85 text-[14.5px] hover:text-leaf transition-colors break-all">{CONTACT.email}</a>
              </div>
              <a
                href="/brochure/yellina-seeds-company-profile-2026.html"
                download="Yellina-Seeds-Company-Profile-2026.html"
                className="btn-primary !bg-leaf !text-green-950 hover:!bg-white !py-3 !px-6 !text-[11px]"
              >
                {t('footer.companyProfile')}
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
              {t('footer.blurb')}
            </p>
          </div>
          {Object.entries(QUICK_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="eyebrow text-leaf !text-[10px] mb-2.5">{t(`footer.groups.${group}`)}</div>
              <ul className="space-y-1.5">
                {links.map((l) => (
                  <li key={l.key}>
                    <button
                      onClick={() => (l.crop ? onCrop?.(l.crop) : onNavigate?.(l.id))}
                      className="text-white/75 text-[13px] hover:text-leaf transition-colors cursor-pointer text-left"
                    >
                      {t(`footer.links.${l.key}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Badges + baseline */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-leaf px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-green-950" style={{ fontFamily: 'var(--font-sans)' }}>{t('footer.badgeSince')}</span>
          <span className="rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/85" style={{ fontFamily: 'var(--font-sans)' }}>{t('footer.badgeMake')}</span>
          <span className="rounded-full border border-white/30 px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/85" style={{ fontFamily: 'var(--font-sans)' }}>{t('footer.badgeFamily')}</span>
        </div>

        <div className="mt-5 pt-4 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <div className="text-white/45 text-[12px]">
            © {new Date().getFullYear()} Yellina Seeds Private Limited · {t('footer.copyrightLocation')}
          </div>
          <div className="italic text-[13.5px] text-white/60" style={{ fontFamily: 'var(--font-serif)' }}>
            {t('footer.closingTagline')}
          </div>
        </div>
      </div>
    </footer>
  )
}
