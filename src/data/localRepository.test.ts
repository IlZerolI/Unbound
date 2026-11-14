import { describe, it, expect, beforeEach, vi } from 'vitest';
import { repositories, initRepositories } from '@/data/localRepository';
import { surveys as seedSurveys, initialChallengeEntries } from '@/data/stations';

vi.mock('idb', () => ({
  openDB: vi.fn(() => Promise.resolve({
    getAll: vi.fn(() => Promise.resolve([])),
    get: vi.fn(() => Promise.resolve(null)),
    put: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
    transaction: vi.fn(() => ({
      store: { put: vi.fn(() => Promise.resolve()) },
      done: Promise.resolve()
    })),
    objectStore: vi.fn(() => ({ put: vi.fn(() => Promise.resolve()) }))
  }))
}));

describe('localRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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