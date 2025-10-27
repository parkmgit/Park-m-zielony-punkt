# 📝 System Rejestracji - Park M

## ✨ Nowa funkcjonalność!

Dodano pełny system rejestracji użytkowników. Teraz nowi pracownicy mogą sami utworzyć konto bez potrzeby kontaktu z administratorem.

---

## 🔐 Jak się zarejestrować?

### Krok 1: Otwórz stronę rejestracji
1. Wejdź na stronę aplikacji
2. Zostaniesz przekierowany do `/login`
3. Kliknij **"Nie masz konta? Zarejestruj się"**

### Krok 2: Wypełnij formularz
Podaj następujące dane:

#### 1. **Imię i nazwisko**
- Minimum 3 znaki
- Przykład: `Jan Kowalski`

#### 2. **Email służbowy**
- **MUSI kończyć się na `@park-m.pl`**
- Przykład: `jan.kowalski@park-m.pl`
- Email musi być unikalny (nie może być już zarejestrowany)

#### 3. **Stanowisko**
Wybierz jedno z:
- **Pracownik** - podstawowy dostęp
- **Brygadzista** - zarządzanie zespołem
- **Administrator** - pełny dostęp

### Krok 3: Utwórz konto
1. Kliknij **"Utwórz konto"**
2. System sprawdzi poprawność danych
3. Po pomyślnej rejestracji zostaniesz automatycznie zalogowany
4. Przekierowanie do strony głównej aplikacji

---

## ✅ Walidacja danych

### Email
- ✅ Musi kończyć się na `@park-m.pl`
- ✅ Musi być unikalny (nie może istnieć w bazie)
- ✅ Format email musi być poprawny

### Imię i nazwisko
- ✅ Minimum 3 znaki
- ✅ Nie może być puste

### Stanowisko
- ✅ Tylko: `pracownik`, `brygadzista`, `admin`

---

## 🔒 Bezpieczeństwo

### Ograniczenia rejestracji
- Tylko emaile `@park-m.pl` są akceptowane
- Zapobiega rejestrowaniu się osób spoza firmy
- Każdy email może być użyty tylko raz

### Automatyczne logowanie
- Po rejestracji użytkownik jest automatycznie zalogowany
- Sesja ważna przez 30 dni
- Bezpieczne cookie (httpOnly)

---

## 🚫 Komunikaty błędów

### "Email musi kończyć się na @park-m.pl"
- Podałeś email spoza domeny Park M
- Użyj służbowego emaila firmowego

### "Użytkownik z tym adresem email już istnieje"
- Ten email jest już zarejestrowany
- Spróbuj się zalogować zamiast rejestrować
- Lub użyj innego emaila

### "Imię i nazwisko musi mieć minimum 3 znaki"
- Podane imię jest za krótkie
- Wpisz pełne imię i nazwisko

### "Wszystkie pola są wymagane"
- Wypełnij wszystkie pola formularza
- Imię, email i stanowisko są obowiązkowe

---

## 📱 Rejestracja na telefonie

System rejestracji działa identycznie na:
- 📱 Telefonie (Android/iPhone)
- 💻 Komputerze
- 📟 Tablecie

Formularz jest w pełni responsywny i dostosowuje się do rozmiaru ekranu.

---

## 🔄 Przepływ użytkownika

### Nowy użytkownik:
1. Otwiera aplikację → przekierowanie do `/login`
2. Kliknie "Nie masz konta? Zarejestruj się"
3. Wypełnia formularz rejestracji
4. Klika "Utwórz konto"
5. **Automatyczne logowanie**
6. Przekierowanie do strony głównej
7. Może korzystać z aplikacji

### Istniejący użytkownik:
1. Otwiera aplikację → przekierowanie do `/login`
2. Wybiera swoje konto z listy
3. Klika "Zaloguj się"
4. Przekierowanie do strony głównej

---

## 🎨 Interfejs

### Strona rejestracji (`/register`)
- Nowoczesny design zgodny z resztą aplikacji
- Ciemny/jasny motyw
- Ikona Park M (drzewo)
- Formularz z walidacją
- Link powrotny do logowania
- Komunikaty błędów w czasie rzeczywistym

### Strona logowania (`/login`)
- Dodano link "Nie masz konta? Zarejestruj się"
- Zachowano możliwość logowania z listy użytkowników
- Oba sposoby działają równolegle

---

