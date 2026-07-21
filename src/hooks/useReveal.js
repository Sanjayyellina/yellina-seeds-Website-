import { useEffect, useRef } from 'react'

// Adds .is-visible to any descendant with .reveal when it enters the viewport.
// A MutationObserver re-scans for elements mounted after the initial render
// (e.g. product cards appearing when the user switches category tabs) so they
// animate in instead of staying at opacity 0.
export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    const observeAll = () => {
      root.querySelectorAll('.reveal:not(.is-visible)').forEach((t) => io.observe(t))
    }
    observeAll()

    const mo = new MutationObserver(observeAll)
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return ref
}
