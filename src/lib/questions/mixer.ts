import { defaultRng, pick, randInt, shuffle } from './rng';
import type { Grade, Question, QuestionGenerator, Semester } from './types';
import { G2_GENERATORS } from './generators/grade2';
import { getG2WordProblems } from './bank/grade-2/word-problems';
import { G4_GENERATORS } from './generators/grade4';
import { getG4WordProblems } from './bank/grade-4/word-problems';
import { G1_GENERATORS } from './generators/grade1';
import { G3_GENERATORS } from './generators/grade3';
import { G5_GENERATORS } from './generators/grade5';

const MC_CONVERT_PROB = 0.3;

function generateDistractors(correct: number, isInteger: boolean, count: number, rng: () => number): number[] {
  const distractors = new Set<number>();
  const magnitude = Math.max(1, Math.abs(correct));
  const maxOffset = Math.max(3, Math.floor(magnitude * 0.5));

  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    attempts++;
    const offset = randInt(rng, 1, maxOffset);
    const sign = rng() < 0.5 ? -1 : 1;
    let candidate = correct + sign * offset;
    if (!isInteger) candidate = Math.round(candidate * 100) / 100;
    if (candidate !== correct && candidate >= 0) {
      distractors.add(candidate);
    }
  }

  let pad = 1;
  while (distractors.size < count) {
    const candidate = isInteger ? correct + pad : Math.round((correct + pad * 0.1) * 100) / 100;
    if (candidate !== correct && candidate >= 0) distractors.add(candidate);
    pad++;
  }

  return Array.from(distractors);
}

function maybeConvertToMC(q: Question, rng: () => number): Question {
  if (q.type !== 'fill-blank') return q;
  if (rng() > MC_CONVERT_PROB) return q;

  const correct = Number(q.answer.replace(',', '.'));
  if (!isFinite(correct)) return q;

  const isInteger = Number.isInteger(correct);
  const distractors = generateDistractors(correct, isInteger, 3, rng);
  const formatNum = (n: number) => (isInteger ? String(n) : String(n));
  const choices = shuffle(rng, [q.answer, ...distractors.map(formatNum)]);

  return { ...q, type: 'multiple-choice', choices };
}

const GENERATORS_BY_GRADE: Record<Grade, Record<string, QuestionGenerator>> = {
  1: G1_GENERATORS,
  2: G2_GENERATORS,
  3: G3_GENERATORS,
  4: G4_GENERATORS,
  5: G5_GENERATORS,
};

const WORD_PROBLEM_LOADERS: Record<Grade, ((topic: string, semester: 1 | 2 | 'all') => Question[]) | null> = {
  1: null,
  2: getG2WordProblems,
  3: null,
  4: getG4WordProblems,
  5: null,
};

export type SessionConfig = {
  grade: Grade;
  semester: Semester | 'all';
  topics: string[];
  count: number;
};

const DEDUP_MAX_RETRY = 8;

function promptKey(q: Question): string {
  return q.prompt.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function generateQuestions(config: SessionConfig): Question[] {
  const rng = defaultRng();
  const { grade, semester, topics, count } = config;
  const gens = GENERATORS_BY_GRADE[grade] ?? {};
  const wpLoader = WORD_PROBLEM_LOADERS[grade];

  const generatorTopics = topics.filter((t) => gens[t]);
  const wordProblemTopics = topics.filter((t) => wpLoader && t.includes('word'));

  const wordProblemPool: Question[] = [];
  if (wpLoader) {
    for (const t of wordProblemTopics) {
      wordProblemPool.push(...wpLoader(t, semester));
    }
  }

  const questions: Question[] = [];
  const seen = new Set<string>();

  const drawCandidate = (): Question | null => {
    const useWordProblem = wordProblemPool.length > 0 && rng() < (wordProblemTopics.length / topics.length) * 0.6;
    if (useWordProblem) return pick(rng, wordProblemPool);
    if (generatorTopics.length > 0) {
      const topic = pick(rng, generatorTopics);
      return gens[topic](rng);
    }
    if (wordProblemPool.length > 0) return pick(rng, wordProblemPool);
    return null;
  };

  for (let i = 0; i < count; i++) {
    let chosen: Question | null = null;
    let fallback: Question | null = null;
    for (let attempt = 0; attempt < DEDUP_MAX_RETRY; attempt++) {
      const candidate = drawCandidate();
      if (!candidate) break;
      fallback = candidate;
      if (!seen.has(promptKey(candidate))) {
        chosen = candidate;
        break;
      }
    }
    const q = chosen ?? fallback;
    if (!q) break;
    seen.add(promptKey(q));
    questions.push(maybeConvertToMC(q, rng));
  }

  return shuffle(rng, questions);
}

export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/,/g, '.');
}

export function checkAnswer(input: string, expected: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}
