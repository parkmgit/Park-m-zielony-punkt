import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get('entity_type');
    const entityId = searchParams.get('entity_id');

    let sqlQuery = `
      SELECT 
        p.*,
        u.name as taker_name
      FROM photos p
      LEFT JOIN users u ON p.taken_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (entityType) {
      sqlQuery += ' AND p.entity_type = ?';
      params.push(entityType);
    }

    if (entityId) {
      sqlQuery += ' AND p.entity_id = ?';
      params.push(entityId);
    }

    sqlQuery += ' ORDER BY p.taken_at DESC';

    const photos = await query(sqlQuery, params);

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

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'park-m-trees',
      resource_type: 'auto',
    });

    const url = uploadResult.secure_url;
    const filename = uploadResult.public_id;

    // Save to database
    await query(
      'INSERT INTO photos (entity_type, entity_id, filename, url, taken_by) VALUES (?, ?, ?, ?, ?)',
      [entityType, entityId, filename, url, takenBy]
    );

    return NextResponse.json({
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
