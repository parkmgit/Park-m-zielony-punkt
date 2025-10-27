import { NextRequest, NextResponse } from 'next/server';
import { register, RegisterData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body as RegisterData;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      );
    }

    const result = await register({ name, email, password, role });

    // Check if registration failed
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Registration successful
    return NextResponse.json({
      success: true,
      user: {
        id: result.id,
        name: result.name,
        role: result.role,
        email: result.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Błąd rejestracji' },
      { status: 500 }
    );
  }
}
