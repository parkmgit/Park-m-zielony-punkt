import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt:', { email: email?.trim().toLowerCase() });

    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      );
    }

    const result = await login(email, password);

    // Check if login failed
    if ('error' in result) {
      console.log('Login failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    console.log('Login successful for:', result.email);

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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Błąd logowania' },
      { status: 500 }
    );
  }
}
