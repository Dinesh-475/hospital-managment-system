import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Optimized connection pool for high performance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool optimizations for e-commerce level performance
  max: 20, // Maximum number of clients in the pool
  min: 5, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection cannot be established
  // Statement timeout
  statement_timeout: 10000, // 10 seconds
  // Query timeout
  query_timeout: 10000,
  // Keep connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Optimize Prisma for performance
// Optimize Prisma for performance
const closePool = async () => {
  await pool.end();
};

process.on('beforeExit', closePool);
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

export default prisma;
