import useReveal from '../hooks/useReveal.js'
import SectionCurve from './SectionCurve.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

const FACTS = [
  { n: '2,000+', unitKey: 'factUnitTotal', factKey: 'drying' },
  { n: '2', unitKey: 'factUnitUnits', factKey: 'units' },
  { n: '100%', unitKey: 'factUnitOwn', factKey: 'owned' },
  { n: 'Every', unitKey: 'factUnitLot', factKey: 'traceable' },
]

const GALLERY = [
  {
    src: '/images/photos/dryer-deck.jpg',
    alt: 'Top drying deck of the Yellina seed dryer with numbered loading hatches',
    key: 'deck',
    span: 'md:col-span-2',
  },
  {
    src: '/images/photos/dryer-grader.jpg',
    alt: 'Seed grader and elevator inside the Yellina processing unit',
    key: 'grader',
  },
  {
    src: '/images/photos/dryer-conveyors.jpg',
    alt: 'Conveyor network feeding the drying bins',
    key: 'conveyors',
  },
  {
    src: '/images/photos/dryer-bins-row.jpg',
    alt: 'Row of numbered discharge doors on the Yellina dryer, bins 18 to 20',
    key: 'bins',
  },
  {
    src: '/images/photos/dryer-bins-closeup.jpg',
    alt: 'Close-up of numbered dryer bin doors',
    key: 'binClose',
  },
]

export default function Infrastructure() {
  const ref = useReveal()
  const { t } = useLang()

  return (
    <section id="plant" ref={ref} className="relative bg-sage py-11 md:py-14">
      <SectionCurve fill="#FAFAF6" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">{t('infrastructure.eyebrow')}</div>
            <h2 className="reveal mt-5 text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-green-950 font-light tracking-tight max-w-2xl" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              {t('infrastructure.heading')}
            </h2>
          </div>
          <p className="reveal max-w-sm text-ink-soft text-[14.5px] leading-relaxed" style={{ '--reveal-delay': '150ms' }}>
            {t('infrastructure.intro')}
          </p>
        </div>

        {/* Establishing shot — the photo drifts inside its frame as you scroll */}
        <div className="reveal mt-8 relative rounded-3xl overflow-hidden shadow-[0_30px_60px_-24px_rgba(20,47,27,0.4)]" style={{ '--reveal-delay': '120ms' }}>
          <div className="w-full aspect-[16/7] relative overflow-hidden">
            <div data-parallax="-0.14" className="absolute -inset-y-[20%] inset-x-0">
              <img
                src="/images/photos/dryer-exterior.jpg"
                alt="The Yellina Seeds drying and processing plant"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.55), transparent 45%)' }} />
          <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
            <div className="text-white text-xl sm:text-2xl font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
              {t('infrastructure.unitName')}
            </div>
            {/* hidden for now — remove the `hidden` class to bring the address back */}
            <div className="hidden mt-1 text-white/80 text-[11px] uppercase tracking-[0.2em] font-bold" style={{ fontFamily: 'var(--font-sans)' }}>
              Sy. No. 8/1A, 1AA · Siddipet District · Telangana 502103
            </div>
          </div>
          <div className="absolute top-5 right-5 hidden sm:flex rounded-full bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-green-800" style={{ fontFamily: 'var(--font-sans)' }}>
            {t('infrastructure.since')}
          </div>
        </div>

        {/* Capacity facts */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FACTS.map((f, i) => (
            <div key={f.factKey} className="reveal card px-6 py-5" style={{ '--reveal-delay': `${i * 80}ms` }}>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-medium text-green-700" style={{ fontFamily: 'var(--font-serif)' }}>{f.n}</span>
                <span className="text-amber-deep text-sm italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{t(`infrastructure.${f.unitKey}`)}</span>
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-mute leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>{t(`infrastructure.facts.${f.factKey}`)}</div>
            </div>
          ))}
        </div>

        {/* Plant gallery */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((g, i) => (
            <figure key={g.src} className={`reveal group relative rounded-2xl overflow-hidden ${g.span || ''}`} style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}>
              <img src={g.src} alt={g.alt} loading="lazy" className="w-full h-56 md:h-64 object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <figcaption className="absolute inset-x-0 bottom-0 px-4 pt-10 pb-3.5 text-white text-[12.5px] font-medium tracking-wide" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.78), transparent)', fontFamily: 'var(--font-sans)' }}>
                {t(`infrastructure.gallery.${g.key}`)}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="reveal mt-8 text-center text-ink-mute italic text-[15px] max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-serif)' }}>
          {t('infrastructure.closing')}
        </p>
      </div>
    </section>
  )
}
