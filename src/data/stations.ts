import { Station, TramLine, School, Survey, Route, Roadwork, ChallengeEntry } from '@/types';

export const stations: Station[] = [
  {
    id: 'tehnicka-skola',
    name: 'Tehnička škola',
    latitude: 43.8542,
    longitude: 18.4156,
    address: 'Zmaja od Bosne, Sarajevo (blizu Tehničke škole)',
    schoolId: 'tehnicka-skola-sarajevo',
    hasSmartBench: false,
    hasBikeStation: true,
    bikeCapacity: 15
  },
  {
    id: 'pocetno-stajaliste',
    name: 'Početno stajalište',
    latitude: 43.8578,
    longitude: 18.4201,
    address: 'Baščaršija, Sarajevo',
    schoolId: 'prva-gimnazija',
    hasSmartBench: true,
    hasBikeStation: true,
    bikeCapacity: 20
  },
  {
    id: 'zmaja-od-bosne',
    name: 'Zmaja od Bosne',
    latitude: 43.8531,
    longitude: 18.4148,
    address: 'Zmaja od Bosne, Sarajevo',
    schoolId: 'druga-gimnazija',
    hasSmartBench: true,
    hasBikeStation: true,
    bikeCapacity: 12
  },
  {
    id: 'marsal-tito',
    name: 'Maršal Tito',
    latitude: 43.8512,
    longitude: 18.4123,
    address: 'Maršala Tita, Sarajevo',
    schoolId: 'medicinska-skola-sarajevo',
    hasSmartBench: false,
    hasBikeStation: true,
    bikeCapacity: 10
  },
  {
    id: 'skenderija',
    name: 'Skenderija',
    latitude: 43.8598,
    longitude: 18.4234,
    address: 'Skenderija, Sarajevo',
    schoolId: undefined,
    hasSmartBench: true,
    hasBikeStation: true,
    bikeCapacity: 25
  },
  {
    id: 'univerzitet',
    name: 'Univerzitet',
    latitude: 43.8487,
    longitude: 18.4078,
    address: 'Univerzitetsko gradilište, Sarajevo',
    schoolId: 'univerzitet-sarajevo',
    hasSmartBench: true,
    hasBikeStation: true,
    bikeCapacity: 30
  }
];

export const tramLines: TramLine[] = [
  {
    id: 'line-1',
    number: '1',
    name: 'Baščaršija - Ilidža',
    color: '#0B7A4B',
    destinations: ['Baščaršija', 'Centar', 'Ilidža'],
    stationOrder: ['pocetno-stajaliste', 'zmaja-od-bosne', 'tehnicka-skola', 'marsal-tito', 'skenderija', 'univerzitet']
  },
  {
    id: 'line-3',
    number: '3',
    name: 'Novi Grad - Baščaršija',
    color: '#FFB703',
    destinations: ['Novi Grad', 'Centar', 'Baščaršija'],
    stationOrder: ['univerzitet', 'marsal-tito', 'tehnicka-skola', 'zmaja-od-bosne', 'pocetno-stajaliste']
  },
  {
    id: 'line-5',
    number: '5',
    name: 'Vogošća - Baščaršija',
    color: '#1A3A2E',
    destinations: ['Vogošća', 'Centar', 'Baščaršija'],
    stationOrder: ['univerzitet', 'skenderija', 'tehnicka-skola', 'zmaja-od-bosne', 'pocetno-stajaliste']
  },
  {
    id: 'line-6',
    number: '6',
    name: 'Ilidža - Baščaršija',
    color: '#D32F2F',
    destinations: ['Ilidža', 'Centar', 'Baščaršija'],
    stationOrder: ['skenderija', 'marsal-tito', 'tehnicka-skola', 'zmaja-od-bosne', 'pocetno-stajaliste']
  }
];

export const schools: School[] = [
  { id: 'tehnicka-skola-sarajevo', name: 'Tehnička škola Sarajevo', city: 'Sarajevo' },
  { id: 'prva-gimnazija', name: 'Prva gimnazija', city: 'Sarajevo' },
  { id: 'druga-gimnazija', name: 'Druga gimnazija', city: 'Sarajevo' },
  { id: 'medicinska-skola-sarajevo', name: 'Medicinska škola Sarajevo', city: 'Sarajevo' },
  { id: 'univerzitet-sarajevo', name: 'Univerzitet u Sarajevu', city: 'Sarajevo' }
];

