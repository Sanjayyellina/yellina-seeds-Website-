// Organic boundary between sections: the previous section's colour flows down
// into this one as a soft, irregular hill line — no straight seams.
// Render as the first child of a `relative` section; `fill` is the colour of
// the section ABOVE.
export default function SectionCurve({ fill = '#FAFAF6', className = '' }) {
  return (
    <div aria-hidden="true" className={`absolute top-0 inset-x-0 h-10 md:h-16 pointer-events-none z-[2] ${className}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full block">
        <path
          d="M0,0 L1440,0 L1440,26 C1230,64 1010,8 740,38 C470,66 215,18 0,50 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
