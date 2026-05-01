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
  grade: 4,
  semester,
  topic,
  type,
  prompt,
  answer,
  choices,
  unit,
});

export const g4_large_numbers: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const n = randInt(rng, 100000, 9999999);
      return make('g4-large-numbers', 1, 'fill-blank', `Số liền sau ${n} là ...`, String(n + 1));
    },
    () => {
      const a = randInt(rng, 100000, 9999999);
      const b = randInt(rng, 100000, 9999999);
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return make('g4-large-numbers', 1, 'multiple-choice', `So sánh: ${a} ... ${b}`, ans, ['>', '<', '=']);
    },
  ];
  return pick(rng, cases)();
};

export const g4_add_sub_large: QuestionGenerator = (rng) => {
  const isAdd = rng() < 0.5;
  if (isAdd) {
    const a = randInt(rng, 10000, 80000);
    const b = randInt(rng, 1000, 99999 - a);
    return make('g4-add-sub-large', 1, 'fill-blank', `${a} + ${b} = ...`, String(a + b));
  } else {
    const a = randInt(rng, 20000, 99999);
    const b = randInt(rng, 1000, a - 1);
    return make('g4-add-sub-large', 1, 'fill-blank', `${a} − ${b} = ...`, String(a - b));
  }
};

export const g4_mul_multi_digit: QuestionGenerator = (rng) => {
  const a = randInt(rng, 100, 999);
  const b = randInt(rng, 11, 99);
  return make('g4-mul-multi-digit', 1, 'fill-blank', `${a} × ${b} = ...`, String(a * b));
};

export const g4_div_multi_digit: QuestionGenerator = (rng) => {
  const b = randInt(rng, 12, 49);
  const q = randInt(rng, 12, 99);
  return make('g4-div-multi-digit', 1, 'fill-blank', `${b * q} ÷ ${b} = ...`, String(q));
};

export const g4_weight_units: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const t = randInt(rng, 1, 9);
      return make('g4-weight-units', 1, 'fill-blank', `${t} tấn = ... kg`, String(t * 1000), undefined, 'kg');
    },
    () => {
      const t = randInt(rng, 1, 9);
      return make('g4-weight-units', 1, 'fill-blank', `${t} tạ = ... kg`, String(t * 100), undefined, 'kg');
    },
    () => {
      const y = randInt(rng, 1, 9);
      return make('g4-weight-units', 1, 'fill-blank', `${y} yến = ... kg`, String(y * 10), undefined, 'kg');
    },
    () => {
      const t = randInt(rng, 1, 9);
      return make('g4-weight-units', 1, 'fill-blank', `${t} tạ = ... yến`, String(t * 10), undefined, 'yến');
    },
  ];
  return pick(rng, cases)();
};

export const g4_area_units: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const m = randInt(rng, 1, 9);
      return make('g4-area-units', 1, 'fill-blank', `${m} m² = ... dm²`, String(m * 100), undefined, 'dm²');
    },
    () => {
      const dm = randInt(rng, 1, 9);
      return make('g4-area-units', 1, 'fill-blank', `${dm} dm² = ... cm²`, String(dm * 100), undefined, 'cm²');
    },
  ];
  return pick(rng, cases)();
};

export const g4_angles: QuestionGenerator = (rng) => {
  const types = [
    { name: 'Góc vuông', deg: '90' },
    { name: 'Góc nhọn', deg: '< 90' },
    { name: 'Góc tù', deg: '> 90 và < 180' },
    { name: 'Góc bẹt', deg: '180' },
  ];
  const t = pick(rng, types);
  const opts = shuffle(rng, types.map((x) => x.deg));
  return make('g4-angles', 1, 'multiple-choice', `${t.name} có số đo bằng bao nhiêu độ?`, t.deg, opts);
};

export const g4_parallelogram: QuestionGenerator = (rng) => {
  const a = randInt(rng, 4, 20);
  const h = randInt(rng, 3, 15);
  const cases: (() => Question)[] = [
    () => make('g4-parallelogram', 1, 'fill-blank', `Diện tích hình bình hành đáy ${a} cm, chiều cao ${h} cm là ... cm²`, String(a * h), undefined, 'cm²'),
    () => {
      const d1 = randInt(rng, 4, 20);
      const d2 = randInt(rng, 4, 20);
      return make('g4-parallelogram', 1, 'fill-blank', `Diện tích hình thoi có hai đường chéo ${d1} cm và ${d2} cm là ... cm²`, String((d1 * d2) / 2), undefined, 'cm²');
    },
  ];
  return pick(rng, cases)();
};

export const g4_fraction_reduce: QuestionGenerator = (rng) => {
  const k = randInt(rng, 2, 6);
  const a = randInt(rng, 1, 8);
  const b = randInt(rng, a + 1, 10);
  return make(
    'g4-fraction-reduce',
    2,
    'fill-blank',
    `Rút gọn phân số ${a * k}/${b * k}: tử số = ${a}, mẫu số = ...`,
    String(b)
  );
};

