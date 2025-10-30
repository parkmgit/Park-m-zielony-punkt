import { NextRequest, NextResponse } from 'next/server';
import { register, RegisterData } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body as RegisterData;

    console.log('Register attempt:', { name, email: email?.trim().toLowerCase(), role, passwordLength: password?.length });

    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      );
    }

    const result = await register({ name, email, password, role });

    // Check if registration failed
    if ('error' in result) {
      console.log('Registration failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('Registration successful for:', result.email);

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
