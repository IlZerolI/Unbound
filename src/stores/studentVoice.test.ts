import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStudentVoiceStore } from '@/stores';
import { repositories } from '@/data/localRepository';

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

describe('Student Voice - voting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStudentVoiceStore.setState({
      surveys: [],
      ratings: [],
      suggestions: [],
      votedSurveys: new Set()
    });
  });

  it('should allow voting on a survey option', async () => {
    const testSurvey = {
      id: 'test-survey',
      question: 'Test pitanje?',
      options: [
        { id: 'opt-1', text: 'Opcija 1', votes: 0 },
        { id: 'opt-2', text: 'Opcija 2', votes: 0 }
      ],
      createdAt: Date.now()
    };

    await repositories.surveys.create(testSurvey);
    useStudentVoiceStore.setState({ surveys: [testSurvey] });

    await useStudentVoiceStore.getState().voteSurvey('test-survey', 'opt-1');

    const state = useStudentVoiceStore.getState();
    const survey = state.surveys.find(s => s.id === 'test-survey');
    expect(survey).toBeDefined();
    expect(survey!.options.find(o => o.id === 'opt-1')!.votes).toBe(1);
    expect(state.votedSurveys.has('test-survey:opt-1')).toBe(true);
  });

  it('should prevent voting twice on same survey', async () => {
    const testSurvey = {
      id: 'test-survey-2',
      question: 'Test pitanje 2?',
      options: [
        { id: 'opt-1', text: 'Opcija 1', votes: 0 },
        { id: 'opt-2', text: 'Opcija 2', votes: 0 }
      ],
      createdAt: Date.now()
    };

    await repositories.surveys.create(testSurvey);
    useStudentVoiceStore.setState({ surveys: [testSurvey] });

    await useStudentVoiceStore.getState().voteSurvey('test-survey-2', 'opt-1');
    await useStudentVoiceStore.getState().voteSurvey('test-survey-2', 'opt-2');

    const state = useStudentVoiceStore.getState();
    const survey = state.surveys.find(s => s.id === 'test-survey-2');
    expect(survey!.options.find(o => o.id === 'opt-1')!.votes).toBe(1);
    expect(survey!.options.find(o => o.id === 'opt-2')!.votes).toBe(0);
    expect(state.votedSurveys.has('test-survey-2:opt-1')).toBe(true);
    expect(state.votedSurveys.has('test-survey-2:opt-2')).toBe(false);
  });

  it('should allow voting on different surveys', async () => {
    const survey1 = {
      id: 'survey-1',
      question: 'Pitanje 1?',
      options: [{ id: 'a', text: 'A', votes: 0 }],
      createdAt: Date.now()
    };
    const survey2 = {
      id: 'survey-2',
      question: 'Pitanje 2?',
      options: [{ id: 'b', text: 'B', votes: 0 }],
      createdAt: Date.now()
    };

    await repositories.surveys.create(survey1);
    await repositories.surveys.create(survey2);
    useStudentVoiceStore.setState({ surveys: [survey1, survey2] });

    await useStudentVoiceStore.getState().voteSurvey('survey-1', 'a');
    await useStudentVoiceStore.getState().voteSurvey('survey-2', 'b');

    const state = useStudentVoiceStore.getState();
    expect(state.votedSurveys.has('survey-1:a')).toBe(true);
    expect(state.votedSurveys.has('survey-2:b')).toBe(true);
  });
});