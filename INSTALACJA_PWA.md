# 📱 Instalacja PWA - Park M na Telefon

## 🎯 Cel: Zainstalować aplikację na telefonie jak natywną aplikację

---

## ✅ Co już masz:

1. ✅ Manifest PWA (`public/manifest.json`)
2. ✅ Service Worker (next-pwa)
3. ✅ Logo (`public/logo.png`)
4. ✅ Offline mode
5. ✅ Metadata w `layout.tsx`

---

## 🚀 Kroki do instalacji na telefonie:

### Krok 1: Wygeneruj ikony PWA

Masz 3 opcje:

#### Opcja A: Online (Najłatwiejsze) ⭐
1. Otwórz: https://www.pwabuilder.com/imageGenerator
2. Wgraj `public/logo.png`
3. Wybierz "Android" i "iOS"
4. Pobierz ZIP
5. Rozpakuj i skopiuj pliki do `public/`:
   - `icon-192.png`
   - `icon-512.png`
   - `icon-maskable-192.png`
   - `icon-maskable-512.png`

#### Opcja B: ImageMagick (CLI)
```bash
# Zainstaluj ImageMagick
# Potem wygeneruj ikony:
magick logo.png -resize 192x192 icon-192.png
magick logo.png -resize 512x512 icon-512.png
```

#### Opcja C: Photoshop/GIMP
1. Otwórz `logo.png`
2. Zmień rozmiar na 192x192 → Zapisz jako `icon-192.png`
3. Zmień rozmiar na 512x512 → Zapisz jako `icon-512.png`

---

### Krok 2: Wdróż na HTTPS

PWA **wymaga HTTPS**! Masz 3 opcje:

#### Opcja A: Vercel (Zalecane - Darmowe) ⭐
```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Wdróż
vercel

# Postępuj zgodnie z instrukcjami
# Otrzymasz URL: https://park-m-trees.vercel.app
```

#### Opcja B: Netlify
```bash
# Zainstaluj Netlify CLI
npm install -g netlify-cli

# Wdróż
netlify deploy --prod
```

#### Opcja C: Ngrok (Tymczasowe, do testów)
```bash
# Zainstaluj ngrok
# Uruchom aplikację lokalnie
npm run dev

# W nowym terminalu:
ngrok http 3000

# Otrzymasz URL: https://abc123.ngrok.io
```

---

### Krok 3: Zainstaluj na telefonie

#### Android (Chrome):
1. Otwórz aplikację w Chrome na telefonie
2. Wejdź na URL (np. `https://park-m-trees.vercel.app`)
3. Kliknij **Menu (⋮)** → **"Dodaj do ekranu głównego"**
4. Potwierdź instalację
5. Ikona pojawi się na ekranie głównym! 🎉

#### iPhone (Safari):
1. Otwórz aplikację w Safari
2. Kliknij przycisk **"Udostępnij"** (kwadrat ze strzałką)
3. Przewiń w dół i wybierz **"Dodaj do ekranu początkowego"**
4. Potwierdź
5. Ikona pojawi się na ekranie głównym! 🎉

---

## 🧪 Testowanie PWA

### Test 1: Sprawdź manifest
1. Otwórz aplikację w Chrome
2. DevTools (F12) → **Application** → **Manifest**
3. Sprawdź czy manifest się ładuje
4. Sprawdź czy ikony są widoczne

### Test 2: Sprawdź Service Worker
1. DevTools → **Application** → **Service Workers**
2. Sprawdź status: "activated and is running"

### Test 3: Sprawdź instalację
1. DevTools → **Application** → **Manifest**
2. Kliknij **"Add to homescreen"**
3. Sprawdź czy prompt się pojawia

### Test 4: Offline mode
1. Zainstaluj aplikację
2. Otwórz aplikację
3. Wyłącz internet (tryb samolotowy)
4. Aplikacja powinna działać! ✅

---

## 📊 Lighthouse Score

Sprawdź jakość PWA:

1. Otwórz Chrome DevTools (F12)
2. **Lighthouse** tab
3. Wybierz **"Progressive Web App"**
4. Kliknij **"Generate report"**
5. Cel: **90+ punktów** ✅

---

## 🎨 Customizacja

### Zmiana koloru motywu:
Edytuj `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  themeColor: '#22c55e', // Zmień kolor
}
```

### Zmiana nazwy aplikacji:
Edytuj `public/manifest.json`:
```json
{
  "name": "Park M - Twoja Nazwa",
  "short_name": "Park M"
}
```

---

## 🔧 Rozwiązywanie problemów

### Problem: "Add to homescreen" nie pojawia się
**Rozwiązanie:**
- Sprawdź czy masz HTTPS
- Sprawdź czy manifest jest poprawny
- Sprawdź czy Service Worker działa
- Sprawdź czy ikony istnieją

### Problem: Ikony nie ładują się
**Rozwiązanie:**
- Sprawdź czy pliki `icon-*.png` są w `public/`
- Sprawdź ścieżki w `manifest.json`
- Wyczyść cache (Ctrl+Shift+R)

### Problem: Offline nie działa
**Rozwiązanie:**
- Sprawdź Service Worker w DevTools
- Sprawdź Cache Storage
- Odśwież aplikację kilka razy

### Problem: PWA nie instaluje się na iPhone
**Rozwiązanie:**
- Użyj **Safari** (nie Chrome!)
- Sprawdź czy masz HTTPS
- Sprawdź czy manifest jest poprawny

---

## 📱 Funkcje PWA

### Co działa offline:
- ✅ Przeglądanie wcześniej załadowanych stron
- ✅ Przeglądanie drzew (cache)
- ✅ Mapa (kafelki cache)
- ✅ Zdjęcia (cache)

### Co wymaga internetu:
- ❌ Dodawanie nowych drzew
- ❌ Edycja danych
- ❌ Logowanie
- ❌ Synchronizacja

---

## 🚀 Wdrożenie krok po kroku

### 1. Przygotowanie (5 min)
```bash
# Wygeneruj ikony (online tool)
# Skopiuj do public/
```

### 2. Test lokalny (2 min)
```bash
npm run dev
# Otwórz http://localhost:3000
# Sprawdź DevTools → Application
```

### 3. Wdrożenie (5 min)
```bash
# Vercel
vercel

# Lub Netlify
netlify deploy --prod
```

### 4. Test na telefonie (3 min)
```
# Otwórz URL na telefonie
# Zainstaluj PWA
# Testuj offline mode
```

---

## ✅ Checklist

- [ ] Ikony PWA wygenerowane (192, 512, maskable)
- [ ] Ikony skopiowane do `public/`
- [ ] Manifest poprawny
- [ ] Service Worker działa
- [ ] Wdrożone na HTTPS (Vercel/Netlify)
- [ ] Przetestowane na Android
- [ ] Przetestowane na iPhone
- [ ] Offline mode działa
- [ ] Lighthouse score > 90

---

## 🎯 Następne kroki

Po instalacji PWA:
1. Dodaj **Push Notifications** (opcjonalnie)
2. Dodaj **Background Sync** (synchronizacja offline)
3. Dodaj **Share API** (udostępnianie)
4. Dodaj **Shortcuts** (skróty w menu)

---

**Gotowe! Teraz możesz zainstalować Park M na telefonie! 📱✨**
