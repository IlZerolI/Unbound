# Odluke i razlozi (DECISIONS.md)

Ovaj dokument bilježi ključne tehničke odluke donijete tijekom razvoja Student Stop aplikacije, uz razloge i alternative koje su odbijene.

---

## 1. HashRouter umjesto BrowserRouter

**Odluka:** Koristiti `HashRouter` (URL-ovi oblika `#/bus`) umjesto `BrowserRouter`.

**Razlog:** GitHub Pages ne podržava server-side routing. Sa `BrowserRouter`, osvježavanje stranice na `/bus` vraća 404 jer ne postoji fizički fajl. `HashRouter` održava stanje u hash dijelu URL-a koji server ignorira.

**Alternative:** 
- `BrowserRouter` + 404.html redirect hack (neprenosivo, komplikovano)
- Netlify/Vercel za hosting (zahtijeva drugačiji deployment pipeline)

---

## 2. Vite `base: '/student-stop/'`

**Odluka:** Postaviti `base` u `vite.config.ts` na `/student-stop/`.

**Razlog:** GitHub Pages servira repozitorij pod podputanjom `/student-stop/`. Bez ovoga, svi asset putanje (JS, CSS, ikone) bi bile pogrešne.

**Napomena:** Svi `fetch` pozivi, slike u `public/`, i PWA manifest moraju uzeti u obzir ovu bazu. `vite-plugin-pwa` automatski prilagođava `manifest.webmanifest` i service worker scope.

---

## 3. localStorage + IndexedDB (idb) za perzistenciju

**Odluka:** Koristiti `localStorage` za postavke (tema, jezik) i `IndexedDB` (preko `idb` biblioteke) za strukturirane podatke (prijave, ocjene, glasovi, izazovi).

**Razlog:** 
- `localStorage` je synchroni, ograničen na ~5MB, pogodan za male JSON objekte
- `IndexedDB` je asynchroni, podržava indekse, transakcije, veće količine podataka, bolje za aplikacijske podatke
- Nema backend servera, pa sve mora biti klijentski

