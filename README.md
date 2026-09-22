# Gopal Tent House

Website for **Gopal Tent House**, a wedding venue and tent house in Kanpur, Uttar Pradesh.

Bookings are **confirmed over the phone**, not online. The site is built around that: every
section pushes the visitor toward calling or WhatsApping, and the booking form only sends a
callback request that the owner follows up on.

- **Public site** — React + Vite (`index.html`)
- **Admin panel** — same app, separate entry (`admin.html`)
- **API** — Express with JSON files on disk (`server/`)

---

## Running it

```bash
npm run setup      # installs both frontend and server dependencies
npm run dev:all    # frontend on :3000, API on :3001
```

Or run the two halves separately:

```bash
npm run dev         # frontend only  → http://localhost:3000
npm run dev:server  # API only       → http://localhost:3001
```

The Vite dev server proxies `/api` and `/uploads` to the API, so the frontend always calls
relative paths. To point it somewhere else, set `VITE_API_TARGET`.

| URL | What it is |
| --- | --- |
| `http://localhost:3000` | The public site |
| `http://localhost:3000/admin.html` | Admin panel |
| `http://localhost:3001/api/health` | API health check |

**Default admin login is `admin` / `admin123` — change it before going live** (Admin panel →
it writes a bcrypt hash to `server/data/admin.json`).

---

## Page structure

| Section | Purpose |
| --- | --- |
| Hero | Rotating photos, "Check Your Date" and a tap-to-call button |
| Venue | The ground — capacity, area, amenities, and the setup styles |
| Gallery | Filterable photos with a lightbox |
| Services | Tent, decor, mandap, catering, lighting, furniture |
| Packages | Sagai / Vivah / Maharaja pricing tiers |
| About | History, milestones, stats |
| Booking | Call + WhatsApp CTAs, and the callback request form |
| Contact | Map, contact details, general enquiry form |

---

## How booking works

There is no self-serve calendar. The flow is:

1. Visitor submits the Booking form → `POST /api/enquiries` (public, no auth).
2. The enquiry lands in `server/data/enquiries.json` with status `new`.
3. Admin panel → **Enquiries** shows it, with a badge in the sidebar for unanswered ones.
4. The owner calls the family (Call / WhatsApp buttons are on each enquiry), then sets the
   status to `contacted`, `confirmed` or `declined` and saves internal notes.

Submitting the form does **not** reserve a date — the form says so explicitly.

---

## Editing content

Almost everything is editable from the admin panel without touching code:

| Tab | Edits |
| --- | --- |
| Overview | New enquiries, upcoming confirmed bookings |
| Enquiries | Booking enquiries and their status |
| Packages | Pricing tiers and what's included |
| Venue Info | Name, phone, WhatsApp, address, capacity, area, amenities |
| Hero / About / Services / Reviews / Team / Gallery | Their respective sections |
| Social Links / Contact Info | Contact and social details |
| Messages / Comments | Contact-form submissions and photo comments |

Values edited here are served from `server/data/content.json` and override the build-time
defaults in `src/data/content.js` (see `src/context/VenueContext.jsx`). If the API is
unreachable the site still renders using those bundled defaults.

### Photos

Venue photographs live in `public/photos/` and are referenced by path (`/photos/<name>.jpg`).
Gallery entries can also be managed from the admin panel, which uploads to `server/uploads/`.

---

## Still to replace

- **Street address** — currently just "Kanpur, Uttar Pradesh". Add the full address in
  Admin → Venue Info, and update the map embed in `src/components/Contact/Contact.jsx`.
- **Email** — `bookings@gopaltenthouse.com` is a placeholder.
- **Social links** — all point at `gopaltenthouse` handles that may not exist.
- **Package prices** — starting prices are illustrative.
- **Testimonials and team** — names and quotes are placeholders.

The phone number (`+91 90263 23680`), the city, and the photographs are real.

---

## Data files

JSON on disk, no database:

```
server/data/
  admin.json       # admin username + bcrypt password hash
  content.json     # venue info, packages, services, reviews, team, about, hero
  photos.json      # gallery photos and categories
  enquiries.json   # booking enquiries
  contacts.json    # contact-form messages
  comments.json    # photo comments
```

Back these up before deploying over them — they hold live enquiries.

---

## Production notes

- `npm run build` outputs `dist/` (both `index.html` and `admin.html`).
- The built app calls relative `/api`, so put the API behind the same origin with a reverse
  proxy, or set `VITE_API_URL` at build time for the admin panel.
- Set `JWT_SECRET` in the server environment — it falls back to a hardcoded development
  secret otherwise.
- `admin.html` is marked `noindex`, but it is not otherwise hidden. Restrict it at the
  proxy if you want it off the public internet.
