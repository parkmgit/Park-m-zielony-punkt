// Legacy file - now just re-exports from db.ts
// This file is kept for compatibility with old migration scripts
import { query, queryOne } from './db';

export { query, queryOne };

// Stub default export for compatibility with migration scripts
const db = {
  prepare: () => ({
    run: () => ({ lastInsertRowid: 0, changes: 0 }),
    get: () => null,
    all: () => [],
  }),
  exec: () => {},
};

export default db;
