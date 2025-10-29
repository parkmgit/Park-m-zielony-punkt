// Legacy file stub - kept for compatibility with old migration scripts
// This file just re-exports from db.ts

export { query, queryOne } from './db';

// Stub default export for compatibility
const db = {
  prepare: () => ({
    run: () => ({ lastInsertRowid: 0, changes: 0 }),
    get: () => null,
    all: () => [],
  }),
  exec: () => {},
};

export default db;
