import { createContext, useContext, useEffect, useState } from 'react'
import { venueInfo as bundledInfo, venue as bundledVenue } from '../data/content'

// The admin panel edits server/data/content.json. Without this, the site would
// keep showing the values bundled at build time, so admin edits to the phone
// number, address or capacity would silently never appear.
const VenueContext = createContext({ info: bundledInfo, venue: bundledVenue })

// Server keys that belong to the venue's physical details rather than contact.
const VENUE_KEYS = ['capacity', 'area', 'setupTime', 'amenities']

export function VenueProvider({ children }) {
  const [value, setValue] = useState({ info: bundledInfo, venue: bundledVenue })

  useEffect(() => {
    let cancelled = false

    fetch('/api/content/venue')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then(data => {
        if (cancelled || !data || typeof data !== 'object') return

        const venueOverrides = {}
        VENUE_KEYS.forEach(key => {
          if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
            venueOverrides[key] = data[key]
          }
        })

        setValue({
          // Bundled values stay as the fallback for anything the API omits.
          info: { ...bundledInfo, ...data, social: data.social || bundledInfo.social },
          venue: { ...bundledVenue, ...venueOverrides }
        })
      })
      .catch(() => {
        // Keep the bundled content — the site renders fine without the API.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
}

export function useVenueInfo() {
  return useContext(VenueContext).info
}

export function useVenue() {
  return useContext(VenueContext).venue
}
