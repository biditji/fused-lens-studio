import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../../data/content'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

// Service Icons
const ServiceIcon = ({ type }) => {
  const icons = {
    tent: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M32 12L54 38H10z" strokeLinejoin="round" />
        <path d="M10 38q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0" strokeLinecap="round" />
        <path d="M32 12V38" opacity="0.5" />
        <path d="M16 44v10M48 44v10" strokeLinecap="round" />
        <path d="M24 54V48a8 8 0 0116 0v6" strokeLinecap="round" />
      </svg>
    ),
    decor: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="32" cy="26" r="6" />
        <path d="M32 20c0-6-4-9-8-7s-2 8 8 7zM32 20c0-6 4-9 8-7s2 8-8 7z" />
        <path d="M26 26c-6 0-9 4-7 8s8 2 7-8zM38 26c6 0 9 4 7 8s-8 2-7-8z" />
        <path d="M32 32v22" strokeLinecap="round" />
        <path d="M32 42c-5 0-8-3-9-7M32 48c5 0 8-3 9-7" strokeLinecap="round" />
      </svg>
    ),
    mandap: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22h40l-6-8H18z" strokeLinejoin="round" />
        <path d="M12 22q5 6 10 0 q5 6 10 0 q5 6 10 0" strokeLinecap="round" />
        <path d="M16 28v26M48 28v26" strokeLinecap="round" />
        <path d="M32 10v4" strokeLinecap="round" />
        <circle cx="32" cy="8" r="2" fill="currentColor" stroke="none" />
        <path d="M24 54v-8a8 8 0 0116 0v8" strokeLinecap="round" />
      </svg>
    ),
    catering: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 42h44" strokeLinecap="round" />
        <path d="M14 42a18 18 0 0136 0" />
        <path d="M32 18v6" strokeLinecap="round" />
        <circle cx="32" cy="16" r="2" fill="currentColor" stroke="none" />
        <path d="M16 48h32" strokeLinecap="round" />
      </svg>
    ),
    lighting: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 14q12 10 24 0 q12 10 24 0" strokeLinecap="round" />
        <path d="M14 18v6M26 22v6M38 22v6M50 18v6" strokeLinecap="round" />
        <circle cx="14" cy="28" r="4" />
        <circle cx="26" cy="32" r="4" />
        <circle cx="38" cy="32" r="4" />
        <circle cx="50" cy="28" r="4" />
        <path d="M20 46h24M24 52h16" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
    furniture: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 18a6 6 0 0124 0v16" />
        <path d="M18 34h28" strokeLinecap="round" />
        <path d="M20 34v6M44 34v6" strokeLinecap="round" />
        <path d="M14 40h36" strokeLinecap="round" />
        <path d="M18 40v12M46 40v12" strokeLinecap="round" />
      </svg>
    )
  }

  return icons[type] || icons.tent
}

export function Services() {
  const [flippedCard, setFlippedCard] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    // Fetch testimonials
    fetch('/api/content/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error('Failed to load testimonials:', err))
  }, [])

  // Staggered card animation
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    
    gsap.fromTo(cards,
      { opacity: 0, y: 60, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleCardClick = (id) => {
    setFlippedCard(flippedCard === id ? null : id)
  }

  return (
    <section id="services" className="services section section--dark" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Services</span>
          <h2 className="section-title">Everything Under One Roof</h2>
          <div className="ornament"><span className="ornament__mark">❖</span></div>
          <p className="section-subtitle">
            Tent, decor, mandap, food, lights and furniture — handled by our own crew, on one
            quotation. No chasing six different vendors.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="services__grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`service-card ${flippedCard === service.id ? 'service-card--flipped' : ''}`}
              onClick={() => handleCardClick(service.id)}
              style={{ perspective: '1000px' }}
            >
              <div className="service-card__inner">
                {/* Front */}
                <div className="service-card__front">
                  <div className="service-card__icon">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__description">{service.description}</p>
                  <span className="service-card__hint">Click to learn more</span>
                </div>

                {/* Back */}
                <div className="service-card__back">
                  <h3 className="service-card__title">{service.title}</h3>
                  <ul className="service-card__features">
                    {service.features.map((feature, i) => (
                      <li key={i} className="service-card__feature">
                        <span className="service-card__feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="service-card__cta"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Enquire Now
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          className="testimonials"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="testimonials__title">What Families Say</h3>
          
          {testimonials.length > 0 ? (
            <>
              <div className="testimonials__slider">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    className="testimonial"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <blockquote className="testimonial__quote">
                      {testimonials[activeTestimonial]?.content}
                    </blockquote>
                    <div className="testimonial__author">
                      <img
                        src={testimonials[activeTestimonial]?.image || '/placeholder-avatar.jpg'}
                        alt={testimonials[activeTestimonial]?.name || 'Client'}
                        className="testimonial__avatar"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                      <div className="testimonial__info">
                        <span className="testimonial__name">{testimonials[activeTestimonial]?.name || 'Client'}</span>
                        <span className="testimonial__role">{testimonials[activeTestimonial]?.role || 'Client'}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div className="testimonials__dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`testimonials__dot ${index === activeTestimonial ? 'testimonials__dot--active' : ''}`}
                      onClick={() => setActiveTestimonial(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="testimonials__slider">
              <p style={{ color: 'var(--color-silver)', fontStyle: 'italic' }}>
                No reviews yet.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

