# 🌳 Park M - System Ewidencji Drzew (Zenbox Edition)

Profesjonalna aplikacja PWA do zarządzania i monitorowania drzew z GPS, zdjęciami i pełnym systemem logowania.

**Wersja Zenbox** - Zoptymalizowana dla hostingu Zenbox z bazą danych MariaDB.

## ✨ Główne funkcje

### 🔐 System Logowania i Rejestracji
- Klasyczne logowanie email + hasło
- Hashowanie haseł (bcrypt)
- Rejestracja dla nowych użytkowników (@park-m.pl)
- Ochrona wszystkich tras i API
- Sesje ważne 30 dni
- Role: admin, brygadzista, pracownik

### 📱 Progressive Web App (PWA)
- Instalacja na telefonie jak natywna aplikacja
- Działanie offline z cache
- Wskaźnik statusu online/offline
- Automatyczne aktualizacje

### 🌍 Funkcje aplikacji
- ✅ Dodawanie drzew z automatyczną lokalizacją GPS
- ✅ Robienie i przechowywanie zdjęć
- ✅ Historia działań (podlewanie, przycinanie, inspekcja)
- ✅ Wizualizacja na mapie (OpenStreetMap)
- ✅ Zarządzanie projektami i budowami
- ✅ Przypisywanie do pracowników
- ✅ Tryb offline z synchronizacją

## 🚀 Szybki start

### Instalacja
```bash
npm install
```

### Uruchomienie
```bash
npm run dev
```

Aplikacja dostępna pod: **http://localhost:3000**

### Pierwsze użycie

#### Opcja 1: Rejestracja (Nowy użytkownik)
1. Otwórz aplikację → przekierowanie do `/login`
2. Kliknij "Nie masz konta? Zarejestruj się"
3. Wypełnij formularz:
   - Imię i nazwisko
   - Email (musi kończyć się na @park-m.pl)
   - **Hasło** (minimum 6 znaków)
   - Stanowisko
4. Kliknij "Utwórz konto"
5. Automatyczne logowanie i przekierowanie do aplikacji

#### Opcja 2: Logowanie (Istniejący użytkownik)
1. Otwórz aplikację → przekierowanie do `/login`
2. Wpisz email i hasło
3. Kliknij "Zaloguj się"

**⚠️ Uwaga:** Domyślni użytkownicy NIE mają ustawionych haseł. Musisz zarejestrować nowe konto.

## 📱 Instalacja PWA na telefonie

### Android (Chrome)
1. Otwórz aplikację w Chrome
2. Menu (⋮) → "Dodaj do ekranu głównego"
3. Potwierdź instalację

### iPhone (Safari)
1. Otwórz aplikację w Safari
2. Przycisk "Udostępnij" (□↑)
3. "Dodaj do ekranu początkowego"

**⚠️ Wymagane HTTPS dla pełnej funkcjonalności PWA**

## 🛠️ Technologie

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Baza danych:** MariaDB (mysql2)
- **Mapa:** Leaflet, React-Leaflet, OpenStreetMap
- **PWA:** next-pwa, Service Workers
- **Ikony:** Lucide React, Heroicons
- **Hosting:** Zenbox

## 📚 Dokumentacja

- **[ZENBOX_DEPLOYMENT.md](./ZENBOX_DEPLOYMENT.md)** - 🚀 Wdrożenie na Zenbox (GŁÓWNA INSTRUKCJA!)
- **[LOGOWANIE_HASLA.md](./LOGOWANIE_HASLA.md)** - Klasyczne logowanie email + hasło
- **[REJESTRACJA.md](./REJESTRACJA.md)** - System rejestracji użytkowników
- **[INSTALACJA_I_LOGOWANIE.md](./INSTALACJA_I_LOGOWANIE.md)** - Pełna dokumentacja logowania i PWA
- **[PWA_INSTRUKCJA.md](./PWA_INSTRUKCJA.md)** - Instrukcja instalacji PWA
- **[TESTOWANIE.md](./TESTOWANIE.md)** - Instrukcje testowania
- **[IKONY_TODO.md](./IKONY_TODO.md)** - Generowanie ikon PWA

## 🔒 Bezpieczeństwo

- Klasyczne logowanie email + hasło
- Hashowanie haseł (bcrypt, 10 salt rounds)
- Rejestracja tylko dla emaili @park-m.pl
- Sesje przechowywane w httpOnly cookies
- Middleware chroni wszystkie trasy
- Tylko zalogowani użytkownicy mają dostęp
- Automatyczne przekierowanie do /login
- Walidacja danych przy rejestracji

## 🌐 Wdrożenie

### Zenbox (Zalecane dla tej wersji)

Szczegółowa instrukcja wdrożenia: **[ZENBOX_DEPLOYMENT.md](./ZENBOX_DEPLOYMENT.md)**

Krótka wersja:
1. Utwórz bazę danych MariaDB w panelu Zenbox
2. Skonfiguruj zmienne środowiskowe (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
3. Wdróż przez Git lub FTP
4. Zainicjalizuj bazę: `/api/init-db`

### Docker
```bash
docker build -t park-m .
docker run -p 3000:3000 park-m
```

## 📊 Struktura projektu

```
park-m-trees/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── login/             # Strona logowania
│   ├── trees/             # Lista drzew
│   ├── map/               # Mapa
│   └── add-tree/          # Dodawanie drzew
├── components/            # Komponenty React
├── lib/                   # Biblioteki i utils
│   ├── auth.ts           # System autentykacji
│   ├── db.ts             # Baza danych
│   └── types.ts          # TypeScript types
├── public/               # Pliki statyczne
│   ├── manifest.json     # PWA manifest
│   └── icons/            # Ikony PWA
└── middleware.ts         # Ochrona tras

```

## 🎨 Motywy

- 🌙 Ciemny motyw (domyślny)
- ☀️ Jasny motyw
- Przełącznik w navbarze

## 🐛 Rozwiązywanie problemów

### Nie mogę się zalogować
```bash
# Zainicjalizuj bazę danych
curl http://localhost:3000/api/init
```

### PWA się nie instaluje
- Sprawdź czy używasz HTTPS
- Wyczyść cache przeglądarki
- Sprawdź DevTools → Application → Manifest

### Offline mode nie działa
- Załaduj aplikację online najpierw
- Sprawdź Service Worker w DevTools
- Wyczyść cache i przeładuj

## 📝 Licencja

Projekt prywatny - Park M

## 👨‍💻 Autor

Park M Team

---
**Gotowe do użycia! 🌳📱✨**
