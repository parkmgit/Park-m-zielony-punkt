# 🚀 Wdrożenie aplikacji na Zenbox

## 📋 Wymagania

- ✅ Konto na Zenbox: drzewa@trees.park-m.pl
- ✅ Dostęp FTP: s15.zenbox.pl
- ✅ Baza danych MariaDB już skonfigurowana w panelu Zenbox

## 🎯 Metody wdrożenia

### Metoda 1: FTP (FileZilla) - POLECANA

### Metoda 2: Git + Zenbox Auto Deploy

### Metoda 3: Ręczne kopiowanie przez panel Zenbox

---

## 📦 Metoda 1: FTP (FileZilla)

### Krok 1: Zbuduj aplikację

```bash
npm run build
```

To utworzy folder `.next` z skompilowaną aplikacją.

### Krok 2: Połącz się z FTP

**W FileZilla:**
- **Host:** s15.zenbox.pl (lub ftp.s15.zenbox.pl)
- **Username:** drzewa@trees.park-m.pl
- **Password:** YvoUtEoZ7z
- **Port:** 21 (FTP) lub 22 (SFTP jeśli dostępne)

### Krok 3: Wgraj pliki

**Katalogi i pliki do wgrania:**

```
public_html/  (lub główny katalog na Zenbox)
├── .next/              # Wygenerowane przez npm run build
├── public/             # Pliki statyczne
├── node_modules/       # Zależności (jeśli Zenbox nie ma npm)
├── app/                # Kod aplikacji
├── components/         # Komponenty React
├── lib/                # Biblioteki (auth, db)
├── middleware.ts       # Middleware Next.js
├── next.config.js      # Konfiguracja Next.js
├── package.json        # Zależności
├── tailwind.config.js  # Konfiguracja Tailwind
└── tsconfig.json       # TypeScript config
```

**⚠️ NIE wgrywaj:**
- `park-m-trees.db` (plik SQLite - tylko lokalny)
- `.env` (jeśli istnieje)
- `README.md`, `*.md` (opcjonalnie)

### Krok 4: Zainstaluj zależności na serwerze

**Jeśli Zenbox ma dostęp do SSH:**
```bash
ssh drzewa@s15.zenbox.pl
cd public_html  # lub katalog aplikacji
npm install --production
```

**Jeśli Zenbox NIE ma npm/node:**
Musisz wgrać cały folder `node_modules/` przez FTP (może być wolne!).

### Krok 5: Skonfiguruj zmienne środowiskowe na Zenbox

**W panelu Zenbox (cPanel lub podobny):**

Utwórz plik `.env.production` lub ustaw zmienne w panelu:

```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=parkm_drzewa
DB_PASSWORD=GoZV5NcZP1
DB_NAME=parkm_trees
```

**⚠️ Ważne:** Na serwerze Zenbox `DB_HOST` powinien być `localhost` (nie `s15.zenbox.pl`), ponieważ aplikacja działa NA TYM SAMYM serwerze co baza danych.

### Krok 6: Uruchom aplikację

**Jeśli Zenbox obsługuje Node.js:**

```bash
npm start
# lub
node server.js  # jeśli masz własny server.js
# lub
npx next start
```

**Jeśli Zenbox używa Apache/Nginx:**
Skonfiguruj reverse proxy do aplikacji Node.js.

### Krok 7: Zainicjuj bazę danych

Otwórz w przeglądarce:
```
https://trees.park-m.pl/api/init
```

Powinieneś zobaczyć:
```json
{"message":"Database initialized successfully"}
```

---

## 📦 Metoda 2: Git + Auto Deploy

### Krok 1: Utwórz repozytorium Git

```bash
git init
git add .
git commit -m "Initial commit"
```

### Krok 2: Połącz z GitHub/GitLab

```bash
git remote add origin https://github.com/twoj-uzytkownik/park-m-trees.git
git push -u origin main
```

### Krok 3: Skonfiguruj Auto Deploy w Zenbox

W panelu Zenbox:
1. Znajdź opcję "Git Version Control" lub "Deploy"
2. Podaj URL repozytorium
3. Ustaw branch: `main`
4. Zenbox automatycznie ściągnie kod przy każdym push

