import type { Question, QuestionGenerator } from '../types';
import { pick, randInt, shuffle } from '../rng';
import { v4 as uuid } from 'uuid';

const make = (
  topic: string,
  type: Question['type'],
  prompt: string,
  answer: string,
  extra?: { choices?: string[]; unit?: string; semester?: 1 | 2 }
): Question => ({
  id: uuid(),
  grade: 2,
  semester: extra?.semester ?? 1,
  topic,
  type,
  prompt,
  answer,
  choices: extra?.choices,
  unit: extra?.unit,
});

export const g2_count_1000: QuestionGenerator = (rng) => {
  const mode = randInt(rng, 0, 2);
  if (mode === 0) {
    const n = randInt(rng, 100, 999);
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;
    return make(
      'g2-count-1000',
      'fill-blank',
      `Số ${n} gồm ${h} trăm, ${t} chục và ... đơn vị`,
      String(u),
      { semester: 1 }
    );
  } else if (mode === 1) {
    const a = randInt(rng, 100, 999);
    const b = randInt(rng, 100, 999);
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return make('g2-count-1000', 'multiple-choice', `So sánh: ${a} ... ${b}`, ans, {
      choices: ['>', '<', '='],
      semester: 1,
    });
  } else {
    const n = randInt(rng, 100, 999);
    return make('g2-count-1000', 'fill-blank', `Số liền sau của ${n} là ...`, String(n + 1), { semester: 1 });
  }
};

export const g2_add_sub_100_carry: QuestionGenerator = (rng) => {
  const isAdd = rng() < 0.5;
  if (isAdd) {
    const a = randInt(rng, 15, 89);
    const b = randInt(rng, 15, 99 - a);
    return make('g2-add-sub-100-carry', 'fill-blank', `${a} + ${b} = ...`, String(a + b), { semester: 1 });
  } else {
    const a = randInt(rng, 30, 99);
    const b = randInt(rng, 11, a - 1);
    return make('g2-add-sub-100-carry', 'fill-blank', `${a} − ${b} = ...`, String(a - b), { semester: 1 });
  }
};

export const g2_add_sub_1000: QuestionGenerator = (rng) => {
  const isAdd = rng() < 0.5;
  if (isAdd) {
    const a = randInt(rng, 100, 800);
    const b = randInt(rng, 100, 999 - a);
    return make('g2-add-sub-1000', 'fill-blank', `${a} + ${b} = ...`, String(a + b), { semester: 1 });
  } else {
    const a = randInt(rng, 200, 999);
    const b = randInt(rng, 100, a - 1);
    return make('g2-add-sub-1000', 'fill-blank', `${a} − ${b} = ...`, String(a - b), { semester: 1 });
  }
};

export const g2_length_units: QuestionGenerator = (rng) => {
  const cases = [
    () => {
      const cm = randInt(rng, 1, 9);
      return make('g2-length-units', 'fill-blank', `${cm} dm = ... cm`, String(cm * 10), { unit: 'cm', semester: 1 });
    },
    () => {
      const m = randInt(rng, 1, 9);
      return make('g2-length-units', 'fill-blank', `${m} m = ... cm`, String(m * 100), { unit: 'cm', semester: 1 });
    },
    () => {
      const dm = randInt(rng, 1, 9);
      return make('g2-length-units', 'fill-blank', `${dm * 10} cm = ... dm`, String(dm), { unit: 'dm', semester: 1 });
    },
    () => {
      const m = randInt(rng, 1, 9);
      return make('g2-length-units', 'fill-blank', `${m * 100} cm = ... m`, String(m), { unit: 'm', semester: 1 });
    },
    () => {
      const km = randInt(rng, 1, 9);
      return make('g2-length-units', 'fill-blank', `${km} km = ... m`, String(km * 1000), { unit: 'm', semester: 1 });
    },
    () => {
      const km = randInt(rng, 2, 9);
      return make('g2-length-units', 'fill-blank', `${km * 1000} m = ... km`, String(km), { unit: 'km', semester: 1 });
    },
  ];
  return pick(rng, cases)();
};

export const g2_weight_kg: QuestionGenerator = (rng) => {
  const a = randInt(rng, 5, 30);
  const b = randInt(rng, 2, a - 1);
  const isAdd = rng() < 0.5;
  if (isAdd) {
    return make('g2-weight-kg', 'fill-blank', `${a} kg + ${b} kg = ... kg`, String(a + b), {
      unit: 'kg',
      semester: 1,
    });
  }
  return make('g2-weight-kg', 'fill-blank', `${a} kg − ${b} kg = ... kg`, String(a - b), {
    unit: 'kg',
    semester: 1,
  });
};

export const g2_volume_liter: QuestionGenerator = (rng) => {
  const a = randInt(rng, 3, 20);
  const b = randInt(rng, 2, a - 1);
  const isAdd = rng() < 0.5;
  if (isAdd) {
    return make('g2-volume-liter', 'fill-blank', `${a} ℓ + ${b} ℓ = ... ℓ`, String(a + b), {
      unit: 'ℓ',
      semester: 1,
    });
  }
  return make('g2-volume-liter', 'fill-blank', `${a} ℓ − ${b} ℓ = ... ℓ`, String(a - b), {
    unit: 'ℓ',
    semester: 1,
  });
};

