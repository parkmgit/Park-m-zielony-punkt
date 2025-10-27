# 🧪 Instrukcja Testowania - Park M

## ✅ Co zostało zaimplementowane?

### 1. System Logowania ✅
- ✅ Strona logowania `/login`
- ✅ API endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- ✅ Sesje w cookies (30 dni)
- ✅ Middleware chroniący wszystkie trasy
- ✅ Navbar z informacją o użytkowniku i przyciskiem wylogowania

### 2. Ochrona Aplikacji ✅
- ✅ Middleware w `middleware.ts`
- ✅ Automatyczne przekierowanie do `/login` dla niezalogowanych
- ✅ Ochrona API endpoints
- ✅ Publiczny dostęp tylko do `/login`

### 3. PWA - Progressive Web App ✅
- ✅ Manifest PWA (`public/manifest.json`)
- ✅ Service Worker z cache offline
- ✅ Wskaźnik online/offline (`OfflineIndicator.tsx`)
- ✅ Rozszerzona strategia cache dla offline mode
- ✅ Instrukcje generowania ikon PNG

---

## 🧪 Jak przetestować?

### Krok 1: Uruchom aplikację
```bash
cd "c:\Users\emili\OneDrive\Pulpit\Ewidencja Drzew\windsurf-project\park-m-trees"
npm run dev
```

### Krok 2: Testowanie logowania

#### Test 1: Przekierowanie do logowania
1. Otwórz: `http://localhost:3000`
2. **Oczekiwany rezultat:** Automatyczne przekierowanie do `/login`

#### Test 2: Logowanie
1. Na stronie `/login` wybierz użytkownika (np. "Admin Park M")
2. Kliknij "Zaloguj się"
3. **Oczekiwany rezultat:** Przekierowanie do strony głównej `/`

#### Test 3: Navbar po zalogowaniu
1. Sprawdź navbar
2. **Oczekiwany rezultat:** 
   - Widoczna nazwa użytkownika
   - Przycisk "Wyloguj"
   - Linki do Home i Projekty

#### Test 4: Wylogowanie
1. Kliknij przycisk "Wyloguj"
2. **Oczekiwany rezultat:** Przekierowanie do `/login`

#### Test 5: Ochrona tras
1. Wyloguj się
2. Spróbuj otworzyć: `http://localhost:3000/trees`
3. **Oczekiwany rezultat:** Przekierowanie do `/login`

#### Test 6: Ochrona API
1. Wyloguj się
2. Otwórz DevTools (F12) → Console
3. Wykonaj: `fetch('/api/trees').then(r => r.json()).then(console.log)`
4. **Oczekiwany rezultat:** Błąd 401 Unauthorized

---

### Krok 3: Testowanie PWA

#### Test 7: Manifest PWA
1. Otwórz DevTools (F12)
2. Application → Manifest
3. **Oczekiwany rezultat:** 
   - Manifest się ładuje
   - Nazwa: "Park M - System Ewidencji Drzew"
   - Ikony zdefiniowane (nawet jeśli nie istnieją fizycznie)

#### Test 8: Service Worker
1. DevTools → Application → Service Workers
2. **Oczekiwany rezultat:** 
   - Service Worker jest zarejestrowany
   - Status: "activated and is running"

#### Test 9: Cache Storage
1. DevTools → Application → Cache Storage
2. **Oczekiwany rezultat:** 
   - Widoczne cache: `openstreetmap-tiles`, `offlineCache`, `image-cache`, `api-cache`

#### Test 10: Wskaźnik Offline
1. Zaloguj się
2. DevTools → Network → Throttling → Offline
3. **Oczekiwany rezultat:** 
   - Czerwony wskaźnik "Tryb offline" w prawym dolnym rogu
4. Przywróć połączenie (Online)
5. **Oczekiwany rezultat:** 
   - Zielony wskaźnik "Połączono z internetem" (znika po 3 sekundach)

---

### Krok 4: Testowanie funkcji aplikacji (po zalogowaniu)

#### Test 11: Strona główna
1. Zaloguj się
2. **Oczekiwany rezultat:** 
   - 3 kafelki: Dodaj Drzewo, Lista Drzew, Mapa
   - Lista funkcji aplikacji

#### Test 12: Dodawanie drzewa
1. Kliknij "Dodaj Drzewo"
2. **Oczekiwany rezultat:** 
   - Formularz dodawania drzewa
   - Automatyczne pobranie GPS (jeśli zezwolisz)

#### Test 13: Lista drzew
1. Kliknij "Lista Drzew"
2. **Oczekiwany rezultat:** 
   - Lista wszystkich drzew
   - Możliwość filtrowania

#### Test 14: Mapa
1. Kliknij "Mapa"
2. **Oczekiwany rezultat:** 
   - Mapa OpenStreetMap
   - Markery drzew (jeśli są dodane)

---

