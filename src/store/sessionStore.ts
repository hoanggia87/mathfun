import { create } from 'zustand';
import type { Question } from '@/lib/questions/types';
import type { SessionRecord } from '@/lib/db/sessions';

type SessionState = {
  lastResult: SessionRecord | null;
  questions: Question[];
  setLastResult: (r: SessionRecord | null) => void;
  setQuestions: (q: Question[]) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  lastResult: null,
  questions: [],
  setLastResult: (lastResult) => set({ lastResult }),
  setQuestions: (questions) => set({ questions }),
}));
