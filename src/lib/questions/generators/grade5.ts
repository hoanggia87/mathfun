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
  grade: 5,
  semester,
  topic,
  type,
  prompt,
  answer,
  choices,
  unit,
});

export const g5_mixed_number: QuestionGenerator = (rng) => {
  const whole = randInt(rng, 1, 5);
  const denom = pick(rng, [2, 3, 4, 5]);
  const num = randInt(rng, 1, denom - 1);
  return make(
    'g5-mixed-number',
    1,
    'fill-blank',
    `Hỗn số ${whole} ${num}/${denom} = .../${denom} (phân số tử trên mẫu, điền tử)`,
    String(whole * denom + num)
  );
};

export const g5_decimal: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const a = randInt(rng, 1, 99) / 10;
      const b = randInt(rng, 1, 99) / 10;
      const ans = a > b ? '>' : a < b ? '<' : '=';
      return make('g5-decimal', 1, 'multiple-choice', `So sánh: ${a} ... ${b}`, ans, ['>', '<', '=']);
    },
    () => {
      const n = randInt(rng, 10, 999) / 100;
      return make('g5-decimal', 1, 'fill-blank', `${n} = ... phần trăm`, String(Math.round(n * 100)));
    },
  ];
  return pick(rng, cases)();
};

export const g5_decimal_ops: QuestionGenerator = (rng) => {
  const op = pick(rng, ['+', '−', '×']);
  const a = randInt(rng, 10, 99) / 10;
  const b = randInt(rng, 10, 99) / 10;
  if (op === '+') {
    const ans = (Math.round(a * 10) + Math.round(b * 10)) / 10;
    return make('g5-decimal-ops', 1, 'fill-blank', `${a} + ${b} = ...`, String(ans));
  }
  if (op === '−') {
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    const ans = (Math.round(big * 10) - Math.round(small * 10)) / 10;
    return make('g5-decimal-ops', 1, 'fill-blank', `${big} − ${small} = ...`, String(ans));
  }
  const ans = Math.round(a * b * 100) / 100;
  return make('g5-decimal-ops', 1, 'fill-blank', `${a} × ${b} = ...`, String(ans));
};

export const g5_percentage: QuestionGenerator = (rng) => {
  const total = pick(rng, [50, 80, 100, 200, 250, 400, 500]);
  const pct = pick(rng, [10, 20, 25, 30, 40, 50, 60, 75, 80]);
  const ans = (total * pct) / 100;
  return make('g5-percentage', 2, 'fill-blank', `${pct}% của ${total} là ...`, String(ans));
};

export const g5_velocity: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const v = randInt(rng, 30, 80);
      const t = randInt(rng, 2, 6);
      return make('g5-velocity', 2, 'fill-blank', `Ô tô đi với vận tốc ${v} km/giờ trong ${t} giờ. Quãng đường đi được là ... km`, String(v * t), undefined, 'km');
    },
    () => {
      const v = randInt(rng, 30, 60);
      const s = v * randInt(rng, 2, 5);
      return make('g5-velocity', 2, 'fill-blank', `Xe đi quãng đường ${s} km với vận tốc ${v} km/giờ. Thời gian đi là ... giờ`, String(s / v), undefined, 'giờ');
    },
    () => {
      const t = randInt(rng, 2, 5);
      const v = randInt(rng, 30, 70);
      const s = v * t;
      return make('g5-velocity', 2, 'fill-blank', `Đi quãng đường ${s} km trong ${t} giờ. Vận tốc là ... km/giờ`, String(v), undefined, 'km/giờ');
    },
  ];
  return pick(rng, cases)();
};

export const g5_area_triangle: QuestionGenerator = (rng) => {
  const a = randInt(rng, 4, 20);
  const h = randInt(rng, 4, 16);
  const ans = (a * h) / 2;
  return make('g5-area-triangle', 2, 'fill-blank', `Diện tích tam giác đáy ${a} cm, chiều cao ${h} cm là ... cm²`, String(ans), undefined, 'cm²');
};

export const g5_area_trapezoid: QuestionGenerator = (rng) => {
  const a = randInt(rng, 4, 20);
  const b = randInt(rng, 4, 20);
  const h = randInt(rng, 4, 16);
  const ans = ((a + b) * h) / 2;
  return make(
    'g5-area-trapezoid',
    2,
    'fill-blank',
    `Diện tích hình thang có 2 đáy ${a} cm, ${b} cm và chiều cao ${h} cm là ... cm²`,
    String(ans),
    undefined,
    'cm²'
  );
};

export const g5_area_circle: QuestionGenerator = (rng) => {
  const r = randInt(rng, 2, 10);
  const isCircum = rng() < 0.5;
  if (isCircum) {
    const ans = Math.round(2 * r * 3.14 * 100) / 100;
    return make('g5-area-circle', 2, 'fill-blank', `Chu vi hình tròn bán kính ${r} cm là ... cm (lấy π = 3,14)`, String(ans), undefined, 'cm');
  }
  const ans = Math.round(r * r * 3.14 * 100) / 100;
  return make('g5-area-circle', 2, 'fill-blank', `Diện tích hình tròn bán kính ${r} cm là ... cm² (lấy π = 3,14)`, String(ans), undefined, 'cm²');
};

export const g5_volume_box: QuestionGenerator = (rng) => {
  const isCube = rng() < 0.4;
  if (isCube) {
    const a = randInt(rng, 2, 10);
    return make('g5-volume-box', 2, 'fill-blank', `Thể tích hình lập phương cạnh ${a} cm là ... cm³`, String(a * a * a), undefined, 'cm³');
  }
  const a = randInt(rng, 3, 12);
  const b = randInt(rng, 3, 10);
  const c = randInt(rng, 2, 8);
  return make('g5-volume-box', 2, 'fill-blank', `Thể tích hình hộp chữ nhật ${a} × ${b} × ${c} (cm) là ... cm³`, String(a * b * c), undefined, 'cm³');
};

export const G5_GENERATORS: Record<string, QuestionGenerator> = {
  'g5-mixed-number': g5_mixed_number,
  'g5-decimal': g5_decimal,
  'g5-decimal-ops': g5_decimal_ops,
  'g5-percentage': g5_percentage,
  'g5-velocity': g5_velocity,
  'g5-area-triangle': g5_area_triangle,
  'g5-area-trapezoid': g5_area_trapezoid,
  'g5-area-circle': g5_area_circle,
  'g5-volume-box': g5_volume_box,
};
