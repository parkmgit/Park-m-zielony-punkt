# Skrypt do wyświetlenia adresu IP dla telefonu

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ADRES IP DLA TELEFONU" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Pobierz adres IP
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Ethernet*"} | Select-Object -First 1).IPAddress

if ($ip) {
    Write-Host "Twój adres IP: " -NoNewline
    Write-Host "$ip" -ForegroundColor Cyan
    Write-Host "`nOtwórz na telefonie:" -ForegroundColor Yellow
    Write-Host "http://$ip:3000" -ForegroundColor Cyan -BackgroundColor Black
    Write-Host "`nDane logowania:" -ForegroundColor Yellow
    Write-Host "Email: admin@park-m.pl" -ForegroundColor White
    Write-Host "Hasło: password123" -ForegroundColor White
} else {
    Write-Host "Nie znaleziono adresu IP!" -ForegroundColor Red
    Write-Host "Sprawdź połączenie Wi-Fi lub Ethernet" -ForegroundColor Yellow
}

Write-Host "`n========================================`n" -ForegroundColor Green
Write-Host "Uruchom serwer komendą:" -ForegroundColor Yellow
Write-Host "npm run dev:network" -ForegroundColor Cyan
Write-Host "`n========================================`n" -ForegroundColor Green

# Czekaj na Enter
Read-Host "Naciśnij Enter aby zamknąć"
