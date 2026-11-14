# Student Stop

Pametna autobuska stanica za srednjoškolce u Bosni i Hercegovini. PWA aplikacija koja dodaje vrijednost solarnoj stanici (solarni paneli, kinetičke ploče, baterija, ekran, rasvjeta) omogućujući učenicima lakše i sigurnije korištenje javnog prevoza, povezivanje sa stanicom i učešće u unapređenju javnog prostora.

## 🚀 Brzo pokretanje

### Lokalno razvojno okruženje

```bash
# Instalacija zavisnosti
npm install

# Pokretanje development servera
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173/student-stop/`

### Testiranje na telefonu (ista Wi-Fi mreža)

1. Pokrenite `npm run dev -- --host`
2. Pronađite IP adresu računara (npr. `192.168.1.42`)
3. Na telefonu otvorite `http://192.168.1.42:5173/student-stop/`
4. Za PWA testiranje: Chrome → Meni → "Instaliraj aplikaciju" / "Dodaj na početni ekran"

## 📱 Generisanje QR kodova

```bash
npm run qr
```

Ovo kreira u folderu `qr/`:
- `site.png` / `site.svg` - opći QR za cijelu aplikaciju
- `station-<id>.png` / `station-<id>.svg` - QR za svaku stanicu
- `print.html` - stranica spremna za štampu na A4 (po jedan QR po stanici sa nazivom i logom)

QR kodovi su nivo korekcije H, minimalno 1000px.

## 🌐 Objavljivanje na GitHub Pages

### Jednom (postavljanje):

1. Kreirajte repozitorij `student-stop` na GitHubu (korisnik: `TVOJE_IME`)
2. U Settings → Pages:
   - Source: "GitHub Actions"
3. Push na `main` granu pokreće automatski deploy

### Svaki put (deploy):

```bash
git add .
git commit -m "Nova verzija"
git push -u origin main
```

GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Checkout → Setup Node (LTS) → `npm ci` → `npm test` → `npm run build` → `npm run qr`
- Upload artifact → Deploy to Pages
- QR kodovi dostupni na `https://TVOJE_IME.github.io/student-stop/qr/print.html`

### Ručno na GitHubu (ako workflow ne radi):

1. Settings → Pages → "GitHub Actions" kao source
2. Actions tab → "Deploy to GitHub Pages" → "Run workflow"

## ⚙️ Konfiguracija stanica

Stanice su definisane u **jednom fajlu**: `src/data/stations.ts`

```typescript
export const stations: Station[] = [
  {
    id: 'gimnazija',
    name: 'Gimnazija',
    latitude: 43.8563,
    longitude: 18.4131,
    address: 'Zmaja od Bosne 8, Sarajevo',
    schoolId: 'gimnazija-sarajevo',
    hasSmartBench: true,
    hasBikeStation: true,
    bikeCapacity: 12
  },
  // ... druge stanice
];
```

**Promjena stanica:**
1. Uredite `src/data/stations.ts`
2. Dodajte/uklonite/izmijenite objekte u nizu `stations`
3. Osigurajte jedinstvene `id` vrijednosti
4. `schoolId` povezuje sa šolama u Challenge ekranu
5. `hasSmartBench` / `hasBikeStation` / `bikeCapacity` kontrolira Smart Route kartice
6. `npm run build` && `git push`

## 📲 Dodavanje ikone na početni ekran

### Android (Chrome)
1. Otvorite aplikaciju u Chrome-u
2. Meni (tri tačke) → "Instaliraj aplikaciju" ili "Dodaj na početni ekran"
3. Potvrdite

### iPhone (Safari)
1. Otvorite aplikaciju u Safari-u
2. Share ikona (kvadratić sa strelicom gore) → "Dodaj na početni ekran"
3. Potvrdite

**Važno za obavijesti na iPhoneu:** Aplikacija **mora** biti dodana na početni ekran da bi Push Notifications radile. Bez toga, "Obavijesti me" dugme prikaže uputu.

## 🛠️ Tehnologije

- **Vite + React 18 + TypeScript (strict)**
- **React Router (HashRouter)** - za GitHub Pages bez 404 na refresh
- **Zustand** - state management
- **localStorage / IndexedDB (idb)** - trajno čuvanje
- **vite-plugin-pwa** - Service Worker, manifest, "Add to Home Screen"
- **Vitest** - testovi
- **ESLint + TypeScript** - linting i type checking

## 🧪 Testiranje i kvalitet

```bash
# Testovi
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

Sve komande moraju proći bez grešaka.

## 📁 Struktura projekta

```
src/
├── components/       # Layout, zajednički UI
├── data/             # stations.ts, busProvider, energySimulator, localRepository
├── i18n/             # bs.ts (svi stringovi na bosanskom)
├── screens/          # HomeScreen, BusScreen, EnergyScreen, SafeStopScreen, ReportScreen, SmartRouteScreen, StudentVoiceScreen, ChallengeScreen, QRScreen, SettingsScreen, StationSelectorScreen
├── stores/           # Zustand store-ovi (app, bus, energy, report, studentVoice, challenge, smartRoute, stationEquipment)
├── styles/           # globals.css (tema, dark mode, pristupačnost)
├── types/            # TypeScript interfejsi
├── utils/            # helpers.ts, qr.ts
├── App.tsx           # Rutiranje, HashRouter
└── main.tsx          # Entry point, SW registracija

scripts/
└── generateQr.ts     # QR kod generiranje (npm run qr)

.github/workflows/
└── deploy.yml        # GitHub Pages deploy

public/
├── .nojekyll         # Zabrana Jekyll obrade
└── favicon.svg       # SVG favicon
```

## 🔒 Privatnost

- **Bez računa** - nikakva registracija
- **Bez praćenja** - nijedan analytics/tracking
- **Lokacija ostaje na uređaju** - koristi se samo za izračun udaljenosti do stanica
- **Svi podaci u localStorage/IndexedDB** - ništa ne ide na server
- Firebase opcionalno (VITE_USE_FIREBASE=false po defaultu) - bez Firebasea prijave ne šalju se službi

## ♿ Pristupačnost

- Dodirne zone minimalno 44×44px
- `aria-label` na ikonama
- Kontrast 4.5:1 (visoki kontrast opcija u postavkama)
- Veličini tekst opcija u postavkama
- `prefers-reduced-motion` podrška
- Semantički HTML

## 🎨 Tema

- Primarna: `#0B7A4B` (zelena)
- Akcent: `#FFB703` (žuta)
- Tamna: `#10231C`
- Pozadina: `#F4F7F5`
- Potpuna podrška dark mode (system / light / ručno)

## 📄 Licenca

MIT