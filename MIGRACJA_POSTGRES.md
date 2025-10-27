# 🗄️ Migracja na Vercel Postgres

## ✅ Co zostało zrobione:

1. ✅ Zainstalowano `@vercel/postgres`
2. ✅ Usunięto `better-sqlite3` i `@types/better-sqlite3`
3. ✅ Przepisano `lib/db.ts` na Postgres
4. ✅ Zaktualizowano `lib/auth.ts` do Postgres
5. ✅ Utworzono endpoint `/api/init-db` do inicjalizacji bazy

---

## 🚀 Kroki wdrożenia na Vercel:

### 1. Utwórz bazę danych Postgres na Vercel

1. Otwórz projekt na Vercel: https://vercel.com/emilkarusnarczyk-yahoocoms-projects/park-m-trees
2. Przejdź do zakładki **Storage**
3. Kliknij **Create Database**
4. Wybierz **Postgres**
5. Wybierz region: **Washington, D.C., USA (iad1)** (ten sam co aplikacja)
6. Kliknij **Create**

### 2. Połącz bazę danych z projektem

1. Po utworzeniu bazy, Vercel automatycznie doda zmienne środowiskowe:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

2. Te zmienne będą dostępne w projekcie automatycznie

### 3. Wdróż aplikację

```bash
git add .
git commit -m "Migrate from SQLite to Vercel Postgres"
git push
```

Vercel automatycznie wdroży nową wersję.

### 4. Inicjalizuj bazę danych

Po wdrożeniu, otwórz w przeglądarce:
```
https://park-m-trees.vercel.app/api/init-db
```

To utworzy wszystkie tabele i wstawi dane domyślne.

---

## 🧪 Testowanie lokalne (opcjonalne)

Jeśli chcesz testować lokalnie z Vercel Postgres:

1. Zainstaluj Vercel CLI:
```bash
npm install -g vercel
```

2. Pobierz zmienne środowiskowe:
```bash
vercel env pull .env.local
```

3. Uruchom lokalnie:
```bash
npm run dev
```

4. Otwórz: http://localhost:3000/api/init-db

---

## 📊 Różnice SQLite vs Postgres:

| Funkcja | SQLite | Postgres |
|---------|--------|----------|
| **PRIMARY KEY** | `INTEGER PRIMARY KEY AUTOINCREMENT` | `SERIAL PRIMARY KEY` |
| **DATETIME** | `DATETIME DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` |
| **Zapytania** | `db.prepare().get()` | `await sql\`SELECT...\`` |
| **INSERT RETURNING** | `result.lastInsertRowid` | `RETURNING *` |
| **Async/Await** | Synchroniczne | Asynchroniczne |

---

## ⚠️ Ważne zmiany:

### Przed (SQLite):
```typescript
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
```

### Po (Postgres):
```typescript
const result = await sql`SELECT * FROM users WHERE id = ${userId}`;
const user = result.rows[0];
```

---

## 🔧 Co jeszcze trzeba zaktualizować:

Wszystkie API routes muszą być zaktualizowane do używania `sql` zamiast `db.prepare()`.

Pliki do aktualizacji:
- ✅ `lib/db.ts`
- ✅ `lib/auth.ts`
- ⏳ `app/api/trees/route.ts`
- ⏳ `app/api/sites/route.ts`
- ⏳ `app/api/species/route.ts`
- ⏳ `app/api/projects/route.ts`
- ⏳ `app/api/users/route.ts`
- ⏳ `app/api/photos/route.ts`
- ⏳ Wszystkie inne API routes

---

## 📱 PWA nadal działa!

Migracja na Postgres **nie wpływa** na funkcjonalność PWA:
- ✅ Manifest PWA
- ✅ Service Worker
- ✅ Offline cache
- ✅ Instalacja na telefonie

---

## 🎯 Następne kroki:

1. Commit i push zmian
2. Utwórz bazę Postgres na Vercel
3. Wdróż aplikację
4. Uruchom `/api/init-db`
5. Zaktualizuj pozostałe API routes
6. Testuj aplikację
7. Zainstaluj PWA na telefonie!

---

**Gotowe! Aplikacja będzie działać na Vercel z Postgres! 🚀**
