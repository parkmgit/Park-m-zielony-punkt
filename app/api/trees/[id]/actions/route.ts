import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { CreateTreeActionDTO } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const actions = await sql`
      SELECT 
        ta.*,
        u.name as performer_name
      FROM tree_actions ta
      LEFT JOIN users u ON ta.performed_by = u.id
      WHERE ta.tree_id = ${params.id}
      ORDER BY ta.performed_at DESC
    `;

    return NextResponse.json(actions);
  } catch (error) {
    console.error('Error fetching tree actions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tree actions' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: CreateTreeActionDTO = await request.json();

    const result = await sql`
      INSERT INTO tree_actions (tree_id, action_type, notes, performed_by)
      VALUES (${params.id}, ${body.action_type}, ${body.notes || null}, ${body.performed_by})
      RETURNING id
    `;

    // Update tree's updated_at timestamp
    await sql`UPDATE trees SET updated_at = CURRENT_TIMESTAMP WHERE id = ${params.id}`;

    return NextResponse.json({
      id: result[0].id,
      message: 'Tree action created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tree action:', error);
    return NextResponse.json(
      { error: 'Failed to create tree action' },
      { status: 500 }
    );
  }
}
