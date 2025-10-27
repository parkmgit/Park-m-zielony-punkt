import { NextResponse } from 'next/server';
import { db } from '@/lib/db-sqlite';

export async function POST() {
  try {
    // Add tree_number column to trees table
    try {
      db.exec(`
        ALTER TABLE trees ADD COLUMN tree_number TEXT
      `);
    } catch (e) {
      // Column already exists, ignore
      console.log('tree_number column already exists or error:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Kolumna tree_number została dodana do tabeli trees'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
