# 🔐 Klasyczne Logowanie Email + Hasło

## ✨ Co się zmieniło?

System logowania został zmieniony z **wyboru użytkownika z listy** na **klasyczne logowanie email + hasło**.

---

## 🚀 Instalacja

### Krok 1: Zainstaluj zależności
```bash
npm install
```

To zainstaluje `bcrypt` i `@types/bcrypt` do hashowania haseł.

### Krok 2: Uruchom aplikację
```bash
npm run dev
```

### Krok 3: Migracja bazy danych
Przy pierwszym uruchomieniu aplikacja automatycznie:
- Doda kolumnę `password_hash` do tabeli `users`
- Istniejący użytkownicy **nie będą mieli** ustawionych haseł

---

## 🔑 Jak to działa?

### Logowanie (`/login`)
1. Użytkownik wpisuje **email** i **hasło**
2. System sprawdza czy email istnieje w bazie
3. System weryfikuje hasło używając `bcrypt.compare()`
4. Jeśli poprawne - tworzy sesję i loguje użytkownika
5. Jeśli niepoprawne - wyświetla błąd

### Rejestracja (`/register`)
1. Użytkownik wypełnia formularz:
   - Imię i nazwisko
   - Email (@park-m.pl)
   - **Hasło** (minimum 6 znaków)
   - Stanowisko
2. System hashuje hasło używając `bcrypt.hash()` (10 salt rounds)
3. Zapisuje użytkownika z zahashowanym hasłem
4. Automatycznie loguje użytkownika

---

## 🔒 Bezpieczeństwo

### Hashowanie haseł
- Używamy **bcrypt** z 10 salt rounds
- Hasła **NIGDY** nie są przechowywane w czystej postaci
- Tylko hash jest zapisywany w bazie danych

### Walidacja
- **Email**: musi kończyć się na `@park-m.pl`
- **Hasło**: minimum 6 znaków
- **Imię**: minimum 3 znaki

### Komunikaty błędów
- "Nieprawidłowy email lub hasło" - nie ujawniamy czy email istnieje
- Bezpieczne komunikaty nie pomagają atakującym

---

## 📝 Zmiany w kodzie

### 1. `package.json`
```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "@types/bcrypt": "^5.0.2"
  }
}
```

### 2. `lib/db.ts`
Dodano migrację:
```typescript
// Check if password_hash column exists in users table
const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
const hasPasswordHash = userTableInfo.some((col) => col.name === 'password_hash');

if (!hasPasswordHash) {
  db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
}
```

### 3. `lib/auth.ts`
**Przed:**
```typescript
export async function login(email: string): Promise<User | null>
```

**Po:**
```typescript
export async function login(email: string, password: string): Promise<User | { error: string }>
```

Dodano:
- Import `bcrypt`
- Weryfikacja hasła: `bcrypt.compare(password, user.password_hash)`
- Hashowanie przy rejestracji: `bcrypt.hash(password, 10)`

### 4. `app/login/page.tsx`
**Przed:** Wybór użytkownika z listy (select)

**Po:** Formularz z polami:
- Email (input type="email")
- Hasło (input type="password")
- Przycisk pokazywania/ukrywania hasła (Eye/EyeOff icon)

### 5. `app/register/page.tsx`
Dodano pole:
- Hasło (input type="password")
- Przycisk pokazywania/ukrywania hasła
- Walidacja minimum 6 znaków

### 6. API Endpoints
**`/api/auth/login`:**
```typescript
// Przed
{ email: string }

// Po
{ email: string, password: string }
```

**`/api/auth/register`:**
```typescript
// Przed
{ name: string, email: string, role: string }

// Po
{ name: string, email: string, password: string, role: string }
```

---

## ⚠️ Ważne - Istniejący użytkownicy

### Problem
Domyślni użytkownicy (admin@parkm.pl, jan.kowalski@parkm.pl, etc.) **nie mają** ustawionych haseł.

### Rozwiązanie 1: Usuń starą bazę danych
```bash
# Usuń plik bazy danych
rm park-m.db

# Uruchom aplikację ponownie
npm run dev
```
Aplikacja utworzy nową bazę, ale **bez domyślnych użytkowników**.

### Rozwiązanie 2: Zarejestruj nowe konta
1. Otwórz `/register`
2. Utwórz nowe konta z hasłami
3. Stare konta bez haseł nie będą działać

### Rozwiązanie 3: Ręcznie dodaj hasła (dla programistów)
```sql
-- Otwórz bazę danych
sqlite3 park-m.db

-- Dodaj zahashowane hasło (przykład: hasło "password123")
UPDATE users 
SET password_hash = '$2b$10$...' 
WHERE email = 'admin@parkm.pl';
```

