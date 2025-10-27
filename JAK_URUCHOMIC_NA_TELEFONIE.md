# 📱 JAK URUCHOMIĆ APLIKACJĘ NA TELEFONIE - KROK PO KROKU

## Problem
Aplikacja PWA na telefonie nie może połączyć się z `localhost:3000`, bo to adres tylko na komputerze.

## ✅ ROZWIĄZANIE (3 PROSTE KROKI):

### KROK 1: Sprawdź swój adres IP

**Opcja A - Automatycznie (NAJŁATWIEJSZE):**
1. Kliknij prawym na plik `pokaz-ip.ps1`
2. Wybierz "Uruchom w PowerShell"
3. Zapisz wyświetlony adres IP (np. `192.168.1.100`)

**Opcja B - Ręcznie:**
1. Otwórz PowerShell lub CMD
2. Wpisz: `ipconfig`
3. Znajdź "IPv4 Address" przy Wi-Fi
4. Zapisz adres (np. `192.168.1.100`)

---

### KROK 2: Uruchom serwer z dostępem sieciowym

**W terminalu wpisz:**
```bash
npm run dev:network
```

**Zobaczysz coś takiego:**
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000
```

**Zapisz adres Network!** (np. `http://192.168.1.100:3000`)

---

### KROK 3: Otwórz aplikację na telefonie

**Na telefonie (w Chrome):**

1. **Upewnij się że telefon jest w tej samej sieci Wi-Fi co komputer!**

2. Otwórz Chrome

3. Wpisz adres z KROKU 2, np:
   ```
   http://192.168.1.100:3000
   ```

4. Zaloguj się:
   - Email: `admin@park-m.pl`
   - Hasło: `password123`

5. Kliknij przycisk **"Pobierz"** w górnym pasku

6. Kliknij **"Dodaj do ekranu głównego"**

7. **GOTOWE!** Ikona aplikacji pojawi się na ekranie głównym!

---

## ⚠️ WAŻNE:

### Telefon i komputer muszą być w tej samej sieci Wi-Fi!
- Sprawdź czy oba urządzenia są podłączone do tego samego Wi-Fi
- **NIE używaj danych mobilnych na telefonie**

### Jeśli nie działa - sprawdź firewall:

**Windows Firewall:**
1. Wyszukaj "Zapora Windows Defender"
2. Kliknij "Zezwalaj aplikacji przez zaporę"
3. Kliknij "Zmień ustawienia"
4. Znajdź "Node.js" lub "Node.js: Server-side JavaScript"
5. Zaznacz **obie** opcje: "Prywatne" i "Publiczne"
6. Kliknij OK
7. Uruchom serwer ponownie

---

## 🎯 SZYBKI TEST:

### 1. Na komputerze:
```bash
# Uruchom skrypt
.\pokaz-ip.ps1

# Lub ręcznie:
ipconfig
npm run dev:network
```

### 2. Na telefonie:
- Otwórz Chrome
- Wpisz: `http://TWOJ_IP:3000` (np. `http://192.168.1.100:3000`)
- Zaloguj się
- Kliknij "Pobierz"

---

## 🔧 ROZWIĄZYWANIE PROBLEMÓW:

### Problem: "Nie można połączyć się z serwerem"
**Rozwiązanie:**
1. Sprawdź czy telefon i komputer są w tej samej sieci Wi-Fi
2. Sprawdź czy serwer działa (`npm run dev:network`)
3. Sprawdź firewall (patrz wyżej)
4. Spróbuj wyłączyć VPN na komputerze

### Problem: "Strona nie ładuje się"
**Rozwiązanie:**
1. Sprawdź czy adres IP jest poprawny
2. Upewnij się że używasz `http://` a nie `https://`
3. Sprawdź czy port 3000 nie jest zajęty

### Problem: "Logowanie nie działa"
**Rozwiązanie:**
1. Otwórz na telefonie: `http://TWOJ_IP:3000/api/init`
2. Powinieneś zobaczyć: `{"message":"Database initialized successfully"}`
3. Wróć do logowania i spróbuj ponownie

---

## 📝 PRZYKŁAD:

Jeśli Twój adres IP to `192.168.1.100`:

1. **Uruchom:** `npm run dev:network`
2. **Na telefonie otwórz:** `http://192.168.1.100:3000`
3. **Zaloguj się:** `admin@park-m.pl` / `password123`
4. **Kliknij:** "Pobierz"
5. **Gotowe!** 🎉

---

## 🌐 ALTERNATYWA: Wdróż na Vercel (dla stałego dostępu)

Jeśli chcesz aby aplikacja działała zawsze (nie tylko w sieci lokalnej):

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Wdróż
vercel
```

Otrzymasz publiczny URL typu: `https://park-m-trees.vercel.app`

**Uwaga:** Na Vercel będziesz potrzebować Vercel Postgres zamiast SQLite.
