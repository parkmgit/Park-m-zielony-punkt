import { NextResponse } from 'next/server';
import db from '@/lib/db-legacy';

export async function POST() {
  try {
    // Oznacz jako nieaktywne wszystkie sites które nie mają project_id (stare BUD-00X)
    const result = db.prepare(`
      UPDATE sites SET active = 0 WHERE project_id IS NULL
    `).run();

    return NextResponse.json({
      success: true,
      message: `Dezaktywowano ${result.changes} starych sites bez projektu`,
      deactivated: result.changes
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      error: 'Cleanup failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
