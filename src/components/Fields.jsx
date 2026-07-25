import useReveal from '../hooks/useReveal.js'
import { useLang } from '../i18n/LanguageContext.jsx'

// Real photos and clips from Yellina fields and the processing unit — an
// always-moving rail (continuous marquee, pauses on hover) instead of a grid.
// Captions come from fields.tiles.<key> in the translation dictionary.
const TILES = [
  { type: 'video', src: '/videos/conveyor-loop.mp4', poster: '/images/photos/cobs-conveyor.jpg', key: 'conveyor' },
  { type: 'img', src: '/images/photos/detasseling-crew.jpg', alt: 'Detasseling crew working through a maize seed production plot', key: 'detasseling', wide: true },
  { type: 'img', src: '/images/photos/cob-on-plant.jpg', alt: 'Maize cob opened on the plant showing bold orange grain', key: 'grainFillPlant' },
  { type: 'img', src: '/images/photos/paddy-inspection.jpg', alt: 'Yellina team inspecting a golden paddy field before harvest', key: 'paddyInspection' },
  { type: 'video', src: '/videos/husking-line.mp4', poster: '/images/photos/cobs-conveyor.jpg', key: 'husking' },
  { type: 'img', src: '/images/photos/harvest-mesh-bag.jpg', alt: 'Mesh bag of freshly harvested maize cobs in the field', key: 'bagged' },
  { type: 'img', src: '/images/photos/field-maize-wide.jpg', alt: 'Wide view of a Yellina maize field at tasselling', key: 'kharifMaize', wide: true },
  { type: 'img', src: '/images/photos/cob-drying-stalk.jpg', alt: 'Maize cob drying on the stalk in the field', key: 'cobDrying' },
  { type: 'img', src: '/images/photos/grain-cross-hand.jpg', alt: 'Hand holding maize cob cross-sections showing deep grain', key: 'grainCrossHand' },
  { type: 'img', src: '/images/photos/farmers-cobs.jpg', alt: 'Farmers holding Yellina cobs in a dried maize field', key: 'farmersHarvest', wide: true },
]

function Card({ tile, t }) {
  const caption = t(`fields.tiles.${tile.key}`)
  return (
    <figure className={`relative corner-leaf overflow-hidden shrink-0 h-56 md:h-64 group ${tile.wide ? 'w-[320px] md:w-[400px]' : 'w-[220px] md:w-[250px]'}`}>
      {tile.type === 'video' ? (
        <video src={tile.src} poster={tile.poster} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
      ) : (
        <img src={tile.src} alt={tile.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
      )}
      <figcaption className="absolute inset-x-0 bottom-0 px-3.5 pt-9 pb-3 text-white text-[12px] font-medium tracking-wide" style={{ background: 'linear-gradient(to top, rgba(20,47,27,0.78), transparent)', fontFamily: 'var(--font-sans)' }}>
        {caption}
        {tile.type === 'video' && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[8.5px] uppercase tracking-[0.14em] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" /> {t('common.live')}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

export default function Fields() {
  const ref = useReveal()
  const { t } = useLang()

  return (
    <section id="fields" ref={ref} className="relative bg-bg py-10 md:py-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="reveal eyebrow eyebrow-rule text-green-700">{t('fields.eyebrow')}</div>
            <h2 className="reveal mt-4 text-3xl sm:text-4xl leading-[1.1] text-green-950 font-light tracking-tight" style={{ fontFamily: 'var(--font-serif)', '--reveal-delay': '90ms' }}>
              {t('fields.heading')}
            </h2>
          </div>
          <p className="reveal hidden sm:block text-ink-mute text-[12.5px] max-w-[260px] leading-snug text-right" style={{ '--reveal-delay': '150ms' }}>
            {t('fields.note')}
          </p>
        </div>
      </div>

      {/* always-moving rail — pauses on hover */}
      <div className="mt-8 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)' }}>
        <div className="marquee-slow flex gap-4 w-max">
          {[...TILES, ...TILES].map((tile, i) => (
            <Card key={`${tile.src}-${i}`} tile={tile} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
