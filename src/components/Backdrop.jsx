// Soft-focus photo behind a light section — visible texture and colour, but
// blurred like depth-of-field so it never competes with text. Fades into the
// section colour at the top and bottom edges. Render as the first child of a
// `relative` section and keep the content wrapper `relative` so it paints on top.
export default function Backdrop({ src, opacity = 0.17, color = '#FAFAF6' }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <img
        src={src}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ opacity, filter: 'blur(6px) saturate(0.9)', transform: 'scale(1.06)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${color} 2%, ${color}00 30%, ${color}00 70%, ${color} 98%)` }}
      />
    </div>
  )
}
