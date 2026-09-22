// NOTE: the street address and pricing below are placeholders — replace them
// with the real details (or edit them from the admin panel). The phone number,
// city and photographs are the real ones.

export const venueInfo = {
  name: 'Gopal Tent House',
  tagline: 'Where Forever Begins',
  description: 'Grand shamianas, handcrafted mandaps and themed decor — hosting unforgettable weddings in Kanpur.',
  founded: 1992,
  location: 'Kanpur, Uttar Pradesh',
  address: 'Kanpur, Uttar Pradesh',
  email: 'bookings@gopaltenthouse.com',
  phone: '+91 90263 23680',
  whatsapp: '919026323680',
  social: {
    instagram: 'https://instagram.com/gopaltenthouse',
    facebook: 'https://facebook.com/gopaltenthouse',
    youtube: 'https://youtube.com/@gopaltenthouse',
    twitter: 'https://twitter.com/gopaltenthouse'
  }
}

// A single venue — Gopal Tent House. Capacity and area are the headline
// numbers shown on the venue section.
export const venue = {
  capacity: 1000,
  area: '25,000 sq ft',
  setupTime: '24 hrs',
  amenities: [
    'Indoor and open-air setups',
    'Weatherproof shamiana & German hangar',
    'Chandelier and festoon lighting',
    'Bridal suite & green rooms',
    'Power backup included',
    'In-house vegetarian kitchen',
    'Ample guest & valet parking',
    'Baraat entry driveway'
  ],
  highlights: [
    {
      id: 'themed-decor',
      title: 'Themed Decor',
      description: 'Complete colour themes carried through backdrop, drapes, seating, linen and florals — blue and gold, monochrome, pastel or anything you bring us.',
      image: '/photos/blue-mandap-stage.jpg'
    },
    {
      id: 'grand-pavilion',
      title: 'Chandelier Pavilion',
      description: 'Gold-draped canopy under crystal chandeliers, with tufted sofa lounges and marble-top tables for an evening reception.',
      image: '/photos/gold-chandelier-pavilion.jpg'
    },
    {
      id: 'guest-seating',
      title: 'Guest Seating',
      description: 'Round tables with themed covers, cushioned chairs and lounge settings laid out and cleared by our own crew.',
      image: '/photos/blue-dining-setup.jpg'
    },
    {
      id: 'catering-counters',
      title: 'Catering Counters',
      description: 'Pure-vegetarian buffet lines, live chaat and tandoor counters, and trained service staff for every table.',
      image: '/photos/catering-lawn-setup.jpg'
    }
  ]
}

// Time slots that can be requested on the enquiry form.
export const timeSlots = [
  { id: 'morning', label: 'Morning', time: '8:00 AM – 4:00 PM' },
  { id: 'evening', label: 'Evening', time: '5:00 PM – 12:00 AM' },
  { id: 'fullday', label: 'Full Day', time: '8:00 AM – 12:00 AM' }
]

export const eventTypes = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'reception', label: 'Reception' },
  { id: 'engagement', label: 'Engagement / Sagai' },
  { id: 'sangeet', label: 'Sangeet & Mehendi' },
  { id: 'tilak', label: 'Tilak / Roka' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'corporate', label: 'Corporate Event' },
  { id: 'other', label: 'Other' }
]

export const packages = [
  {
    id: 'sagai',
    name: 'Sagai',
    subtitle: 'Intimate Celebrations',
    price: 125000,
    guests: 'Up to 200 guests',
    popular: false,
    description: 'A complete engagement or roka setup, handled end to end.',
    features: [
      'Single evening slot',
      'Themed stage & entrance decor',
      'Round table seating with covers',
      'Vegetarian buffet (8 dishes)',
      'Basic lighting & sound',
      'Dedicated event supervisor'
    ]
  },
  {
    id: 'vivah',
    name: 'Vivah',
    subtitle: 'The Classic Wedding',
    price: 350000,
    guests: 'Up to 500 guests',
    popular: true,
    description: 'Our most-booked package — the full wedding day, start to finish.',
    features: [
      'Full day booking',
      'Carved mandap with floral canopy',
      'Baraat welcome with dhol & flowers',
      'Vegetarian buffet (16 dishes) + 3 live counters',
      'Designer lighting, DJ & sound',
      'Bridal suite & green rooms',
      'Valet parking',
      'Dedicated event manager'
    ]
  },
  {
    id: 'maharaja',
    name: 'Maharaja',
    subtitle: 'Multi-Day Grandeur',
    price: 750000,
    guests: 'Up to 1000 guests',
    popular: false,
    description: 'Three days of ceremonies, with a fresh setup for each function.',
    features: [
      'Three days, re-themed for each function',
      'Haldi, mehendi, sangeet & wedding setups',
      'Chandelier pavilion with sofa lounges',
      'Multi-cuisine catering + 6 live counters',
      'Fireworks & entry effects',
      'Guest room coordination',
      'Photography & drone coordination',
      'Full-time event crew of 40+'
    ]
  }
]

