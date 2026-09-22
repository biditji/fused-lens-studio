import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useVenueInfo, useVenue } from '../../context/VenueContext'
import './Venue.css'

gsap.registerPlugin(ScrollTrigger)

const CapacityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M16 5.2a3.2 3.2 0 010 5.6M17 13.4c2.4.7 4 2.9 4 5.6" />
  </svg>
)

const AreaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
    <path d="M3.5 9h17M9 3.5v17" />
  </svg>
)

const SetupIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" strokeLinecap="round" />
  </svg>
)

export function Venue() {
  const venueInfo = useVenueInfo()
  const venue = useVenue()
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  const highlights = venue.highlights

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    if (cards.length === 0) return

    const animation = gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      animation.scrollTrigger?.kill()
      animation.kill()
    }
  }, [])

  const active = highlights[activeIndex] || highlights[0]

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="venue" className="venue section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">The Venue</span>
          <h2 className="section-title">One Ground, Every Setup</h2>
          <div className="ornament"><span className="ornament__mark">❖</span></div>
          <p className="section-subtitle">
            {venueInfo.name} in {venueInfo.location} — a single ground we re-theme completely
            for your function, with tent, decor, lighting, furniture and catering all handled
            by our own crew.
          </p>
        </motion.div>

        {/* Headline specs */}
        <motion.div
          className="venue__specs"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="venue__spec">
            <span className="venue__spec-icon"><CapacityIcon /></span>
            <span className="venue__spec-value">{venue.capacity}</span>
            <span className="venue__spec-label">Guest Capacity</span>
          </div>
          <div className="venue__spec">
            <span className="venue__spec-icon"><AreaIcon /></span>
            <span className="venue__spec-value">{venue.area}</span>
            <span className="venue__spec-label">Ground Area</span>
          </div>
          <div className="venue__spec">
            <span className="venue__spec-icon"><SetupIcon /></span>
            <span className="venue__spec-value">{venue.setupTime}</span>
            <span className="venue__spec-label">Setup Before Event</span>
          </div>
        </motion.div>

        {/* Highlight showcase */}
        <div className="venue__tabs" role="tablist" aria-label="Venue setups">
          {highlights.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={index === activeIndex}
              className={`venue__tab clickable ${index === activeIndex ? 'venue__tab--active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {item.title}
              {index === activeIndex && (
                <motion.span
                  className="venue__tab-line"
                  layoutId="venueTabLine"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {active && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="venue__feature"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="venue__feature-media">
                <img src={active.image} alt={active.title} loading="lazy" />
              </div>

              <div className="venue__feature-body">
                <h3 className="venue__feature-name">{active.title}</h3>
                <p className="venue__feature-description">{active.description}</p>

                <ul className="venue__amenities">
                  {venue.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>

                <div className="venue__feature-actions">
                  <motion.button
                    className="venue__cta clickable"
                    onClick={scrollToBooking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Check Your Date
                  </motion.button>
                  <span className="venue__price-note">
                    Pricing depends on date, guest count and package.
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* All setups at a glance */}
        <div className="venue__grid">
          {highlights.map((item, index) => (
            <article
              key={item.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`setup-card clickable ${index === activeIndex ? 'setup-card--active' : ''}`}
              onClick={() => {
                setActiveIndex(index)
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <div className="setup-card__media">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="setup-card__body">
                <h4 className="setup-card__name">{item.title}</h4>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
