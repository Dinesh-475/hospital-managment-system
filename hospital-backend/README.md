# Hospital Management System Backend

Backend API for the Hospital Management System built with Node.js, Express, and PostgreSQL.

## Project Structure

- **src/config**: Database and external service configuration
- **src/controllers**: Route controllers
- **src/middleware**: Express middleware (Auth, Error handling, Validation)
- **src/models**: Sequelize models
- **src/routes**: API route definitions
- **src/services**: Business logic layer
- **src/utils**: Utility functions
- **src/socket**: Socket.io handlers

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` (if exists) or create `.env` based on the template.

3. Run development server:
   ```bash
   npm run dev
   ```

## Valid Scripts

- `npm start`: Run in production
- `npm run dev`: Run in development with nodemon
- `npm test`: Run tests
