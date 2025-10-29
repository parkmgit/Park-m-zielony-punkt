import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import { query, queryOne } from './db';

export interface User {
  id: number;
  name: string;
  role: 'admin' | 'brygadzista' | 'pracownik';
  email: string | null;
  active: number;
  password_hash?: string;
}

const SESSION_COOKIE_NAME = 'park-m-session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function login(email: string, password: string): Promise<User | { error: string }> {
  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    const user = await queryOne<User>('SELECT * FROM users WHERE email = ? AND active = 1', [normalizedEmail]);
    
    if (!user) {
      return { error: 'Nieprawidłowy email lub hasło' };
    }

    // Check if user has password set
    if (!user.password_hash) {
      return { error: 'Konto nie ma ustawionego hasła. Skontaktuj się z administratorem.' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { error: 'Nieprawidłowy email lub hasło' };
    }

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      expiresAt: Date.now() + SESSION_DURATION
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/'
    });

    // Remove password_hash from returned user
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Błąd logowania' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    
    if (!sessionCookie?.value) {
      return null;
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session expired
    if (sessionData.expiresAt < Date.now()) {
      await logout();
      return null;
    }

    const user = await queryOne<User>('SELECT * FROM users WHERE id = ? AND active = 1', [sessionData.userId]);
    
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'brygadzista' | 'pracownik';
}

export async function register(data: RegisterData): Promise<User | { error: string }> {
  try {
    // Normalize inputs
    const normalizedEmail = data.email.trim().toLowerCase();
    const normalizedName = data.name.trim();
    
    // Validate email domain
    if (!normalizedEmail.endsWith('@park-m.pl')) {
      return { error: 'Email musi kończyć się na @park-m.pl' };
    }

    // Check if email already exists
    const existingUser = await queryOne('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (existingUser) {
      return { error: 'Użytkownik z tym adresem email już istnieje' };
    }

    // Validate name
    if (!normalizedName || normalizedName.length < 3) {
      return { error: 'Imię i nazwisko musi mieć minimum 3 znaki' };
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
      return { error: 'Hasło musi mieć minimum 6 znaków' };
    }

    // Validate role
    if (!['admin', 'brygadzista', 'pracownik'].includes(data.role)) {
      return { error: 'Nieprawidłowa rola użytkownika' };
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(data.password, saltRounds);

    // Insert new user
    await query(
      'INSERT INTO users (name, role, email, password_hash, active) VALUES (?, ?, ?, ?, 1)',
      [normalizedName, data.role, normalizedEmail, password_hash]
    );

    // Get the newly created user
    const newUser = await queryOne<User>('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    
    if (!newUser) {
      return { error: 'Błąd podczas tworzenia użytkownika' };
    }

    // Automatically log in the new user
    const sessionData = {
      userId: newUser.id,
      email: newUser.email,
      expiresAt: Date.now() + SESSION_DURATION
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/'
    });

    // Remove password_hash from returned user
    const { password_hash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Błąd podczas rejestracji' };
  }
}
