export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  schoolId?: string;
  hasSmartBench: boolean;
  hasBikeStation: boolean;
  bikeCapacity: number;
}

export interface TramLine {
  id: string;
  number: string;
  name: string;
  color: string;
  destinations: string[];
  stationOrder: string[];
}

export interface TramArrival {
  id: string;
  lineId: string;
  stationId: string;
  destination: string;
  scheduledTime: number;
  estimatedTime: number;
  delay: number;
  latitude: number;
  longitude: number;
  vehicleId: string;
  occupancy: 'empty' | 'half' | 'full';
}

export interface EnergyData {
  timestamp: number;
  solar: number;
  kinetic: number;
  consumption: number;
  batteryLevel: number;
  batteryStatus: 'charging' | 'discharging' | 'stable';
}

export interface Report {
  id: string;
  stationId: string;
  category: ReportCategory;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  createdAt: number;
  updatedAt: number;
}

export type ReportCategory = 'bench' | 'lighting' | 'glass' | 'screen' | 'cleanliness';
export type ReportStatus = 'pending' | 'inProgress' | 'resolved' | 'rejected';

export interface Survey {
  id: string;
  question: string;
  options: SurveyOption[];
  createdAt: number;
  endsAt?: number;
}

export interface SurveyOption {
  id: string;
  text: string;
  votes: number;
}

export interface Rating {
  id: string;
  stationId: string;
  cleanliness: number;
  safety: number;
  comfort: number;
  createdAt: number;
}

export interface Suggestion {
  id: string;
  text: string;
  votes: number;
  createdAt: number;
}

export interface School {
  id: string;
  name: string;
  city: string;
}

export interface ChallengeEntry {
  schoolId: string;
  energyPoints: number;
  transportPoints: number;
  habitsPoints: number;
  ideasPoints: number;
  updatedAt: number;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  distance: number;
  duration: number;
  type: 'walking' | 'cycling';
  safetyScore: number;
  waypoints: { lat: number; lng: number }[];
}

export interface Roadwork {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'medium' | 'high';
  startDate: number;
  endDate?: number;
}

export interface CrowdReport {
  id: string;
  stationId: string;
  level: 'low' | 'medium' | 'high';
  reportedAt: number;
}

export interface StationEquipment {
  lighting: EquipmentStatus;
  cameras: EquipmentStatus;
  screen: EquipmentStatus;
  bench: EquipmentStatus;
  lastChecked: number;
}

export type EquipmentStatus = 'working' | 'warning' | 'broken';

export interface SuspiciousReport {
  id: string;
  stationId: string;
  description: string;
  createdAt: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  highContrast: boolean;
  largeText: boolean;
  language: string;
  notificationsEnabled: boolean;
  selectedSchoolId?: string;
  selectedStationId?: string;
}

export interface Repository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface TramProvider {
  getArrivals(stationId: string): Promise<TramArrival[]>;
  subscribe(stationId: string, callback: (arrivals: TramArrival[]) => void): () => void;
}

export interface EnergySimulator {
  getCurrentData(): EnergyData;
  subscribe(callback: (data: EnergyData) => void): () => void;
}

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}