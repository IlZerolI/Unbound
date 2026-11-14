# Student Stop

PWA aplikacija za pametne solarne autobuske stanice u BiH. Omogućuje učenicima lakše i sigurnije korištenje javnog prevoza.

## 🚀 Brzo pokretanje

```bash
npm install
npm run dev
```

Dostupno na `http://localhost:5173/student-stop/`

## 🌐 Deploy na GitHub Pages

Repo je već podešen za automatski deploy:

1. **Settings → Pages** → Source: "GitHub Actions"
2. Push na `main` granu pokreće build i deploy

Aplikacija će biti na: `https://IlZerolI.github.io/student-stop/`

## 📱 PWA instalacija

- **Android/Chrome**: Meni → "Instaliraj aplikaciju"
- **iPhone/Safari**: Share → "Dodaj na početni ekran"

## ⚙️ Konfiguracija stanica

Uredi `src/data/stations.ts` - dodaj/ukloni stanice, onda `git push`.

## 🛠️ Tehnologije

Vite + React 18 + TypeScript + Zustand + PWA (Workbox) + Vitest

## 🧪 Komande

```bash
npm test        # testovi
npm run lint    # linting
npm run build   # produkcija build
npm run qr      # generiši QR kodove
```