# 🚀 Jak uruchomić aplikację na Netlify z bazą danych

## ❌ PROBLEM: SQLite nie działa na Netlify!

**Dlaczego logowanie nie działa:**
- Netlify to **serverless** hosting (funkcje Lambda)
- SQLite wymaga **stałego pliku** na dysku
- Netlify **nie ma stałego dysku** - każde żądanie to nowy kontener
- Baza danych **znika** po każdym żądaniu

## ✅ ROZWIĄZANIE: Vercel Postgres (DARMOWE!)

### Krok 1: Utwórz bazę danych na Vercel

1. Wejdź na: https://vercel.com
2. Zaloguj się (możesz użyć GitHub)
3. Kliknij **Storage** → **Create Database**
4. Wybierz **Postgres**
5. Wybierz **Free Plan** (darmowy)
6. Nazwij bazę: `park-m-trees-db`
7. Wybierz region: **Frankfurt** (najbliżej Polski)
8. Kliknij **Create**

### Krok 2: Skopiuj dane połączenia

Po utworzeniu bazy, Vercel pokaże Ci dane połączenia:

```
POSTGRES_URL="postgres://default:..."
POSTGRES_PRISMA_URL="postgres://default:..."
POSTGRES_URL_NON_POOLING="postgres://default:..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

**WAŻNE:** Skopiuj te dane - będą potrzebne!

### Krok 3: Dodaj zmienne środowiskowe na Netlify

1. Otwórz swój projekt na Netlify
2. Przejdź do **Site settings** → **Environment variables**
3. Kliknij **Add a variable**
4. Dodaj każdą zmienną z Vercel:

```
POSTGRES_URL = postgres://default:...
POSTGRES_PRISMA_URL = postgres://default:...
POSTGRES_URL_NON_POOLING = postgres://default:...
POSTGRES_USER = default
POSTGRES_HOST = ...
POSTGRES_PASSWORD = ...
POSTGRES_DATABASE = verceldb
```

5. Kliknij **Save**

### Krok 4: Zaktualizuj kod (JA TO ZROBIĘ)

Zmienię kod z SQLite na Vercel Postgres. Poczekaj chwilę...

### Krok 5: Wdróż ponownie

```bash
git add .
git commit -m "Migracja na Vercel Postgres"
git push
```

Netlify automatycznie wdroży nową wersję.

### Krok 6: Zainicjuj bazę danych

Otwórz w przeglądarce:
```
https://TWOJA-DOMENA.netlify.app/api/init-db
```

Powinieneś zobaczyć:
```json
{"message":"Database initialized successfully"}
```

### Krok 7: Zaloguj się!

Otwórz:
```
https://TWOJA-DOMENA.netlify.app/login
```

Dane logowania:
- Email: `admin@park-m.pl`
- Hasło: `password123`

**GOTOWE!** 🎉

---

## 📊 Porównanie opcji:

### Vercel Postgres (POLECAM)
✅ **Darmowe** (do 256 MB)
✅ **Szybkie** (optymalizowane dla serverless)
✅ **Łatwe** (3 kliknięcia)
✅ **Działa z Netlify**
❌ Wymaga konta Vercel

### Supabase
✅ **Darmowe** (do 500 MB)
✅ **Więcej funkcji** (auth, storage, realtime)
✅ **Działa z Netlify**
❌ Bardziej skomplikowane

### Przenieść na Vercel
✅ **Wszystko w jednym miejscu**
✅ **Automatyczna integracja**
✅ **Darmowe**
❌ Trzeba zmienić hosting

---

## 🔧 Alternatywa: Supabase

Jeśli wolisz Supabase:

1. Wejdź na: https://supabase.com
2. Utwórz projekt
3. Skopiuj **Database URL** z Settings → Database
4. Dodaj na Netlify jako `DATABASE_URL`
5. Zaktualizuj kod (powiedz mi, a zmienię)

---

## ⚠️ WAŻNE:

### Bezpieczeństwo:
- **NIE commituj** zmiennych środowiskowych do Git!
- Dodaj `.env.local` do `.gitignore`
- Zmienne trzymaj tylko na Netlify/Vercel

### Koszty:
- **Vercel Postgres Free:** 256 MB, 60 godzin compute/miesiąc
- **Supabase Free:** 500 MB, 2 GB transfer/miesiąc
- Dla małej aplikacji: **wystarczy darmowy plan!**

---

## 🎯 Co teraz zrobić:

1. **Utwórz bazę Vercel Postgres** (5 minut)
2. **Dodaj zmienne na Netlify** (2 minuty)
3. **Poczekaj aż zaktualizuję kod** (ja to zrobię)
4. **Wdróż ponownie** (`git push`)
5. **Zainicjuj bazę** (`/api/init-db`)
6. **Zaloguj się!** 🎉

**Powiedz mi gdy utworzysz bazę na Vercel, a ja zaktualizuję kod!**
