import { v4 as uuid } from 'uuid';
import { getDb } from './database';

export type SessionRecord = {
  id: string;
  profileId: string;
  grade: number;
  semester: number;
  topics: string[];
  totalQuestions: number;
  correctCount: number;
  wrongAttempts: number;
  skippedCount: number;
  bestStreak: number;
  durationSeconds: number;
  stars: 0 | 1 | 2 | 3;
  spinsEarned: number;
  spinsUsed: number;
  createdAt: number;
};

type Row = {
  id: string;
  profile_id: string;
  grade: number;
  semester: number;
  topics: string;
  total_questions: number;
  correct_count: number;
  wrong_attempts: number;
  skipped_count: number;
  best_streak: number;
  duration_seconds: number;
  stars: number;
  spins_earned: number;
  spins_used: number;
  created_at: number;
};

const fromRow = (r: Row): SessionRecord => ({
  id: r.id,
  profileId: r.profile_id,
  grade: r.grade,
  semester: r.semester,
  topics: JSON.parse(r.topics),
  totalQuestions: r.total_questions,
  correctCount: r.correct_count,
  wrongAttempts: r.wrong_attempts,
  skippedCount: r.skipped_count,
  bestStreak: r.best_streak,
  durationSeconds: r.duration_seconds,
  stars: r.stars as 0 | 1 | 2 | 3,
  spinsEarned: r.spins_earned,
  spinsUsed: r.spins_used,
  createdAt: r.created_at,
});

export async function saveSession(
  s: Omit<SessionRecord, 'id' | 'createdAt' | 'spinsUsed'>
): Promise<SessionRecord> {
  const db = await getDb();
  const record: SessionRecord = {
    ...s,
    id: uuid(),
    spinsUsed: 0,
    createdAt: Date.now(),
  };
  await db.runAsync(
    `INSERT INTO sessions (
      id, profile_id, grade, semester, topics, total_questions,
      correct_count, wrong_attempts, skipped_count, best_streak,
      duration_seconds, stars, spins_earned, spins_used, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    record.id,
    record.profileId,
    record.grade,
    record.semester,
    JSON.stringify(record.topics),
    record.totalQuestions,
    record.correctCount,
    record.wrongAttempts,
    record.skippedCount,
    record.bestStreak,
    record.durationSeconds,
    record.stars,
    record.spinsEarned,
    record.spinsUsed,
    record.createdAt
  );
  return record;
}

export async function listSessionsByProfile(
  profileId: string,
  limit = 50
): Promise<SessionRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>(
    'SELECT * FROM sessions WHERE profile_id = ? ORDER BY created_at DESC LIMIT ?',
    profileId,
    limit
  );
  return rows.map(fromRow);
}
