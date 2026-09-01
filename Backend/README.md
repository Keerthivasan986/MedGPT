# MedGPT - Backend

Express + MongoDB (Mongoose) + Socket.IO API for MedGPT.

## Layout

```
Backend/
├── scripts/            # one-off CLI tasks (seed, clear)
├── seeds/              # demo data + seeding logic
│   └── data/           # pharmacies, medicines, demo users
└── src/
    ├── config/         # env, database, socket bootstrap
    ├── controllers/    # HTTP layer (request -> service -> response)
    ├── services/       # business logic
    ├── models/         # Mongoose schemas
    ├── routes/         # route tables mounted under /api
    ├── middleware/     # auth, validation, logging, errors
    ├── validators/     # express-validator rule sets
    ├── sockets/        # Socket.IO events and handlers
    ├── utils/          # geo maths, tokens, errors, logger
    ├── app.js          # express app factory
    └── server.js       # entry point
```

## Run

```bash
cp .env.example .env    # then fill MONGO_URI + JWT_SECRET
npm install
npm run seed            # loads demo pharmacies/medicines/users (wipes the db)
npm run dev             # http://localhost:4000
```

## API

| Method | Route | Access | Purpose |
| ------ | ----- | ------ | ------- |
| GET | `/api/health` | public | service + db status |
| POST | `/api/auth/register` | public | create patient/pharmacist |
| POST | `/api/auth/login` | public | issue JWT |
| GET | `/api/auth/me` | auth | current user |
| GET | `/api/search?q=&lat=&lng=&radiusKm=` | public | nearby live stock |
| GET | `/api/pharmacies` | public | list / nearby pharmacies |
| GET | `/api/pharmacies/:id` | public | pharmacy detail |
| GET | `/api/pharmacies/:id/inventory` | public | pharmacy stock |
| GET | `/api/medicines` | public | medicine catalogue |
| POST | `/api/medicines` | pharmacist | add medicine |
| GET | `/api/inventory/mine` | pharmacist | own stock |
| PUT | `/api/inventory` | pharmacist | create/update stock line |
| DELETE | `/api/inventory/:id` | pharmacist | remove stock line |
| GET | `/api/reservations/mine` | auth | reservations |
| POST | `/api/reservations` | patient | reserve + pickup code |
| PATCH | `/api/reservations/:id/status` | auth | collected / cancelled |

## Real time

Socket.IO broadcasts `stock:updated` `{ pharmacyId, medicineId, available, price }` whenever stock
changes. Clients may also `pharmacy:subscribe` to a single pharmacy room.
