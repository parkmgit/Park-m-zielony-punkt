# 🔐 System Logowania i Instalacja PWA

## ✅ Co zostało dodane?

### 1. **System Logowania**
- ✅ Pełny system autentykacji z sesją (30 dni)
- ✅ Strona logowania `/login`
- ✅ Ochrona wszystkich tras - tylko zalogowani użytkownicy mają dostęp
- ✅ Wyświetlanie zalogowanego użytkownika w navbarze
- ✅ Przycisk wylogowania

### 2. **Ochrona Aplikacji**
- ✅ Middleware sprawdza czy użytkownik jest zalogowany
- ✅ Automatyczne przekierowanie do `/login` dla niezalogowanych
- ✅ Ochrona API endpoints
- ✅ Sesja przechowywana w bezpiecznym cookie

### 3. **PWA - Aplikacja Mobilna**
- ✅ Manifest PWA z ikonami
- ✅ Service Worker z cache offline
- ✅ Wskaźnik statusu online/offline
- ✅ Możliwość instalacji na telefonie
- ✅ Działanie offline z ograniczeniami

---

## 🚀 Jak uruchomić aplikację?

### Krok 1: Instalacja zależności
```bash
npm install
```

### Krok 2: Uruchomienie w trybie deweloperskim
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

### Krok 3: Pierwsze logowanie
1. Otwórz **http://localhost:3000**
2. Zostaniesz przekierowany do `/login`
3. Wybierz użytkownika z listy:
   - **Admin Park M** (admin@parkm.pl) - administrator
   - **Jan Kowalski** (jan.kowalski@parkm.pl) - brygadzista
   - **Anna Nowak** (anna.nowak@parkm.pl) - pracownik
   - **Piotr Wiśniewski** (piotr.wisniewski@parkm.pl) - pracownik
4. Kliknij "Zaloguj się"

---

## 📱 Instalacja na telefonie (PWA)

### ⚠️ WAŻNE: Wymagania
- **HTTPS** - PWA wymaga bezpiecznego połączenia
- Dla testów lokalnych możesz użyć:
  - `ngrok` do tunelowania
  - Wdrożenie na Vercel/Netlify (automatyczne HTTPS)

### Android (Chrome)
1. Otwórz aplikację w Chrome
2. Kliknij menu (⋮) → "Dodaj do ekranu głównego"
3. Potwierdź instalację
4. Ikona pojawi się na ekranie głównym

### iPhone (Safari)
1. Otwórz aplikację w Safari
2. Kliknij przycisk "Udostępnij" (□↑)
3. Wybierz "Dodaj do ekranu początkowego"
4. Potwierdź

---

## 🔒 Bezpieczeństwo

### Jak działa logowanie?
1. Użytkownik wybiera swoje konto z listy
2. System tworzy sesję i zapisuje w cookie (httpOnly)
3. Sesja ważna przez 30 dni
4. Middleware sprawdza sesję przy każdym żądaniu
5. Brak sesji = przekierowanie do `/login`

### Co jest chronione?
- ✅ Wszystkie strony (/, /trees, /map, /add-tree, /projects)
- ✅ API endpoints (/api/trees, /api/projects, etc.)
- ✅ Tylko `/login` i `/api/auth/*` są publiczne

### Wylogowanie
- Kliknij przycisk "Wyloguj" w navbarze
- Sesja zostanie usunięta
- Przekierowanie do `/login`

---

## 🌐 Tryb Offline

