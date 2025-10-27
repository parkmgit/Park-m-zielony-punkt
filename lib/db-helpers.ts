import { sql } from '@vercel/postgres';

// Helper functions for Vercel Postgres to make migration easier

export async function query<T = any>(sqlQuery: string, params: any[] = []): Promise<T[]> {
  try {
    // Convert ? placeholders to $1, $2, etc. for Postgres
    let paramIndex = 1;
    const postgresQuery = sqlQuery.replace(/\?/g, () => `$${paramIndex++}`);
    
    const result = await sql.query(postgresQuery, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export async function queryOne<T = any>(sqlQuery: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sqlQuery, params);
  return results.length > 0 ? results[0] : null;
}

export async function execute(sqlQuery: string, params: any[] = []): Promise<{ rowCount: number; lastInsertId?: number }> {
  try {
    // Convert ? placeholders to $1, $2, etc. for Postgres
    let paramIndex = 1;
    const postgresQuery = sqlQuery.replace(/\?/g, () => `$${paramIndex++}`);
    
    const result = await sql.query(postgresQuery, params);
    
    return {
      rowCount: result.rowCount || 0,
      lastInsertId: result.rows[0]?.id
    };
  } catch (error) {
    console.error('Execute error:', error);
    throw error;
  }
}

// Export sql for direct use
export { sql };
