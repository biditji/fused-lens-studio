import { motion } from 'framer-motion'
import { venueInfo, navLinks, venues } from '../../data/content'
import './Footer.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <motion.a
              href="#home"
              className="footer__logo clickable"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('home')
              }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="/gopal-logo.svg" 
                alt={venueInfo.name}
                className="footer__logo-image"
              />
              <span className="footer__logo-text">{venueInfo.name}</span>
            </motion.a>
            <p className="footer__tagline">{venueInfo.tagline}</p>
            <p className="footer__description">
              Lawns, halls and shamianas with tent, decor, catering and lighting handled
              in house — serving {venueInfo.location} since {venueInfo.founded}.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer__nav">
            <h4 className="footer__heading">Navigation</h4>
            <nav className="footer__links">
              {navLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className="footer__link clickable"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.id)
                  }}
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Venues */}
          <div className="footer__services">
            <h4 className="footer__heading">Our Venues</h4>
            <nav className="footer__links">
              {venues.map((venue) => (
                <a
                  key={venue.id}
                  href="#venues"
                  className="footer__link clickable"
                  onClick={(e) => { e.preventDefault(); scrollToSection('venues') }}
                >
                  {venue.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="footer__contact">
            <h4 className="footer__heading">Book Your Date</h4>
            <div className="footer__contact-info">
              <p>{venueInfo.address}</p>
              <a href={`tel:${venueInfo.phone.replace(/[^\d+]/g, '')}`} className="clickable">{venueInfo.phone}</a>
              <a href={`mailto:${venueInfo.email}`} className="clickable">{venueInfo.email}</a>
              <a
                href={`https://wa.me/${venueInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="clickable"
              >
                WhatsApp us
              </a>
            </div>
            
            {/* Social */}
            <div className="footer__social">
              {Object.entries(venueInfo.social).map(([platform, url]) => (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link clickable"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={platform}
                >
                  {platform.charAt(0).toUpperCase()}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} {venueInfo.name}. All rights reserved.
          </p>
          <p className="footer__credit">
            Vegetarian kitchen · Open daily 9 AM – 8 PM
          </p>
        </div>
      </div>
    </footer>
  )
}
