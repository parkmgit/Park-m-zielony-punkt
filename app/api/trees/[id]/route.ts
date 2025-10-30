import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db-config';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tree = await queryOne(`
      SELECT 
        t.*,
        sp.name as species_name,
        s.name as site_name,
        s.code as site_code,
        w.name as worker_name,
        c.name as creator_name
      FROM trees t
      LEFT JOIN species sp ON t.species_id = sp.id
      LEFT JOIN sites s ON t.site_id = s.id
      LEFT JOIN users w ON t.worker_id = w.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = ?
    `, [params.id]);

    if (!tree) {
      return NextResponse.json(
        { error: 'Tree not found' },
        { status: 404 }
      );
    }

    // Convert latitude/longitude from string to number (PostgreSQL DECIMAL returns string)
    const treeWithNumbers = {
      ...tree,
      latitude: parseFloat(tree.latitude),
      longitude: parseFloat(tree.longitude),
      accuracy: tree.accuracy ? parseFloat(tree.accuracy) : null
    };

    return NextResponse.json(treeWithNumbers);
  } catch (error) {
    console.error('Error fetching tree:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tree' },
      { status: 500 }
    );
  }
}
