export const translations = {
  app: {
    name: 'Student Stop',
    tagline: 'Pametno stajalište za pametnu mladež'
  },
  nav: {
    home: 'Početna',
    tram: 'Tramvaj',
    energy: 'Energija',
    more: 'Više',
    menu: 'Meni'
  },
  home: {
    myStation: 'Moje stajalište',
    changeStation: 'Promijeni stajalište',
    nextTram: 'Sljedeći tramvaj',
    line: 'Linija',
    destination: 'Odredište',
    arrivesIn: 'Stiže za',
    delayed: 'Kasni',
    minutes: 'min',
    now: 'Sad',
    quickActions: 'Brze akcije',
    announcements: 'Obavijesti',
    tiles: {
      safety: {
        title: 'Sigurnost',
        description: 'SOS, kamere, rasvjeta'
      },
      energy: {
        title: 'Energija',
        description: 'Solarni, kinetika, baterija'
      },
      smartRoute: {
        title: 'Pametna ruta',
        description: 'Najkraći i najsigurniji put'
      },
      report: {
        title: 'Prijavi problem',
        description: 'Klupa, staklo, nečistoća...'
      },
      studentVoice: {
        title: 'Glas učenika',
        description: 'Ankete, ocjene, prijedlozi'
      },
      challenge: {
        title: 'Izazov',
        description: 'Rang-lista škola, bodovi'
      }
    }
  },
  tram: {
    title: 'Tramvaj u realnom vremenu',
    map: 'Mapa',
    arrivals: 'Dolasci',
    line: 'Linija',
    destination: 'Odredište',
    eta: 'Očekivano',
    delay: 'Kašnjenje',
    onTime: 'Na vrijeme',
    delayed: 'Kasni',
    minutes: 'min',
    notifyMe: 'Obavijesti me',
    notifyEnabled: 'Obavijesti uključen',
    notifyInfo: 'Omogućite obavijesti u postavkama pregledača. Na iPhoneu prvo dodajte aplikaciju na početni ekran (Share → Dodaj na početni ekran).',
    noArrivals: 'Nema planiranih dolazaka',
    loading: 'Učitavanje...',
    error: 'Greška pri učitavanju podataka'
  },
  energy: {
    title: 'Praćenje energije',
    solar: 'Solarni paneli',
    kinetic: 'Kinetičke ploče',
    consumption: 'Potrošnja stajališta',
    battery: 'Baterija',
    batteryLevel: 'Stanje baterije',
    hourlyChart: 'Po satima',
    watts: 'W',
    kw: 'kW',
    kwh: 'kWh',
    percent: '%',
    charging: 'Punjenje',
    discharging: 'Praznjenje',
    stable: 'Stabilno',
    live: 'Uživo',
    simulator: 'Simulator'
  },
  safeStop: {
    title: 'Sigurno stajalište',
    lighting: 'Rasvjeta',
    cameras: 'Kamere',
    equipment: 'Oprema',
    lastChecked: 'Zadnje provjereno',
    status: {
      working: 'Ispravno',
      warning: 'Upozorenje',
      broken: 'Neispravno'
    },
    sos: 'SOS',
    sosConfirm: 'Jeste li sigurni da želite pozvati hitnu pomoć (112)?',
    sosCalling: 'Zovem 112...',
    reportSuspicious: 'Prijavi sumnjivu situaciju',
    reportPlaceholder: 'Opišite što ste vidjeli (do 500 znakova)...',
    reportSubmit: 'Pošalji prijavu',
    reportSuccess: 'Prijava poslana. Hvala na brzi reakciji!',
    reportError: 'Greška pri slanju prijave',
    charsLeft: 'preostalo znakova'
  },
  report: {
    title: 'Prijavi problem',
    categories: {
      bench: 'Klupa',
      lighting: 'Rasvjeta',
      glass: 'Staklo',
      screen: 'Ekran',
      cleanliness: 'Nečistoća'
    },
    photo: 'Fotografija',
    takePhoto: 'Uzmite sliku',
    photoHint: 'Dozvolite pristup kameri za sliku problema',
    description: 'Opis',
    descriptionPlaceholder: 'Dodatne informacije...',
    submit: 'Pošalji prijavu',
    myReports: 'Moje prijave',
    status: {
      pending: 'Na čekanju',
      inProgress: 'U obradi',
      resolved: 'Riješeno',
      rejected: 'Odbijeno'
    },
    noReports: 'Nemate još prijavljenih problema',
    success: 'Prijava uspješno poslana!',
    error: 'Greška pri slanju prijave'
  },
  studentVoice: {
    title: 'Glas učenika',
    surveys: 'Ankete',
    ratings: 'Ocjene stajališta',
    cleanliness: 'Čistoća',
    safety: 'Sigurnost',
    comfort: 'Udobnost',
    submitRating: 'Pošalji ocjenu',
    suggestion: 'Prijedlog nove funkcije',
    suggestionPlaceholder: 'Što biste želeli da stajalište ima?',
    submitSuggestion: 'Pošalji prijedlog',
    vote: 'Glasaj',
    voted: 'Glasali ste',
    results: 'Rezultati',
    noSurveys: 'Trenutno nema aktivnih anketa',
    thankYou: 'Hvala naglasu!'
  },
  smartRoute: {
    title: 'Pametna ruta',
    nearestStops: 'Najbliža stajališta',
    distance: 'Udaljenost',
    walking: 'Pješke',
    cycling: 'Bicikl',
    safeRoutes: 'Sigurnije rute',
    crowds: 'Gužve',
    roadworks: 'Radovi i zatvoreni putevi',
    smartBench: 'Pametna klupa',
    heating: 'Grijanje',
    heaterOn: 'Uključi grijanje',
    heaterOff: 'Isključi grijanje',
    bikeStation: 'Bicikl stajalište',
    freeSpots: 'Slobodna mjesta',
    occupiedSpots: 'Zauzeta mjesta',
    totalSpots: 'Ukupno mjesta',
    locationDenied: 'Lokacija nije dopuštena. Prikazujem sva stajališta bez udaljenosti.',
    enableLocation: 'Omogući lokaciju',
    calculating: 'Izračunavanje...'
  },
  challenge: {
    title: 'Izazov škole',
    leaderboard: 'Rang-lista',
    yourSchool: 'Vaša škola',
    selectSchool: 'Odaberite svoju školu',
    categories: {
      energy: 'Ušteda energije',
      transport: 'Javni prevoz',
      habits: 'Održive navike',
      ideas: 'Prijedlozi'
    },
    points: 'bodova',
    rank: 'Mjest',
    noSchool: 'Škola nije odabrana',
    totalPoints: 'Ukupno bodova'
  },
  qr: {
    title: 'QR kod stajališta',
    stationQR: 'QR kod za stajalište',
    shareLink: 'Podijeli link',
    copyLink: 'Kopiraj link',
    copied: 'Link kopiran!',
    scanText: 'Skeniraj i prati tramvaj',
    generalQR: 'Opći QR kod aplikacije',
    printPage: 'Stranica za štampu'
  },
  stationLink: {
    connected: 'Povezani ste sa stajalištem',
    invalid: 'Nevažeće stajalište. Molimo odaberite stajalište ručno.',
    selectStation: 'Odaberite stajalište'
  },
  settings: {
    title: 'Postavke',
    theme: 'Tema',
    light: 'Svjetla',
    dark: 'Tamna',
    system: 'Sistemska',
    highContrast: 'Visoki kontrast',
    largeText: 'Veličini tekst',
    language: 'Jezik',
    notifications: 'Obavijesti',
    privacy: 'Privatnost',
    about: 'O aplikaciji',
    version: 'Verzija',
    dataStoredLocally: 'Svi podaci se čuvaju lokalno na vašem uređaju. Ne koristimo račune niti pratimo korisnike.'
  },
  common: {
    ok: 'U redu',
    cancel: 'Odustani',
    save: 'Sačuvaj',
    delete: 'Obriši',
    edit: 'Uredi',
    close: 'Zatvori',
    back: 'Natrag',
    next: 'Sljedeće',
    loading: 'Učitavanje...',
    error: 'Greška',
    success: 'Uspjeh',
    retry: 'Pokušaj ponovo',
    confirm: 'Potvrdi',
    yes: 'Da',
    no: 'Ne',
    search: 'Pretraži',
    filter: 'Filtriraj',
    sort: 'Sortiraj',
    refresh: 'Osvježi',
    share: 'Podijeli',
    copy: 'Kopiraj',
    copied: 'Kopirano!',
    done: 'Gotovo',
    skip: 'Preskoči',
    continue: 'Nastavi'
  },
  accessibility: {
    openMenu: 'Otvori meni',
    closeMenu: 'Zatvori meni',
    navigateTo: 'Idi na',
    currentLocation: 'Trenutna lokacija',
    mapView: 'Prikaz mape',
    listView: 'Prikaz liste',
    batteryLevel: 'Razina baterije',
    chargingStatus: 'Status punjenja'
  }
} as const;

export type Translations = typeof translations;

export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }
  return typeof value === 'string' ? value : key;
}