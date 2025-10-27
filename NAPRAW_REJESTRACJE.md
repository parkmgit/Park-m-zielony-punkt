# Naprawa problemu z rejestracją ✅

## Problem
Domyślni użytkownicy w bazie mieli emaile z domeną `@parkm.pl` (bez myślnika), ale system wymaga `@park-m.pl` (z myślnikiem). To powodowało konflikt podczas rejestracji nowych użytkowników.

## Rozwiązanie
Naprawiono domenę email w pliku `lib/db.ts` - teraz wszyscy domyślni użytkownicy mają poprawną domenę `@park-m.pl`.

## Jak naprawić bazę danych:

### Krok 1: Wyczyść starą bazę danych
Otwórz w przeglądarce:
```
http://localhost:3000/api/reset-db
```

Powinieneś zobaczyć komunikat: "Baza danych została wyczyszczona"

### Krok 2: Utwórz nową bazę danych
Otwórz w przeglądarce:
```
http://localhost:3000/api/init-db
```

Powinieneś zobaczyć komunikat: "Database initialized successfully"

### Krok 3: Przetestuj rejestrację
1. Otwórz: http://localhost:3000/register
2. Wypełnij formularz:
   - **Imię i nazwisko:** Twoje imię (np. "Maria Testowa")
   - **Email:** dowolny email z domeną `@park-m.pl` (np. `maria.testowa@park-m.pl`)
   - **Hasło:** minimum 6 znaków
   - **Stanowisko:** wybierz z listy

3. Kliknij "Utwórz konto"
4. Powinieneś zostać automatycznie zalogowany i przekierowany na stronę główną

## Dane logowania testowe (po zresetowaniu bazy)

**Hasło dla wszystkich:** `password123`

- `admin@park-m.pl` - Administrator
- `jan.kowalski@park-m.pl` - Brygadzista
- `anna.nowak@park-m.pl` - Pracownik
- `piotr.wisniewski@park-m.pl` - Pracownik

## Uwaga
Endpoint `/api/reset-db` usuwa WSZYSTKIE dane z bazy! Używaj tylko w środowisku deweloperskim.
