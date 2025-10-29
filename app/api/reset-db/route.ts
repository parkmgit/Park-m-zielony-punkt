import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Drop all tables in correct order (respecting foreign keys)
    await query('DROP TABLE IF EXISTS photos');
    await query('DROP TABLE IF EXISTS tree_actions');
    await query('DROP TABLE IF EXISTS trees');
    await query('DROP TABLE IF EXISTS sync_queue');
    await query('DROP TABLE IF EXISTS species');
    await query('DROP TABLE IF EXISTS sites');
    await query('DROP TABLE IF EXISTS projects');
    await query('DROP TABLE IF EXISTS users');

    return NextResponse.json({ 
      success: true, 
      message: 'Baza danych została wyczyszczona. Teraz uruchom /api/init aby utworzyć nową bazę.' 
    });
  } catch (error) {
    console.error('Database reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Błąd czyszczenia bazy danych' },
      { status: 500 }
    );
  }
}
