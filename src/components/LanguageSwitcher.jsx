import { useEffect, useRef, useState } from 'react'
import { LANGUAGES, useLang } from '../i18n/LanguageContext.jsx'

const GlobeIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Desktop: a small dropdown pill in the nav bar. Mobile: an inline pill
// row inside the slide-down menu. Both read/write the same LanguageContext,
// so switching in either place updates the whole site immediately.
export default function LanguageSwitcher({ variant = 'desktop' }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (variant === 'mobile') {
    return (
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-mute mb-2.5" style={{ fontFamily: 'var(--font-sans)' }}>
          Language
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors cursor-pointer border ${
                l.code === lang
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-ink-soft border-line hover:border-green-600 hover:text-green-700'
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] font-semibold text-ink-soft hover:text-green-700 transition-colors cursor-pointer"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {GlobeIcon}
        {current.native}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div
        role="listbox"
        className={`absolute right-0 top-full mt-2 min-w-[140px] rounded-2xl glass-nav-solid p-1.5 transition-all duration-200 origin-top-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            role="option"
            aria-selected={l.code === lang}
            onClick={() => {
              setLang(l.code)
              setOpen(false)
            }}
            className={`w-full text-left rounded-xl px-3 py-2 text-[13px] transition-colors cursor-pointer ${
              l.code === lang ? 'bg-green-700 text-white font-semibold' : 'text-ink-soft hover:bg-sage'
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    </div>
  )
}
