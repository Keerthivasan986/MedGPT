# MedGPT — Get Pills Timely

Real-time pharmacy medicine stock aggregator (MERN).

> Patients waste time visiting multiple pharmacies for essential medicines because there is no
> real-time stock visibility. MedGPT aggregates live inventory from local pharmacies so patients can
> search, locate and reserve medicine instantly, while pharmacies keep their stock accurate.

## Features

- **Live search** — medicine / brand / composition search across nearby pharmacies, ranked by distance.
- **Geo aware** — MongoDB `2dsphere` + `$nearSphere` with a configurable radius; Haversine distance shown per result.
- **Smart sorting** — sort results by distance, price, or stock availability.
- **Pharmacy status** — real-time open/closed status with "closes in X mins" warning badge.
- **Alerts & warnings** — low stock, near-expiry, and closing time warnings to guide purchasing decisions.
- **Generic alternatives** — find cheaper generic substitutes with the same active composition.
- **Freshness indicator** — "updated X mins ago" shows how current the stock data is.
- **Enhanced reservations** — improved modal dialog with quantity selector, pickup code countdown (4-hour validity).
- **Pharmacy directions** — quick-access phone call and Google Maps directions for each pharmacy.
- **Reservations** — patients reserve units and get a pickup code valid 4 hours; reserved units are held, never oversold.
- **Pharmacist dashboard** — add/update stock lines, quick ±1 adjust, see on-hand vs reserved vs available.
- **Real time** — Socket.IO `stock:updated` pushes every stock change to open search pages instantly.
- **Auth & roles** — JWT with `patient` and `pharmacist` roles.

## Tech stack

| Layer | Tech |
| ----- | ---- |
| Frontend | React 19, Vite, React Router, Axios, Socket.IO client |
| Backend | Node.js, Express 5, Mongoose, Socket.IO, JWT, bcryptjs, express-validator |
| Database | MongoDB Atlas |

## Structure

```
MedGPT/
├── Backend/        # Express API (config, controllers, services, models, routes, sockets)
│   ├── scripts/    # seed + clear CLI tasks
│   ├── seeds/      # demo data
│   └── src/
└── Frontend/       # React client (api, components, context, hooks, pages, routes, styles)
    └── src/
```

Each folder has its own README with the detailed layout.

## Getting started

**1. Database** — create a free MongoDB Atlas cluster, add a database user, allow your IP
(`0.0.0.0/0` for a demo), and copy the connection string ending in `/medgpt`.

**2. Backend**

```bash
cd Backend
cp .env.example .env      # paste MONGO_URI + a JWT_SECRET
npm install
npm run seed              # demo pharmacies, medicines, stock, users (wipes the db)
npm run dev               # http://localhost:4000
```

**3. Frontend** (second terminal)

```bash
cd Frontend
cp .env.example .env      # VITE_API_URL=http://localhost:4000
npm install
npm run dev               # http://localhost:5173
```

Or run both with Docker: `docker compose up --build`.

## Deploy on Render

The repository includes a Render Blueprint (`render.yaml`) for the API and static frontend. To
deploy, sign in to Render with GitHub, create a Blueprint from
`Keerthivasan986/MedGPT`, and provide `MONGO_URI` when prompted. Use the Atlas connection string
for the `medgpt` database; keep it private. The Blueprint generates `JWT_SECRET` and configures
the frontend/API URLs and SPA routing automatically. Atlas Network Access must allow connections
from Render; for a demo, `0.0.0.0/0` works, while production should use restricted network access.

After both services are healthy, open the `medgpt-web` URL and sign in with either demo account
below. The seeded database already contains these users. If deploying to a new, empty database,
seed it once from the API service shell with `npm run seed`; this clears existing collections, so
never run it against a database containing data you need to keep. Render redeploys automatically
when changes are pushed to the connected GitHub branch.

## Demo accounts

| Role | Email | Password |
| ---- | ----- | -------- |
| Patient | patient@medgpt.dev | password123 |
| Pharmacist (Apollo T. Nagar) | pharmacist@medgpt.dev | password123 |

## Demo script

1. Search `paracetamol` — nearby pharmacies appear with price, distance and live stock.
2. Sign in as the patient and reserve 2 units — a pickup code is issued.
3. Sign in as the pharmacist in another browser — the reservation is listed; change stock and watch
   the patient's search page update without a refresh.
4. Mark the reservation collected — on-hand stock drops by the reserved quantity.

## API and socket reference

See [Backend/README.md](Backend/README.md).
