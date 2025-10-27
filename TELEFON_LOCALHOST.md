# 📱 Jak uruchomić aplikację na telefonie

## Problem
Aplikacja PWA zainstalowana na telefonie **nie może połączyć się z localhost**, ponieważ localhost na telefonie to inny adres niż na komputerze.

## Rozwiązanie: Użyj adresu IP komputera

### Krok 1: Znajdź adres IP swojego komputera

**Windows:**
1. Otwórz PowerShell lub CMD
2. Wpisz:
```bash
ipconfig
```
3. Znajdź **IPv4 Address** w sekcji "Wireless LAN adapter Wi-Fi" lub "Ethernet adapter"
4. Będzie to coś w stylu: `192.168.1.100` lub `192.168.0.50`

### Krok 2: Uruchom serwer z dostępem sieciowym

Zatrzymaj obecny serwer (Ctrl+C) i uruchom:

```bash
npm run dev -- -H 0.0.0.0
```

Lub dodaj do `package.json`:
```json
"scripts": {
  "dev": "next dev -H 0.0.0.0",
  "dev:local": "next dev"
}
```

### Krok 3: Otwórz aplikację na telefonie

**Na telefonie (w tej samej sieci Wi-Fi):**

Zamiast `http://localhost:3000` użyj:
```
http://TWOJ_ADRES_IP:3000
```

Przykład:
```
http://192.168.1.100:3000
```

### Krok 4: Zainstaluj PWA z nowego adresu

1. Otwórz `http://192.168.1.100:3000` w Chrome na telefonie
2. Zaloguj się
3. Kliknij przycisk "Pobierz" lub użyj menu Chrome → "Dodaj do ekranu głównego"
4. Aplikacja zainstaluje się i będzie działać!

## Ważne uwagi:

### 1. Telefon i komputer muszą być w tej samej sieci Wi-Fi
- Sprawdź czy oba urządzenia są podłączone do tego samego Wi-Fi
- Nie używaj danych mobilnych na telefonie

### 2. Firewall
Jeśli nie działa, może być blokowane przez firewall:

**Windows Firewall:**
1. Otwórz "Windows Defender Firewall"
2. Kliknij "Zezwalaj aplikacji przez zaporę"
3. Znajdź "Node.js" i zaznacz "Prywatne" i "Publiczne"
4. Kliknij OK

### 3. HTTPS dla niektórych funkcji PWA
Niektóre funkcje PWA (np. geolokalizacja, kamera) wymagają HTTPS. Możesz użyć:

**Opcja A: ngrok (najprostsze)**
```bash
# Zainstaluj ngrok
npm install -g ngrok

# Uruchom tunel
ngrok http 3000
```

Otrzymasz publiczny URL typu: `https://abc123.ngrok.io`

**Opcja B: Vercel (do produkcji)**
```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Wdróż aplikację
vercel
```

## Szybki test:

### Na komputerze:
1. Znajdź swój IP: `ipconfig`
2. Uruchom serwer: `npm run dev -- -H 0.0.0.0`
3. Otwórz w przeglądarce: `http://TWOJ_IP:3000`

### Na telefonie:
1. Połącz się z tym samym Wi-Fi
2. Otwórz Chrome
3. Wpisz: `http://TWOJ_IP:3000`
4. Zaloguj się: `admin@park-m.pl` / `password123`

## Alternatywa: Wdróż na Vercel

Jeśli chcesz, aby aplikacja działała zawsze (nie tylko w sieci lokalnej):

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Wdróż
vercel

# Lub z GitHub
# 1. Push do GitHub
# 2. Połącz repozytorium z Vercel
# 3. Automatyczne wdrożenie
```

**Uwaga:** Na Vercel będziesz potrzebować Vercel Postgres zamiast SQLite, ale możesz użyć darmowego planu.
