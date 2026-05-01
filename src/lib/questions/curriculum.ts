import type { Grade, Semester } from './types';

export type TopicDef = {
  key: string;
  label: string;
  emoji: string;
  grade: Grade;
  semester: Semester;
};

export const CURRICULUM: TopicDef[] = [
  { key: 'g1-count-10', label: 'Đếm số 0-10', emoji: '🔢', grade: 1, semester: 1 },
  { key: 'g1-add-sub-10', label: 'Cộng trừ trong 10', emoji: '➕', grade: 1, semester: 1 },
  { key: 'g1-shapes-2d', label: 'Hình phẳng', emoji: '🔺', grade: 1, semester: 1 },
  { key: 'g1-count-100', label: 'Số đến 100', emoji: '💯', grade: 1, semester: 2 },
  { key: 'g1-add-sub-100-no-carry', label: 'Cộng trừ trong 100 (không nhớ)', emoji: '➕', grade: 1, semester: 2 },
  { key: 'g1-length-cm', label: 'Đo độ dài (cm)', emoji: '📏', grade: 1, semester: 2 },
  { key: 'g1-clock-hour', label: 'Xem giờ đúng', emoji: '🕐', grade: 1, semester: 2 },

  { key: 'g2-count-1000', label: 'Số đến 1000', emoji: '🔢', grade: 2, semester: 1 },
  { key: 'g2-add-sub-100-carry', label: 'Cộng trừ có nhớ trong 100', emoji: '➕', grade: 2, semester: 1 },
  { key: 'g2-add-sub-1000', label: 'Cộng trừ trong 1000', emoji: '➖', grade: 2, semester: 1 },
  { key: 'g2-length-units', label: 'Đơn vị độ dài (mm, cm, dm, m, km)', emoji: '📏', grade: 2, semester: 1 },
  { key: 'g2-weight-kg', label: 'Khối lượng (kg)', emoji: '⚖️', grade: 2, semester: 1 },
  { key: 'g2-volume-liter', label: 'Dung tích (lít)', emoji: '🥛', grade: 2, semester: 1 },
  { key: 'g2-vn-money', label: 'Tiền Việt Nam', emoji: '💵', grade: 2, semester: 1 },
  { key: 'g2-word-add-sub', label: 'Toán giải (cộng trừ)', emoji: '📖', grade: 2, semester: 1 },

  { key: 'g2-mul-table-2-5', label: 'Bảng nhân 2 và 5', emoji: '✖️', grade: 2, semester: 2 },
  { key: 'g2-div-table-2-5', label: 'Bảng chia 2 và 5', emoji: '➗', grade: 2, semester: 2 },
  { key: 'g2-three-num-ops', label: 'Phép tính 3 số (+ − ×)', emoji: '🧮', grade: 2, semester: 2 },
  { key: 'g2-time-hour-minute', label: 'Giờ và phút', emoji: '🕐', grade: 2, semester: 2 },
  { key: 'g2-calendar', label: 'Ngày, tháng, năm', emoji: '📅', grade: 2, semester: 2 },
  { key: 'g2-word-mul-div', label: 'Toán giải (nhân chia)', emoji: '📖', grade: 2, semester: 2 },

  { key: 'g3-mul-table-6-9', label: 'Bảng nhân 6-9', emoji: '✖️', grade: 3, semester: 1 },
  { key: 'g3-div-table-6-9', label: 'Bảng chia 6-9', emoji: '➗', grade: 3, semester: 1 },
  { key: 'g3-mul-by-1-digit', label: 'Nhân với số 1 chữ số', emoji: '✖️', grade: 3, semester: 1 },
  { key: 'g3-div-by-1-digit', label: 'Chia cho số 1 chữ số', emoji: '➗', grade: 3, semester: 1 },
  { key: 'g3-three-num-ops', label: 'Phép tính 3 số (4 phép tính)', emoji: '🧮', grade: 3, semester: 1 },
  { key: 'g3-perimeter', label: 'Chu vi HCN, HV', emoji: '⬜', grade: 3, semester: 1 },
  { key: 'g3-count-100000', label: 'Số đến 100 000', emoji: '🔢', grade: 3, semester: 2 },
  { key: 'g3-fraction-intro', label: 'Phân số đơn giản', emoji: '½', grade: 3, semester: 2 },
  { key: 'g3-area-rect', label: 'Diện tích HCN, HV', emoji: '⬜', grade: 3, semester: 2 },
  { key: 'g3-expression-paren', label: 'Biểu thức có ngoặc', emoji: '🧮', grade: 3, semester: 2 },

  { key: 'g4-large-numbers', label: 'Số đến triệu, tỉ', emoji: '🔢', grade: 4, semester: 1 },
  { key: 'g4-add-sub-large', label: 'Cộng trừ số lớn', emoji: '➕', grade: 4, semester: 1 },
  { key: 'g4-mul-multi-digit', label: 'Nhân nhiều chữ số', emoji: '✖️', grade: 4, semester: 1 },
  { key: 'g4-div-multi-digit', label: 'Chia nhiều chữ số', emoji: '➗', grade: 4, semester: 1 },
  { key: 'g4-three-num-ops', label: 'Phép tính 3 số (số lớn)', emoji: '🧮', grade: 4, semester: 1 },
  { key: 'g4-weight-units', label: 'Yến, tạ, tấn', emoji: '⚖️', grade: 4, semester: 1 },
  { key: 'g4-area-units', label: 'Đơn vị diện tích (dm², m²)', emoji: '🟦', grade: 4, semester: 1 },
  { key: 'g4-angles', label: 'Các loại góc', emoji: '📐', grade: 4, semester: 1 },
  { key: 'g4-parallelogram', label: 'Hình bình hành, hình thoi', emoji: '◆', grade: 4, semester: 1 },
  { key: 'g4-word-large', label: 'Toán giải (số lớn)', emoji: '📖', grade: 4, semester: 1 },

  { key: 'g4-fraction-reduce', label: 'Rút gọn phân số', emoji: '½', grade: 4, semester: 2 },
  { key: 'g4-fraction-compare', label: 'So sánh phân số', emoji: '½', grade: 4, semester: 2 },
  { key: 'g4-fraction-ops', label: '4 phép tính phân số', emoji: '½', grade: 4, semester: 2 },
  { key: 'g4-average', label: 'Trung bình cộng', emoji: '📊', grade: 4, semester: 2 },
  { key: 'g4-area-km2', label: 'Đơn vị km²', emoji: '🟦', grade: 4, semester: 2 },
  { key: 'g4-time-second-century', label: 'Giây, thế kỷ', emoji: '⏱️', grade: 4, semester: 2 },
  { key: 'g4-word-fraction', label: 'Toán giải (phân số)', emoji: '📖', grade: 4, semester: 2 },

  { key: 'g5-mixed-number', label: 'Hỗn số', emoji: '🔢', grade: 5, semester: 1 },
  { key: 'g5-decimal', label: 'Số thập phân', emoji: '🔢', grade: 5, semester: 1 },
  { key: 'g5-decimal-ops', label: '4 phép tính số thập phân', emoji: '➕', grade: 5, semester: 1 },
  { key: 'g5-percentage', label: 'Tỉ số phần trăm', emoji: '%', grade: 5, semester: 2 },
  { key: 'g5-velocity', label: 'Vận tốc, quãng đường, thời gian', emoji: '🚗', grade: 5, semester: 2 },
  { key: 'g5-area-triangle', label: 'Diện tích tam giác', emoji: '🔺', grade: 5, semester: 2 },
  { key: 'g5-area-trapezoid', label: 'Diện tích hình thang', emoji: '🔻', grade: 5, semester: 2 },
  { key: 'g5-area-circle', label: 'Chu vi, diện tích hình tròn', emoji: '⭕', grade: 5, semester: 2 },
  { key: 'g5-volume-box', label: 'Thể tích hình hộp', emoji: '📦', grade: 5, semester: 2 },
];

export function topicsForGradeSemester(grade: Grade, semester: Semester | 'all'): TopicDef[] {
  return CURRICULUM.filter(
    (t) => t.grade === grade && (semester === 'all' || t.semester === semester)
  );
}

export function getTopic(key: string): TopicDef | undefined {
  return CURRICULUM.find((t) => t.key === key);
}