## 📱 Testowanie PWA na telefonie

### Wymagania
- **HTTPS** - dla pełnej funkcjonalności PWA
- Opcje:
  1. Wdróż na Vercel (automatyczne HTTPS)
  2. Użyj ngrok: `ngrok http 3000`
  3. Użyj lokalnego certyfikatu SSL

### Test 15: Instalacja PWA na Android
1. Otwórz aplikację w Chrome na telefonie
2. Menu (⋮) → "Dodaj do ekranu głównego"
3. **Oczekiwany rezultat:** 
   - Prompt instalacji PWA
   - Ikona na ekranie głównym
   - Aplikacja otwiera się w trybie standalone

### Test 16: Instalacja PWA na iPhone
1. Otwórz aplikację w Safari
2. Przycisk "Udostępnij" → "Dodaj do ekranu początkowego"
3. **Oczekiwany rezultat:** 
   - Ikona na ekranie głównym
   - Aplikacja otwiera się bez paska Safari

### Test 17: Offline mode na telefonie
1. Zainstaluj PWA
2. Otwórz aplikację i zaloguj się
3. Przeglądaj kilka stron
4. Wyłącz internet (tryb samolotowy)
5. Otwórz aplikację ponownie
6. **Oczekiwany rezultat:** 
   - Aplikacja się ładuje
   - Wcześniej odwiedzone strony działają
   - Wskaźnik "Tryb offline"

---

## 🔍 Testowanie bezpieczeństwa

### Test 18: Sesja wygasa
1. Zaloguj się
2. Otwórz DevTools → Application → Cookies
3. Znajdź cookie `park-m-session`
4. Usuń cookie
5. Odśwież stronę
6. **Oczekiwany rezultat:** Przekierowanie do `/login`

### Test 19: Nieprawidłowa sesja
1. Zaloguj się
2. DevTools → Application → Cookies
3. Edytuj wartość cookie `park-m-session` (zmień na "invalid")
4. Odśwież stronę
5. **Oczekiwany rezultat:** Przekierowanie do `/login`

### Test 20: Bezpośredni dostęp do API
1. Wyloguj się
2. Spróbuj otworzyć: `http://localhost:3000/api/trees`
3. **Oczekiwany rezultat:** JSON z błędem 401

---

## 🎨 Testowanie UI/UX

### Test 21: Ciemny/Jasny motyw
1. Zaloguj się
2. Kliknij przełącznik motywu w navbarze
3. **Oczekiwany rezultat:** 
   - Płynne przejście między motywami
   - Wszystkie elementy dobrze widoczne

### Test 22: Responsywność
1. Zmień rozmiar okna przeglądarki
2. **Oczekiwany rezultat:** 
   - Navbar dostosowuje się (desktop/mobile)
   - Wszystkie elementy czytelne
   - Brak poziomego scrollowania

### Test 23: Mobilny navbar
1. Zmień rozmiar okna do mobile (<768px)
2. **Oczekiwany rezultat:** 
   - Kompaktowy navbar
   - Ikony z krótkimi etykietami
   - Przycisk wylogowania widoczny

---

## 🐛 Znane ograniczenia

### Ikony PWA
- ❌ Fizyczne pliki ikon PNG nie zostały wygenerowane
- ✅ Manifest jest skonfigurowany
- 📝 **Akcja:** Wygeneruj ikony używając `scripts/generate-icons.js`

### HTTPS dla PWA
- ⚠️ Localhost działa bez HTTPS
- ⚠️ Dla pełnej funkcjonalności PWA na telefonie wymagane HTTPS
- 📝 **Akcja:** Wdróż na Vercel lub użyj ngrok

### Synchronizacja offline
- ⚠️ Dane dodane offline nie są automatycznie synchronizowane
- 📝 **Akcja:** Wymaga implementacji sync queue

---

## ✅ Checklist testowania

- [ ] Przekierowanie do logowania dla niezalogowanych
- [ ] Logowanie działa poprawnie
- [ ] Navbar pokazuje użytkownika i przycisk wylogowania
- [ ] Wylogowanie działa
- [ ] Ochrona tras działa
- [ ] Ochrona API działa
- [ ] Manifest PWA się ładuje
- [ ] Service Worker jest aktywny
- [ ] Cache Storage działa
- [ ] Wskaźnik offline/online działa
- [ ] Wszystkie strony ładują się po zalogowaniu
- [ ] Ciemny/jasny motyw działa
- [ ] Responsywność działa
- [ ] Sesja wygasa po usunięciu cookie

---

## 📝 Raportowanie błędów

Jeśli znajdziesz błąd:
1. Otwórz DevTools (F12) → Console
2. Skopiuj komunikaty błędów
3. Sprawdź Network tab dla błędów API
4. Sprawdź Application → Service Workers dla problemów PWA

---

**Powodzenia w testowaniu! 🧪✨**
