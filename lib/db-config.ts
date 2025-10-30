// Database configuration - automatically selects SQLite for local dev, Neon for production
const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true';

// Lazy load the appropriate database module
let dbModule: any = null;

function getDb() {
  if (!dbModule) {
    if (isProduction) {
      console.log('🚀 Using Neon PostgreSQL (production)');
      dbModule = require('./db');
    } else {
      console.log('💻 Using SQLite (local development)');
      dbModule = require('./db-sqlite');
    }
  }
  return dbModule;
}

// Export wrapper functions
export async function query<T = any>(sqlQuery: string, params?: any[]): Promise<T[]> {
  return getDb().query(sqlQuery, params);
}

export async function queryOne<T = any>(sqlQuery: string, params?: any[]): Promise<T | null> {
  return getDb().queryOne(sqlQuery, params);
}

export async function initDB() {
  return getDb().initDB();
}
