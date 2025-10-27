# 📦 Jak wrzucić projekt na GitHub

## Krok 1: Utwórz nowe repozytorium na GitHub

1. Przejdź na [github.com](https://github.com)
2. Zaloguj się na swoje konto
3. Kliknij przycisk **"+"** w prawym górnym rogu
4. Wybierz **"New repository"**
5. Wypełnij formularz:
   - **Repository name:** `park-m-trees-zenbox`
   - **Description:** `Park M - System Ewidencji Drzew (Zenbox Edition with MariaDB)`
   - **Visibility:** Public lub Private (według preferencji)
   - **NIE ZAZNACZAJ:** "Initialize this repository with a README" (już mamy pliki)
6. Kliknij **"Create repository"**

## Krok 2: Połącz lokalne repo z GitHub

GitHub pokaże Ci instrukcje. Użyj tych komend w terminalu:

### Jeśli używasz HTTPS:

```bash
git remote add origin https://github.com/TWOJA-NAZWA-UZYTKOWNIKA/park-m-trees-zenbox.git
git branch -M main
git push -u origin main
```

### Jeśli używasz SSH:

```bash
git remote add origin git@github.com:TWOJA-NAZWA-UZYTKOWNIKA/park-m-trees-zenbox.git
git branch -M main
git push -u origin main
```

**Zamień `TWOJA-NAZWA-UZYTKOWNIKA` na swoją nazwę użytkownika GitHub!**

## Krok 3: Sprawdź czy się udało

1. Odśwież stronę repozytorium na GitHub
2. Powinieneś zobaczyć wszystkie pliki projektu
3. README.md powinno się wyświetlać na stronie głównej

## 🔄 Jak aktualizować kod na GitHub

Po wprowadzeniu zmian w projekcie:

```bash
# 1. Dodaj zmienione pliki
git add .

# 2. Utwórz commit z opisem zmian
git commit -m "Opis wprowadzonych zmian"

# 3. Wyślij na GitHub
git push
```

## 📋 Przydatne komendy Git

### Sprawdź status zmian:
```bash
git status
```

### Zobacz historię commitów:
```bash
git log --oneline
```

### Cofnij zmiany (przed commitem):
```bash
git checkout -- nazwa-pliku
```

### Sprawdź remote:
```bash
git remote -v
```

## 🔐 Uwagi dotyczące bezpieczeństwa

### ✅ Pliki które POWINNY być na GitHub:
- Kod źródłowy (`.ts`, `.tsx`, `.js`, etc.)
- Pliki konfiguracyjne (`package.json`, `next.config.ts`, etc.)
- Dokumentacja (`.md`)
- `env.example` (przykładowa konfiguracja)
- `.gitignore`

### ❌ Pliki które NIE POWINNY być na GitHub:
- `.env.local` (zawiera hasła i dane dostępowe)
- `node_modules/` (za duże, instaluje się przez npm)
- `.next/` (generowane podczas budowania)
- Bazy danych (`.db`)

**Wszystkie te pliki są już w `.gitignore` - nie musisz się martwić!**

## 🚀 Wdrożenie z GitHub na Zenbox

Po wrzuceniu na GitHub możesz łatwo wdrożyć na Zenbox:

1. W panelu Zenbox wybierz **"Deploy from Git"**
2. Połącz z GitHub
3. Wybierz repozytorium `park-m-trees-zenbox`
4. Ustaw branch: `main`
5. Skonfiguruj zmienne środowiskowe (DB_HOST, DB_USER, etc.)
6. Kliknij **"Deploy"**

Szczegóły w: [ZENBOX_DEPLOYMENT.md](./ZENBOX_DEPLOYMENT.md)

## 🆘 Rozwiązywanie problemów

### Błąd: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TWOJA-NAZWA/park-m-trees-zenbox.git
```

### Błąd: "Permission denied (publickey)"
Musisz skonfigurować klucz SSH:
1. Przejdź na GitHub → Settings → SSH and GPG keys
2. Dodaj swój klucz SSH
3. Lub użyj HTTPS zamiast SSH

### Błąd: "Updates were rejected"
```bash
git pull origin main --rebase
git push
```

## 📚 Dodatkowe zasoby

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Zenbox Documentation](https://zenbox.pl/docs)

---

**Gotowe!** Twój projekt jest teraz na GitHub i gotowy do wdrożenia na Zenbox! 🎉