export const services = [
  {
    id: 1,
    title: 'Tent & Shamiana Setup',
    description: 'Waterproof German hangars, Rajasthani shamianas and canopies raised to fit your guest list and your ground.',
    icon: 'tent',
    features: ['Weatherproof structures', 'Custom spans up to 25,000 sq ft', 'Carved pillars & drapes', 'Same-day dismantling']
  },
  {
    id: 2,
    title: 'Decor & Florals',
    description: 'Entrance gates, stage backdrops and walkways dressed in fresh flowers, drapes and theme lighting.',
    icon: 'decor',
    features: ['Fresh floral installations', 'Theme-based backdrops', 'Entrance & pathway decor', 'Photo-booth corners']
  },
  {
    id: 3,
    title: 'Mandap & Stage',
    description: 'Hand-carved wooden mandaps, floral canopies and raised stages built for the ceremony and the photographs.',
    icon: 'mandap',
    features: ['Carved wooden mandaps', 'Floral & drape canopies', 'Raised pheras platform', 'Havan kund arrangement']
  },
  {
    id: 4,
    title: 'Catering & Live Counters',
    description: 'Pure-veg multi-cuisine kitchens, chaat and tandoor counters, and trained service staff for every table.',
    icon: 'catering',
    features: ['Pure vegetarian kitchen', 'North Indian, Chinese & Continental', 'Live chaat & tandoor counters', 'Uniformed service staff']
  },
  {
    id: 5,
    title: 'Lighting & Sound',
    description: 'Crystal chandeliers, festoon and uplighting, LED walls and clean audio that carries across the whole ground.',
    icon: 'lighting',
    features: ['Crystal chandeliers', 'Festoon & uplighting', 'LED walls, DJ & sound', 'Power backup included']
  },
  {
    id: 6,
    title: 'Furniture & Seating',
    description: 'Tufted sofa lounges, round tables, cushioned chairs and buffet counters — laid out and cleared by our crew.',
    icon: 'furniture',
    features: ['Sofa lounge settings', 'Round & long tables', 'Cushioned & VIP chairs', 'Linen, covers & drapes']
  }
]

export const stats = [
  { value: 2400, suffix: '+', label: 'Weddings Hosted' },
  { value: 33, suffix: '', label: 'Years of Service' },
  { value: 1000, suffix: '', label: 'Guest Capacity' },
  { value: 25, suffix: 'k', label: 'Sq Ft of Ground' }
]

export const timeline = [
  {
    year: 1992,
    title: 'The First Shamiana',
    description: 'Gopal Tent House opened in Kanpur with a single hand-stitched shamiana and a borrowed truck.'
  },
  {
    year: 2001,
    title: 'The Ground',
    description: 'We took on and levelled the 25,000 sq ft ground we still host weddings on today.'
  },
  {
    year: 2009,
    title: 'In-House Kitchen',
    description: 'Catering was brought in house so families deal with one team, not five vendors.'
  },
  {
    year: 2016,
    title: 'Themed Decor Studio',
    description: 'We began building full colour-themed setups — backdrop, linen, florals and lighting as one design.'
  },
  {
    year: 2023,
    title: 'Online Enquiries',
    description: 'Date enquiries moved online so families can send us a date any time of day.'
  }
]

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'venue', label: 'Venue' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'services', label: 'Services' },
  { id: 'packages', label: 'Packages' },
  { id: 'booking', label: 'Book' },
  { id: 'contact', label: 'Contact' }
]

export const missionStatement = `For three generations, Gopal Tent House has raised tents and lit grounds for the families of Kanpur. We believe a wedding is not a transaction — it is a promise made in front of everyone a family loves. Our work is to make sure nothing on that day goes wrong: the canopy holds, the food arrives hot, the lights come on when the baraat turns the corner. Everything else is yours to enjoy.`