**Uwaga:** Musisz wygenerować hash używając bcrypt.

---

## 🧪 Testowanie

### Test 1: Rejestracja nowego użytkownika
1. Otwórz `/register`
2. Wypełnij formularz:
   - Imię: "Test User"
   - Email: "test@park-m.pl"
   - Hasło: "test123"
   - Stanowisko: "Pracownik"
3. Kliknij "Utwórz konto"
4. **Oczekiwany rezultat:** Automatyczne logowanie i przekierowanie do `/`

### Test 2: Logowanie
1. Wyloguj się
2. Otwórz `/login`
3. Wpisz:
   - Email: "test@park-m.pl"
   - Hasło: "test123"
4. Kliknij "Zaloguj się"
5. **Oczekiwany rezultat:** Przekierowanie do `/`

### Test 3: Nieprawidłowe hasło
1. Otwórz `/login`
2. Wpisz:
   - Email: "test@park-m.pl"
   - Hasło: "wrongpassword"
3. **Oczekiwany rezultat:** Błąd "Nieprawidłowy email lub hasło"

### Test 4: Przycisk pokazywania hasła
1. Otwórz `/login` lub `/register`
2. Wpisz hasło
3. Kliknij ikonę oka
4. **Oczekiwany rezultat:** Hasło jest widoczne/ukryte

### Test 5: Walidacja hasła
1. Otwórz `/register`
2. Wpisz hasło krótsze niż 6 znaków (np. "12345")
3. Kliknij "Utwórz konto"
4. **Oczekiwany rezultat:** Błąd "Hasło musi mieć minimum 6 znaków"

---

## 🎨 UI/UX

### Strona logowania
- Pole email (type="email")
- Pole hasło (type="password")
- Przycisk pokazywania/ukrywania hasła (ikona oka)
- Link do rejestracji
- Komunikaty błędów

### Strona rejestracji
- Pole imię i nazwisko
- Pole email
- **Pole hasło** (NOWE)
- Pole stanowisko
- Przycisk pokazywania/ukrywania hasła
- Link do logowania

---

## 📊 Struktura bazy danych

### Tabela `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,  -- NOWA KOLUMNA
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🔍 Różnice: Przed vs Po

### Przed (Wybór z listy)
- ❌ Brak haseł
- ❌ Każdy mógł się zalogować jako każdy
- ❌ Brak bezpieczeństwa
- ✅ Szybkie logowanie (1 klik)

### Po (Email + Hasło)
- ✅ Hasła zahashowane bcrypt
- ✅ Tylko właściciel konta może się zalogować
- ✅ Bezpieczne
- ✅ Standardowe logowanie
- ❌ Wymaga wpisania hasła

---

## 💡 Wskazówki

### Dla użytkowników:
- Używaj silnych haseł (minimum 6 znaków)
- Nie udostępniaj hasła innym
- Jeśli zapomnisz hasła - skontaktuj się z administratorem

### Dla administratorów:
- Wszyscy nowi użytkownicy muszą się zarejestrować
- Stare konta bez haseł nie będą działać
- Możesz ręcznie dodać hasła w bazie danych

### Dla programistów:
- Hasła są hashowane z 10 salt rounds
- Używamy bcrypt (nie md5, nie sha1)
- Password_hash jest opcjonalny (dla kompatybilności wstecznej)

---

## 🐛 Rozwiązywanie problemów

### "Cannot find module 'bcrypt'"
```bash
npm install
```

### "Konto nie ma ustawionego hasła"
Użytkownik istnieje, ale nie ma hasła. Opcje:
1. Usuń konto i zarejestruj ponownie
2. Ręcznie dodaj hasło w bazie danych

### "Nieprawidłowy email lub hasło"
- Sprawdź czy email jest poprawny
- Sprawdź czy hasło jest poprawne
- Sprawdź czy konto istnieje

### Błędy TypeScript
```bash
# Zainstaluj typy
npm install @types/bcrypt
```

---

## ✅ Podsumowanie

### Co zostało dodane:
- ✅ Pole hasła w formularzu logowania
- ✅ Pole hasła w formularzu rejestracji
- ✅ Hashowanie haseł (bcrypt)
- ✅ Weryfikacja haseł przy logowaniu
- ✅ Przycisk pokazywania/ukrywania hasła
- ✅ Walidacja długości hasła (min 6 znaków)
- ✅ Migracja bazy danych (kolumna password_hash)

### Co się zmieniło:
- ❌ Usunięto wybór użytkownika z listy
- ✅ Dodano klasyczne logowanie email + hasło
- ✅ Zwiększono bezpieczeństwo

---

**System logowania jest teraz bezpieczny i zgodny ze standardami! 🔐✨**
