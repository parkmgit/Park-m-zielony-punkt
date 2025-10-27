# 🔍 Test Logowania - Instrukcje

## Problem
Logowanie i rejestracja nie działają w aplikacji PWA.

## Jak przetestować:

### 1. Sprawdź czy serwer działa
Otwórz w przeglądarce:
```
http://localhost:3000
```

### 2. Sprawdź inicjalizację bazy
Otwórz w przeglądarce:
```
http://localhost:3000/api/init
```

Powinieneś zobaczyć:
```json
{"message":"Database initialized successfully"}
```

### 3. Otwórz konsolę przeglądarki
1. Naciśnij **F12** (DevTools)
2. Przejdź do zakładki **Console**
3. Przejdź do zakładki **Network**

### 4. Spróbuj się zalogować
Otwórz: http://localhost:3000/login

Użyj danych:
- Email: `admin@park-m.pl`
- Hasło: `password123`

### 5. Sprawdź błędy w konsoli
Po kliknięciu "Zaloguj", sprawdź:

**W zakładce Console:**
- Czy są czerwone błędy?
- Jaki jest dokładny komunikat błędu?

**W zakładce Network:**
- Znajdź request do `/api/auth/login`
- Kliknij na niego
- Sprawdź **Response** (odpowiedź serwera)
- Sprawdź **Status Code** (kod odpowiedzi)

### 6. Możliwe błędy i rozwiązania:

#### Błąd: "Failed to fetch" lub "Network error"
**Przyczyna:** Serwer nie działa
**Rozwiązanie:** Uruchom `npm run dev`

#### Błąd: "Nieprawidłowy email lub hasło"
**Przyczyna:** Baza nie została zainicjowana lub złe dane
**Rozwiązanie:** 
1. Otwórz http://localhost:3000/api/init
2. Spróbuj ponownie z: `admin@park-m.pl` / `password123`

#### Błąd: "Cannot find module '@/lib/db-sqlite'"
**Przyczyna:** Serwer nie został zrestartowany po zmianach
**Rozwiązanie:**
1. Zatrzymaj serwer (Ctrl+C)
2. Uruchom ponownie: `npm run dev`

#### Błąd: 500 Internal Server Error
**Przyczyna:** Problem z bazą danych
**Rozwiązanie:**
1. Usuń pliki `*.db` z głównego katalogu
2. Uruchom ponownie serwer
3. Otwórz http://localhost:3000/api/init

## Wyślij mi informacje:

Jeśli nadal nie działa, wyślij mi:
1. **Dokładny komunikat błędu** z konsoli (Console)
2. **Status Code** z Network (np. 400, 401, 500)
3. **Response** z Network (odpowiedź serwera)
4. **Screenshot** konsoli przeglądarki

## Szybki test w konsoli przeglądarki:

Otwórz konsolę (F12) i wklej:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@park-m.pl',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log('Odpowiedź:', data))
.catch(err => console.error('Błąd:', err));
```

To pokaże dokładną odpowiedź serwera.
