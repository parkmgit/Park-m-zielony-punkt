# 🗄️ Informacje o bazie danych

## ✅ Automatyczny wybór bazy danych

Aplikacja **automatycznie wykrywa środowisko** i używa odpowiedniej bazy:

### 🔧 Lokalnie (Development)
- **Baza:** SQLite
- **Plik:** `park-m-trees.db` (w głównym katalogu projektu)
- **Zalety:**
  - ✅ Nie wymaga instalacji MySQL/MariaDB
  - ✅ Działa bez konfiguracji
  - ✅ Szybkie i proste dla developmentu
  - ✅ Plik bazy można łatwo skopiować/usunąć
  - ✅ Nie wymaga połączenia z internetem

### 🌐 Produkcyjnie (Zenbox)
- **Baza:** MariaDB
- **Host:** s15.zenbox.pl
- **Database:** parkm_trees
- **User:** parkm_drzewa
- **Password:** GoZV5NcZP1
- **Zalety:**
  - ✅ Profesjonalna baza dla produkcji
  - ✅ Dostępna przez phpMyAdmin
  - ✅ Backup przez panel Zenbox
  - ✅ Współdzielona między wieloma instancjami

## 🔄 Jak to działa?

### Wykrywanie środowiska
Aplikacja sprawdza w pliku `lib/db.ts`:
```typescript
const USE_SQLITE = 
  process.env.NODE_ENV === 'development' || 
  process.env.USE_SQLITE === 'true' || 
  !process.env.DB_HOST;
```

**Używa SQLite gdy:**
- `NODE_ENV=development` (domyślnie w `npm run dev`)
- Brak zmiennej `DB_HOST` w środowisku
- Ustawiono `USE_SQLITE=true`

**Używa MariaDB gdy:**
- `NODE_ENV=production`
- Ustawiono `DB_HOST` (np. na Zenbox)

### Przełączanie zapytań
Każde zapytanie (`query`, `queryOne`, `initDB`) automatycznie:
1. Sprawdza flagę `USE_SQLITE`
2. Jeśli `true` - używa `lib/db-sqlite.ts`
3. Jeśli `false` - używa MariaDB przez `mysql2`

## 📁 Struktura plików

```
lib/
├── db.ts          # Główny plik - wykrywa środowisko i deleguje
├── db-sqlite.ts   # Implementacja SQLite (better-sqlite3)
└── auth.ts        # System autentykacji (działa z obiema bazami)
```

## 🚀 Pierwsze uruchomienie

### Lokalnie
```bash
npm run dev
# Otworzyć: http://localhost:3000/api/init
# SQLite utworzy plik park-m-trees.db automatycznie
```

### Na Zenbox
1. Wgraj pliki przez FTP
2. Ustaw zmienne środowiskowe w panelu Zenbox:
   - `NODE_ENV=production`
   - `DB_HOST=localhost` (na serwerze)
   - `DB_USER=parkm_drzewa`
   - `DB_PASSWORD=GoZV5NcZP1`
   - `DB_NAME=parkm_trees`
3. Otwórz: `https://trees.park-m.pl/api/init`

## 🗑️ Reset bazy lokalnej

Jeśli chcesz zacząć od nowa lokalnie:
```bash
# Zatrzymaj serwer (Ctrl+C)
# Usuń plik bazy
rm park-m-trees.db
# Uruchom ponownie
npm run dev
# Zainicjuj: http://localhost:3000/api/init
```

## 🔐 Bezpieczeństwo

- ✅ Plik `park-m-trees.db` jest w `.gitignore` (nie trafi do repozytorium)
- ✅ Hasła są hashowane (bcrypt) w obu bazach
- ✅ Dane dostępowe do MariaDB można przechowywać w zmiennych środowiskowych

## 📦 Zależności

### SQLite (lokalnie)
```json
{
  "better-sqlite3": "^11.x",
  "@types/better-sqlite3": "^7.x"
}
```

### MariaDB (produkcja)
```json
{
  "mysql2": "^3.x"
}
```

## ❓ FAQ

### Czy mogę wymusić MariaDB lokalnie?
Tak! Ustaw zmienną środowiskową:
```bash
DB_HOST=s15.zenbox.pl npm run dev
```

### Czy mogę wymusić SQLite na produkcji?
Nie jest zalecane, ale możliwe:
```bash
USE_SQLITE=true npm run build
```

### Jak przenieść dane z SQLite do MariaDB?
Musisz ręcznie wyeksportować dane. SQLite i MariaDB mają nieco inną składnię SQL.

### Czy dane są kompatybilne?
Tak! Oba schematy są identyczne pod względem struktury tabel i relacji.

---

**Gotowe do użycia! 🎯**
