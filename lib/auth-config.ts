// Auth configuration wrapper
// Automatically uses SQLite for localhost, Neon for production

const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true';

let authModule: any;

if (isProduction) {
  console.log('🚀 Using Neon auth (production)');
  authModule = require('./auth');
} else {
  console.log('💻 Using SQLite auth (local development)');
  authModule = require('./auth-sqlite');
}

export const login = authModule.login;
export const register = authModule.register;
export const logout = authModule.logout;
export const getCurrentUser = authModule.getCurrentUser;
export type { RegisterData } from './auth';
