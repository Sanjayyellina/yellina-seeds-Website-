import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import PhotoBand from './components/PhotoBand.jsx'
import FounderLetter from './components/FounderLetter.jsx'
import Story from './components/Story.jsx'
import Fields from './components/Fields.jsx'
import Pillars from './components/Pillars.jsx'
import Quality from './components/Quality.jsx'
import Infrastructure from './components/Infrastructure.jsx'
import Products from './components/Products.jsx'
import Portfolio from './components/Portfolio.jsx'
import Agronomy from './components/Agronomy.jsx'
import Partner from './components/Partner.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const lenisRef = useRef(null)
  const [productCat, setProductCat] = useState('maize')

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  // Global depth parallax: any element with data-parallax drifts against the
  // scroll at its own speed. One rAF loop, transform-only, skipped for
  // reduced-motion users.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const applied = new WeakMap()
    let ticking = false
    const update = () => {
      ticking = false
      const vh2 = window.innerHeight / 2
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax)
        if (!speed) return
        const rect = el.getBoundingClientRect()
        const prev = applied.get(el) || 0
        const naturalCenter = rect.top + rect.height / 2 - prev
        const offset = (vh2 - naturalCenter) * speed
        if (Math.abs(offset - prev) > 0.5) {
          applied.set(el, offset)
          el.style.transform = `translate3d(0, ${offset}px, 0)`
        }
      })
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const navigate = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    // rAF is paused in hidden/background tabs, which would stall Lenis's animation
    if (lenisRef.current && document.visibilityState === 'visible') {
      lenisRef.current.scrollTo(el, { offset: id === 'home' ? 0 : -70, duration: 1.6 })
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - (id === 'home' ? 0 : 70)
      window.scrollTo({ top, behavior: 'auto' })
    }
  }

  const browseCrop = (id) => {
    if (id === 'coming') {
      navigate('coming')
      return
    }
    setProductCat(id)
    navigate('products')
  }

  return (
    <div className="min-h-screen">
      <Nav onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} />
        <Portfolio onCrop={browseCrop} />
        <FounderLetter />
        <Story />
        <PhotoBand
          src="/images/photos/paddy-inspection.jpg"
          eyebrow="Our Promise"
          quote="If the seed is right, the season is right."
          attribution="Every packet represents our commitment to the success of every farmer"
        />
        <Pillars />
        <Quality />
        <Fields />
        <Infrastructure />
        <Products cat={productCat} onCatChange={setProductCat} />
        <PhotoBand
          src="/images/photos/farmers-cobs.jpg"
          eyebrow="Built on Trust"
          quote="Trust is earned in the field — not in advertisements."
          attribution="Mr. Murali Krishna · Founder & Managing Director"
        />
        <Agronomy />
        <PhotoBand
          src="/images/photos/detasseling-crew.jpg"
          eyebrow="Agronomy Support"
          quote="Helping farmers achieve higher productivity from sowing to harvest."
          attribution="Field days · demo plots · season-long guidance"
        />
        <Partner />
      </main>
      <Footer onNavigate={navigate} onCrop={browseCrop} />
    </div>
  )
}
