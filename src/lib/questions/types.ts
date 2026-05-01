export type Grade = 1 | 2 | 3 | 4 | 5;
export type Semester = 1 | 2;

export type QuestionType = 'fill-blank' | 'multiple-choice' | 'word-problem';

export type Question = {
  id: string;
  grade: Grade;
  semester: Semester;
  topic: string;
  type: QuestionType;
  prompt: string;
  choices?: string[];
  answer: string;
  unit?: string;
  hint?: string;
  solution?: string;
};

export type QuestionGenerator = (rng: () => number) => Question;
