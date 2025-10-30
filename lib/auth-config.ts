// Auth configuration - automatically selects SQLite for local dev, Neon for production
const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true';

// Lazy load the appropriate auth module
let authModule: any = null;

function getAuth() {
  if (!authModule) {
    if (isProduction) {
      console.log('🚀 Using Neon auth (production)');
      authModule = require('./auth');
    } else {
      console.log('💻 Using SQLite auth (local development)');
      authModule = require('./auth-sqlite');
    }
  }
  return authModule;
}

// Export wrapper functions
export async function login(email: string, password: string) {
  return getAuth().login(email, password);
}

export async function register(data: any) {
  return getAuth().register(data);
}

export async function logout() {
  return getAuth().logout();
}

export async function getCurrentUser() {
  return getAuth().getCurrentUser();
}

export type { User, RegisterData } from './auth';
