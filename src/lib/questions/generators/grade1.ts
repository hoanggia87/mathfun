import type { Question, QuestionGenerator } from '../types';
import { pick, randInt, shuffle } from '../rng';
import { v4 as uuid } from 'uuid';

const make = (
  topic: string,
  semester: 1 | 2,
  type: Question['type'],
  prompt: string,
  answer: string,
  choices?: string[]
): Question => ({
  id: uuid(),
  grade: 1,
  semester,
  topic,
  type,
  prompt,
  answer,
  choices,
});

export const g1_count_10: QuestionGenerator = (rng) => {
  const n = randInt(rng, 0, 10);
  const cases: (() => Question)[] = [
    () => make('g1-count-10', 1, 'fill-blank', `Số liền sau của ${n} là ...`, String(n + 1)),
    () => {
      const a = randInt(rng, 0, 10);
      const b = randInt(rng, 0, 10);
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return make('g1-count-10', 1, 'multiple-choice', `So sánh: ${a} ... ${b}`, ans, ['>', '<', '=']);
    },
  ];
  return pick(rng, cases)();
};

export const g1_add_sub_10: QuestionGenerator = (rng) => {
  const isAdd = rng() < 0.5;
  if (isAdd) {
    const a = randInt(rng, 0, 9);
    const b = randInt(rng, 0, 10 - a);
    return make('g1-add-sub-10', 1, 'fill-blank', `${a} + ${b} = ...`, String(a + b));
  } else {
    const a = randInt(rng, 1, 10);
    const b = randInt(rng, 0, a);
    return make('g1-add-sub-10', 1, 'fill-blank', `${a} − ${b} = ...`, String(a - b));
  }
};

export const g1_shapes_2d: QuestionGenerator = (rng) => {
  const shapes = [
    { name: 'Hình vuông', emoji: '⬛', sides: '4' },
    { name: 'Hình tam giác', emoji: '🔺', sides: '3' },
    { name: 'Hình chữ nhật', emoji: '▬', sides: '4' },
  ];
  const s = pick(rng, shapes);
  return make(
    'g1-shapes-2d',
    1,
    'multiple-choice',
    `${s.name} ${s.emoji} có mấy cạnh?`,
    s.sides,
    shuffle(rng, ['3', '4', '5', '6'])
  );
};

export const g1_count_100: QuestionGenerator = (rng) => {
  const n = randInt(rng, 11, 99);
  const cases: (() => Question)[] = [
    () => make('g1-count-100', 2, 'fill-blank', `Số liền trước ${n} là ...`, String(n - 1)),
    () => make('g1-count-100', 2, 'fill-blank', `Số liền sau ${n} là ...`, String(n + 1)),
    () => {
      const a = randInt(rng, 11, 99);
      const b = randInt(rng, 11, 99);
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return make('g1-count-100', 2, 'multiple-choice', `So sánh: ${a} ... ${b}`, ans, ['>', '<', '=']);
    },
  ];
  return pick(rng, cases)();
};

export const g1_add_sub_100_no_carry: QuestionGenerator = (rng) => {
  const isAdd = rng() < 0.5;
  if (isAdd) {
    const aT = randInt(rng, 1, 8) * 10;
    const aU = randInt(rng, 0, 4);
    const bT = randInt(rng, 1, 9 - aT / 10) * 10;
    const bU = randInt(rng, 0, 9 - aU);
    const a = aT + aU;
    const b = bT + bU;
    return make('g1-add-sub-100-no-carry', 2, 'fill-blank', `${a} + ${b} = ...`, String(a + b));
  } else {
    const aT = randInt(rng, 3, 9) * 10;
    const aU = randInt(rng, 5, 9);
    const bT = randInt(rng, 1, aT / 10 - 1) * 10;
    const bU = randInt(rng, 0, aU);
    const a = aT + aU;
    const b = bT + bU;
    return make('g1-add-sub-100-no-carry', 2, 'fill-blank', `${a} − ${b} = ...`, String(a - b));
  }
};

export const g1_length_cm: QuestionGenerator = (rng) => {
  const a = randInt(rng, 5, 30);
  const b = randInt(rng, 2, a - 1);
  const isAdd = rng() < 0.5;
  if (isAdd) {
    return make('g1-length-cm', 2, 'fill-blank', `${a} cm + ${b} cm = ... cm`, String(a + b));
  }
  return make('g1-length-cm', 2, 'fill-blank', `${a} cm − ${b} cm = ... cm`, String(a - b));
};

export const g1_clock_hour: QuestionGenerator = (rng) => {
  const h = randInt(rng, 1, 12);
  return make('g1-clock-hour', 2, 'multiple-choice', `Sau ${h} giờ là mấy giờ?`, String(h === 12 ? 1 : h + 1), shuffle(rng, [String(h - 1 < 1 ? 12 : h - 1), String(h === 12 ? 1 : h + 1), String(h), String(h + 2 > 12 ? h - 10 : h + 2)]));
};

export const G1_GENERATORS: Record<string, QuestionGenerator> = {
  'g1-count-10': g1_count_10,
  'g1-add-sub-10': g1_add_sub_10,
  'g1-shapes-2d': g1_shapes_2d,
  'g1-count-100': g1_count_100,
  'g1-add-sub-100-no-carry': g1_add_sub_100_no_carry,
  'g1-length-cm': g1_length_cm,
  'g1-clock-hour': g1_clock_hour,
};
