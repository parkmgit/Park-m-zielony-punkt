# Simple deployment preparation script
# Usage: .\prepare-deploy-simple.ps1

Write-Host "Preparing application for Zenbox deployment..." -ForegroundColor Green

# 1. Build application
Write-Host "`nStep 1: Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# 2. Create deploy directory
Write-Host "`nStep 2: Creating deploy directory..." -ForegroundColor Yellow
$deployDir = "deploy"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# 3. Copy files
Write-Host "`nStep 3: Copying files..." -ForegroundColor Yellow

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
        Write-Host "  Copying: $item" -ForegroundColor Gray
        Copy-Item -Path $item -Destination $deployDir -Recurse -Force
    }
}

# 4. Create .env.production
Write-Host "`nStep 4: Creating .env.production..." -ForegroundColor Yellow
@"
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=parkm_drzewa
DB_PASSWORD=GoZV5NcZP1
DB_NAME=parkm_trees
"@ | Out-File -FilePath "$deployDir\.env.production" -Encoding UTF8

Write-Host "  Created .env.production" -ForegroundColor Gray

# 5. Create README
Write-Host "`nStep 5: Creating deployment instructions..." -ForegroundColor Yellow
@"
DEPLOYMENT TO ZENBOX
====================

INSTRUCTIONS:

1. Connect via FTP to s15.zenbox.pl
   User: drzewa@trees.park-m.pl
   Password: YvoUtEoZ7z

2. Upload ALL contents of this folder to the main directory on Zenbox

3. Install dependencies (via SSH):
   cd /home/drzewa/public_html
   npm install --production

4. Start the application:
   npm start
   
   Or with PM2:
   pm2 start npm --name "park-m-trees" -- start
   pm2 save

5. Initialize database:
   Open: https://trees.park-m.pl/api/init

6. Login:
   https://trees.park-m.pl/login
   Email: admin@park-m.pl
   Password: password123

IMPORTANT:

- .env.production file contains database credentials (already configured)
- DB_HOST=localhost (because database is on the same server)
- If Zenbox doesn't have npm, you need to upload node_modules/ folder too

---
Details: WDROZENIE_ZENBOX.md
"@ | Out-File -FilePath "$deployDir\README_DEPLOY.txt" -Encoding UTF8

Write-Host "  Created README_DEPLOY.txt" -ForegroundColor Gray

# 6. Summary
Write-Host "`nDone!" -ForegroundColor Green
Write-Host "`nFiles ready for deployment in folder: $deployDir" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Connect FTP to s15.zenbox.pl" -ForegroundColor White
Write-Host "  2. Upload contents of 'deploy' folder to server" -ForegroundColor White
Write-Host "  3. Install dependencies: npm install --production" -ForegroundColor White
Write-Host "  4. Start: npm start or PM2" -ForegroundColor White
Write-Host "  5. Initialize database: https://trees.park-m.pl/api/init" -ForegroundColor White
Write-Host "`nDetails: WDROZENIE_ZENBOX.md`n" -ForegroundColor Gray
