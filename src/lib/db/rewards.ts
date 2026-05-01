import { v4 as uuid } from 'uuid';
import { getDb } from './database';

export type Reward = {
  id: string;
  name: string;
  cost: number;
  emoji: string;
  sortOrder: number;
};

type Row = { id: string; name: string; cost: number; emoji: string; sort_order: number };

const fromRow = (r: Row): Reward => ({
  id: r.id,
  name: r.name,
  cost: r.cost,
  emoji: r.emoji,
  sortOrder: r.sort_order,
});

export async function listRewards(): Promise<Reward[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>(
    'SELECT * FROM rewards ORDER BY sort_order ASC, cost ASC'
  );
  return rows.map(fromRow);
}

export async function createReward(
  data: Omit<Reward, 'id' | 'sortOrder'> & { sortOrder?: number }
): Promise<Reward> {
  const db = await getDb();
  const reward: Reward = { id: uuid(), sortOrder: data.sortOrder ?? 99, ...data };
  await db.runAsync(
    'INSERT INTO rewards (id, name, cost, emoji, sort_order) VALUES (?, ?, ?, ?, ?)',
    reward.id,
    reward.name,
    reward.cost,
    reward.emoji,
    reward.sortOrder
  );
  return reward;
}

export async function updateReward(id: string, patch: Partial<Omit<Reward, 'id'>>): Promise<void> {
  const db = await getDb();
  const fields: string[] = [];
  const values: any[] = [];
  if (patch.name !== undefined) { fields.push('name = ?'); values.push(patch.name); }
  if (patch.cost !== undefined) { fields.push('cost = ?'); values.push(patch.cost); }
  if (patch.emoji !== undefined) { fields.push('emoji = ?'); values.push(patch.emoji); }
  if (patch.sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(patch.sortOrder); }
  if (fields.length === 0) return;
  values.push(id);
  await db.runAsync(`UPDATE rewards SET ${fields.join(', ')} WHERE id = ?`, ...values);
}

export async function deleteReward(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM rewards WHERE id = ?', id);
}

export async function recordRedemption(
  profileId: string,
  reward: Reward
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO reward_redemptions (id, profile_id, reward_id, reward_name, cost, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    uuid(),
    profileId,
    reward.id,
    reward.name,
    reward.cost,
    Date.now()
  );
}

export type WheelSegment = { id: string; points: number; color: string; sortOrder: number };
type WheelRow = { id: string; points: number; color: string; sort_order: number };

export async function listWheelSegments(): Promise<WheelSegment[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<WheelRow>(
    'SELECT * FROM wheel_segments ORDER BY sort_order ASC'
  );
  return rows.map((r) => ({ id: r.id, points: r.points, color: r.color, sortOrder: r.sort_order }));
}

export async function replaceWheelSegments(
  segments: { points: number; color: string }[]
): Promise<void> {
  const db = await getDb();
  await db.execAsync('DELETE FROM wheel_segments');
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    await db.runAsync(
      'INSERT INTO wheel_segments (id, points, color, sort_order) VALUES (?, ?, ?, ?)',
      uuid(),
      s.points,
      s.color,
      i
    );
  }
}
