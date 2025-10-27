import { NextResponse } from 'next/server';
import db from '@/lib/db-legacy';

export async function POST() {
  try {
    // Get all projects
    const projects = db.prepare('SELECT * FROM projects').all() as any[];

    let created = 0;
    let skipped = 0;

    for (const project of projects) {
      // Check if site already exists for this project
      const existingSite = db.prepare('SELECT id FROM sites WHERE project_id = ?').get(project.id);
      
      if (!existingSite) {
        // Create site for this project
        db.prepare(`
          INSERT INTO sites (project_id, code, name, address)
          VALUES (?, ?, ?, ?)
        `).run(project.id, project.project_number, project.name, project.location || null);
        created++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migracja zakończona. Utworzono: ${created}, Pominięto: ${skipped}`,
      created,
      skipped
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
