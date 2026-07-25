import useReveal from '../hooks/useReveal.js'
import { STATS } from '../data/products.js'
import { useLang } from '../i18n/LanguageContext.jsx'

export default function FounderLetter() {
  const ref = useReveal()
  const { t } = useLang()

  return (
    <section ref={ref} className="relative bg-bg py-11 md:py-14 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-[300px_1fr] gap-10 md:gap-14 items-start">
        {/* Left column — portrait, name, heading, stats */}
        <div className="md:sticky md:top-28">
          <div className="reveal eyebrow eyebrow-rule text-green-700">{t('founder.eyebrow')}</div>

          {/* stamp-style portrait — square polaroid frame + verified badge */}
          <div className="reveal mt-6 relative w-full max-w-[260px] aspect-square" style={{ '--reveal-delay': '60ms' }}>
            <div className="absolute inset-0 rounded-3xl bg-white p-1.5 shadow-[0_10px_28px_-8px_rgba(20,47,27,0.4)] ring-1 ring-line">
              <img
                src="/images/founder.jpg"
                alt="Mr. Murali Krishna, Founder & Managing Director"
                className="w-full h-full object-cover rounded-2xl"
                style={{ objectPosition: '50% 18%' }}
              />
            </div>
            <div className="absolute -bottom-2.5 -right-2.5 w-10 h-10 rounded-full bg-leaf border-[3px] border-bg flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#142F1B" strokeWidth="3.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>

          <div className="reveal mt-5" style={{ '--reveal-delay': '80ms' }}>
            <div className="text-green-950 font-medium text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Mr. Murali Krishna</div>
            <div className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-green-700 font-bold" style={{ fontFamily: 'var(--font-sans)' }}>
              {t('founder.title')}
            </div>
          </div>

          <h2
            className="reveal mt-6 text-3xl leading-[1.1] text-green-950 font-light tracking-tight"
            style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '110ms' }}
          >
            {t('founder.heading')}
          </h2>

          <div className="reveal mt-6 flex flex-wrap gap-x-7 gap-y-3" style={{ '--reveal-delay': '140ms' }}>
            {STATS.slice(0, 3).map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-medium text-green-700" style={{ fontFamily: 'var(--font-serif)' }}>{s.num}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-mute" style={{ fontFamily: 'var(--font-sans)' }}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — the letter itself scrolls inside its own reading
            pane, keeping the page short no matter how long the letter runs */}
        <div className="reveal relative rounded-3xl border border-line bg-card shadow-[0_1px_2px_rgba(31,42,33,0.04),0_10px_30px_-14px_rgba(31,42,33,0.10)] overflow-hidden" style={{ '--reveal-delay': '160ms' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] z-[1]" style={{ background: 'linear-gradient(90deg, var(--color-green-700), var(--color-gold))' }} />

          <div className="absolute top-4 right-5 z-[2] flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] font-bold text-ink-mute pointer-events-none" style={{ fontFamily: 'var(--font-sans)' }}>
            {t('founder.scrollHint')}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M12 5v14m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>

          <div data-lenis-prevent className="thin-scroll relative h-[420px] sm:h-[480px] overflow-y-auto overscroll-contain px-6 sm:px-9 pt-8 pb-6">
            <div className="text-[15px] leading-[1.8] text-ink-soft">
              <p className="font-medium text-ink">{t('founder.dear')}</p>
              <p className="mt-4">{t('founder.p1')}</p>
              <p className="mt-4">{t('founder.p2')}</p>
              <p className="mt-4">{t('founder.p3')}</p>
            </div>

            <blockquote className="mt-6 card border-l-4 !border-l-leaf rounded-r-2xl px-6 py-5">
              <p className="italic text-[19px] leading-snug text-green-900" style={{ fontFamily: 'var(--font-serif)' }}>
                {t('founder.quote')}
              </p>
            </blockquote>

            <div className="mt-6 text-[15px] leading-[1.8] text-ink-soft">
              <p>
                {t('founder.p4a')}{' '}
                <em className="text-green-800">{t('founder.p4b')}</em>
              </p>
              <p className="mt-4">{t('founder.p5')}</p>
              <p className="mt-4">
                {t('founder.p6a')}{' '}
                <b className="text-ink font-semibold">{t('founder.p6b')}</b>
              </p>
            </div>

            <div className="mt-7 flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="italic text-lg text-green-800" style={{ fontFamily: 'var(--font-serif)' }}>
                  {t('founder.thanks')}
                </p>
                <div className="mt-3 text-[26px] text-green-900" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                  Murali Krishna
                </div>
              </div>
              <div className="card !bg-sage px-5 py-4 max-w-[240px]">
                <div className="text-[9px] uppercase tracking-[0.26em] text-green-700 font-bold mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>{t('founder.promiseLabel')}</div>
                <div className="italic text-[14px] leading-snug text-green-900" style={{ fontFamily: 'var(--font-serif)' }}>
                  {t('founder.promiseText')}
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10" style={{ background: 'linear-gradient(to top, var(--color-card), transparent)' }} />
        </div>
      </div>
    </section>
  )
}
