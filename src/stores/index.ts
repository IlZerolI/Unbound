import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Station, UserPreferences, BusArrival, EnergyData, Report, Rating, Suggestion, Survey, ChallengeEntry, School, Route, Roadwork, SuspiciousReport, StationEquipment } from '@/types';
import { stations, schools, initialChallengeEntries } from '@/data/stations';
import { repositories, initRepositories } from '@/data/localRepository';
import { surveys as seedSurveys } from '@/data/stations';

interface AppState {
  selectedStationId: string | null;
  setSelectedStation: (id: string | null) => void;
  stations: Station[];
  getStationById: (id: string) => Station | undefined;
  userPreferences: UserPreferences;
  setUserPreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => Promise<void>;
  largeText: boolean;
  setLargeText: (enabled: boolean) => Promise<void>;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  highContrast: false,
  largeText: false,
  language: 'bs',
  notificationsEnabled: false
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedStationId: null,
      setSelectedStation: (id) => set({ selectedStationId: id }),
      stations,
      getStationById: (id) => stations.find(s => s.id === id),
      userPreferences: defaultPreferences,
      setUserPreferences: async (prefs) => {
        const newPrefs = { ...get().userPreferences, ...prefs };
        set({ userPreferences: newPrefs });
        await repositories.userPreferences.update('prefs', newPrefs as any);
      },
      theme: 'system',
      setTheme: async (theme) => {
        set({ theme });
        await get().setUserPreferences({ theme });
      },
      highContrast: false,
      setHighContrast: async (enabled) => {
        set({ highContrast: enabled });
        await get().setUserPreferences({ highContrast: enabled });
        document.documentElement.classList.toggle('high-contrast', enabled);
      },
      largeText: false,
      setLargeText: async (enabled) => {
        set({ largeText: enabled });
        await get().setUserPreferences({ largeText: enabled });
        document.documentElement.classList.toggle('large-text', enabled);
      },
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: 'student-stop-prefs',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.highContrast) document.documentElement.classList.add('high-contrast');
        if (state?.largeText) document.documentElement.classList.add('large-text');
        const theme = state?.theme || 'system';
        document.documentElement.setAttribute('data-theme', theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme);
      }
    }
  )
);

interface BusState {
  arrivals: BusArrival[];
  setArrivals: (arrivals: BusArrival[]) => void;
  selectedStationId: string | null;
  subscribeToStation: (stationId: string) => () => void;
}

export const useBusStore = create<BusState>((set) => ({
  arrivals: [],
  setArrivals: (arrivals: BusArrival[]) => set({ arrivals }),
  selectedStationId: null,
  subscribeToStation: (stationId) => {
    set({ selectedStationId: stationId });
    const { MockBusProvider } = require('@/data/busProvider');
    const provider = new MockBusProvider();
    return provider.subscribe(stationId, (arrivals: BusArrival[]) => {
      set({ arrivals });
    });
  }
}));

interface EnergyState {
  currentData: EnergyData | null;
  hourlyData: Array<{ hour: number; solar: number; kinetic: number; consumption: number; battery: number }>;
  setCurrentData: (data: EnergyData) => void;
  subscribe: () => () => void;
}

export const useEnergyStore = create<EnergyState>((set) => ({
  currentData: null,
  hourlyData: [],
  setCurrentData: (data: EnergyData) => set({ currentData: data }),
  subscribe: () => {
    const { energySimulator } = require('@/data/energySimulator');
    const unsub = energySimulator.subscribe((data: EnergyData) => {
      set({ currentData: data });
    });
    set({ hourlyData: require('@/data/energySimulator').generateHourlyData() });
    return unsub;
  }
}));

interface ReportState {
  reports: Report[];
  suspiciousReports: SuspiciousReport[];
  loading: boolean;
  loadReports: () => Promise<void>;
  createReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Report>;
  createSuspiciousReport: (report: Omit<SuspiciousReport, 'id' | 'createdAt'>) => Promise<SuspiciousReport>;
}

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  suspiciousReports: [],
  loading: false,
  loadReports: async () => {
    set({ loading: true });
    const [reports, suspicious] = await Promise.all([
      repositories.reports.getAll(),
      repositories.suspiciousReports.getAll()
    ]);
    set({ 
      reports: reports as Report[], 
      suspiciousReports: suspicious as SuspiciousReport[], 
      loading: false 
    });
  },
  createReport: async (report) => {
    const newReport = await repositories.reports.create({
      ...report,
      status: 'pending' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    const typedReport = newReport as Report;
    set({ reports: [typedReport, ...get().reports] });
    return typedReport;
  },
  createSuspiciousReport: async (report) => {
    const newReport = await repositories.suspiciousReports.create({
      ...report,
      createdAt: Date.now()
    });
    const typedReport = newReport as SuspiciousReport;
    set({ suspiciousReports: [typedReport, ...get().suspiciousReports] });
    return typedReport;
  }
}));

interface StudentVoiceState {
  surveys: Survey[];
  ratings: Rating[];
  suggestions: Suggestion[];
  votedSurveys: Set<string>;
  loadData: () => Promise<void>;
  voteSurvey: (surveyId: string, optionId: string) => Promise<void>;
  submitRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => Promise<void>;
  submitSuggestion: (text: string) => Promise<void>;
}

