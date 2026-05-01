import type { Question } from '../../types';

type WordProblemTemplate = {
  topic: string;
  semester: 1 | 2;
  prompt: string;
  answer: string;
  unit?: string;
};

export const G4_WORD_PROBLEMS: WordProblemTemplate[] = [
  // HK1
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Một nhà máy năm thứ nhất sản xuất 125 600 sản phẩm, năm thứ hai sản xuất nhiều hơn 18 450 sản phẩm. Hỏi cả hai năm sản xuất bao nhiêu sản phẩm?',
    answer: '269650',
    unit: 'sản phẩm',
  },
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Trung bình một con gà mái đẻ 180 quả trứng một năm. Hỏi 25 con gà mái đẻ được bao nhiêu quả trứng một năm?',
    answer: '4500',
    unit: 'quả',
  },
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Một mảnh đất hình chữ nhật có chiều dài 124 m, chiều rộng 78 m. Tính chu vi mảnh đất.',
    answer: '404',
    unit: 'm',
  },
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Có 9 ô tô chở hàng, mỗi ô tô chở 2 450 kg gạo. Hỏi tất cả các ô tô chở bao nhiêu ki-lô-gam gạo?',
    answer: '22050',
    unit: 'kg',
  },
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Một cửa hàng có 1 250 kg đường, đã bán 3/5 số đường đó. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam đường?',
    answer: '500',
    unit: 'kg',
  },
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Hai thửa ruộng thu hoạch được tổng cộng 5 tấn 4 tạ thóc. Thửa thứ nhất thu hoạch nhiều hơn thửa thứ hai 6 tạ. Hỏi mỗi thửa ruộng thu hoạch bao nhiêu tạ thóc?',
    answer: '30',
    unit: 'tạ',
  },
  {
    topic: 'g4-word-large',
    semester: 1,
    prompt: 'Một mảnh vườn hình bình hành có đáy 24 m, chiều cao 15 m. Tính diện tích mảnh vườn.',
    answer: '360',
    unit: 'm²',
  },

  // HK2 - phân số
  {
    topic: 'g4-word-fraction',
    semester: 2,
    prompt: 'Một sợi dây dài 5/6 m, người ta cắt đi 1/3 m. Hỏi sợi dây còn lại dài bao nhiêu mét? (điền tử số khi mẫu số là 6)',
    answer: '3',
    unit: 'm (mẫu 6)',
  },
  {
    topic: 'g4-word-fraction',
    semester: 2,
    prompt: 'Lớp 4A có 36 học sinh, trong đó 1/4 số học sinh là học sinh giỏi. Hỏi lớp 4A có bao nhiêu học sinh giỏi?',
    answer: '9',
    unit: 'học sinh',
  },
  {
    topic: 'g4-word-fraction',
    semester: 2,
    prompt: 'Mẹ có 24 quả táo, mẹ cho bé 2/3 số táo. Hỏi mẹ cho bé bao nhiêu quả táo?',
    answer: '16',
    unit: 'quả',
  },
  {
    topic: 'g4-word-fraction',
    semester: 2,
    prompt: 'Trung bình cộng của hai số là 45. Tổng của hai số là bao nhiêu?',
    answer: '90',
    unit: '',
  },
  {
    topic: 'g4-word-fraction',
    semester: 2,
    prompt: 'Trung bình cộng của ba số 36, 42 và 51 là bao nhiêu?',
    answer: '43',
    unit: '',
  },
  {
    topic: 'g4-word-fraction',
    semester: 2,
    prompt: 'Một thửa đất hình thoi có hai đường chéo dài 18 m và 24 m. Tính diện tích thửa đất.',
    answer: '216',
    unit: 'm²',
  },
];

export function getG4WordProblems(topic: string, semester: 1 | 2 | 'all'): Question[] {
  return G4_WORD_PROBLEMS.filter((w) => w.topic === topic && (semester === 'all' || w.semester === semester)).map((w, i) => ({
    id: `g4-wp-${topic}-${i}`,
    grade: 4,
    semester: w.semester,
    topic: w.topic,
    type: 'word-problem' as const,
    prompt: w.prompt,
    answer: w.answer,
    unit: w.unit,
  }));
}