export const surveys: Survey[] = [
  {
    id: 'survey-1',
    question: 'Koja je vaša prioritetna poboljšanja za stajalište?',
    options: [
      { id: 'opt-1', text: 'Bolja rasvjeta i kamere', votes: 42 },
      { id: 'opt-2', text: 'Više sjedišta i zaklona', votes: 38 },
      { id: 'opt-3', text: 'Wi-Fi i nabijanje telefona', votes: 55 },
      { id: 'opt-4', text: 'Real-time informacije o tramvajima', votes: 67 }
    ],
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'survey-2',
    question: 'Kako najčešće dođete do stajališta?',
    options: [
      { id: 'opt-5', text: 'Pješke', votes: 89 },
      { id: 'opt-6', text: 'Biciklom', votes: 23 },
      { id: 'opt-7', text: 'Tramvajem', votes: 45 },
      { id: 'opt-8', text: 'Autom/taxi', votes: 12 }
    ],
    createdAt: Date.now() - 86400000 * 2
  }
];

export const routes: Route[] = [
  {
    id: 'route-1',
    name: 'Sigurna šetnja do škole',
    description: 'Ruta sa svetlosnim signalima i nadzornim kamerama',
    distance: 800,
    duration: 10,
    type: 'walking',
    safetyScore: 95,
    waypoints: [
      { lat: 43.8542, lng: 18.4156 },
      { lat: 43.8551, lng: 18.4168 },
      { lat: 43.8562, lng: 18.4185 }
    ]
  },
  {
    id: 'route-2',
    name: 'Biciklistička staza Centar',
    description: 'Posebna biciklistička staza do centra grada',
    distance: 2500,
    duration: 12,
    type: 'cycling',
    safetyScore: 88,
    waypoints: [
      { lat: 43.8542, lng: 18.4156 },
      { lat: 43.8565, lng: 18.4189 },
      { lat: 43.8585, lng: 18.4234 }
    ]
  },
  {
    id: 'route-3',
    name: 'Brza ruta do tramvaja',
    description: 'Najkraći put do tramvajske stajalište Tehnička škola',
    distance: 350,
    duration: 4,
    type: 'walking',
    safetyScore: 90,
    waypoints: [
      { lat: 43.8542, lng: 18.4156 },
      { lat: 43.8548, lng: 18.4162 }
    ]
  }
];

export const roadworks: Roadwork[] = [
  {
    id: 'rw-1',
    description: 'Saniranje kolovоза на Zmaja od Bosne',
    latitude: 43.8550,
    longitude: 18.4162,
    severity: 'high',
    startDate: Date.now() - 86400000 * 3,
    endDate: Date.now() + 86400000 * 14
  },
  {
    id: 'rw-2',
    description: 'Radovi na tramvajskim šinama kod Skenderije',
    latitude: 43.8598,
    longitude: 18.4234,
    severity: 'medium',
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 86400000 * 7
  }
];

export const initialChallengeEntries: ChallengeEntry[] = [
  {
    schoolId: 'tehnicka-skola-sarajevo',
    energyPoints: 1250,
    transportPoints: 980,
    habitsPoints: 750,
    ideasPoints: 320,
    updatedAt: Date.now()
  },
  {
    schoolId: 'prva-gimnazija',
    energyPoints: 1100,
    transportPoints: 1150,
    habitsPoints: 680,
    ideasPoints: 410,
    updatedAt: Date.now()
  },
  {
    schoolId: 'druga-gimnazija',
    energyPoints: 950,
    transportPoints: 870,
    habitsPoints: 820,
    ideasPoints: 290,
    updatedAt: Date.now()
  },
  {
    schoolId: 'medicinska-skola-sarajevo',
    energyPoints: 880,
    transportPoints: 920,
    habitsPoints: 710,
    ideasPoints: 350,
    updatedAt: Date.now()
  },
  {
    schoolId: 'univerzitet-sarajevo',
    energyPoints: 1050,
    transportPoints: 1000,
    habitsPoints: 780,
    ideasPoints: 420,
    updatedAt: Date.now()
  }
];

export function getStationById(id: string): Station | undefined {
  return stations.find(s => s.id === id);
}

export function getSchoolById(id: string): School | undefined {
  return schools.find(s => s.id === id);
}

export function getLineById(id: string): TramLine | undefined {
  return tramLines.find(l => l.id === id);
}