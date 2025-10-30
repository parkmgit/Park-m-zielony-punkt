import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-config';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Nie zalogowano' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Błąd pobierania danych użytkownika' },
      { status: 500 }
    );
  }
}
