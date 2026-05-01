import { v4 as uuid } from 'uuid';
import { getDb } from './database';
import type { Grade } from '@/lib/questions/types';

export type Profile = {
  id: string;
  name: string;
  avatarUri: string | null;
  totalPoints: number;
  grade: Grade;
  createdAt: number;
};

type Row = {
  id: string;
  name: string;
  avatar_uri: string | null;
  total_points: number;
  grade: number;
  created_at: number;
};

const fromRow = (r: Row): Profile => ({
  id: r.id,
  name: r.name,
  avatarUri: r.avatar_uri,
  totalPoints: r.total_points,
  grade: (r.grade as Grade) ?? 2,
  createdAt: r.created_at,
});

export async function listProfiles(): Promise<Profile[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>(
    'SELECT * FROM profiles ORDER BY created_at ASC'
  );
  return rows.map(fromRow);
}

export async function createProfile(
  name: string,
  avatarUri: string | null,
  grade: Grade
): Promise<Profile> {
  const db = await getDb();
  const profile: Profile = {
    id: uuid(),
    name: name.trim(),
    avatarUri,
    totalPoints: 0,
    grade,
    createdAt: Date.now(),
  };
  await db.runAsync(
    'INSERT INTO profiles (id, name, avatar_uri, total_points, grade, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    profile.id,
    profile.name,
    profile.avatarUri,
    profile.totalPoints,
    profile.grade,
    profile.createdAt
  );
  return profile;
}

export async function updateProfile(
  id: string,
  patch: { name?: string; avatarUri?: string | null; grade?: Grade }
): Promise<void> {
  const db = await getDb();
  if (patch.name !== undefined) {
    await db.runAsync('UPDATE profiles SET name = ? WHERE id = ?', patch.name.trim(), id);
  }
  if (patch.avatarUri !== undefined) {
    await db.runAsync('UPDATE profiles SET avatar_uri = ? WHERE id = ?', patch.avatarUri, id);
  }
  if (patch.grade !== undefined) {
    await db.runAsync('UPDATE profiles SET grade = ? WHERE id = ?', patch.grade, id);
  }
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM profiles WHERE id = ?', id);
}

export async function addPoints(id: string, delta: number): Promise<number> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE profiles SET total_points = MAX(0, total_points + ?) WHERE id = ?',
    delta,
    id
  );
  const row = await db.getFirstAsync<{ total_points: number }>(
    'SELECT total_points FROM profiles WHERE id = ?',
    id
  );
  return row?.total_points ?? 0;
}

export async function getProfile(id: string): Promise<Profile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Row>('SELECT * FROM profiles WHERE id = ?', id);
  return row ? fromRow(row) : null;
}
