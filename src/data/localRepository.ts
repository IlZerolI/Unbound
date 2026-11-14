import { Repository } from '@/types';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

type StoreName = 'reports' | 'ratings' | 'suggestions' | 'surveys' | 'surveyVotes' | 'suspiciousReports' | 'challengeEntries' | 'userPreferences';

interface StudentStopDB extends DBSchema {
  reports: {
    key: string;
    value: {
      id: string;
      stationId: string;
      category: string;
      description: string;
      photoUrl?: string;
      status: string;
      createdAt: number;
      updatedAt: number;
    };
    indexes: { 'by-station': string; 'by-date': number };
  };
  ratings: {
    key: string;
    value: {
      id: string;
      stationId: string;
      cleanliness: number;
      safety: number;
      comfort: number;
      createdAt: number;
    };
    indexes: { 'by-station': string };
  };
  suggestions: {
    key: string;
    value: {
      id: string;
      text: string;
      votes: number;
      createdAt: number;
    };
    indexes: { 'by-date': number };
  };
  surveys: {
    key: string;
    value: {
      id: string;
      question: string;
      options: Array<{ id: string; text: string; votes: number }>;
      createdAt: number;
      endsAt?: number;
    };
  };
  surveyVotes: {
    key: string;
    value: { surveyId: string; optionId: string; votedAt: number };
    indexes: { 'by-survey': string };
  };
  suspiciousReports: {
    key: string;
    value: {
      id: string;
      stationId: string;
      description: string;
      createdAt: number;
    };
    indexes: { 'by-station': string };
  };
  challengeEntries: {
    key: string;
    value: {
      schoolId: string;
      energyPoints: number;
      transportPoints: number;
      habitsPoints: number;
      ideasPoints: number;
      updatedAt: number;
    };
  };
  userPreferences: {
    key: string;
    value: {
      theme: 'light' | 'dark' | 'system';
      highContrast: boolean;
      largeText: boolean;
      language: string;
      notificationsEnabled: boolean;
      selectedSchoolId?: string;
      selectedStationId?: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<StudentStopDB>> | null = null;

function getDB(): Promise<IDBPDatabase<StudentStopDB>> {
  if (!dbPromise) {
    dbPromise = openDB<StudentStopDB>('student-stop', 1, {
      upgrade(db) {
        const reportsStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportsStore.createIndex('by-station', 'stationId');
        reportsStore.createIndex('by-date', 'createdAt');

        const ratingsStore = db.createObjectStore('ratings', { keyPath: 'id' });
        ratingsStore.createIndex('by-station', 'stationId');

        const suggestionsStore = db.createObjectStore('suggestions', { keyPath: 'id' });
        suggestionsStore.createIndex('by-date', 'createdAt');

        db.createObjectStore('surveys', { keyPath: 'id' });

        const surveyVotesStore = db.createObjectStore('surveyVotes', { keyPath: 'id' });
        surveyVotesStore.createIndex('by-survey', 'surveyId');

        const suspiciousStore = db.createObjectStore('suspiciousReports', { keyPath: 'id' });
        suspiciousStore.createIndex('by-station', 'stationId');

        db.createObjectStore('challengeEntries', { keyPath: 'schoolId' });
        db.createObjectStore('userPreferences', { keyPath: 'id' });
      }
    });
  }
  return dbPromise;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class LocalRepository<T> implements Repository<T> {
  private storeName: StoreName;
  private seedData: T[];

  constructor(storeName: StoreName, seedData: T[] = []) {
    this.storeName = storeName;
    this.seedData = seedData;
  }

  async getAll(): Promise<T[]> {
    const db = await getDB();
    const items = await db.getAll(this.storeName);
    if (items.length === 0 && this.seedData.length > 0) {
      const tx = db.transaction(this.storeName, 'readwrite');
      for (const item of this.seedData) {
        await tx.store.put(item as any);
      }
      await tx.done;
      return this.seedData;
    }
    return items as unknown as T[];
  }

  async getById(id: string): Promise<T | null> {
    const db = await getDB();
    const item = await db.get(this.storeName, id);
    return (item as unknown as T) || null;
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const db = await getDB();
    const newItem = { ...item, id: generateId() } as T;
    await db.put(this.storeName, newItem as any);
    return newItem;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const db = await getDB();
    const existing = await db.get(this.storeName, id);
    if (!existing) return null;
    const updated = { ...existing, ...item } as T;
    await db.put(this.storeName, updated as any);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    const existing = await db.get(this.storeName, id);
    if (!existing) return false;
    await db.delete(this.storeName, id);
    return true;
  }
}

export const repositories = {
  reports: new LocalRepository<StudentStopDB['reports']['value']>('reports', []),
  ratings: new LocalRepository<StudentStopDB['ratings']['value']>('ratings', []),
  suggestions: new LocalRepository<StudentStopDB['suggestions']['value']>('suggestions', []),
  surveys: new LocalRepository<StudentStopDB['surveys']['value']>('surveys', []),
  surveyVotes: new LocalRepository<any>('surveyVotes', []),
  suspiciousReports: new LocalRepository<StudentStopDB['suspiciousReports']['value']>('suspiciousReports', []),
  challengeEntries: new LocalRepository<any>('challengeEntries', []),
  userPreferences: new LocalRepository<any>('userPreferences', [])
};

export async function initRepositories(seedSurveys: StudentStopDB['surveys']['value'][], seedChallenges: StudentStopDB['challengeEntries']['value'][]) {
  const db = await getDB();
  const tx = db.transaction(['surveys', 'challengeEntries'] as const, 'readwrite');
  for (const survey of seedSurveys) {
    await tx.objectStore('surveys').put(survey);
  }
  for (const challenge of seedChallenges) {
    await tx.objectStore('challengeEntries').put(challenge);
  }
  await tx.done;
}