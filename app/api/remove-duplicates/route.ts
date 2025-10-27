import { NextResponse } from 'next/server';
import db from '@/lib/db-legacy';

export async function POST() {
  try {
    // Znajdź wszystkie projekty
    const projects = db.prepare('SELECT id FROM projects WHERE active = 1').all() as any[];

    let removed = 0;

    for (const project of projects) {
      // Znajdź wszystkie sites dla tego projektu
      const sites = db.prepare('SELECT id FROM sites WHERE project_id = ? AND active = 1 ORDER BY id').all(project.id) as any[];
      
      if (sites.length > 1) {
        // Zostaw pierwszy, usuń resztę
        const toRemove = sites.slice(1).map(s => s.id);
        
        for (const siteId of toRemove) {
          db.prepare('UPDATE sites SET active = 0 WHERE id = ?').run(siteId);
          removed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Usunięto ${removed} duplikatów`,
      removed
    });
  } catch (error) {
    console.error('Remove duplicates error:', error);
    return NextResponse.json({ 
      error: 'Failed to remove duplicates', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