---

## 🔧 Konfiguracja serwera Zenbox

### Node.js na Zenbox

**Sprawdź czy Node.js jest dostępne:**
```bash
ssh drzewa@s15.zenbox.pl
node --version
npm --version
```

**Jeśli brak Node.js:**
- Skontaktuj się z supportem Zenbox
- Poproś o instalację Node.js 18+ lub 20+
- Lub użyj CloudLinux Node.js Selector (jeśli dostępne)

### Apache/Nginx Reverse Proxy

**Przykładowa konfiguracja `.htaccess` dla Apache:**

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

To przekieruje ruch z `trees.park-m.pl` do aplikacji Next.js na porcie 3000.

---

## ✅ Weryfikacja wdrożenia

### 1. Sprawdź czy strona działa
```
https://trees.park-m.pl
```

### 2. Sprawdź logi serwera
W terminalu SSH:
```bash
pm2 logs  # jeśli używasz PM2
# lub
tail -f logs/application.log
```

### 3. Sprawdź czy baza działa
Otwórz phpMyAdmin na Zenbox i sprawdź czy tabele zostały utworzone.

### 4. Zaloguj się
```
https://trees.park-m.pl/login
```

Email: `admin@park-m.pl`  
Hasło: `password123`

---

## 🔄 Aktualizacja aplikacji

### FTP
1. Zbuduj: `npm run build`
2. Wgraj nowy folder `.next/`
3. Zrestartuj aplikację na serwerze

### Git
1. Zacommituj zmiany:
   ```bash
   git add .
   git commit -m "Update"
   git push
   ```
2. Na Zenbox:
   ```bash
   git pull
   npm install  # jeśli zmieniły się zależności
   npm run build
   pm2 restart park-m-trees  # lub restart serwera
   ```

---

## 🛠️ PM2 (Process Manager) - POLECANE

PM2 utrzymuje aplikację działającą non-stop.

### Instalacja PM2
```bash
npm install -g pm2
```

### Uruchomienie aplikacji
```bash
cd /home/drzewa/public_html
pm2 start npm --name "park-m-trees" -- start
pm2 save
pm2 startup
```

### Komendy PM2
```bash
pm2 status           # Status aplikacji
pm2 logs             # Logi
pm2 restart park-m-trees   # Restart
pm2 stop park-m-trees      # Stop
pm2 delete park-m-trees    # Usuń
```

---

## 📋 Checklist wdrożenia

- [ ] Zbuduj aplikację: `npm run build`
- [ ] Połącz się FTP do s15.zenbox.pl
- [ ] Wgraj wszystkie pliki (oprócz .db, .env)
- [ ] Zainstaluj zależności: `npm install --production`
- [ ] Ustaw zmienne środowiskowe (`.env.production`)
- [ ] Uruchom aplikację: `npm start` lub PM2
- [ ] Skonfiguruj reverse proxy (jeśli potrzebne)
- [ ] Otwórz: `https://trees.park-m.pl/api/init`
- [ ] Sprawdź logowanie: `https://trees.park-m.pl/login`
- [ ] Skonfiguruj PM2 do auto-restartu

---

## ❓ Rozwiązywanie problemów

### "Cannot find module"
```bash
npm install --production
```

### Błąd połączenia z bazą
Upewnij się że:
- `DB_HOST=localhost` (nie s15.zenbox.pl)
- Baza `parkm_trees` istnieje w phpMyAdmin
- User `parkm_drzewa` ma uprawnienia

### Port zajęty
```bash
# Znajdź proces
lsof -i :3000
# Zabij proces
kill -9 <PID>
```

### Brak Node.js na Zenbox
Skontaktuj się z supportem Zenbox i poproś o:
- Instalację Node.js 18+
- Dostęp do npm
- Możliwość uruchamiania aplikacji Node.js

---

## 📞 Wsparcie

**Zenbox Support:**
- Panel: https://panel.zenbox.pl
- Email: support@zenbox.pl
- Telefon: (sprawdź na stronie zenbox.pl)

**Dokumentacja Next.js:**
- https://nextjs.org/docs/deployment

---

**Powodzenia! 🚀**
