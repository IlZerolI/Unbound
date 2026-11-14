import { Station, BusLine, School, Survey, Route, Roadwork, ChallengeEntry } from '@/types';

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
  {
    id: 'trg-slobode',
    name: 'Trg Slobode',
    latitude: 43.8592,
    longitude: 18.4215,
    address: 'Trg Slobode, Sarajevo',
    schoolId: 'prva-gimnazija',
    hasSmartBench: true,
    hasBikeStation: true,
    bikeCapacity: 8
  },
  {
    id: 'medicinska-skola',
    name: 'Medicinska škola',
    latitude: 43.8498,
    longitude: 18.3987,
    address: 'Bolnička 25, Sarajevo',
    schoolId: 'medicinska-skola-sarajevo',
    hasSmartBench: false,
    hasBikeStation: true,
    bikeCapacity: 10
  },
  {
    id: 'autobuska-stanica',
    name: 'Autobuska stanica',
    latitude: 43.8389,
    longitude: 18.3856,
    address: 'Put života 8, Sarajevo',
    schoolId: undefined,
    hasSmartBench: true,
    hasBikeStation: false,
    bikeCapacity: 0
  }
];

export const busLines: BusLine[] = [
  {
    id: 'line-12',
    number: '12',
    name: 'Centar',
    color: '#0B7A4B',
    destinations: ['Centar', 'Baščaršija', 'Marijin Dvor']
  },
  {
    id: 'line-7',
    number: '7',
    name: 'Škola',
    color: '#FFB703',
    destinations: ['Gimnazija', 'Medicinska škola', 'Univerzitet']
  },
  {
    id: 'line-3',
    number: '3',
    name: 'Željeznička stanica',
    color: '#1A3A2E',
    destinations: ['Željeznička stanica', 'Autobuska stanica', 'Centar']
  }
];

export const schools: School[] = [
  { id: 'gimnazija-sarajevo', name: 'Gimnazija Sarajevo', city: 'Sarajevo' },
  { id: 'prva-gimnazija', name: 'Prva gimnazija', city: 'Sarajevo' },
  { id: 'medicinska-skola-sarajevo', name: 'Medicinska škola Sarajevo', city: 'Sarajevo' },
  { id: 'druga-gimnazija', name: 'Druga gimnazija', city: 'Sarajevo' }
];

export const surveys: Survey[] = [
  {
    id: 'survey-1',
    question: 'Koja je vaša prioritetna poboljšanja za stanicu?',
    options: [
      { id: 'opt-1', text: 'Bolja rasvjeta i kamere', votes: 42 },
      { id: 'opt-2', text: 'Više sjedišta i zaklona', votes: 38 },
      { id: 'opt-3', text: 'Wi-Fi i nabijanje telefona', votes: 55 },
      { id: 'opt-4', text: 'Real-time informacije o autobusima', votes: 67 }
    ],
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'survey-2',
    question: 'Kako najčešće dođete do stanice?',
    options: [
      { id: 'opt-5', text: 'Pješke', votes: 89 },
      { id: 'opt-6', text: 'Biciklom', votes: 23 },
      { id: 'opt-7', text: 'Autobusom/Tramvajem', votes: 45 },
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
      { lat: 43.8563, lng: 18.4131 },
      { lat: 43.8571, lng: 18.4142 },
      { lat: 43.8582, lng: 18.4168 }
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
      { lat: 43.8563, lng: 18.4131 },
      { lat: 43.8585, lng: 18.4189 },
      { lat: 43.8601, lng: 18.4234 }
    ]
  },
  {
    id: 'route-3',
    name: 'Brza ruta do tramvaja',
    description: 'Najkraći put do tramvajske stanice 3',
    distance: 350,
    duration: 4,
    type: 'walking',
    safetyScore: 90,
    waypoints: [
      { lat: 43.8563, lng: 18.4131 },
      { lat: 43.8568, lng: 18.4138 }
    ]
  }
];

export const roadworks: Roadwork[] = [
  {
    id: 'rw-1',
    description: 'Saniranje asfalta na Zmaja od Bosne',
    latitude: 43.8575,
    longitude: 18.4148,
    severity: 'high',
    startDate: Date.now() - 86400000 * 3,
    endDate: Date.now() + 86400000 * 14
  },
  {
    id: 'rw-2',
    description: 'Radovi na vodovodu u Bolničkoj ulici',
    latitude: 43.8502,
    longitude: 18.3991,
    severity: 'medium',
    startDate: Date.now() - 86400000,
    endDate: Date.now() + 86400000 * 7
  }
];

export const initialChallengeEntries: ChallengeEntry[] = [
  {
    schoolId: 'gimnazija-sarajevo',
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
    schoolId: 'medicinska-skola-sarajevo',
    energyPoints: 950,
    transportPoints: 870,
    habitsPoints: 820,
    ideasPoints: 290,
    updatedAt: Date.now()
  },
  {
    schoolId: 'druga-gimnazija',
    energyPoints: 880,
    transportPoints: 920,
    habitsPoints: 710,
    ideasPoints: 350,
    updatedAt: Date.now()
  }
];

export function getStationById(id: string): Station | undefined {
  return stations.find(s => s.id === id);
}

export function getSchoolById(id: string): School | undefined {
  return schools.find(s => s.id === id);
}

export function getLineById(id: string): BusLine | undefined {
  return busLines.find(l => l.id === id);
}