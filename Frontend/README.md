# MedGPT - Frontend

React (Vite) client for MedGPT.

## Layout

```
Frontend/
└── src/
    ├── api/          # axios instance + one module per API resource
    ├── components/   # reusable UI (Navbar, SearchBar, ResultCard, tables…)
    ├── context/      # AuthContext + AuthProvider
    ├── hooks/        # useAuth, useGeolocation, useStockSocket
    ├── pages/        # Search, Login, Register, Reservations, Dashboard, NotFound
    ├── routes/       # route table + protected routes
    ├── styles/       # global and app styles
    ├── utils/        # constants and formatters
    ├── App.jsx
    └── main.jsx
```

## Run

```bash
cp .env.example .env      # VITE_API_URL=http://localhost:4000
npm install
npm run dev               # http://localhost:5173
```

Start the backend first (`cd ../Backend && npm run dev`), otherwise searches fail.
