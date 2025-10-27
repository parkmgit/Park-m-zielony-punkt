# Dane Logowania - Park M Trees

## Problem został naprawiony! ✅

Domyślni użytkownicy nie mieli ustawionych haseł. Problem został rozwiązany.

## Dane logowania testowe

**Hasło dla wszystkich użytkowników:** `password123`

### Konta testowe:

1. **Administrator**
   - Email: `admin@park-m.pl`
   - Hasło: `password123`

2. **Brygadzista**
   - Email: `jan.kowalski@park-m.pl`
   - Hasło: `password123`

3. **Pracownik 1**
   - Email: `anna.nowak@park-m.pl`
   - Hasło: `password123`

4. **Pracownik 2**
   - Email: `piotr.wisniewski@park-m.pl`
   - Hasło: `password123`

## Jak uruchomić

1. Usuń starą bazę danych (jeśli istnieje)
2. Uruchom serwer: `npm run dev`
3. Zainicjuj bazę: otwórz `http://localhost:3000/api/init-db`
4. Zaloguj się na stronie logowania

## Rejestracja nowych użytkowników

Nowi użytkownicy mogą się zarejestrować na `/register` używając emaila z domeną `@park-m.pl`
