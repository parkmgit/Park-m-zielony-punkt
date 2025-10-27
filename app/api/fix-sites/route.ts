import { NextResponse } from 'next/server';
import db from '@/lib/db-legacy';

export async function POST() {
  try {
    // Usuń sites które mają złe project_id (nie pasują do prawdziwego projektu)
    // Zostaw tylko te gdzie project_id zgadza się z projects.id
    
    // 1. Znajdź wszystkie sites
    const sites = db.prepare('SELECT * FROM sites WHERE active = 1').all() as any[];
    
    // 2. Dla każdego site sprawdź czy project_id jest poprawne
    let removed = 0;
    const seenProjects = new Set();
    
    for (const site of sites) {
      if (site.project_id) {
        // Sprawdź czy projekt o tym ID istnieje
        const project = db.prepare('SELECT * FROM projects WHERE id = ? AND active = 1').get(site.project_id);
        
        if (!project) {
          // Projekt nie istnieje - usuń site
          db.prepare('UPDATE sites SET active = 0 WHERE id = ?').run(site.id);
          removed++;
        } else if (seenProjects.has(site.project_id)) {
          // Już mamy site dla tego projektu - usuń duplikat
          db.prepare('UPDATE sites SET active = 0 WHERE id = ?').run(site.id);
          removed++;
        } else {
          seenProjects.add(site.project_id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Naprawiono bazę. Usunięto ${removed} nieprawidłowych sites`,
      removed
    });
  } catch (error) {
    console.error('Fix sites error:', error);
    return NextResponse.json({ 
      error: 'Failed to fix sites', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}
