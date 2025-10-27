# Test Middleware - Instrukcje

## Problem
Middleware nie przekierowuje na stronę logowania, gdy użytkownik nie jest zalogowany.

## Zmiany wprowadzone:

1. ✅ Dodano `/api/init-db` do publicznych ścieżek
2. ✅ Poprawiono walidację sesji - sprawdzanie czy ciasteczko ma wartość
3. ✅ Dodano sprawdzanie czy sesja zawiera wymagane pola (`userId`, `expiresAt`)

## Jak przetestować:

### 1. Wyczyść cookies w przeglądarce
- Otwórz DevTools (F12)
- Zakładka Application → Cookies
- Usuń wszystkie cookies dla localhost:3000

### 2. Zrestartuj serwer
```bash
# Zatrzymaj obecny serwer (Ctrl+C)
npm run dev
```

### 3. Otwórz stronę główną
- Otwórz: http://localhost:3000
- **Powinno przekierować na:** http://localhost:3000/login

### 4. Zaloguj się
- Email: `admin@parkm.pl`
- Hasło: `password123`

### 5. Sprawdź przekierowanie
- Po zalogowaniu powinno przekierować na stronę główną
- Sprawdź w DevTools czy ciasteczko `park-m-session` zostało ustawione

## Jeśli nadal nie działa:

### Sprawdź logi w konsoli przeglądarki:
1. Otwórz DevTools (F12)
2. Zakładka Console
3. Sprawdź czy są jakieś błędy

### Sprawdź logi serwera:
1. Sprawdź terminal gdzie uruchomiony jest `npm run dev`
2. Szukaj błędów związanych z middleware

### Sprawdź czy middleware jest aktywny:
1. W DevTools → Network
2. Odśwież stronę
3. Sprawdź czy request do `/` ma status 307 (redirect)