export const useStudentVoiceStore = create<StudentVoiceState>((set, get) => ({
  surveys: [],
  ratings: [],
  suggestions: [],
  votedSurveys: new Set(),
  loadData: async () => {
    const [surveys, ratings, suggestions, votes] = await Promise.all([
      repositories.surveys.getAll(),
      repositories.ratings.getAll(),
      repositories.suggestions.getAll(),
      repositories.surveyVotes.getAll()
    ]);
    const votedSet = new Set(votes.map(v => v.surveyId));
    set({ surveys, ratings, suggestions, votedSurveys: votedSet });
  },
  voteSurvey: async (surveyId, optionId) => {
    if (get().votedSurveys.has(surveyId)) return;

    const survey = get().surveys.find(s => s.id === surveyId);
    if (!survey) return;

    const updatedOptions = survey.options.map(opt =>
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );

    await repositories.surveys.update(surveyId, { options: updatedOptions });
    await repositories.surveyVotes.create({ surveyId, optionId, votedAt: Date.now() });

    set({
      surveys: get().surveys.map(s => s.id === surveyId ? { ...s, options: updatedOptions } : s),
      votedSurveys: new Set([...get().votedSurveys, surveyId])
    });
  },
  submitRating: async (rating) => {
    const newRating = await repositories.ratings.create({
      ...rating,
      createdAt: Date.now()
    });
    set({ ratings: [newRating, ...get().ratings] });
  },
  submitSuggestion: async (text) => {
    const newSuggestion = await repositories.suggestions.create({
      text,
      votes: 0,
      createdAt: Date.now()
    });
    set({ suggestions: [newSuggestion, ...get().suggestions] });
  }
}));

interface ChallengeState {
  entries: ChallengeEntry[];
  selectedSchoolId: string | null;
  schools: School[];
  loadData: () => Promise<void>;
  selectSchool: (schoolId: string) => Promise<void>;
  addPoints: (schoolId: string, category: keyof Omit<ChallengeEntry, 'schoolId' | 'updatedAt'>, points: number) => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  entries: [],
  selectedSchoolId: null,
  schools,
  loadData: async () => {
    const entries = await repositories.challengeEntries.getAll();
    if (entries.length === 0) {
      await initRepositories(seedSurveys, initialChallengeEntries);
      const newEntries = await repositories.challengeEntries.getAll();
      set({ entries: newEntries });
    } else {
      set({ entries });
    }
    const prefs = await repositories.userPreferences.getById('prefs');
    if (prefs?.selectedSchoolId) {
      set({ selectedSchoolId: prefs.selectedSchoolId });
    }
  },
  selectSchool: async (schoolId) => {
    set({ selectedSchoolId: schoolId });
    await repositories.userPreferences.update('prefs', { selectedSchoolId: schoolId } as any);
  },
  addPoints: async (schoolId, category, points) => {
    const entry = get().entries.find(e => e.schoolId === schoolId);
    if (!entry) return;

    const updated = {
      ...entry,
      [category]: entry[category] + points,
      updatedAt: Date.now()
    };

    await repositories.challengeEntries.update(schoolId, updated);
    set({ entries: get().entries.map(e => e.schoolId === schoolId ? updated : e) });
  }
}));

interface SmartRouteState {
  routes: Route[];
  roadworks: Roadwork[];
  crowdReports: Map<string, 'low' | 'medium' | 'high'>;
  loadData: () => Promise<void>;
  reportCrowd: (stationId: string, level: 'low' | 'medium' | 'high') => void;
}

export const useSmartRouteStore = create<SmartRouteState>((set, get) => ({
  routes: [],
  roadworks: [],
  crowdReports: new Map(),
  loadData: async () => {
    const { routes, roadworks } = require('@/data/stations');
    set({ routes, roadworks });
  },
  reportCrowd: (stationId, level) => {
    set({ crowdReports: new Map([...get().crowdReports, [stationId, level]]) });
  }
}));

interface StationEquipmentState {
  equipment: Map<string, StationEquipment>;
  getEquipment: (stationId: string) => StationEquipment | undefined;
  updateEquipment: (stationId: string, equipment: Partial<StationEquipment>) => void;
}

const defaultEquipment: StationEquipment = {
  lighting: 'working',
  cameras: 'working',
  screen: 'working',
  bench: 'working',
  lastChecked: Date.now() - 86400000 * 2
};

export const useStationEquipmentStore = create<StationEquipmentState>((set, get) => ({
  equipment: new Map(),
  getEquipment: (stationId) => get().equipment.get(stationId) || defaultEquipment,
  updateEquipment: (stationId, updates) => {
    const current = get().equipment.get(stationId) || defaultEquipment;
    set({
      equipment: new Map([
        ...get().equipment,
        [stationId, { ...current, ...updates, lastChecked: Date.now() }]
      ])
    });
  }
}));

export async function initializeApp() {
  await Promise.all([
    useReportStore.getState().loadReports(),
    useStudentVoiceStore.getState().loadData(),
    useChallengeStore.getState().loadData(),
    useSmartRouteStore.getState().loadData()
  ]);
}