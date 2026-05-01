import type { Question, QuestionGenerator } from '../types';
import { pick, randInt, shuffle } from '../rng';
import { v4 as uuid } from 'uuid';

const make = (
  topic: string,
  semester: 1 | 2,
  type: Question['type'],
  prompt: string,
  answer: string,
  choices?: string[],
  unit?: string
): Question => ({
  id: uuid(),
  grade: 3,
  semester,
  topic,
  type,
  prompt,
  answer,
  choices,
  unit,
});

export const g3_mul_table_6_9: QuestionGenerator = (rng) => {
  const base = randInt(rng, 6, 9);
  const f = randInt(rng, 1, 10);
  return make('g3-mul-table-6-9', 1, 'fill-blank', `${base} × ${f} = ...`, String(base * f));
};

export const g3_div_table_6_9: QuestionGenerator = (rng) => {
  const base = randInt(rng, 6, 9);
  const f = randInt(rng, 1, 10);
  return make('g3-div-table-6-9', 1, 'fill-blank', `${base * f} ÷ ${base} = ...`, String(f));
};

export const g3_mul_by_1_digit: QuestionGenerator = (rng) => {
  const a = randInt(rng, 12, 99);
  const b = randInt(rng, 2, 9);
  return make('g3-mul-by-1-digit', 1, 'fill-blank', `${a} × ${b} = ...`, String(a * b));
};

export const g3_div_by_1_digit: QuestionGenerator = (rng) => {
  const b = randInt(rng, 2, 9);
  const q = randInt(rng, 12, 99);
  return make('g3-div-by-1-digit', 1, 'fill-blank', `${b * q} ÷ ${b} = ...`, String(q));
};

export const g3_perimeter: QuestionGenerator = (rng) => {
  const isSquare = rng() < 0.5;
  if (isSquare) {
    const s = randInt(rng, 3, 25);
    return make('g3-perimeter', 1, 'fill-blank', `Chu vi hình vuông cạnh ${s} cm là ... cm`, String(s * 4), undefined, 'cm');
  }
  const w = randInt(rng, 3, 20);
  const h = randInt(rng, 3, 20);
  return make(
    'g3-perimeter',
    1,
    'fill-blank',
    `Chu vi HCN có chiều dài ${w} m, chiều rộng ${h} m là ... m`,
    String((w + h) * 2),
    undefined,
    'm'
  );
};

export const g3_count_100000: QuestionGenerator = (rng) => {
  const n = randInt(rng, 1000, 99999);
  const cases: (() => Question)[] = [
    () => make('g3-count-100000', 2, 'fill-blank', `Số liền sau ${n} là ...`, String(n + 1)),
    () => {
      const a = randInt(rng, 1000, 99999);
      const b = randInt(rng, 1000, 99999);
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return make('g3-count-100000', 2, 'multiple-choice', `So sánh: ${a} ... ${b}`, ans, ['>', '<', '=']);
    },
  ];
  return pick(rng, cases)();
};

export const g3_fraction_intro: QuestionGenerator = (rng) => {
  const denom = pick(rng, [2, 3, 4, 5, 6, 8]);
  const total = denom * randInt(rng, 1, 4);
  const part = total / denom;
  return make(
    'g3-fraction-intro',
    2,
    'fill-blank',
    `1/${denom} của ${total} là ...`,
    String(part)
  );
};

export const g3_area_rect: QuestionGenerator = (rng) => {
  const isSquare = rng() < 0.4;
  if (isSquare) {
    const s = randInt(rng, 2, 12);
    return make('g3-area-rect', 2, 'fill-blank', `Diện tích hình vuông cạnh ${s} cm là ... cm²`, String(s * s), undefined, 'cm²');
  }
  const w = randInt(rng, 3, 20);
  const h = randInt(rng, 3, 15);
  return make('g3-area-rect', 2, 'fill-blank', `Diện tích HCN dài ${w} m, rộng ${h} m là ... m²`, String(w * h), undefined, 'm²');
};

export const g3_expression_paren: QuestionGenerator = (rng) => {
  const a = randInt(rng, 5, 30);
  const b = randInt(rng, 2, 15);
  const c = randInt(rng, 2, 9);
  const cases: (() => Question)[] = [
    () => make('g3-expression-paren', 2, 'fill-blank', `${a} + ${b} × ${c} = ...`, String(a + b * c)),
    () => make('g3-expression-paren', 2, 'fill-blank', `(${a} + ${b}) × ${c} = ...`, String((a + b) * c)),
    () => make('g3-expression-paren', 2, 'fill-blank', `${a + b * c} − ${b} × ${c} = ...`, String(a)),
  ];
  return pick(rng, cases)();
};

export const g3_three_num_ops: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const a = randInt(rng, 2, 9);
      const b = randInt(rng, 2, 9);
      const c = randInt(rng, 50, 500);
      return make('g3-three-num-ops', 1, 'fill-blank', `${a} × ${b} + ${c} = ...`, String(a * b + c));
    },
    () => {
      const a = randInt(rng, 2, 9);
      const b = randInt(rng, 2, 9);
      const c = randInt(rng, 5, 50);
      return make('g3-three-num-ops', 1, 'fill-blank', `${a * b} ÷ ${b} + ${c} = ...`, String(a + c));
    },
    () => {
      const a = randInt(rng, 30, 99);
      const b = randInt(rng, 10, a - 5);
      const c = randInt(rng, 100, 800);
      return make('g3-three-num-ops', 1, 'fill-blank', `${a} − ${b} + ${c} = ...`, String(a - b + c));
    },
    () => {
      const a = randInt(rng, 50, 500);
      const b = randInt(rng, 20, 200);
      const c = randInt(rng, 20, 200);
      return make('g3-three-num-ops', 1, 'fill-blank', `${a} + ${b} − ${c} = ...`, String(a + b - c));
    },
    () => {
      const a = randInt(rng, 2, 9);
      const b = randInt(rng, 2, 9);
      const c = randInt(rng, 10, a * b - 5);
      return make('g3-three-num-ops', 1, 'fill-blank', `${a} × ${b} − ${c} = ...`, String(a * b - c));
    },
    () => {
      const a = randInt(rng, 5, 30);
      const b = randInt(rng, 2, 5);
      const c = randInt(rng, 50, 300);
      return make('g3-three-num-ops', 1, 'fill-blank', `${a} × ${b} + ${c} = ...`, String(a * b + c));
    },
  ];
  return pick(rng, cases)();
};

export const G3_GENERATORS: Record<string, QuestionGenerator> = {
  'g3-mul-table-6-9': g3_mul_table_6_9,
  'g3-div-table-6-9': g3_div_table_6_9,
  'g3-mul-by-1-digit': g3_mul_by_1_digit,
  'g3-div-by-1-digit': g3_div_by_1_digit,
  'g3-perimeter': g3_perimeter,
  'g3-count-100000': g3_count_100000,
  'g3-fraction-intro': g3_fraction_intro,
  'g3-area-rect': g3_area_rect,
  'g3-expression-paren': g3_expression_paren,
  'g3-three-num-ops': g3_three_num_ops,
};
