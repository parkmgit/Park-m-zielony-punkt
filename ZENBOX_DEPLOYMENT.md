# 🚀 Wdrożenie Park M Trees na Zenbox

Instrukcja krok po kroku wdrożenia aplikacji Park M - System Ewidencji Drzew na hosting Zenbox z bazą danych MariaDB.

## 📋 Wymagania

- Konto na Zenbox.pl
- Hosting z obsługą Node.js
- Baza danych MariaDB
- Git zainstalowany lokalnie
- Node.js 20+ zainstalowany lokalnie

## 🗄️ Krok 1: Utworzenie bazy danych MariaDB

### W panelu Zenbox:

1. Zaloguj się do panelu Zenbox
2. Przejdź do sekcji **Bazy danych**
3. Kliknij **Utwórz nową bazę danych**
4. Wybierz **MariaDB**
5. Zapisz dane dostępowe:
   - Host bazy danych
   - Port (domyślnie 3306)
   - Nazwa bazy danych
   - Użytkownik
   - Hasło

## ⚙️ Krok 2: Konfiguracja zmiennych środowiskowych

### Lokalnie (dla testów):

1. Skopiuj plik `env.example` do `.env.local`:
```bash
cp env.example .env.local
```

2. Edytuj `.env.local` i uzupełnij danymi z Zenbox:
```env
DB_HOST=twoj-host.zenbox.pl
DB_PORT=3306
DB_USER=twoj_uzytkownik
DB_PASSWORD=twoje_haslo
DB_NAME=park_m_trees

NODE_ENV=production
```

### Na serwerze Zenbox:

1. W panelu Zenbox przejdź do **Ustawienia aplikacji**
2. Znajdź sekcję **Zmienne środowiskowe**
3. Dodaj następujące zmienne:
   - `DB_HOST` - host bazy danych
   - `DB_PORT` - port (3306)
   - `DB_USER` - użytkownik bazy danych
   - `DB_PASSWORD` - hasło do bazy danych
   - `DB_NAME` - nazwa bazy danych
   - `NODE_ENV` - `production`

## 📦 Krok 3: Instalacja zależności

```bash
cd park-m-trees-zenbox
npm install
```

## 🏗️ Krok 4: Inicjalizacja bazy danych

Po wdrożeniu aplikacji, zainicjalizuj bazę danych:

1. Otwórz przeglądarkę i przejdź do:
```
https://twoja-domena.zenbox.pl/api/init-db
```

2. Zobaczysz komunikat o powodzeniu inicjalizacji
3. Baza danych zostanie utworzona z domyślnymi danymi

### Domyślni użytkownicy:

Po inicjalizacji dostępni są następujący użytkownicy (hasło dla wszystkich: `password123`):

- **admin@park-m.pl** - Administrator
- **jan.kowalski@park-m.pl** - Brygadzista
- **anna.nowak@park-m.pl** - Pracownik
- **piotr.wisniewski@park-m.pl** - Pracownik

## 🚀 Krok 5: Wdrożenie na Zenbox

### Opcja A: Przez Git (zalecane)

1. Zainicjalizuj repozytorium Git (jeśli jeszcze nie zrobione):
```bash
git init
git add .
git commit -m "Initial commit - Zenbox version with MariaDB"
```

2. Dodaj remote do GitHub:
```bash
git remote add origin https://github.com/twoj-username/park-m-trees-zenbox.git
git branch -M main
git push -u origin main
```

3. W panelu Zenbox:
   - Przejdź do **Wdrożenia**
   - Wybierz **Wdróż z Git**
   - Połącz z repozytorium GitHub
   - Wybierz branch `main`
   - Ustaw komendy:
     - Build: `npm run build`
     - Start: `npm start`

### Opcja B: Przez FTP/SFTP

1. Zbuduj aplikację lokalnie:
```bash
npm run build
```

2. Prześlij następujące foldery/pliki na serwer:
   - `.next/`
   - `public/`
   - `node_modules/` (lub zainstaluj na serwerze)
   - `package.json`
   - `next.config.ts`
   - Wszystkie pliki konfiguracyjne

3. Na serwerze uruchom:
```bash
npm start
```

## 🔧 Krok 6: Konfiguracja domeny

1. W panelu Zenbox przejdź do **Domeny**
2. Dodaj swoją domenę lub użyj subdomeny Zenbox
3. Skonfiguruj SSL (Let's Encrypt)

## ✅ Krok 7: Weryfikacja

1. Otwórz aplikację w przeglądarce
2. Sprawdź czy strona logowania działa
3. Zaloguj się jako `admin@park-m.pl` / `password123`
4. Sprawdź czy mapa się wyświetla
5. Sprawdź czy PWA działa (przycisk "Pobierz" w Navbarze)

## 🔒 Bezpieczeństwo

### Po wdrożeniu KONIECZNIE:

1. **Zmień hasła domyślnych użytkowników**
2. Upewnij się, że zmienne środowiskowe są bezpieczne
3. Włącz SSL/HTTPS
4. Regularnie aktualizuj zależności:
```bash
npm update
```

## 🐛 Rozwiązywanie problemów

### Błąd połączenia z bazą danych

1. Sprawdź czy zmienne środowiskowe są poprawnie ustawione
2. Zweryfikuj dane dostępowe do bazy danych
3. Sprawdź czy baza danych jest aktywna w panelu Zenbox
4. Sprawdź logi aplikacji w panelu Zenbox

### Aplikacja nie startuje

1. Sprawdź logi w panelu Zenbox
2. Upewnij się, że `npm install` zostało wykonane
3. Sprawdź czy Node.js jest w odpowiedniej wersji (20+)

### PWA nie działa

1. Sprawdź czy aplikacja działa przez HTTPS
2. Wyczyść cache przeglądarki
3. Sprawdź Service Worker w DevTools

## 📊 Monitoring

### Logi aplikacji

W panelu Zenbox możesz sprawdzić:
- Logi aplikacji
- Logi błędów
- Statystyki użycia

### Baza danych

Możesz zarządzać bazą danych przez:
- phpMyAdmin (jeśli dostępny w panelu Zenbox)
- Bezpośrednie połączenie przez MySQL Workbench

## 🔄 Aktualizacje

### Aktualizacja aplikacji:

1. Wprowadź zmiany w kodzie
2. Commit i push do GitHub:
```bash
git add .
git commit -m "Opis zmian"
git push
```
3. Zenbox automatycznie wdroży nową wersję (jeśli skonfigurowane auto-deploy)

### Aktualizacja zależności:

```bash
npm update
npm audit fix
```

## 📱 PWA (Progressive Web App)

Aplikacja działa jako PWA:
- Możliwość instalacji na telefonie/komputerze
- Działanie offline (cache)
- Automatyczne aktualizacje
- Przycisk "Pobierz" w Navbarze

## 🆘 Wsparcie

W razie problemów:
1. Sprawdź dokumentację Zenbox
2. Sprawdź logi aplikacji
3. Skontaktuj się z supportem Zenbox

## 📚 Dodatkowe zasoby

- [Dokumentacja Next.js](https://nextjs.org/docs)
- [Dokumentacja MariaDB](https://mariadb.org/documentation/)
- [Dokumentacja Zenbox](https://zenbox.pl/docs)

---

**Wersja:** 1.0.0 (Zenbox + MariaDB)  
**Data:** 2025-10-27
