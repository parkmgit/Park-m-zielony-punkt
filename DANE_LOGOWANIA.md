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

## Konfiguracja bazy danych MariaDB (Zenbox)

**Host:** s15.zenbox.pl (2.57.138.166)  
**Port:** 3306  
**User:** parkm_drzewa  
**Password:** GoZV5NcZP1  
**Database:** parkm_trees

## Konfiguracja FTP (Zenbox)

**FTP:** drzewa@trees.park-m.pl  
**FTP Host:** s15.zenbox.pl  
**FTP Password:** YvoUtEoZ7z

## Jak uruchomić

1. Uruchom serwer: `npm run dev`
2. Zainicjuj bazę: otwórz `http://localhost:3000/api/init`
3. Zaloguj się na stronie logowania: `http://localhost:3000/login`

**Uwaga:** Aplikacja łączy się ze zdalną bazą danych na Zenbox (s15.zenbox.pl)

## Rejestracja nowych użytkowników

Nowi użytkownicy mogą się zarejestrować na `/register` używając emaila z domeną `@park-m.pl`
