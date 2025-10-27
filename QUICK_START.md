# ⚡ Szybki Start - Park M Trees Zenbox

## 🚀 Jak wrzucić na GitHub (3 kroki)

### 1️⃣ Utwórz repo na GitHub
- Idź na [github.com/new](https://github.com/new)
- Nazwa: `park-m-trees-zenbox`
- **NIE ZAZNACZAJ** "Initialize with README"
- Kliknij "Create repository"

### 2️⃣ Połącz i wyślij (w terminalu)
```bash
cd "c:\Users\emili\OneDrive\Pulpit\Ewidencja Drzew\windsurf-project\park-m-trees-zenbox"

git remote add origin https://github.com/TWOJA-NAZWA/park-m-trees-zenbox.git
git branch -M main
git push -u origin main
```

**Zamień `TWOJA-NAZWA` na swoją nazwę użytkownika GitHub!**

### 3️⃣ Gotowe! ✅
Odśwież stronę GitHub - zobaczysz wszystkie pliki.

---

## 🏗️ Jak wdrożyć na Zenbox

### Krok 1: Baza danych
1. Panel Zenbox → **Bazy danych** → **Utwórz nową**
2. Wybierz **MariaDB**
3. Zapisz dane dostępowe

### Krok 2: Zmienne środowiskowe
W panelu Zenbox dodaj:
- `DB_HOST` - host bazy danych
- `DB_PORT` - `3306`
- `DB_USER` - użytkownik
- `DB_PASSWORD` - hasło
- `DB_NAME` - nazwa bazy
- `NODE_ENV` - `production`

### Krok 3: Wdrożenie
1. Panel Zenbox → **Deploy from Git**
2. Połącz z GitHub
3. Wybierz repo `park-m-trees-zenbox`
4. Branch: `main`
5. Build: `npm run build`
6. Start: `npm start`

### Krok 4: Inicjalizacja
Otwórz: `https://twoja-domena.zenbox.pl/api/init-db`

---

## 📝 Domyślne konta (hasło: password123)
- `admin@park-m.pl` - Administrator
- `jan.kowalski@park-m.pl` - Brygadzista
- `anna.nowak@park-m.pl` - Pracownik

---

## 📚 Pełna dokumentacja
- **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** - Szczegóły GitHub
- **[ZENBOX_DEPLOYMENT.md](./ZENBOX_DEPLOYMENT.md)** - Szczegóły Zenbox
- **[README.md](./README.md)** - Pełna dokumentacja projektu

---

**To wszystko!** Projekt gotowy do użycia! 🎉