export const g4_fraction_compare: QuestionGenerator = (rng) => {
  const d = pick(rng, [2, 3, 4, 5, 6, 8, 10]);
  const a = randInt(rng, 1, d - 1);
  let b = randInt(rng, 1, d - 1);
  if (b === a) b = (b % (d - 1)) + 1;
  const ans = a > b ? '>' : '<';
  return make('g4-fraction-compare', 2, 'multiple-choice', `So sánh: ${a}/${d} ... ${b}/${d}`, ans, ['>', '<', '=']);
};

export const g4_fraction_ops: QuestionGenerator = (rng) => {
  const d = pick(rng, [3, 4, 5, 6, 8]);
  const a = randInt(rng, 1, d - 1);
  const b = randInt(rng, 1, d - a);
  return make(
    'g4-fraction-ops',
    2,
    'fill-blank',
    `${a}/${d} + ${b}/${d} = .../${d} (điền tử số)`,
    String(a + b)
  );
};

export const g4_average: QuestionGenerator = (rng) => {
  const n = randInt(rng, 2, 5);
  const nums: number[] = [];
  for (let i = 0; i < n; i++) nums.push(randInt(rng, 5, 50));
  const sum = nums.reduce((s, x) => s + x, 0);
  if (sum % n !== 0) {
    nums[0] += n - (sum % n);
  }
  const total = nums.reduce((s, x) => s + x, 0);
  return make(
    'g4-average',
    2,
    'fill-blank',
    `Trung bình cộng của ${nums.join(', ')} là ...`,
    String(total / n)
  );
};

export const g4_area_km2: QuestionGenerator = (rng) => {
  const km = randInt(rng, 1, 9);
  return make('g4-area-km2', 2, 'fill-blank', `${km} km² = ... m²`, String(km * 1000000), undefined, 'm²');
};

export const g4_time_second_century: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => make('g4-time-second-century', 2, 'multiple-choice', '1 phút có bao nhiêu giây?', '60', ['30', '60', '100', '120']),
    () => make('g4-time-second-century', 2, 'multiple-choice', '1 thế kỷ có bao nhiêu năm?', '100', ['10', '50', '100', '1000']),
    () => {
      const n = randInt(rng, 2, 9);
      return make('g4-time-second-century', 2, 'fill-blank', `${n} phút = ... giây`, String(n * 60), undefined, 'giây');
    },
  ];
  return pick(rng, cases)();
};

export const g4_three_num_ops: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const a = randInt(rng, 12, 99);
      const b = randInt(rng, 2, 9);
      const c = randInt(rng, 100, 5000);
      return make('g4-three-num-ops', 1, 'fill-blank', `${a} × ${b} + ${c} = ...`, String(a * b + c));
    },
    () => {
      const a = randInt(rng, 100, 999);
      const b = randInt(rng, 11, 50);
      const c = randInt(rng, 100, 1000);
      return make('g4-three-num-ops', 1, 'fill-blank', `${a} + ${b * 10} − ${c} = ...`, String(a + b * 10 - c));
    },
    () => {
      const a = randInt(rng, 1000, 5000);
      const b = randInt(rng, 100, 999);
      const c = randInt(rng, 100, 999);
      return make('g4-three-num-ops', 1, 'fill-blank', `${a} − ${b} + ${c} = ...`, String(a - b + c));
    },
    () => {
      const b = randInt(rng, 12, 49);
      const q = randInt(rng, 5, 20);
      const c = randInt(rng, 100, 999);
      return make('g4-three-num-ops', 1, 'fill-blank', `${b * q} ÷ ${b} + ${c} = ...`, String(q + c));
    },
    () => {
      const a = randInt(rng, 12, 50);
      const b = randInt(rng, 2, 9);
      const c = randInt(rng, 50, a * b - 5);
      return make('g4-three-num-ops', 1, 'fill-blank', `${a} × ${b} − ${c} = ...`, String(a * b - c));
    },
    () => {
      const a = randInt(rng, 500, 5000);
      const b = randInt(rng, 100, 1000);
      const c = randInt(rng, 100, 1000);
      return make('g4-three-num-ops', 1, 'fill-blank', `${a} + ${b} + ${c} = ...`, String(a + b + c));
    },
  ];
  return pick(rng, cases)();
};

export const G4_GENERATORS: Record<string, QuestionGenerator> = {
  'g4-three-num-ops': g4_three_num_ops,
  'g4-large-numbers': g4_large_numbers,
  'g4-add-sub-large': g4_add_sub_large,
  'g4-mul-multi-digit': g4_mul_multi_digit,
  'g4-div-multi-digit': g4_div_multi_digit,
  'g4-weight-units': g4_weight_units,
  'g4-area-units': g4_area_units,
  'g4-angles': g4_angles,
  'g4-parallelogram': g4_parallelogram,
  'g4-fraction-reduce': g4_fraction_reduce,
  'g4-fraction-compare': g4_fraction_compare,
  'g4-fraction-ops': g4_fraction_ops,
  'g4-average': g4_average,
  'g4-area-km2': g4_area_km2,
  'g4-time-second-century': g4_time_second_century,
};
