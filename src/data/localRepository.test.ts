import { describe, it, expect, beforeEach, vi } from 'vitest';
import { repositories, initRepositories } from '@/data/localRepository';
import { surveys as seedSurveys, initialChallengeEntries } from '@/data/stations';

const surveysStore: any[] = [];
const challengeEntriesStore: any[] = [];
const reportsStore: any[] = [];
const ratingsStore: any[] = [];
const suggestionsStore: any[] = [];
const surveyVotesStore: any[] = [];
const suspiciousReportsStore: any[] = [];

function createMockStore(store: any[], keyPath: string = 'id') {
  return {
    put: vi.fn((item: any) => {
      const key = item[keyPath];
      const existing = store.findIndex(s => s[keyPath] === key);
      if (existing >= 0) store[existing] = item;
      else store.push(item);
      return Promise.resolve(item);
    }),
    get: vi.fn((id: string) => Promise.resolve(store.find(s => s[keyPath] === id) || null)),
    getAll: vi.fn(() => Promise.resolve([...store])),
    delete: vi.fn((id: string) => {
      const idx = store.findIndex(s => s[keyPath] === id);
      if (idx >= 0) store.splice(idx, 1);
      return Promise.resolve();
    }),
  };
}

const mockSurveysStore = createMockStore(surveysStore, 'id');
const mockChallengeEntriesStore = createMockStore(challengeEntriesStore, 'schoolId');
const mockReportsStore = createMockStore(reportsStore, 'id');
const mockRatingsStore = createMockStore(ratingsStore, 'id');
const mockSuggestionsStore = createMockStore(suggestionsStore, 'id');
const mockSurveyVotesStore = createMockStore(surveyVotesStore, 'id');
const mockSuspiciousReportsStore = createMockStore(suspiciousReportsStore, 'id');

const allStores = {
  surveys: mockSurveysStore,
  challengeEntries: mockChallengeEntriesStore,
  reports: mockReportsStore,
  ratings: mockRatingsStore,
  suggestions: mockSuggestionsStore,
  surveyVotes: mockSurveyVotesStore,
  suspiciousReports: mockSuspiciousReportsStore,
};

const mockTx = {
  objectStore: vi.fn((name: string) => allStores[name as keyof typeof allStores] || createMockStore([])),
  done: Promise.resolve(),
};

vi.mock('idb', () => ({
  openDB: vi.fn(() => Promise.resolve({
    getAll: vi.fn((name: string) => Promise.resolve(allStores[name as keyof typeof allStores]?.getAll() || [])),
    get: vi.fn((name: string, id: string) => Promise.resolve(allStores[name as keyof typeof allStores]?.get(id) || null)),
    put: vi.fn((name: string, item: any) => Promise.resolve(allStores[name as keyof typeof allStores]?.put(item))),
    delete: vi.fn((name: string, id: string) => Promise.resolve(allStores[name as keyof typeof allStores]?.delete(id))),
    transaction: vi.fn(() => mockTx),
    objectStore: vi.fn((name: string) => allStores[name as keyof typeof allStores] || createMockStore([])),
  }))
}));

describe('localRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    surveysStore.length = 0;
    challengeEntriesStore.length = 0;
    reportsStore.length = 0;
    ratingsStore.length = 0;
    suggestionsStore.length = 0;
    surveyVotesStore.length = 0;
    suspiciousReportsStore.length = 0;
  });

  describe('repositories.reports', () => {
    it('should create a report', async () => {
      const report = await repositories.reports.create({
        stationId: 'gimnazija',
        category: 'bench',
        description: 'Klupa je slomljena',
        photoUrl: undefined,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      expect(report).toHaveProperty('id');
      expect(report.stationId).toBe('gimnazija');
      expect(report.category).toBe('bench');
    });

    it('should get all reports', async () => {
      const reports = await repositories.reports.getAll();
      expect(Array.isArray(reports)).toBe(true);
    });
  });

  describe('repositories.ratings', () => {
    it('should create a rating', async () => {
      const rating = await repositories.ratings.create({
        stationId: 'gimnazija',
        cleanliness: 4,
        safety: 5,
        comfort: 3,
        createdAt: Date.now()
      });
      expect(rating).toHaveProperty('id');
      expect(rating.cleanliness).toBe(4);
    });
  });

  describe('repositories.suggestions', () => {
    it('should create a suggestion', async () => {
      const suggestion = await repositories.suggestions.create({
        text: 'Dodajte Wi-Fi',
        votes: 0,
        createdAt: Date.now()
      });
      expect(suggestion).toHaveProperty('id');
      expect(suggestion.text).toBe('Dodajte Wi-Fi');
      expect(suggestion.votes).toBe(0);
    });
  });

  describe('repositories.surveys', () => {
    it('should seed surveys on init', async () => {
      await initRepositories(seedSurveys, initialChallengeEntries);
      const surveys = await repositories.surveys.getAll();
      expect(surveys.length).toBeGreaterThan(0);
    });
  });

  describe('repositories.challengeEntries', () => {
    it('should seed challenge entries on init', async () => {
      await initRepositories(seedSurveys, initialChallengeEntries);
      const entries = await repositories.challengeEntries.getAll();
      expect(entries.length).toBe(initialChallengeEntries.length);
    });
  });

  describe('repositories.surveyVotes', () => {
    it('should track survey votes', async () => {
      const vote = await repositories.surveyVotes.create({
        surveyId: 'survey-1',
        optionId: 'opt-1',
        votedAt: Date.now()
      });
      expect(vote.surveyId).toBe('survey-1');
      expect(vote.optionId).toBe('opt-1');
    });
  });

  describe('repositories.suspiciousReports', () => {
    it('should create suspicious report', async () => {
      const report = await repositories.suspiciousReports.create({
        stationId: 'gimnazija',
        description: 'Sumnjiva osoba',
        createdAt: Date.now()
      });
      expect(report).toHaveProperty('id');
      expect(report.stationId).toBe('gimnazija');
    });
  });
});