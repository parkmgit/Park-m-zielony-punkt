// This file is for SQLite migrations only (local development)
// Production uses Neon DB with schema defined in lib/db.ts

import { db } from './db-sqlite';

export function runMigrations() {
  // Check if tree_number column exists
  try {
    const tableInfo = db.prepare("PRAGMA table_info(trees)").all() as any[];
    const hasTreeNumber = tableInfo.some((col: any) => col.name === 'tree_number');
    
    if (!hasTreeNumber) {
      console.log('Adding tree_number column to trees table...');
      db.exec('ALTER TABLE trees ADD COLUMN tree_number TEXT');
      console.log('Migration completed: tree_number column added');
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
}
