import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { packages as fallbackPackages } from '../../data/content'
import { useVenueInfo } from '../../context/VenueContext'
import './Packages.css'

gsap.registerPlugin(ScrollTrigger)

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)

export function Packages() {
  const venueInfo = useVenueInfo()
  const [packages, setPackages] = useState(fallbackPackages)
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    let cancelled = false

    fetch('/api/content/packages')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setPackages(data)
        }
      })
      .catch(() => {
        // Fall back to the bundled packages.
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    if (cards.length === 0) return

    const animation = gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      animation.scrollTrigger?.kill()
      animation.kill()
    }
  }, [packages])

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="packages" className="packages section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Packages</span>
          <h2 className="section-title">All-Inclusive Wedding Packages</h2>
          <div className="ornament"><span className="ornament__mark">❖</span></div>
          <p className="section-subtitle">
            Venue, tent, decor, mandap, catering, lighting and furniture in one quotation.
            Every package is adjusted to your guest count — these are starting prices.
          </p>
        </motion.div>

        <div className="packages__grid">
          {packages.map((pkg, index) => (
            <article
              key={pkg.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`package-card ${pkg.popular ? 'package-card--popular' : ''}`}
            >
              {pkg.popular && <span className="package-card__ribbon">Most Booked</span>}

              <header className="package-card__header">
                <span className="package-card__subtitle">{pkg.subtitle}</span>
                <h3 className="package-card__name">{pkg.name}</h3>
                <p className="package-card__description">{pkg.description}</p>
              </header>

              <div className="package-card__price">
                <span className="package-card__price-from">Starting at</span>
                <span className="package-card__price-value">{formatPrice(pkg.price)}</span>
                <span className="package-card__price-guests">{pkg.guests}</span>
              </div>

              <ul className="package-card__features">
                {pkg.features?.map((feature) => (
                  <li key={feature}>
                    <span className="package-card__check" aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                className="package-card__cta clickable"
                onClick={scrollToBooking}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enquire About {pkg.name}
              </motion.button>
            </article>
          ))}
        </div>

        <motion.p
          className="packages__footnote"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Need something different? We build custom quotations for multi-day functions and
          smaller gatherings alike. Call {venueInfo.phone} and tell us what you have in mind.
        </motion.p>
      </div>
    </section>
  )
}
