# MedGPT — Quick Start Guide

Complete implementation of all planned features from Devin AI session. The project is now ready for deployment.

---

## 🎯 What's New

This is the completed version of MedGPT with the following advanced features:

1. ✅ **Smart Sorting** - Sort by distance, price, or stock availability
2. ✅ **Pharmacy Status** - Real-time open/closed with "closes in X mins" warnings
3. ✅ **Alert Badges** - Low stock, near expiry, and closing alerts
4. ✅ **Freshness Indicator** - "Updated X mins ago" on results
5. ✅ **Generic Alternatives** - Find cheaper generic substitutes
6. ✅ **Enhanced Pharmacy Info** - Quick call and directions links
7. ✅ **Improved Reservations** - Professional modal dialog with countdown
8. ✅ **Better UX** - Clean UI, responsive design, professional styling

---

## 🚀 Installation & Running

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB Atlas** account (free tier works)
- **Docker** (optional, for containerized run)

### Step 1: Database Setup

1. Create a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
2. Create a database user and get connection string
3. Whitelist your IP (or use 0.0.0.0/0 for dev)
4. Copy the connection string: `mongodb+srv://user:pass@cluster.mongodb.net/medgpt?retryWrites=true&w=majority`

### Step 2: Backend Setup

```bash
cd Backend

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medgpt
# JWT_SECRET=your-secret-key-here (any random string)

# Install dependencies
npm install

# Seed database with demo data (wipes existing data)
npm run seed

# Start development server
npm run dev
# Server runs on http://localhost:4000
```

### Step 3: Frontend Setup (new terminal)

```bash
cd Frontend

# Create environment file
cp .env.example .env

# Should contain: VITE_API_URL=http://localhost:4000

# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### Step 4: Visit the App

Open browser and go to: **http://localhost:5173**

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👤 Patient | patient@medgpt.dev | password123 |
| 🏥 Pharmacist | pharmacist@medgpt.dev | password123 |

---

## 📋 Demo Walkthrough

### 1. Search as Patient
- Go to search page (already open)
- Search for "Cetirizine"
- Notice:
  - Results sorted by distance
  - Pharmacy hours displayed
  - "Updated X mins ago" freshness
  - Google Maps & call buttons

### 2. Test Sorting
- Use the "Sort by" dropdown (top right)
- Try "Price (cheapest first)"
- Watch results reorder

### 3. Check Warnings
- Look for badges:
  - 🟡 "Low stock" (< 5 units)
  - 🔴 "Near expiry" (< 30 days)
  - 🔴 "Closes in 45m" (if near closing time)

### 4. Reserve Medicine (as Patient)
- Sign in as patient@medgpt.dev
- Search for any medicine
- Click "Reserve"
- Modal dialog appears with quantity selector
- Adjust quantity and confirm
- You get a pickup code valid 4 hours

### 5. View Alternatives
- On any search result, click "▶ See alternatives"
- Shows generic/cheaper alternatives (if available)

### 6. Check Real-time Updates (as Pharmacist)
- Open the app in 2 browser tabs
- Tab 1: Sign in as pharmacist, go to Dashboard
- Tab 2: Sign in as patient, search for a medicine
- In Tab 1: Update inventory (add/remove stock)
- Tab 2: Watch results update in real-time (no refresh needed)

---

## 🐳 Running with Docker

```bash
# From project root
docker compose up --build

# Then visit http://localhost:3000 for frontend
# Backend API at http://localhost:4000
```

---

## 📊 Features Checklist

- [x] Live medicine search by name/brand/composition
- [x] Geolocation-based nearby pharmacy search
- [x] Multiple sort options (distance, price, stock)
- [x] Pharmacy status & operating hours
- [x] Closing time warnings
- [x] Low stock warnings
- [x] Near-expiry warnings
- [x] Data freshness indicator
- [x] Generic alternatives suggestion
- [x] Quick call button
- [x] Google Maps directions
- [x] Professional reservation modal
- [x] Pickup code with time validity
- [x] Real-time socket updates
- [x] Patient & Pharmacist roles
- [x] Responsive design
- [x] Professional styling

---

## 📁 Project Structure

```
MedGPT/
├── Backend/
│   ├── src/
│   │   ├── models/          # Medicine, Pharmacy, Inventory, User, Reservation
│   │   ├── controllers/     # search, auth, medicine, etc.
│   │   ├── services/        # search service (with sorting & alternatives)
│   │   ├── routes/          # all API routes
│   │   ├── middleware/      # auth, validation, error handling
│   │   ├── sockets/         # real-time stock updates
│   │   ├── utils/           # helpers, geo calculations
│   │   └── config/          # database, JWT, Socket.IO setup
│   ├── seeds/               # demo data with generics setup
│   └── scripts/             # seed & clear commands
│
├── Frontend/
│   ├── src/
│   │   ├── pages/           # SearchPage, DashboardPage, etc.
│   │   ├── components/      # ResultCard (enhanced), SearchBar, etc.
│   │   ├── api/             # search.api (with sorting & substitutes)
│   │   ├── hooks/           # useAuth, useGeolocation, useStockSocket
│   │   ├── context/         # AuthProvider
│   │   ├── utils/           # format utilities (with time functions)
│   │   └── styles/          # App.css (with new component styles)
│   └── public/              # static assets
│
├── FEATURES_COMPLETED.md    # Detailed feature documentation
├── README.md                # Updated project README
└── docker-compose.yml       # Docker setup

```

---

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/medgpt
JWT_SECRET=your-secret-key-min-32-chars-recommended
PORT=4000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
```

---

## 📱 Key Endpoints

### Search
- `GET /search?q=paracetamol&lat=13.0356&lng=80.1895&sortBy=distance`
- `GET /search/substitutes/:medicineId` - Generic alternatives
- `GET /search/cheapest/:medicineId/:pharmacyId` - Cheapest nearby option

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Inventory (Pharmacist)
- `POST /inventory` - Add stock
- `PUT /inventory/:id` - Update stock
- `GET /inventory` - List inventory

### Reservations
- `POST /reservations` - Create reservation
- `PUT /reservations/:id` - Update status
- `GET /reservations` - List reservations

See [Backend/README.md](Backend/README.md) for complete API reference.

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check MongoDB Atlas cluster is running
- Verify connection string in .env
- Ensure IP whitelist includes your current IP

### "npm run seed fails"
- Clear MongoDB: `npm run clear` then `npm run seed`
- Check database user has write permissions
- Verify .env MONGO_URI is correct

### Frontend shows blank page
- Check browser console for errors
- Verify VITE_API_URL in .env points to backend
- Ensure backend is running on port 4000

### Real-time updates not working
- Check Socket.IO connection in browser DevTools
- Verify backend Socket.IO middleware is configured
- Check WebSocket URL matches VITE_API_URL

---

## 🚢 Deployment

### Heroku / Railway / Render
1. Push code to Git
2. Set environment variables in platform settings
3. Ensure `npm run start` works locally
4. Add build scripts: `npm run build` (if needed)

### AWS / GCP / Azure
- Containerize with Docker (use docker-compose.yml as reference)
- Push image to container registry
- Deploy with load balancer
- Set up MongoDB Atlas connection

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console (Frontend) or terminal (Backend)
2. Review MongoDB connection and permissions
3. Verify all environment variables are set correctly
4. Check that ports 4000 (backend) and 5173 (frontend) are available

---

## 📄 License

MIT

---

**Version:** 2.0 - Feature Complete
**Last Updated:** 2025
**Status:** ✅ Ready for Production
