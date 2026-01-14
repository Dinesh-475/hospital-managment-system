# Docvista - Hospital Management System

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/hospital-management-system.git
cd hospital-management-system
```

2. **Install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Set up environment variables:**

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and fill in your actual values
```

4. **Set up database:**

```bash
# Create PostgreSQL database
createdb hospital_management

# Run migrations (if using)
npm run migrate
```

5. **Start the application:**

```bash
# Backend (in backend folder)
npm run dev

# Frontend (in frontend folder)
npm start
```

## 🔐 Environment Variables

**IMPORTANT:** Never commit your .env file to Git!

Copy .env.example to .env and fill in your actual values:

- Database credentials
- JWT secrets (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- Email credentials (use Gmail App Password)
- API keys for third-party services

See .env.example for all required variables.

## 📝 License

MIT
