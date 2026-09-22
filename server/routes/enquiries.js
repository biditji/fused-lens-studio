import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const enquiriesPath = join(__dirname, '../data/enquiries.json')

// Bookings are confirmed over the phone, so an enquiry is a callback request —
// not a reservation. Status tracks where the venue has got to with it.
const STATUSES = ['new', 'contacted', 'confirmed', 'declined']

function initEnquiries() {
  if (!existsSync(enquiriesPath)) {
    writeFileSync(enquiriesPath, JSON.stringify([], null, 2))
  }
}

function readEnquiries() {
  initEnquiries()
  return JSON.parse(readFileSync(enquiriesPath, 'utf8'))
}

function writeEnquiries(data) {
  writeFileSync(enquiriesPath, JSON.stringify(data, null, 2))
}

// List all enquiries, newest first (admin)
router.get('/', authenticateToken, (req, res) => {
  try {
    const enquiries = readEnquiries()
    const { status } = req.query

    const filtered = status && status !== 'all'
      ? enquiries.filter(e => e.status === status)
      : enquiries

    res.json(
      [...filtered].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    )
  } catch (error) {
    console.error('Error reading enquiries:', error)
    res.status(500).json({ error: 'Failed to load enquiries' })
  }
})

// Submit a booking enquiry (public)
router.post('/', (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      eventDate,
      eventType,
      timeSlot,
      guests,
      message
    } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Your name is required' })
    }

    if (!phone || !/^[\d\s+()-]{7,20}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'A valid phone number is required' })
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    if (!eventDate) {
      return res.status(400).json({ error: 'Please pick an event date' })
    }

    if (Number.isNaN(Date.parse(eventDate))) {
      return res.status(400).json({ error: 'Event date is not a valid date' })
    }

    const guestCount = guests === '' || guests === undefined ? null : Number(guests)
    if (guestCount !== null && (!Number.isFinite(guestCount) || guestCount < 1)) {
      return res.status(400).json({ error: 'Guest count must be a positive number' })
    }

    const enquiries = readEnquiries()

    const newEnquiry = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      eventDate,
      eventType: eventType || '',
      timeSlot: timeSlot || '',
      guests: guestCount,
      message: message ? message.trim() : '',
      status: 'new',
      notes: '',
      submittedAt: new Date().toISOString()
    }

    enquiries.push(newEnquiry)
    writeEnquiries(enquiries)

    res.status(201).json({
      message: 'Enquiry received. We will call you back to confirm your date.',
      id: newEnquiry.id
    })
  } catch (error) {
    console.error('Error submitting enquiry:', error)
    res.status(500).json({ error: 'Failed to submit enquiry' })
  }
})

// Update an enquiry's status or internal notes (admin)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const enquiries = readEnquiries()
    const index = enquiries.findIndex(e => e.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' })
    }

    const { status, notes } = req.body

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` })
      }
      enquiries[index].status = status
    }

    if (notes !== undefined) {
      enquiries[index].notes = String(notes)
    }

    enquiries[index].updatedAt = new Date().toISOString()
    writeEnquiries(enquiries)

    res.json(enquiries[index])
  } catch (error) {
    console.error('Error updating enquiry:', error)
    res.status(500).json({ error: 'Failed to update enquiry' })
  }
})

// Delete an enquiry (admin)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const enquiries = readEnquiries()
    const index = enquiries.findIndex(e => e.id === req.params.id)

    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' })
    }

    enquiries.splice(index, 1)
    writeEnquiries(enquiries)

    res.json({ message: 'Enquiry deleted' })
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    res.status(500).json({ error: 'Failed to delete enquiry' })
  }
})

export default router
