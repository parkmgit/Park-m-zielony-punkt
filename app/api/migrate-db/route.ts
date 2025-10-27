import { NextResponse } from 'next/server';
import db from '@/lib/db-legacy';

export async function POST() {
  try {
    // Add projects table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_number TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        location TEXT,
        client TEXT,
        trees_to_plant INTEGER DEFAULT 0,
        trees_planted INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Update sites table to add project_id if it doesn't exist
    try {
      db.exec(`
        ALTER TABLE sites ADD COLUMN project_id INTEGER REFERENCES projects(id)
      `);
    } catch (e) {
      // Column already exists, ignore
      console.log('project_id column already exists');
    }

    return NextResponse.json({
      success: true,
      message: 'Migracja zakończona pomyślnie! Możesz teraz dodawać projekty.'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
