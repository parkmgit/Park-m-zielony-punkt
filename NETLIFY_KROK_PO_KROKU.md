# 🚀 NETLIFY - Krok po kroku (NAJPROSTSZE ROZWIĄZANIE)

## ❌ PROBLEM
SQLite nie działa na Netlify → logowanie nie działa

## ✅ ROZWIĄZANIE
Użyj Vercel Postgres (darmowe!)

---

## KROK 1: Utwórz bazę danych (5 minut)

### 1.1 Wejdź na Vercel
https://vercel.com → Zaloguj się (możesz użyć GitHub)

### 1.2 Utwórz bazę
1. Kliknij **Storage** (w menu bocznym)
2. Kliknij **Create Database**
3. Wybierz **Postgres**
4. Wybierz **Hobby** (darmowy plan)
5. Nazwij: `park-m-trees-db`
6. Region: **Frankfurt** (najbliżej Polski)
7. Kliknij **Create**

### 1.3 Skopiuj dane połączenia
Po utworzeniu bazy, kliknij na nią i przejdź do zakładki **.env.local**

Skopiuj WSZYSTKIE zmienne (będzie ich około 6-7):
```
POSTGRES_URL="postgres://default:..."
POSTGRES_PRISMA_URL="postgres://default:..."
POSTGRES_URL_NON_POOLING="postgres://default:..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

**WAŻNE:** Zapisz te dane w notatniku - będą potrzebne!

---

## KROK 2: Dodaj zmienne na Netlify (3 minuty)

### 2.1 Otwórz swój projekt na Netlify
https://app.netlify.com → Twój projekt

### 2.2 Przejdź do ustawień
**Site settings** → **Environment variables** (w menu bocznym)

### 2.3 Dodaj zmienne
Kliknij **Add a variable** i dodaj KAŻDĄ zmienną z Vercel:

```
Klucz: POSTGRES_URL
Wartość: postgres://default:... (skopiuj z Vercel)

Klucz: POSTGRES_PRISMA_URL  
Wartość: postgres://default:... (skopiuj z Vercel)

Klucz: POSTGRES_URL_NON_POOLING
Wartość: postgres://default:... (skopiuj z Vercel)

Klucz: POSTGRES_USER
Wartość: default

Klucz: POSTGRES_HOST
Wartość: ... (skopiuj z Vercel)

Klucz: POSTGRES_PASSWORD
Wartość: ... (skopiuj z Vercel)

Klucz: POSTGRES_DATABASE
Wartość: verceldb
```

### 2.4 Zapisz
Kliknij **Save** po dodaniu wszystkich zmiennych

---

## KROK 3: Wdróż zaktualizowany kod (2 minuty)

### 3.1 Commit i push
```bash
git add .
git commit -m "Migracja na Vercel Postgres dla Netlify"
git push
```

### 3.2 Poczekaj na wdrożenie
Netlify automatycznie wdroży nową wersję (1-2 minuty)

---

## KROK 4: Zainicjuj bazę danych (1 minuta)

### 4.1 Otwórz w przeglądarce
```
https://TWOJA-DOMENA.netlify.app/api/init-db
```

Zamień `TWOJA-DOMENA` na swoją domenę Netlify (np. `park-m-trees.netlify.app`)

### 4.2 Sprawdź odpowiedź
Powinieneś zobaczyć:
```json
{"message":"Database initialized successfully"}
```

Jeśli widzisz błąd, sprawdź czy wszystkie zmienne środowiskowe zostały dodane poprawnie.

---

## KROK 5: ZALOGUJ SIĘ! 🎉

### 5.1 Otwórz stronę logowania
```
https://TWOJA-DOMENA.netlify.app/login
```

### 5.2 Użyj danych logowania
```
Email: admin@park-m.pl
Hasło: password123
```

### 5.3 Kliknij "Zaloguj"

**GOTOWE!** Logowanie powinno działać! 🎉

---

## 🔧 ROZWIĄZYWANIE PROBLEMÓW

### Problem: "Failed to initialize database"
**Rozwiązanie:**
1. Sprawdź czy wszystkie zmienne środowiskowe zostały dodane na Netlify
2. Sprawdź czy wartości są poprawnie skopiowane (bez spacji na początku/końcu)
3. Poczekaj 2-3 minuty i spróbuj ponownie

### Problem: "Nieprawidłowy email lub hasło"
**Rozwiązanie:**
1. Upewnij się że baza została zainicjowana (`/api/init-db`)
2. Sprawdź czy używasz `admin@park-m.pl` (z myślnikiem!)
3. Sprawdź czy hasło to `password123`

### Problem: "Cannot connect to database"
**Rozwiązanie:**
1. Sprawdź czy baza Vercel Postgres jest aktywna
2. Sprawdź czy zmienne środowiskowe są poprawne
3. Sprawdź logi na Netlify: **Deploys** → kliknij na ostatni deploy → **Function logs**

---

## 📊 CO ZOSTAŁO ZMIENIONE W KODZIE

Zaktualizowałem następujące pliki aby używały Vercel Postgres zamiast SQLite:

✅ `/api/auth/login/route.ts` - logowanie
✅ `/api/auth/register/route.ts` - rejestracja  
✅ `/api/auth/logout/route.ts` - wylogowanie
✅ `/api/auth/me/route.ts` - pobieranie użytkownika
✅ `/api/init/route.ts` - inicjalizacja bazy

**Uwaga:** Pozostałe endpointy (`/api/projects`, `/api/trees`, etc.) będą wymagały aktualizacji, ale logowanie i rejestracja już działają!

---

## 💰 KOSZTY

### Vercel Postgres - Hobby Plan (DARMOWY):
- ✅ 256 MB storage
- ✅ 60 godzin compute/miesiąc
- ✅ Wystarczy dla małej/średniej aplikacji
- ✅ Bez karty kredytowej

### Netlify - Free Plan:
- ✅ 100 GB bandwidth/miesiąc
- ✅ 300 minut build/miesiąc
- ✅ Wystarczy dla większości projektów

**Razem: 0 zł/miesiąc!** 🎉

---

## 🎯 PODSUMOWANIE

1. ✅ Utwórz bazę Vercel Postgres (5 min)
2. ✅ Dodaj zmienne na Netlify (3 min)
3. ✅ Wdróż kod (`git push`) (2 min)
4. ✅ Zainicjuj bazę (`/api/init-db`) (1 min)
5. ✅ Zaloguj się! (`admin@park-m.pl` / `password123`)

**Łączny czas: ~11 minut**

**Powiedz mi gdy utworzysz bazę na Vercel i dodam zmienne, a pomogę Ci z resztą!** 🚀
