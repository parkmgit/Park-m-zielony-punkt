import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Drop all tables in correct order (respecting foreign keys)
    await sql`DROP TABLE IF EXISTS photos CASCADE`;
    await sql`DROP TABLE IF EXISTS tree_actions CASCADE`;
    await sql`DROP TABLE IF EXISTS trees CASCADE`;
    await sql`DROP TABLE IF EXISTS sync_queue CASCADE`;
    await sql`DROP TABLE IF EXISTS species CASCADE`;
    await sql`DROP TABLE IF EXISTS sites CASCADE`;
    await sql`DROP TABLE IF EXISTS projects CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    return NextResponse.json({ 
      success: true, 
      message: 'Baza danych została wyczyszczona. Teraz uruchom /api/init-db aby utworzyć nową bazę.' 
    });
  } catch (error) {
    console.error('Database reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd czyszczenia bazy danych' },
      { status: 500 }
    );
  }
}
