import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get('entity_type');
    const entityId = searchParams.get('entity_id');

    let query = `
      SELECT 
        p.*,
        u.name as taker_name
      FROM photos p
      LEFT JOIN users u ON p.taken_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (entityType) {
      query += ' AND p.entity_type = $' + (params.length + 1);
      params.push(entityType);
    }

    if (entityId) {
      query += ' AND p.entity_id = $' + (params.length + 1);
      params.push(entityId);
    }

    query += ' ORDER BY p.taken_at DESC';

    const photos = await sql.query(query, params);

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityType = formData.get('entity_type') as string;
    const entityId = formData.get('entity_id') as string;
    const takenBy = formData.get('taken_by') as string;

    if (!file || !entityType || !entityId || !takenBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const url = `/uploads/${filename}`;
    const stmt = db.prepare(`
      INSERT INTO photos (entity_type, entity_id, filename, url, taken_by)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(entityType, entityId, filename, url, takenBy);

    return NextResponse.json({
      id: result.lastInsertRowid,
      url,
      message: 'Photo uploaded successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
