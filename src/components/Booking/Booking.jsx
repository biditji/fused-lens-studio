import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventTypes, timeSlots } from '../../data/content'
import { useVenueInfo, useVenue } from '../../context/VenueContext'
import './Booking.css'

// Bookings are confirmed over the phone — this form only requests a callback.
const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  eventDate: '',
  eventType: '',
  timeSlot: '',
  guests: '',
  message: ''
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const VisitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export function Booking() {
  const venueInfo = useVenueInfo()
  const venue = useVenue()
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Stop the date picker offering dates in the past.
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const validate = () => {
    const next = {}

    if (!formData.name.trim()) {
      next.name = 'Please tell us your name'
    }

    if (!formData.phone.trim()) {
      next.phone = 'We need a phone number to call you back'
    } else if (!/^[\d\s+()-]{7,20}$/.test(formData.phone.trim())) {
      next.phone = 'Please enter a valid phone number'
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = 'Please enter a valid email address'
    }

    if (!formData.eventDate) {
      next.eventDate = 'Pick the date you have in mind'
    }

    if (formData.guests && Number(formData.guests) < 1) {
      next.guests = 'Guest count must be at least 1'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setSubmitted(true)
        setFormData(EMPTY_FORM)
      } else {
        setErrors({ submit: data.error || 'Could not send your enquiry. Please call us instead.' })
      }
    } catch (error) {
      console.error('Enquiry submission failed:', error)
      setErrors({ submit: 'Network error. Please call or WhatsApp us instead.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const telHref = `tel:${venueInfo.phone.replace(/[^\d+]/g, '')}`

  return (
    <section id="booking" className="booking section section--dark">
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Book Your Date</span>
          <h2 className="section-title">Reserve the Venue</h2>
          <div className="ornament"><span className="ornament__mark">❖</span></div>
          <p className="section-subtitle">
            Dates are confirmed over a phone call, not online. Call us directly, or send the
            form below and we will ring you back within 24 hours with availability and a quotation.
          </p>
        </motion.div>

        <div className="booking__layout">
          {/* Direct contact — the primary path to a booking */}
          <motion.div
            className="booking__contact"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <span className="booking__contact-label">Fastest way to book</span>
            <h3 className="booking__contact-title">Talk to us directly</h3>
            <p className="booking__contact-text">
              Wedding dates move quickly in season. A two-minute call tells you straight away
              whether your date is open, what it costs, and what is included.
            </p>

            <div className="booking__channels">
              <motion.a
                href={telHref}
                className="booking__channel booking__channel--primary clickable"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="booking__channel-icon"><PhoneIcon /></span>
                <span className="booking__channel-body">
                  <span className="booking__channel-label">Call us</span>
                  <span className="booking__channel-value">{venueInfo.phone}</span>
                </span>
              </motion.a>

              <motion.a
                href={`https://wa.me/${venueInfo.whatsapp}?text=${encodeURIComponent(
                  `Hello ${venueInfo.name}, I would like to check availability for my event.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="booking__channel booking__channel--whatsapp clickable"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="booking__channel-icon"><WhatsAppIcon /></span>
                <span className="booking__channel-body">
                  <span className="booking__channel-label">WhatsApp</span>
                  <span className="booking__channel-value">Send us your date</span>
                </span>
              </motion.a>

              <motion.a
                href="#contact"
                className="booking__channel clickable"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="booking__channel-icon"><VisitIcon /></span>
                <span className="booking__channel-body">
                  <span className="booking__channel-label">Visit the ground</span>
                  <span className="booking__channel-value">{venueInfo.location}</span>
                </span>
              </motion.a>
            </div>

            <ul className="booking__notes">
              <li>Open daily, 9:00 AM – 8:00 PM</li>
              <li>Site visits welcome — no appointment needed</li>
              <li>Dates held for 7 days against a booking advance</li>
            </ul>
          </motion.div>

          {/* Callback request form */}
          <motion.div
            className="booking__form-panel"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="booking__success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="booking__success-mark">✓</span>
                  <h3>Enquiry received</h3>
                  <p>
                    Thank you. We will call you within 24 hours to confirm whether your date is
                    available. If it is urgent, call us now on <strong>{venueInfo.phone}</strong>.
                  </p>
                  <button
                    type="button"
                    className="booking__reset clickable"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  className="booking__form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <header className="booking__form-header">
                    <h3>Request a callback</h3>
                    <p>Tell us the date and we will check the register.</p>
                  </header>

                  <div className="booking__row">
                    <div className={`booking__field ${errors.name ? 'booking__field--error' : ''}`}>
                      <label htmlFor="bk-name">Your name *</label>
                      <input
                        id="bk-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rohit Sharma"
                      />
                      {errors.name && <span className="booking__error">{errors.name}</span>}
                    </div>

                    <div className={`booking__field ${errors.phone ? 'booking__field--error' : ''}`}>
                      <label htmlFor="bk-phone">Phone *</label>
                      <input
                        id="bk-phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 90263 23680"
                      />
                      {errors.phone && <span className="booking__error">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className={`booking__field ${errors.email ? 'booking__field--error' : ''}`}>
                    <label htmlFor="bk-email">Email (optional)</label>
                    <input
                      id="bk-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                    {errors.email && <span className="booking__error">{errors.email}</span>}
                  </div>

                  <div className="booking__row">
                    <div className={`booking__field ${errors.eventDate ? 'booking__field--error' : ''}`}>
                      <label htmlFor="bk-date">Event date *</label>
                      <input
                        id="bk-date"
                        name="eventDate"
                        type="date"
                        min={today}
                        value={formData.eventDate}
                        onChange={handleChange}
                      />
                      {errors.eventDate && <span className="booking__error">{errors.eventDate}</span>}
                    </div>

                    <div className="booking__field">
                      <label htmlFor="bk-type">Occasion</label>
                      <select
                        id="bk-type"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                      >
                        <option value="">Select an occasion</option>
                        {eventTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="booking__row">
                    <div className="booking__field">
                      <label htmlFor="bk-slot">Time slot</label>
                      <select
                        id="bk-slot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                      >
                        <option value="">Not sure yet</option>
                        {timeSlots.map(slot => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label} ({slot.time})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={`booking__field ${errors.guests ? 'booking__field--error' : ''}`}>
                      <label htmlFor="bk-guests">
                        Expected guests
                        <span className="booking__hint">up to {venue.capacity}</span>
                      </label>
                      <input
                        id="bk-guests"
                        name="guests"
                        type="number"
                        min="1"
                        value={formData.guests}
                        onChange={handleChange}
                        placeholder="e.g. 450"
                      />
                      {errors.guests && <span className="booking__error">{errors.guests}</span>}
                    </div>
                  </div>

                  <div className="booking__field">
                    <label htmlFor="bk-message">Anything else?</label>
                    <textarea
                      id="bk-message"
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Catering preferences, decor theme, number of days…"
                    />
                  </div>

                  {errors.submit && (
                    <div className="booking__submit-error">{errors.submit}</div>
                  )}

                  <motion.button
                    type="submit"
                    className="booking__submit clickable"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  >
                    {isSubmitting ? 'Sending…' : 'Request Callback'}
                  </motion.button>

                  <p className="booking__disclaimer">
                    This does not reserve the date. A booking is confirmed only after we speak
                    and receive the advance.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
