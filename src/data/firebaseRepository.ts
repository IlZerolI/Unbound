import { Repository } from '@/types';
import { Report, Rating, Suggestion, Survey, SuspiciousReport, ChallengeEntry, UserPreferences } from '@/types';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

let firebaseApp: any = null;
let firestore: any = null;
let initialized = false;

export async function initializeFirebase(config: FirebaseConfig): Promise<boolean> {
  if (initialized) return true;

  try {
    const { initializeApp } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');

    firebaseApp = initializeApp(config);
    firestore = getFirestore(firebaseApp);
    initialized = true;
    console.log('Firebase initialized');
    return true;
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    return false;
  }
}

export function isFirebaseEnabled(): boolean {
  return initialized && (import.meta as any).env?.VITE_USE_FIREBASE === 'true';
}

function getCollection(name: string) {
  if (!firestore) throw new Error('Firestore not initialized');
  const { collection } = require('firebase/firestore');
  return collection(firestore, name);
}

async function addDocWithTimestamp(collectionName: string, data: any) {
  const { addDoc, serverTimestamp } = require('firebase/firestore');
  const docRef = await addDoc(getCollection(collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

async function updateDocWithTimestamp(collectionName: string, id: string, data: any) {
  const { doc, updateDoc, serverTimestamp } = require('firebase/firestore');
  await updateDoc(doc(firestore, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export const firebaseRepository = {
  reports: {
    async create(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
      const id = await addDocWithTimestamp('reports', { ...report, status: 'pending' });
      return { ...report, id, status: 'pending', createdAt: Date.now(), updatedAt: Date.now() };
    },
    async getAll(): Promise<Report[]> {
      const { getDocs, query, orderBy } = require('firebase/firestore');
      const snapshot = await getDocs(query(getCollection('reports'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    },
    async update(id: string, data: Partial<Report>): Promise<Report | null> {
      await updateDocWithTimestamp('reports', id, data);
      const { getDoc, doc } = require('firebase/firestore');
      const snap = await getDoc(doc(firestore, 'reports', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    }
  } as Repository<Report>,

  ratings: {
    async create(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
      const id = await addDocWithTimestamp('ratings', rating);
      return { ...rating, id, createdAt: Date.now() };
    },
    async getAll(): Promise<Rating[]> {
      const { getDocs, query, orderBy } = require('firebase/firestore');
      const snapshot = await getDocs(query(getCollection('ratings'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
  } as Repository<Rating>,

  suggestions: {
    async create(suggestion: Omit<Suggestion, 'id' | 'createdAt'>): Promise<Suggestion> {
      const id = await addDocWithTimestamp('suggestions', { ...suggestion, votes: 0 });
      return { ...suggestion, id, votes: 0, createdAt: Date.now() };
    },
    async getAll(): Promise<Suggestion[]> {
      const { getDocs, query, orderBy } = require('firebase/firestore');
      const snapshot = await getDocs(query(getCollection('suggestions'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    },
    async update(id: string, data: Partial<Suggestion>): Promise<Suggestion | null> {
      await updateDocWithTimestamp('suggestions', id, data);
      const { getDoc, doc } = require('firebase/firestore');
      const snap = await getDoc(doc(firestore, 'suggestions', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    }
  } as Repository<Suggestion>,

  surveys: {
    async create(survey: Omit<Survey, 'id'>): Promise<Survey> {
      const id = await addDocWithTimestamp('surveys', survey);
      return { ...survey, id };
    },
    async getAll(): Promise<Survey[]> {
      const { getDocs, query, orderBy } = require('firebase/firestore');
      const snapshot = await getDocs(query(getCollection('surveys'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    },
    async update(id: string, data: Partial<Survey>): Promise<Survey | null> {
      await updateDocWithTimestamp('surveys', id, data);
      const { getDoc, doc } = require('firebase/firestore');
      const snap = await getDoc(doc(firestore, 'surveys', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    }
  } as Repository<Survey>,

  surveyVotes: {
    async create(vote: { surveyId: string; optionId: string; votedAt: number }): Promise<any> {
      const id = await addDocWithTimestamp('surveyVotes', vote);
      return { id, ...vote };
    },
    async getAll(): Promise<any[]> {
      const { getDocs } = require('firebase/firestore');
      const snapshot = await getDocs(getCollection('surveyVotes'));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
  },

  suspiciousReports: {
    async create(report: Omit<SuspiciousReport, 'id' | 'createdAt'>): Promise<SuspiciousReport> {
      const id = await addDocWithTimestamp('suspiciousReports', report);
      return { ...report, id, createdAt: Date.now() };
    },
    async getAll(): Promise<SuspiciousReport[]> {
      const { getDocs, query, orderBy } = require('firebase/firestore');
      const snapshot = await getDocs(query(getCollection('suspiciousReports'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
  } as Repository<SuspiciousReport>,

  challengeEntries: {
    async create(entry: Omit<ChallengeEntry, 'schoolId'> & { schoolId: string }): Promise<ChallengeEntry> {
      const { doc, setDoc } = require('firebase/firestore');
      await setDoc(doc(firestore, 'challengeEntries', entry.schoolId), entry);
      return entry;
    },
    async getAll(): Promise<ChallengeEntry[]> {
      const { getDocs } = require('firebase/firestore');
      const snapshot = await getDocs(getCollection('challengeEntries'));
      return snapshot.docs.map((doc: any) => doc.data());
    },
    async update(schoolId: string, data: Partial<ChallengeEntry>): Promise<ChallengeEntry | null> {
      await updateDocWithTimestamp('challengeEntries', schoolId, data);
      const { getDoc, doc } = require('firebase/firestore');
      const snap = await getDoc(doc(firestore, 'challengeEntries', schoolId));
      return snap.exists() ? snap.data() : null;
    }
  },

  userPreferences: {
    async getById(id: string): Promise<UserPreferences | null> {
      const { getDoc, doc } = require('firebase/firestore');
      const snap = await getDoc(doc(firestore, 'userPreferences', id));
      return snap.exists() ? snap.data() : null;
    },
    async update(id: string, data: Partial<UserPreferences>): Promise<UserPreferences | null> {
      const { doc, setDoc } = require('firebase/firestore');
      await setDoc(doc(firestore, 'userPreferences', id), data, { merge: true });
      return data as UserPreferences;
    }
  }
};

export function getRepository<T>(): Repository<T> {
  if (isFirebaseEnabled()) {
    return firebaseRepository as unknown as Repository<T>;
  }
  throw new Error('Firebase not enabled - use localRepository instead');
}