## 🛠️ Techniczne szczegóły

### Nowe pliki:
1. **`app/register/page.tsx`** - strona rejestracji
2. **`app/api/auth/register/route.ts`** - endpoint API

### Zmodyfikowane pliki:
1. **`lib/auth.ts`** - dodano funkcję `register()`
2. **`app/login/page.tsx`** - dodano link do rejestracji
3. **`middleware.ts`** - dodano `/register` do publicznych tras

### API Endpoint:
```typescript
POST /api/auth/register
Body: {
  name: string,
  email: string,
  role: 'admin' | 'brygadzista' | 'pracownik'
}
```

---

## 🧪 Testowanie

### Test 1: Poprawna rejestracja
1. Otwórz `/register`
2. Wpisz: "Jan Kowalski"
3. Email: "jan.kowalski@park-m.pl"
4. Stanowisko: "Pracownik"
5. Kliknij "Utwórz konto"
6. **Oczekiwany rezultat:** Automatyczne logowanie i przekierowanie do `/`

### Test 2: Niepoprawny email (bez @park-m.pl)
1. Wpisz email: "jan@gmail.com"
2. Kliknij "Utwórz konto"
3. **Oczekiwany rezultat:** Błąd "Email musi kończyć się na @park-m.pl"

### Test 3: Duplikat emaila
1. Zarejestruj użytkownika z emailem "test@park-m.pl"
2. Spróbuj zarejestrować ponownie ten sam email
3. **Oczekiwany rezultat:** Błąd "Użytkownik z tym adresem email już istnieje"

### Test 4: Za krótkie imię
1. Wpisz imię: "AB"
2. Kliknij "Utwórz konto"
3. **Oczekiwany rezultat:** Błąd "Imię i nazwisko musi mieć minimum 3 znaki"

### Test 5: Link do logowania
1. Na stronie `/register` kliknij "Masz już konto? Zaloguj się"
2. **Oczekiwany rezultat:** Przekierowanie do `/login`

### Test 6: Link do rejestracji
1. Na stronie `/login` kliknij "Nie masz konta? Zarejestruj się"
2. **Oczekiwany rezultat:** Przekierowanie do `/register`

---

## 📊 Baza danych

### Tabela `users`
Nowy użytkownik jest dodawany do istniejącej tabeli:

```sql
INSERT INTO users (name, role, email, active) 
VALUES (?, ?, ?, 1)
```

Pola:
- `id` - auto-increment
- `name` - imię i nazwisko
- `role` - stanowisko
- `email` - email (unikalny)
- `active` - 1 (aktywny)
- `created_at` - timestamp

---

## 🔍 Różnice: Rejestracja vs Logowanie

### Rejestracja (`/register`)
- ✅ Dla nowych użytkowników
- ✅ Wymaga wypełnienia formularza
- ✅ Tworzy nowe konto w bazie
- ✅ Automatyczne logowanie po rejestracji
- ✅ Walidacja emaila @park-m.pl

### Logowanie (`/login`)
- ✅ Dla istniejących użytkowników
- ✅ Wybór z listy użytkowników
- ✅ Nie tworzy nowego konta
- ✅ Wymaga istniejącego emaila

---

## 💡 Wskazówki dla użytkowników

### Dla nowych pracowników:
1. Użyj służbowego emaila firmowego (@park-m.pl)
2. Wybierz odpowiednie stanowisko
3. Po rejestracji możesz od razu korzystać z aplikacji

### Dla administratorów:
- Wszyscy nowi użytkownicy są automatycznie aktywni
- Możesz sprawdzić listę użytkowników w bazie danych
- Możesz dezaktywować konta w razie potrzeby

---

## 🎯 Podsumowanie

### Co się zmieniło?
- ✅ Dodano stronę rejestracji `/register`
- ✅ Dodano API endpoint `/api/auth/register`
- ✅ Rozszerzono `lib/auth.ts` o funkcję `register()`
- ✅ Dodano link do rejestracji na stronie logowania
- ✅ Zaktualizowano middleware (publiczne trasy)

### Co pozostało bez zmian?
- ✅ System logowania działa jak wcześniej
- ✅ Istniejący użytkownicy mogą się logować
- ✅ Ochrona tras i API bez zmian
- ✅ PWA i offline mode bez zmian

---

**Teraz każdy pracownik Park M może samodzielnie utworzyć konto! 🎉**
