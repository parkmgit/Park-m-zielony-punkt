import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    let users = [];
    let projects = [];
    let sites = [];
    let species = [];

    try {
      users = await sql`SELECT * FROM users WHERE active = 1 ORDER BY name`;
    } catch (e) {
      console.error('Error loading users:', e);
    }

    try {
      projects = await sql`SELECT * FROM projects WHERE active = 1 ORDER BY name`;
    } catch (e) {
      console.error('Error loading projects:', e);
    }

    try {
      sites = await sql`
        SELECT s.*, p.name as project_name, p.project_number 
        FROM sites s
        LEFT JOIN projects p ON s.project_id = p.id
        WHERE s.active = 1 
        ORDER BY s.code
      `;
    } catch (e) {
      console.error('Error loading sites:', e);
    }

    try {
      species = await sql`SELECT * FROM species WHERE active = 1 ORDER BY name`;
    } catch (e) {
      console.error('Error loading species:', e);
    }

    return NextResponse.json({
      users,
      projects,
      sites,
      species,
      statuses: ['posadzone', 'podlewanie', 'utrzymanie', 'wymiana', 'usuniete'],
      actionTypes: ['posadzenie', 'podlewanie', 'przyciecie', 'inspekcja', 'wymiana', 'usuniecie']
    });
  } catch (error) {
    console.error('Error fetching lookups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lookups', details: (error as Error).message },
      { status: 500 }
    );
  }
}
