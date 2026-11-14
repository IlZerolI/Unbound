export const translations = {
  app: {
    name: 'Student Stop',
    tagline: 'Pametna stanica za pametnu mladež'
  },
  nav: {
    home: 'Početna',
    bus: 'Autobus',
    energy: 'Energija',
    more: 'Više'
  },
  home: {
    myStation: 'Moja stanica',
    changeStation: 'Promijeni stanicu',
    nextBus: 'Sljedeći autobus',
    line: 'Linija',
    destination: 'Odredište',
    arrivesIn: 'Stiže za',
    delayed: 'Kasni',
    minutes: 'min',
    now: 'Sad',
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
  bus: {
    title: 'Autobus u realnom vremenu',
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
    consumption: 'Potrošnja stanice',
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
    title: 'Sigurna stanica',
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
    ratings: 'Ocjene stanice',
    cleanliness: 'Čistoća',
    safety: 'Sigurnost',
    comfort: 'Udobnost',
    submitRating: 'Pošalji ocjenu',
    suggestion: 'Prijedlog nove funkcije',
    suggestionPlaceholder: 'Što biste želeli da stanica ima?',
    submitSuggestion: 'Pošalji prijedlog',
    vote: 'Glasaj',
    voted: 'Glasali ste',
    results: 'Rezultati',
    noSurveys: 'Trenutno nema aktivnih anketa',
    thankYou: 'Hvala naglasu!'
  },
  smartRoute: {
    title: 'Pametna ruta',
    nearestStops: 'Najbliže stanice',
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
    bikeStation: 'Bicikl stanica',
    freeSpots: 'Slobodna mjesta',
    occupiedSpots: 'Zauzeta mjesta',
    totalSpots: 'Ukupno mjesta',
    locationDenied: 'Lokacija nije dopuštena. Prikazujem sve stanice bez udaljenosti.',
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
    title: 'QR kod stanice',
    stationQR: 'QR kod za stanicu',
    shareLink: 'Podijeli link',
    copyLink: 'Kopiraj link',
    copied: 'Link kopiran!',
    scanText: 'Skeniraj i prati autobus',
    generalQR: 'Opći QR kod aplikacije',
    printPage: 'Stranica za štampu'
  },
  stationLink: {
    connected: 'Povezani ste sa stanicom',
    invalid: 'Nevažeća stanica. Molimo odaberite stanicu ručno.',
    selectStation: 'Odaberite stanicu'
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