### Co działa offline?
- ✅ Przeglądanie wcześniej załadowanych stron
- ✅ Przeglądanie wcześniej pobranych drzew
- ✅ Mapa (kafelki są cache'owane)
- ✅ Zdjęcia (jeśli były wcześniej załadowane)

### Co NIE działa offline?
- ❌ Dodawanie nowych drzew (wymaga połączenia)
- ❌ Edycja danych (wymaga połączenia)
- ❌ Logowanie (wymaga połączenia)
- ❌ Synchronizacja z bazą danych

### Wskaźnik statusu
- 🟢 **Zielony** - Połączono z internetem
- 🔴 **Czerwony** - Tryb offline

---

## 🎨 Generowanie Ikon PWA

### Opcja 1: Online Tool (Zalecane)
1. Odwiedź: https://www.pwabuilder.com/imageGenerator
2. Prześlij `public/logo.png`
3. Pobierz wygenerowane ikony
4. Umieść w folderze `public/`:
   - `icon-192.png`
   - `icon-512.png`
   - `icon-maskable-192.png`
   - `icon-maskable-512.png`

### Opcja 2: Skrypt pomocniczy
```bash
node scripts/generate-icons.js
```
Ten skrypt wyświetli instrukcje generowania ikon.

---

## 🚀 Wdrożenie na produkcję

### Vercel (Zalecane - Darmowe HTTPS)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Własny serwer
```bash
npm run build
npm start
```
**Pamiętaj:** Skonfiguruj HTTPS (Let's Encrypt, Cloudflare, etc.)

---

## 🔧 Konfiguracja

### Zmiana czasu sesji
Edytuj `lib/auth.ts`:
```typescript
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 dni
```

### Dodanie nowego użytkownika
Edytuj `lib/db.ts` w funkcji `insertDefaultData()`:
```typescript
insertUser.run('Nowy Użytkownik', 'pracownik', 'email@example.com');
```

### Zmiana kolorów PWA
Edytuj `public/manifest.json`:
```json
{
  "theme_color": "#22c55e",
  "background_color": "#0f172a"
}
```

---

## 📊 Cache Strategy

### Obrazy
- **CacheFirst** - 30 dni
- Maksymalnie 100 obrazów

### API
- **NetworkFirst** - 5 minut
- Timeout: 10 sekund
- Fallback do cache przy braku internetu

### Mapy OpenStreetMap
- **CacheFirst** - 30 dni
- Maksymalnie 64 kafelki

### Ogólne zasoby
- **NetworkFirst** - 24 godziny
- Timeout: 10 sekund

---

## 🐛 Rozwiązywanie problemów

### Nie mogę się zalogować
- Sprawdź czy baza danych jest zainicjalizowana
- Odwiedź `/api/init` aby zainicjalizować bazę
- Sprawdź konsolę przeglądarki (F12)

### PWA się nie instaluje
- Upewnij się że używasz HTTPS
- Sprawdź czy manifest.json się ładuje
- Sprawdź Chrome DevTools → Application → Manifest

### Offline mode nie działa
- Wyczyść cache przeglądarki
- Sprawdź Service Worker w DevTools
- Upewnij się że aplikacja była wcześniej załadowana online

### Sesja wygasa za szybko
- Sprawdź ustawienia cookie w przeglądarce
- Zwiększ SESSION_DURATION w `lib/auth.ts`

---

## 📝 Notatki

### Domyślni użytkownicy
Wszyscy użytkownicy są tworzone automatycznie przy pierwszym uruchomieniu:
- Admin Park M (admin)
- Jan Kowalski (brygadzista)
- Anna Nowak (pracownik)
- Piotr Wiśniewski (pracownik)

### Baza danych
- SQLite: `park-m.db`
- Automatyczna inicjalizacja przy pierwszym uruchomieniu
- Migracje wykonywane automatycznie

---

## ✨ Funkcje

### Zalogowany użytkownik może:
- ✅ Dodawać drzewa z GPS i zdjęciami
- ✅ Przeglądać listę drzew
- ✅ Zobacz drzewa na mapie
- ✅ Zarządzać projektami
- ✅ Dodawać akcje (podlewanie, przycinanie, etc.)
- ✅ Przeglądać historię działań

### Niezalogowany użytkownik:
- ❌ Widzi tylko stronę logowania
- ❌ Nie ma dostępu do żadnych funkcji
- ❌ Nie może przeglądać danych

---

**Gotowe! Aplikacja Park M jest teraz w pełni zabezpieczona i działa jako PWA! 🌳📱✨**
