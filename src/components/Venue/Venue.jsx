import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { venues as fallbackVenues } from '../../data/content'
import './Venues.css'

gsap.registerPlugin(ScrollTrigger)

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)

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

const PriceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 5h10M7 9h10M15.5 5c0 3-2.2 4.8-5.5 4.8H7l7.5 9" />
  </svg>
)

export function Venues() {
  const [venues, setVenues] = useState(fallbackVenues)
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  // Prefer live content so the owner's admin edits show up without a rebuild.
  useEffect(() => {
    let cancelled = false

    fetch('/api/content/venues')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setVenues(data)
          setActiveIndex(0)
        }
      })
      .catch(() => {
        // Keep the bundled venues — the page still renders without the API.
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
  }, [venues])

  const active = venues[activeIndex] || venues[0]

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="venues" className="venues section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Our Venues</span>
          <h2 className="section-title">Four Grounds, One Standard</h2>
          <div className="ornament"><span className="ornament__mark">❖</span></div>
          <p className="section-subtitle">
            From a thousand-guest lawn to an intimate rooftop — every space comes with tent,
            decor, lighting and catering handled by the same in-house team.
          </p>
        </motion.div>

        {/* Venue selector */}
        <div className="venues__tabs" role="tablist" aria-label="Choose a venue">
          {venues.map((venue, index) => (
            <button
              key={venue.id}
              role="tab"
              aria-selected={index === activeIndex}
              className={`venues__tab clickable ${index === activeIndex ? 'venues__tab--active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {venue.name}
              {index === activeIndex && (
                <motion.span
                  className="venues__tab-line"
                  layoutId="venueTabLine"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Featured venue */}
        {active && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="venues__feature"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="venues__feature-media">
                <img src={active.image} alt={active.name} loading="lazy" />
                <span className="venues__feature-type">{active.type}</span>
              </div>

              <div className="venues__feature-body">
                <h3 className="venues__feature-name">{active.name}</h3>
                <p className="venues__feature-description">{active.description}</p>

                <div className="venues__specs">
                  <div className="venues__spec">
                    <span className="venues__spec-icon"><CapacityIcon /></span>
                    <span className="venues__spec-value">{active.capacity}</span>
                    <span className="venues__spec-label">Guests</span>
                  </div>
                  <div className="venues__spec">
                    <span className="venues__spec-icon"><AreaIcon /></span>
                    <span className="venues__spec-value">{active.area}</span>
                    <span className="venues__spec-label">Area</span>
                  </div>
                  <div className="venues__spec">
                    <span className="venues__spec-icon"><PriceIcon /></span>
                    <span className="venues__spec-value">{formatPrice(active.price)}</span>
                    <span className="venues__spec-label">From / day</span>
                  </div>
                </div>

                <ul className="venues__amenities">
                  {active.amenities?.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>

                <div className="venues__feature-actions">
                  <motion.button
                    className="venues__cta clickable"
                    onClick={scrollToBooking}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enquire About This Venue
                  </motion.button>
                  <span className="venues__price-note">
                    Final price depends on date, guest count and package.
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* All venues at a glance */}
        <div className="venues__grid">
          {venues.map((venue, index) => (
            <article
              key={venue.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`venue-card clickable ${index === activeIndex ? 'venue-card--active' : ''}`}
              onClick={() => {
                setActiveIndex(index)
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <div className="venue-card__media">
                <img src={venue.image} alt={venue.name} loading="lazy" />
              </div>
              <div className="venue-card__body">
                <span className="venue-card__type">{venue.type}</span>
                <h4 className="venue-card__name">{venue.name}</h4>
                <div className="venue-card__meta">
                  <span>{venue.capacity} guests</span>
                  <span aria-hidden="true">·</span>
                  <span>{venue.area}</span>
                </div>
                <span className="venue-card__price">From {formatPrice(venue.price)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
