# Skrypt przygotowania aplikacji do wdrożenia na Zenbox
# Użycie: .\prepare-deploy.ps1

Write-Host "🚀 Przygotowanie aplikacji do wdrożenia na Zenbox..." -ForegroundColor Green

# 1. Zbuduj aplikację
Write-Host "`n📦 Krok 1: Budowanie aplikacji..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Błąd podczas budowania aplikacji!" -ForegroundColor Red
    exit 1
}

# 2. Utwórz katalog deploy
Write-Host "`n📁 Krok 2: Tworzenie katalogu deploy..." -ForegroundColor Yellow
$deployDir = "deploy"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# 3. Kopiuj niezbędne pliki i foldery
Write-Host "`n📋 Krok 3: Kopiowanie plików..." -ForegroundColor Yellow

$itemsToCopy = @(
    ".next",
    "public",
    "app",
    "components",
    "lib",
    "middleware.ts",
    "next.config.mjs",
    "package.json",
    "package-lock.json",
    "tailwind.config.ts",
    "tsconfig.json",
    "postcss.config.mjs"
)

foreach ($item in $itemsToCopy) {
    if (Test-Path $item) {
        Write-Host "  ✓ Kopiowanie: $item" -ForegroundColor Gray
        Copy-Item -Path $item -Destination $deployDir -Recurse -Force
    } else {
        Write-Host "  ⚠ Pominięto (nie istnieje): $item" -ForegroundColor DarkGray
    }
}

# 4. Utwórz plik .env.production
Write-Host "`n🔧 Krok 4: Tworzenie .env.production..." -ForegroundColor Yellow
$envContent = @"
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=parkm_drzewa
DB_PASSWORD=GoZV5NcZP1
DB_NAME=parkm_trees
"@

Set-Content -Path "$deployDir\.env.production" -Value $envContent
Write-Host "  ✓ Utworzono .env.production" -ForegroundColor Gray

# 5. Utwórz README dla wdrożenia
Write-Host "`n📄 Krok 5: Tworzenie instrukcji wdrożenia..." -ForegroundColor Yellow
$readmeContent = @'
WDROZENIE NA ZENBOX
===================

INSTRUKCJA:

1. Polacz sie FTP do s15.zenbox.pl
   User: drzewa@trees.park-m.pl
   Password: YvoUtEoZ7z

2. Wgraj CALA zawartosc tego folderu do katalogu glownego na Zenbox

3. Zainstaluj zaleznosci (SSH):
   cd /home/drzewa/public_html
   npm install --production

4. Uruchom aplikacje:
   npm start
   
   lub z PM2:
   pm2 start npm --name "park-m-trees" -- start
   pm2 save

5. Zainicjuj baze:
   Otworz: https://trees.park-m.pl/api/init

6. Zaloguj sie:
   https://trees.park-m.pl/login
   Email: admin@park-m.pl
   Haslo: password123

WAZNE:

* Plik .env.production zawiera dane do bazy (juz skonfigurowane)
* DB_HOST=localhost (bo baza jest na tym samym serwerze)
* Jesli Zenbox nie ma npm, musisz wgrac tez folder node_modules/

---
Szczegoly: WDROZENIE_ZENBOX.md
'@

Set-Content -Path "$deployDir\README_DEPLOY.txt" -Value $readmeContent
Write-Host "  ✓ Utworzono README_DEPLOY.txt" -ForegroundColor Gray

# 6. Podsumowanie
Write-Host "`n✅ Gotowe!" -ForegroundColor Green
Write-Host "`n📦 Pliki gotowe do wdrożenia znajdują się w folderze: $deployDir" -ForegroundColor Cyan
Write-Host "`nKolejne kroki:" -ForegroundColor Yellow
Write-Host "  1. Połącz się FTP do s15.zenbox.pl" -ForegroundColor White
Write-Host "  2. Wgraj zawartość folderu 'deploy' na serwer" -ForegroundColor White
Write-Host "  3. Zainstaluj zależności: npm install --production" -ForegroundColor White
Write-Host "  4. Uruchom: npm start lub PM2" -ForegroundColor White
Write-Host "  5. Zainicjuj bazę: https://trees.park-m.pl/api/init" -ForegroundColor White
Write-Host "`nSzczegóły: WDROZENIE_ZENBOX.md`n" -ForegroundColor Gray
