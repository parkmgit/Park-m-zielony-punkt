import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CreateTreeActionDTO } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const actions = await query(`
      SELECT 
        ta.*,
        u.name as performer_name
      FROM tree_actions ta
      LEFT JOIN users u ON ta.performed_by = u.id
      WHERE ta.tree_id = ?
      ORDER BY ta.performed_at DESC
    `, [params.id]);

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

    await query(
      'INSERT INTO tree_actions (tree_id, action_type, notes, performed_by) VALUES (?, ?, ?, ?)',
      [params.id, body.action_type, body.notes || null, body.performed_by]
    );

    // Get the newly created action
    const newAction = await query(
      'SELECT * FROM tree_actions WHERE tree_id = ? ORDER BY id DESC LIMIT 1',
      [params.id]
    );

    // Update tree's updated_at timestamp
    await query('UPDATE trees SET updated_at = NOW() WHERE id = ?', [params.id]);

    return NextResponse.json({
      id: newAction[0].id,
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
