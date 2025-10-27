// Tymczasowy wrapper dla kompatybilności ze starym kodem SQLite
// TODO: Przepisać wszystkie API routes na natywny Postgres

import { sql } from '@vercel/postgres';

// Symulacja synchronicznego API SQLite dla Postgres
const db = {
  prepare: (query: string) => {
    return {
      get: async (...params: any[]) => {
        // Konwertuj ? na $1, $2, etc.
        let pgQuery = query;
        params.forEach((_, index) => {
          pgQuery = pgQuery.replace('?', `$${index + 1}`);
        });
        
        const result = await sql.query(pgQuery, params);
        return result.rows[0];
      },
      all: async (...params: any[]) => {
        // Konwertuj ? na $1, $2, etc.
        let pgQuery = query;
        params.forEach((_, index) => {
          pgQuery = pgQuery.replace('?', `$${index + 1}`);
        });
        
        const result = await sql.query(pgQuery, params);
        return result.rows;
      },
      run: async (...params: any[]) => {
        // Konwertuj ? na $1, $2, etc.
        let pgQuery = query;
        params.forEach((_, index) => {
          pgQuery = pgQuery.replace('?', `$${index + 1}`);
        });
        
        // Dla INSERT, dodaj RETURNING id
        if (pgQuery.trim().toUpperCase().startsWith('INSERT')) {
          pgQuery += ' RETURNING id';
        }
        
        const result = await sql.query(pgQuery, params);
        return {
          lastInsertRowid: result.rows[0]?.id || 0,
          changes: result.rowCount || 0,
        };
      },
    };
  },
  exec: async (query: string) => {
    await sql.query(query);
  },
};

export default db;
