# Docvista Hospital Management System

Modern, full-stack Hospital Management System with React frontend and Node.js backend.

## 🚀 Quick Start

### Frontend

```bash
cd google-auth-demo/frontend
npm install
npm run dev
```

Access at: http://localhost:3000

### Backend

```bash
cd google-auth-demo/backend
npm install
npm run dev
```

API at: http://localhost:5001

## 📁 Project Structure

```
google-auth-demo/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── layouts/      # Layout wrappers
│   │   ├── context/      # React Context
│   │   ├── data/         # Mock data
│   │   └── App.jsx       # Main app
│   └── package.json
│
└── backend/           # Node.js + Express + SQLite
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   └── database.js
    └── package.json

hospital-backend/      # PostgreSQL backend (production)
    └── src/
        ├── controllers/
        ├── routes/
        ├── services/
        └── config/
```

## 🎯 Features

- ✅ Email/Password Authentication
- ✅ Patient Dashboard with Health Metrics
- ✅ Appointment Booking System
- ✅ Medical Records Management
- ✅ Real-time Notifications
- ✅ Responsive Design (Mobile/Tablet/Desktop)

## 🔧 Tech Stack

**Frontend:**

- React 19
- Vite 7
- Tailwind CSS v4
- Framer Motion
- React Router v7
- Lucide Icons

**Backend:**

- Node.js + Express
- SQLite (dev) / PostgreSQL (prod)
- JWT Authentication
- bcrypt Password Hashing

## 📝 Default Credentials

Email: `any@email.com`  
Password: `password` (min 6 chars)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Build Optimizations

- Code splitting for React and UI libraries
- Tree shaking for unused code
- Minification with Terser
- Console removal in production
- Optimized chunk sizes
