// Minimal line icons for crops we don't have photography for yet.
// One consistent stroke style, drawn in brand green with a gold grain accent.

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const GOLD = 'var(--color-gold)'

export const CROP_ICONS = {
  wheat: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M24 44V14" />
      {[18, 26, 34].map((y) => (
        <g key={y}>
          <path d={`M24 ${y} C19 ${y - 2} 16 ${y - 7} 16 ${y - 11} C21 ${y - 9} 24 ${y - 5} 24 ${y}`} stroke={GOLD} />
          <path d={`M24 ${y} C29 ${y - 2} 32 ${y - 7} 32 ${y - 11} C27 ${y - 9} 24 ${y - 5} 24 ${y}`} stroke={GOLD} />
        </g>
      ))}
      <path d="M24 14V6" stroke={GOLD} />
    </svg>
  ),
  mustard: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M24 44V22M24 32c-4-1-7-4-8-8M24 32c4-1 7-4 8-8" />
      <circle cx="24" cy="14" r="3.5" stroke={GOLD} />
      <circle cx="16" cy="19" r="3" stroke={GOLD} />
      <circle cx="32" cy="19" r="3" stroke={GOLD} />
      <circle cx="19" cy="8" r="2.5" stroke={GOLD} />
      <circle cx="29" cy="8" r="2.5" stroke={GOLD} />
    </svg>
  ),
  bajra: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M24 44V26" />
      <path d="M20 30c-3 1-6 0-8-2M28 30c3 1 6 0 8-2" />
      <rect x="20" y="4" width="8" height="22" rx="4" stroke={GOLD} />
      <path d="M24 8v14M21 10l6 3M27 10l-6 3M21 16l6 3M27 16l-6 3" stroke={GOLD} strokeWidth="1.2" />
    </svg>
  ),
  sorghum: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M24 44V24" />
      <path d="M24 24c-6-2-9-7-9-13 4 1 7 4 9 8M24 24c6-2 9-7 9-13-4 1-7 4-9 8" stroke={GOLD} />
      <circle cx="24" cy="20" r="2" stroke={GOLD} />
      <circle cx="18" cy="15" r="2" stroke={GOLD} />
      <circle cx="30" cy="15" r="2" stroke={GOLD} />
      <circle cx="21" cy="9" r="2" stroke={GOLD} />
      <circle cx="27" cy="9" r="2" stroke={GOLD} />
    </svg>
  ),
  okra: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M18 10c-2-3-2-5-1-6 2 0 4 1 5 4" />
      <path d="M20 9C14 18 12 30 16 40c1 2 3 3 5 2 4-3 6-9 7-16 1-6 0-12-3-17-2-2-4-2-5 0z" />
      <path d="M20 14c-2 8-3 16-1 24M26 13c1 6 1 12-1 20" strokeWidth="1.2" />
    </svg>
  ),
  cowpea: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M14 6c-3 10-3 22 2 32 1 2 3 2 4 0 4-10 4-22 0-32-2-3-5-3-6 0z" />
      <path d="M30 10c-3 9-3 19 1 28 1 2 3 2 4 0 4-9 4-19 1-28-2-3-4-3-6 0z" />
      <circle cx="17" cy="14" r="1" fill={GOLD} stroke="none" />
      <circle cx="17" cy="22" r="1" fill={GOLD} stroke="none" />
      <circle cx="17" cy="30" r="1" fill={GOLD} stroke="none" />
      <circle cx="33" cy="17" r="1" fill={GOLD} stroke="none" />
      <circle cx="33" cy="25" r="1" fill={GOLD} stroke="none" />
    </svg>
  ),
  radish: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M20 16c-4 3-6 8-5 13 1 6 5 11 9 15 4-4 8-9 9-15 1-5-1-10-5-13" />
      <path d="M24 44V30" strokeWidth="1.2" />
      <path d="M24 16V8M24 8c-2-3-5-4-8-3M24 8c2-3 5-4 8-3" stroke={GOLD} />
    </svg>
  ),
  clusterbeans: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M24 6v10" />
      <path d="M24 16c-5 2-8 8-8 16 0 4 1 8 3 10M24 16c5 2 8 8 8 16 0 4-1 8-3 10" />
      <path d="M24 16c-1 8-1 18 0 26" />
      <circle cx="24" cy="10" r="2" stroke={GOLD} />
    </svg>
  ),
  cucumber: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M14 34C10 24 14 12 24 8c3-1 5 0 6 3 3 10-1 22-11 26-3 1-5 0-5-3z" />
      <path d="M20 14c-2 5-3 11-2 16" strokeWidth="1.2" />
      <path d="M30 8c2-2 4-3 6-2" stroke={GOLD} />
      <circle cx="22" cy="20" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="20" cy="27" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="25" cy="24" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  beans: (
    <svg viewBox="0 0 48 48" className="w-12 h-12" {...S}>
      <path d="M16 8c-4 9-4 20 1 29 2 3 5 3 7 0 5-9 5-20 1-29-3-4-6-4-9 0z" />
      <path d="M19 15a2.5 3 0 100 .1M20 24a2.5 3 0 100 .1M21 33a2.5 3 0 100 .1" stroke={GOLD} strokeWidth="1.4" />
      <path d="M30 12c3-2 6-2 8 0" stroke={GOLD} />
    </svg>
  ),
}