export const g2_vn_money: QuestionGenerator = (rng) => {
  const denominations = [1000, 2000, 5000, 10000];
  const a = pick(rng, denominations);
  const b = pick(rng, denominations);
  return make('g2-vn-money', 'fill-blank', `${a.toLocaleString('vi-VN')} đ + ${b.toLocaleString('vi-VN')} đ = ... đồng`, String(a + b), {
    unit: 'đ',
    semester: 1,
  });
};

export const g2_mul_table_2_5: QuestionGenerator = (rng) => {
  const base = pick(rng, [2, 5]);
  const factor = randInt(rng, 1, 10);
  return make('g2-mul-table-2-5', 'fill-blank', `${base} × ${factor} = ...`, String(base * factor), {
    semester: 2,
  });
};

export const g2_div_table_2_5: QuestionGenerator = (rng) => {
  const base = pick(rng, [2, 5]);
  const factor = randInt(rng, 1, 10);
  return make('g2-div-table-2-5', 'fill-blank', `${base * factor} ÷ ${base} = ...`, String(factor), {
    semester: 2,
  });
};

export const g2_time_hour_minute: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const h = randInt(rng, 1, 11);
      return make('g2-time-hour-minute', 'fill-blank', `Đồng hồ chỉ ${h} giờ. Sau 30 phút là ${h} giờ ... phút`, '30', { semester: 2 });
    },
    () => {
      const h = randInt(rng, 1, 11);
      return make('g2-time-hour-minute', 'fill-blank', `${h} giờ + 2 giờ = ... giờ`, String(h + 2), { semester: 2 });
    },
    () => {
      const m = pick(rng, [15, 30, 45]);
      return make('g2-time-hour-minute', 'fill-blank', `1 giờ ${m} phút = ... phút`, String(60 + m), { semester: 2 });
    },
    () => make('g2-time-hour-minute', 'multiple-choice', `1 giờ có bao nhiêu phút?`, '60', { choices: shuffle(rng, ['30', '45', '60', '90']), semester: 2 }),
    () => make('g2-time-hour-minute', 'multiple-choice', `Nửa giờ bằng bao nhiêu phút?`, '30', { choices: shuffle(rng, ['15', '20', '30', '60']), semester: 2 }),
  ];
  return pick(rng, cases)();
};

export const g2_calendar: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => make('g2-calendar', 'multiple-choice', '1 tuần có mấy ngày?', '7', { choices: ['5', '6', '7', '10'], semester: 2 }),
    () => make('g2-calendar', 'multiple-choice', '1 năm có mấy tháng?', '12', { choices: ['10', '11', '12', '24'], semester: 2 }),
    () => {
      const m = randInt(rng, 1, 12);
      const days31 = [1, 3, 5, 7, 8, 10, 12];
      const days30 = [4, 6, 9, 11];
      let ans: string;
      if (m === 2) ans = '28';
      else if (days31.includes(m)) ans = '31';
      else ans = '30';
      const opts = shuffle(rng, ['28', '30', '31']);
      return make('g2-calendar', 'multiple-choice', `Tháng ${m} có bao nhiêu ngày? (năm thường)`, ans, {
        choices: opts,
        semester: 2,
      });
    },
  ];
  return pick(rng, cases)();
};

export const g2_three_num_ops: QuestionGenerator = (rng) => {
  const cases: (() => Question)[] = [
    () => {
      const base = pick(rng, [2, 5]);
      const f = randInt(rng, 2, 9);
      const c = randInt(rng, 5, 80);
      return make('g2-three-num-ops', 'fill-blank', `${base} × ${f} + ${c} = ...`, String(base * f + c), { semester: 2 });
    },
    () => {
      const base = pick(rng, [2, 5]);
      const f = randInt(rng, 3, 10);
      const c = randInt(rng, 5, base * f - 5);
      return make('g2-three-num-ops', 'fill-blank', `${base} × ${f} − ${c} = ...`, String(base * f - c), { semester: 2 });
    },
    () => {
      const a = randInt(rng, 30, 90);
      const b = randInt(rng, 5, a - 5);
      const c = randInt(rng, 5, 30);
      return make('g2-three-num-ops', 'fill-blank', `${a} − ${b} + ${c} = ...`, String(a - b + c), { semester: 2 });
    },
    () => {
      const a = randInt(rng, 5, 40);
      const b = randInt(rng, 5, 40);
      const c = randInt(rng, 5, 30);
      return make('g2-three-num-ops', 'fill-blank', `${a} + ${b} − ${c} = ...`, String(a + b - c), { semester: 2 });
    },
    () => {
      const a = randInt(rng, 10, 50);
      const b = randInt(rng, 5, 30);
      const c = randInt(rng, 5, 30);
      return make('g2-three-num-ops', 'fill-blank', `${a} + ${b} + ${c} = ...`, String(a + b + c), { semester: 2 });
    },
  ];
  return pick(rng, cases)();
};

export const G2_GENERATORS: Record<string, QuestionGenerator> = {
  'g2-count-1000': g2_count_1000,
  'g2-add-sub-100-carry': g2_add_sub_100_carry,
  'g2-add-sub-1000': g2_add_sub_1000,
  'g2-length-units': g2_length_units,
  'g2-weight-kg': g2_weight_kg,
  'g2-volume-liter': g2_volume_liter,
  'g2-vn-money': g2_vn_money,
  'g2-mul-table-2-5': g2_mul_table_2_5,
  'g2-div-table-2-5': g2_div_table_2_5,
  'g2-time-hour-minute': g2_time_hour_minute,
  'g2-calendar': g2_calendar,
  'g2-three-num-ops': g2_three_num_ops,
};
