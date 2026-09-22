import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import {
  Navigation,
  Hero,
  Venue,
  Gallery,
  Services,
  Packages,
  Booking,
  About,
  Contact,
  Footer,
  FloatingParticles,
  CursorGlow
} from './components'
import { VenueProvider } from './context/VenueContext'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function App() {
  useEffect(() => {
    // Initialize smooth scroll behavior
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse'
    })

    // Refresh ScrollTrigger after initial load
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <VenueProvider>
    <div className="app">
      {/* Global Effects */}
      <FloatingParticles count={25} />
      <CursorGlow />
      
      <Navigation />
      
      <main>
        <Hero />
        <Venue />
        <Gallery />
        <Services />
        <Packages />
        <About />
        <Booking />
        <Contact />
      </main>
      
      <Footer />
    </div>
    </VenueProvider>
  )
}

export default App
