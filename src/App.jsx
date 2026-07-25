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
import { useLang } from './i18n/LanguageContext.jsx'

export default function App() {
  const { t } = useLang()
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
          eyebrow={t('photoBands.promise.eyebrow')}
          quote={t('photoBands.promise.quote')}
          attribution={t('photoBands.promise.attribution')}
        />
        <Pillars />
        <Quality />
        <Fields />
        <Infrastructure />
        <Products cat={productCat} onCatChange={setProductCat} />
        <PhotoBand
          src="/images/photos/farmers-cobs.jpg"
          eyebrow={t('photoBands.trust.eyebrow')}
          quote={t('photoBands.trust.quote')}
          attribution={t('photoBands.trust.attribution')}
        />
        <Agronomy />
        <PhotoBand
          src="/images/photos/detasseling-crew.jpg"
          eyebrow={t('photoBands.agronomy.eyebrow')}
          quote={t('photoBands.agronomy.quote')}
          attribution={t('photoBands.agronomy.attribution')}
        />
        <Partner />
      </main>
      <Footer onNavigate={navigate} onCrop={browseCrop} />
    </div>
  )
}
