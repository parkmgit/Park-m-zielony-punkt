# 🎨 Ikony do wygenerowania

Masz plik `public/icon.svg` - teraz musisz stworzyć PNG:

## Opcja 1: Online (najszybsze)
1. Otwórz: https://cloudconvert.com/svg-to-png
2. Upload `public/icon.svg`
3. Ustaw rozmiar: 192x192
4. Pobierz jako `icon-192.png`
5. Powtórz dla 512x512 → `icon-512.png`
6. Umieść w folderze `public/`

## Opcja 2: Photoshop/GIMP
1. Otwórz `icon.svg`
2. Eksportuj jako PNG:
   - 192x192 → `icon-192.png`
   - 512x512 → `icon-512.png`
3. Zapisz w `public/`

## Opcja 3: ImageMagick (CLI)
```bash
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
```

## Opcja 4: Canva
1. Stwórz projekt 512x512
2. Dodaj zielone drzewo + tekst "Park M"
3. Pobierz jako PNG
4. Zmień nazwę na `icon-512.png`
5. Zmniejsz do 192x192 → `icon-192.png`

---

Po wygenerowaniu ikon:
✅ Umieść `icon-192.png` i `icon-512.png` w folderze `public/`
✅ Zrestartuj serwer: `npm run dev`
✅ Gotowe!
