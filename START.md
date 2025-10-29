# 🚀 SZYBKI START - Park M Trees

## ⚡ NAPRAWIONO! SQLite teraz działa lokalnie!

Jeśli miałeś/aś błąd połączenia z MariaDB - jest naprawiony. Aplikacja teraz zawsze używa SQLite lokalnie.

## ✅ Konfiguracja GOTOWA!

Projekt używa **automatycznego wyboru bazy danych**:

### 🔧 Lokalnie (Twój komputer):
- **SQLite** - plik `park-m-trees.db`
- Działa bez konfiguracji
- Nie wymaga serwera MySQL/MariaDB

### 🌐 Produkcyjnie (Zenbox):
- **MariaDB** na s15.zenbox.pl
- Database: parkm_trees
- User: parkm_drzewa
- ✅ Hasło wpisane w kodzie

## 🎯 CO TERAZ ZROBIĆ?

### 1️⃣ ZRESTARTUJ SERWER DEV

**W terminalu gdzie działa `npm run dev`:**
- Naciśnij **Ctrl+C** (zatrzymaj serwer)
- Uruchom ponownie:
```bash
npm run dev
```

### 2️⃣ ZAINICJUJ BAZĘ DANYCH

Otwórz w przeglądarce:
```
http://localhost:3000/api/init
```

Powinieneś zobaczyć:
```json
{"message":"Database initialized successfully"}
```

✅ Baza zostanie automatycznie utworzona na serwerze Zenbox!

### 3️⃣ ZALOGUJ SIĘ

Otwórz:
```
http://localhost:3000/login
```

**Użyj konta testowego:**
- Email: `admin@park-m.pl`
- Hasło: `password123`

### 4️⃣ LUB ZAREJESTRUJ NOWE KONTO

```
http://localhost:3000/register
```

Wymagania:
- Email musi kończyć się na `@park-m.pl`
- Np: `emilia.rusnarczyk@park-m.pl`
- Hasło min. 6 znaków

---

## ✅ Zalety tego rozwiązania:

- 🔧 **Lokalnie:** SQLite działa bez konfiguracji, bez serwera
- 🌐 **Produkcyjnie:** MariaDB na Zenbox
- 🚀 **Automatyczne:** Aplikacja sama wykrywa środowisko
- 💾 **Przenośne:** Plik bazy danych w projekcie

---

## 📋 Wszystkie dane dostępowe:

Patrz: **DANE_LOGOWANIA.md** lub **INSTRUKCJA_URUCHOMIENIA.md**
