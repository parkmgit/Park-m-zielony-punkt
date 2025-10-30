// Database configuration wrapper
// Automatically uses SQLite for localhost, Neon for production

const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true';

let dbModule: any;

if (isProduction) {
  console.log('🚀 Using Neon PostgreSQL (production)');
  dbModule = require('./db');
} else {
  console.log('💻 Using SQLite (local development)');
  dbModule = require('./db-sqlite');
}

export const query = dbModule.query;
export const queryOne = dbModule.queryOne;
export const initDB = dbModule.initDB;
