import type { Question } from '../../types';

type WordProblemTemplate = {
  topic: string;
  semester: 1 | 2;
  prompt: string;
  answer: string;
  unit?: string;
};

export const G2_WORD_PROBLEMS: WordProblemTemplate[] = [
  // HK1 - cộng trừ
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Cửa hàng buổi sáng bán được 23 kg gạo. Buổi chiều bán hơn buổi sáng 10 kg. Hỏi cả ngày bán được bao nhiêu kg gạo?',
    answer: '56',
    unit: 'kg',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Lớp 2A có 32 học sinh, lớp 2B có 28 học sinh. Hỏi cả hai lớp có tất cả bao nhiêu học sinh?',
    answer: '60',
    unit: 'học sinh',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Mẹ có 85 quả cam, mẹ cho bé 17 quả. Hỏi mẹ còn lại bao nhiêu quả cam?',
    answer: '68',
    unit: 'quả',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Bé Bin có 25 viên bi, anh trai có nhiều hơn bé Bin 18 viên. Hỏi anh trai có bao nhiêu viên bi?',
    answer: '43',
    unit: 'viên',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Thùng thứ nhất có 145 ℓ nước, thùng thứ hai ít hơn thùng thứ nhất 38 ℓ. Hỏi thùng thứ hai có bao nhiêu lít nước?',
    answer: '107',
    unit: 'ℓ',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Một mảnh vải dài 87 cm, người ta cắt đi 39 cm. Hỏi mảnh vải còn lại dài bao nhiêu xăng-ti-mét?',
    answer: '48',
    unit: 'cm',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Sáng bán 156 quả trứng, chiều bán thêm 234 quả. Hỏi cả ngày bán được bao nhiêu quả trứng?',
    answer: '390',
    unit: 'quả',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Cô An có 500 nghìn đồng, cô mua quà hết 175 nghìn đồng. Hỏi cô An còn lại bao nhiêu nghìn đồng?',
    answer: '325',
    unit: 'nghìn đồng',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Đoạn dây thứ nhất dài 4 dm 5 cm, đoạn dây thứ hai dài 3 dm 8 cm. Hỏi cả hai đoạn dây dài bao nhiêu xăng-ti-mét?',
    answer: '83',
    unit: 'cm',
  },
  {
    topic: 'g2-word-add-sub',
    semester: 1,
    prompt: 'Bao gạo nặng 50 kg, bao đường nhẹ hơn bao gạo 18 kg. Hỏi bao đường nặng bao nhiêu ki-lô-gam?',
    answer: '32',
    unit: 'kg',
  },

  // HK2 - nhân chia
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Mỗi bàn có 5 chiếc ghế. Hỏi 7 bàn có tất cả bao nhiêu chiếc ghế?',
    answer: '35',
    unit: 'chiếc',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Một con gà có 2 chân. Hỏi 9 con gà có bao nhiêu chân?',
    answer: '18',
    unit: 'chân',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Có 20 quả cam chia đều cho 5 bạn. Hỏi mỗi bạn được bao nhiêu quả cam?',
    answer: '4',
    unit: 'quả',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Mẹ mua 16 cái bánh, chia đều vào 2 đĩa. Hỏi mỗi đĩa có bao nhiêu cái bánh?',
    answer: '8',
    unit: 'cái',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Một xe ô tô có 4 bánh. Hỏi 5 xe ô tô có tất cả bao nhiêu bánh?',
    answer: '20',
    unit: 'bánh',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Có 30 cái kẹo chia đều cho 5 bạn. Hỏi mỗi bạn được mấy cái kẹo?',
    answer: '6',
    unit: 'cái',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Mỗi hộp có 5 chiếc bút. Hỏi 8 hộp có bao nhiêu chiếc bút?',
    answer: '40',
    unit: 'chiếc',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Lớp có 40 bạn xếp thành 5 hàng đều nhau. Hỏi mỗi hàng có bao nhiêu bạn?',
    answer: '8',
    unit: 'bạn',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Một tuần có 7 ngày. Hỏi 4 tuần có bao nhiêu ngày?',
    answer: '28',
    unit: 'ngày',
  },
  {
    topic: 'g2-word-mul-div',
    semester: 2,
    prompt: 'Có 18 quả táo chia đều vào các đĩa, mỗi đĩa 2 quả. Hỏi cần bao nhiêu cái đĩa?',
    answer: '9',
    unit: 'đĩa',
  },
];

export function getG2WordProblems(topic: string, semester: 1 | 2 | 'all'): Question[] {
  return G2_WORD_PROBLEMS.filter((w) => w.topic === topic && (semester === 'all' || w.semester === semester)).map((w, i) => ({
    id: `g2-wp-${topic}-${i}`,
    grade: 2,
    semester: w.semester,
    topic: w.topic,
    type: 'word-problem' as const,
    prompt: w.prompt,
    answer: w.answer,
    unit: w.unit,
  }));
}
