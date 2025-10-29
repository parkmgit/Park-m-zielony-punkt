# Instrukcja uruchomienia - Park M Trees

## ✅ Konfiguracja bazy danych - GOTOWE!

### 🔧 Lokalne środowisko (Development)
Projekt używa **SQLite** - nie wymaga konfiguracji!
- **Plik bazy:** `park-m-trees.db` (tworzony automatycznie)
- **Brak konfiguracji** - działa od razu po `npm run dev`

### 🌐 Produkcyjne środowisko (Zenbox)
Projekt automatycznie przełącza się na **MariaDB**:
- **Host:** s15.zenbox.pl (2.57.138.166)
- **Port:** 3306
- **User:** parkm_drzewa
- **Password:** GoZV5NcZP1
- **Database:** parkm_trees

### 📡 Hosting Zenbox
- **FTP:** drzewa@trees.park-m.pl
- **FTP Host:** s15.zenbox.pl
- **FTP Password:** YvoUtEoZ7z

## 🚀 Kroki uruchomienia (Lokalnie na Twoim komputerze)

### 1. Zainstaluj zależności (jeśli jeszcze nie zainstalowane)
```bash
npm install
```

### 2. Uruchom serwer deweloperski
```bash
npm run dev
```

### 3. Zainicjuj bazę danych
Otwórz w przeglądarce:
```
http://localhost:3000/api/init
```

Powinieneś zobaczyć komunikat:
```json
{"message":"Database initialized successfully"}
```

**Baza danych zostanie utworzona automatycznie!** Nie musisz jej tworzyć ręcznie.

### 4. Zaloguj się
Otwórz:
```
http://localhost:3000/login
```

Użyj jednego z kont testowych:
- **Email:** `admin@park-m.pl`
- **Hasło:** `password123`

## 🆕 Rejestracja nowych użytkowników

Przejdź do:
```
http://localhost:3000/register
```

Wymagania:
- Email musi kończyć się na `@park-m.pl`
- Hasło minimum 6 znaków
- Imię i nazwisko minimum 3 znaki

**Przykład:**
- Imię i nazwisko: `Jan Kowalski`
- Email: `jan.kowalski@park-m.pl`
- Hasło: `password123`
- Stanowisko: `pracownik`

## 🔧 Rozwiązywanie problemów

### Błąd połączenia z bazą danych
**Lokalnie:** Nie powinno być problemu - SQLite nie wymaga serwera!  
**Na produkcji (Zenbox):** Sprawdź czy:
1. MariaDB działa na serwerze
2. Dane dostępowe są poprawne
3. Aplikacja wykrywa środowisko produkcyjne (ustaw `DB_HOST` w zmiennych środowiskowych)

### 400 przy rejestracji
- Sprawdź czy email kończy się na `@park-m.pl`
- Sprawdź czy ten email nie istnieje już w bazie
- Zobacz logi w terminalu serwera (tam gdzie `npm run dev`)

### 401 przy logowaniu
- Sprawdź czy użytkownik istnieje w bazie
- Sprawdź czy hasło jest poprawne
- Domyślne hasło dla kont testowych: `password123`

## 📋 Konta testowe

| Rola | Email | Hasło |
|------|-------|-------|
| Administrator | admin@park-m.pl | password123 |
| Brygadzista | jan.kowalski@park-m.pl | password123 |
| Pracownik | anna.nowak@park-m.pl | password123 |
| Pracownik | piotr.wisniewski@park-m.pl | password123 |

## 🎯 Następne kroki

Po zalogowaniu będziesz mógł:
- Dodawać nowe drzewa z geolokalizacją
- Zarządzać projektami i budowami
- Przeglądać ewidencję drzew
- Pracować offline (po pierwszym załadowaniu)