**Alternative:**
- Samo `localStorage` (previše opterećenje za veću količinu podataka)
- `Dexie.js` umjesto `idb` (dodatna zavisnost, `idb` je lakša i dovoljna)
- `Firebase` od prvog dana (odlučeno odložiti, vidi odluku #8)

---

## 4. Zustand za state management

**Odluka:** Zustand umjesto Redux, Context API, ili Jotai.

**Razlog:**
- Minimalan boilerplate (hook-based API)
- Dovoljno moćan za naše potrebe (selektori, middleware za persist)
- Nema "provider wrapper" u komponentama
- TypeScript podrška odlična
- mali bundle (~1KB)

**Alternative:**
- Redux Toolkit (previše za ovu veličinu aplikacije)
- React Context (re-render problemi, teže testirati)
- Jotai (atomic approach, ali većća krivulja učenja za tim)

---

## 5. Simulatori umjesto pravnih API-ja

**Odluka:** `MockBusProvider`, `EnergySimulator`, `GtfsRealtimeProvider` (stub) implementiraju `BusProvider` i `EnergySimulator` interfejse.

**Razlog:**
- Nema pristupa pravim GTFS-RT feedovima ili IoT senzorima
- Interfejsi (`Repository`, `BusProvider`, `EnergySimulator`) omogućavaju laku zamjenu kasnije
- `MockBusProvider` generira realistične kašnjenja (30% šanse, do 10 min)
- `EnergySimulator` simulira dnevni ciklus solarne energije, kinetiku, bateriju

**Alternative:**
- Hardkodovani podaci (ne realno, ne testira UI stanje "loading", "kašnjenje")
- Javne API-je (GTFS za BiH ne postoje javno, CORS problemi)

---

## 6. SVG za mapu i ikone (bez vanjskih servisa)

**Odluka:** Sva ikone, mapa, grafikoni u SVG-u unutar React komponenti. Nema Leaflet, Mapbox, Google Maps, Chart.js.

**Razlog:**
- Nema vanjskih zavisnosti (bundle size, privatnost, offline rad)
- Mapa je apstraktna (schematic), ne geografski točna - dovoljno za "gdje je autobus"
- Stupčasti grafikon (Energy) napravljen ručno u SVG-u - potpuna kontrola stila
- PWA mora raditi offline - vanjski tile-ovi ne rade

**Alternative:**
- Leaflet + OpenStreetMap (tiles ne rade offline bez service worker cache strategije, veći bundle)
- Chart.js (dodatnih ~50KB gzipped za jednostavan bar/line chart)
- Mapbox/Google (API ključevi, troškovi, privatnost)

---

## 7. PWA sa `vite-plugin-pwa` (GenerateSW)

**Odluka:** `vite-plugin-pwa` sa `registerType: 'autoUpdate'`, `workbox` konfiguracijom za runtime caching fontova.

**Razlog:**
- Automatski generiše `manifest.webmanifest`, service worker, ikone
- `autoUpdate` - korisnik dobija toast "Nova verzija dostupna" bez ručnog refresh
- Offline-first: precache svih assets, runtime cache za Google Fonts
- "Add to Home Screen" prompt radi out-of-the-box

**Napomena:** Ikone generisane ručno (SVG → PNG različite veličine) jer `vite-plugin-pwa` ne generiše PNG iz SVG automatski. Potrebno dodati prave PNG ikone u `public/icons/` za produkciju.

---

## 8. Firebase samo kao priprema (neaktivan)

**Odluka:** `firebaseRepository.ts` implementiran ali **neaktivan** (`VITE_USE_FIREBASE=false` u `.env.example`).

**Razlog:**
- Bez backenda, prijave i glasovi ostaju isključivo na uređaju (privatnost, nula troškova)
- Firebase sloj je gotov za aktivaciju kada klijent/općina želi centralizovani nadzor
- `.env.example` dokumentira potrebne varijable
- README objašnjava da bez Firebasea prijave **ne** šalju se službi

**Alternative:**
- Supabase, PocketBase, Appwrite (svi zahtijevaju hosting/infrastrukturu)
- Custom backend (previše rada za MVP)

---

## 9. Bosanski jezik (ijekavica) za sve UI stringove

**Odluka:** Svi stringovi u `src/i18n/bs.ts`, kod na engleskom.

**Razlog:**
- Ciljna publika: srednjoškolci u BiH
- Ijekavica standard u BiH (razlika od ekavice u Srbiji)
- Centralizovano u jednom fajlu za lako prevođenje/dodavanje jezika

**Napomena:** `t('key.path')` funkcija koristi dot-notation pristup ugnijezđenom objektu.

---

## 10. QR kodovi generisani pri build-u (`npm run qr`)

**Odluka:** Skripta `scripts/generateQr.ts` koristi `qrcode` paket, generiše PNG/SVG 1000px, korekcija H.

**Razlog:**
- Svaka stanica ima jedinstvenu URL: `.../#/?station=<id>`
- `print.html` za štampu na A4 - fizički QR kodovi na stanicama
- Generisanje pri build-u osigurava da QR kodovi idu na GitHub Pages (`dist/qr/`)
- `homepage` polje iz `package.json` koristi se za baznu URL

**Alternative:**
- Generisanje u browseru (teže zaštampati, ne radi offline)
- Vanjski QR servis (privatnost, dostupnost)

---

## 11. GitHub Actions deploy workflow

**Odluka:** `.github/workflows/deploy.yml` sa `actions/deploy-pages@v4`.

**Razlog:**
- Zvaničan, preporučeni način za GitHub Pages
- `id-token: write` + `pages: write` dozvole - bez personal access tokena
- `upload-pages-artifact` + `deploy-pages` - standardni flow
- QR kopiranje u `dist/qr/` prije uploada

**Napomena:** `public/.nojekyll` zabranjuje Jekyll obradu (važno za `_redirects`, `.well-known`, itd.)

---

## 12. Pristupačnost (a11y) od prvog dana

**Odluke:**
- Minimalne dodirne zone 44×44px (Apple/Google standard)
- `aria-label` na svim ikonama bez teksta
- Kontrast 4.5:1 (WCAG AA) - provereno za sve boje
- `prefers-reduced-motion` - onemogućuje animacije
- Visoki kontrast i veliki tekst toggle u postavkama
- Semantički HTML (`<nav>`, `<section>`, `<article>`, `<header>`, `<main>`)
- Focus-visible stilovi za tastaturu

---

## 13. Dark mode implementacija

**Odluka:** CSS custom properties + `data-theme` atribut na `<html>`, tri opcije: `light`, `dark`, `system`.

**Razlog:**
- CSS varijable omogućavaju instant prebacivanje bez re-rendera React komponenata
- `system` koristi `matchMedia('(prefers-color-scheme: dark)')`
- Perzistira se u Zustand store-u (localStorage)
- Sve boje definisane u `:root` i `[data-theme="dark"]`

---

## 14. Safe-area insets za iPhone

**Odluka:** CSS `env(safe-area-inset-*)` za padding header/footer, `viewport-fit=cover` u meta tagu.

**Razlog:**
- iPhone notch / Dynamic Island ne prekriva sadržaj
- Donja navigacija (Bottom Nav) ima `padding-bottom: env(safe-area-inset-bottom)`
- `100dvh` (dynamic viewport height) za mobile adrese bar

---

## 15. Testovi: Vitest + happy path coverage

**Odluke:**
- Testovi za: `localRepository` (CRUD), `haversineDistance`, `parseStationFromUrl`, `voteSurvey` (jedan glas po uređaju), `formatRelativeTime` (odbrojavanje)
- `npm test` u CI pipeline-u
- Ne testiramo UI komponente (previše setup za marginalnu vrijednost na ovom projektu)

---

## 16. Kodna organizacija: feature-based u `src/`

**Struktura:**
```
src/
├── components/     # Shared UI (Layout)
├── data/           # Podaci, simulatori, repository implementacije
├── i18n/           # Stringovi
├── screens/        # Route-level komponente (Page komponente)
├── stores/         # Zustand store-ovi (po domeni)
├── styles/         # Global CSS
├── types/          # Shared TypeScript tipovi
├── utils/          # Helper funkcije
```

**Razlog:** Skalabilno, lako naći povezan kod, jasna separacija briga.

---

## 17. ESLint + TypeScript strict

**Odluka:** `strict: true` u `tsconfig.json`, ESLint sa `typescript-eslint`, `react-hooks`, `react-refresh`.

**Razlog:** Hvata greške u compile-time, ne u runtime. `noUnusedLocals/Parameters` čisti kod. CI provjerava `npm run lint` i `npx tsc --noEmit`.

---

## 18. Nema analitike / trackinga

**Odluka:** Nema Google Analytics, Matomo, Plausible, itd.

**Razlog:** Privatnost učenika (GDPR, zakon o zaštiti podataka BiH). Aplikacija radi u školama - minimalno prikupljanje podataka.

---

## 19. Ikone: Lucide-stil SVG inline

**Odluka:** SVG ikone inline u komponentama (copy-paste iz Lucide), ne `@lucide/react` paket.

**Razlog:** Nema dodatne zavisnosti, punu kontrolu nad `strokeWidth`, `size`, `aria-hidden`, boje preko `currentColor`.

---

## 20. Verzija 1.0.0 - MVP scope

**Izostavljeno za buduće verzije:**
- Real-time chat / komentari na stanici
- Push notifikacije sa backend (VAPID ključevi)
- Admin panel za općinu
- Više jezika (engleski, hrvatski)
- Ekspor podataka (CSV/PDF)
- PWA periodic background sync
- Web Share Target API (primanje share-a od drugih aplikacija)

---

*Dokument će se ažurirati sa svakom novom značajnom odlukom.*