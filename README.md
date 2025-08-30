<<<<<<< HEAD
# 🚀 H2 Infrastructure Platform

Modern full-stack application for hydrogen infrastructure planning and analysis in India. Built with React + TypeScript frontend and Express + MongoDB backend.

## ⚡ Quick Start

**Prerequisites:** Node.js 18+, MongoDB

```bash
# Clone and install
git clone <repo-url>
cd H2
npm install

# Backend setup
cd backend
npm install
echo "MONGODB_URI=mongodb://localhost:27017/h2db" > .env
echo "JWT_SECRET=your-secret-key" >> .env
echo "PORT=4000" >> .env

=======

# 🚀 GH2 Infrastructure Platform

Modern full-stack application for hydrogen infrastructure planning and analysis in India. Built with React + TypeScript frontend and Express + MongoDB backend.

## ⚡ Quick Start

**Prerequisites:** Node.js 18+, MongoDB

```bash
# Clone and install
git clone <repo-url>
cd H2
npm install

# Backend setup
cd backend
npm install
echo "MONGODB_URI=mongodb://localhost:27017/h2db" > .env
echo "JWT_SECRET=your-secret-key" >> .env
echo "PORT=4000" >> .env

>>>>>>> 95e77656ae03c31152ef84238ec3f6879b4536fc
# Start development servers
npm run dev          # Backend (port 4000)
cd .. && npm run dev # Frontend (port 5173)
```

## 📁 Project Structure

```
├── src/              # React frontend (Vite + TypeScript)
├── backend/          # Express API server
│   ├── src/          # TypeScript source
│   ├── routes/       # API endpoints  
│   ├── models/       # MongoDB schemas
│   └── controllers/  # Business logic
├── frontend/         # Edge functions (optional)
└── public/           # Static assets
```

## 🔑 Environment Variables

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/h2db
JWT_SECRET=your-secure-secret-key
PORT=4000
NODE_ENV=development
```

## 📡 API Endpoints

| Feature | Endpoint | Description |
|---------|----------|-------------|
| **Auth** | `POST /api/auth/signin` | Login with email/password |
| | `POST /api/auth/signup` | Create new account |
| | `GET /api/auth/me` | Get current user |
| **Assets** | `GET /api/assets` | List hydrogen assets |
| | `POST /api/assets` | Create new asset |
| **Sites** | `GET /api/renewables/sites` | Renewable energy sites |
| | `GET /api/renewables/stats` | Site statistics |
| **Transport** | `GET /api/transport/infra` | Transport network data |
| **Scenarios** | `GET /api/scenarios/user` | User scenario plans |

## 🛠️ Development

```bash
# Backend development
cd backend
npm run dev          # Auto-reload server
npm run build        # Compile TypeScript
npm start            # Run production build

# Frontend development  
npm run dev          # Vite dev server
npm run build        # Production build
```

## 📊 Features

- **Asset Management** - Track hydrogen production facilities
- **Site Analysis** - Renewable energy potential mapping  
- **Transport Planning** - Logistics network optimization
- **Scenario Modeling** - Infrastructure planning scenarios
- **Policy Analysis** - Regulatory impact assessment
- **Interactive Maps** - Geospatial data visualization

## 🔧 Troubleshooting

- **MongoDB connection**: Verify `MONGODB_URI` and ensure MongoDB is running
- **Port conflicts**: Change `PORT` in `.env` if 4000 is occupied
- **Auth issues**: Ensure `JWT_SECRET` is set and consistent

## 🚀 Deployment

1. Set production environment variables
2. Build both frontend and backend: `npm run build`
3. Deploy backend to your server (PM2, Docker, etc.)
4. Deploy frontend to CDN/static hosting (Vercel, Netlify, etc.)

---

<<<<<<< HEAD
**Tech Stack:** React, TypeScript, Express, MongoDB, JWT, Vite
=======
**Tech Stack:** React, TypeScript, Express, MongoDB, JWT, Vite
>>>>>>> 95e77656ae03c31152ef84238ec3f6879b4536fc
