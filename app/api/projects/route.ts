import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        p.*,
        COUNT(DISTINCT s.id) as sites_count,
        COUNT(DISTINCT t.id) as trees_count
      FROM projects p
      LEFT JOIN sites s ON s.project_id = p.id
      LEFT JOIN trees t ON t.site_id = s.id
      WHERE p.active = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_number, name, location, client, trees_to_plant } = body;

    if (!project_number || !name) {
      return NextResponse.json(
        { error: 'Numer projektu i nazwa są wymagane' },
        { status: 400 }
      );
    }

    // Insert project
    await query(
      'INSERT INTO projects (project_number, name, location, client, trees_to_plant) VALUES (?, ?, ?, ?, ?)',
      [project_number, name, location || null, client || null, trees_to_plant || 0]
    );

    // Get the newly created project
    const newProjects = await query<any>('SELECT * FROM projects WHERE project_number = ? ORDER BY id DESC LIMIT 1', [project_number]);
    const projectId = newProjects[0]?.id;

    // Automatically create a site for this project
    await query(
      'INSERT INTO sites (project_id, code, name, address) VALUES (?, ?, ?, ?)',
      [projectId, project_number, name, location || null]
    );

    const project = await queryOne('SELECT * FROM projects WHERE id = ?', [projectId]);

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Projekt o tym numerze już istnieje' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID projektu jest wymagane' }, { status: 400 });
    }

    // Soft delete - set active to 0
    await query('UPDATE projects SET active = 0 WHERE id = ?', [id]);
    await query('UPDATE sites SET active = 0 WHERE project_id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Projekt został usunięty' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, project_number, name, location, client, trees_to_plant } = body;

    if (!id || !project_number || !name) {
      return NextResponse.json(
        { error: 'ID, numer projektu i nazwa są wymagane' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE projects SET project_number = ?, name = ?, location = ?, client = ?, trees_to_plant = ? WHERE id = ?',
      [project_number, name, location || null, client || null, trees_to_plant || 0, id]
    );

    // Update corresponding site
    await query(
      'UPDATE sites SET code = ?, name = ?, address = ? WHERE project_id = ?',
      [project_number, name, location || null, id]
    );

    const project = await queryOne('SELECT * FROM projects WHERE id = ?', [id]);

    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Projekt o tym numerze już istnieje' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
