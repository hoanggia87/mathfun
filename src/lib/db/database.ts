import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mathsth.db';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync(DB_NAME);
  await _db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await runMigrations(_db);
  return _db;
}

type Migration = {
  version: number;
  up: string | ((db: SQLite.SQLiteDatabase) => Promise<void>);
};

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar_uri TEXT,
        total_points INTEGER NOT NULL DEFAULT 0,
        grade INTEGER NOT NULL DEFAULT 2,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        grade INTEGER NOT NULL,
        semester INTEGER NOT NULL,
        topics TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        correct_count INTEGER NOT NULL,
        wrong_attempts INTEGER NOT NULL,
        skipped_count INTEGER NOT NULL,
        best_streak INTEGER NOT NULL,
        duration_seconds INTEGER NOT NULL,
        stars INTEGER NOT NULL,
        spins_earned INTEGER NOT NULL,
        spins_used INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_profile ON sessions(profile_id, created_at DESC);

      CREATE TABLE IF NOT EXISTS rewards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cost INTEGER NOT NULL,
        emoji TEXT NOT NULL DEFAULT '🎁',
        sort_order INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS reward_redemptions (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        reward_id TEXT NOT NULL,
        reward_name TEXT NOT NULL,
        cost INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wheel_segments (
        id TEXT PRIMARY KEY,
        points INTEGER NOT NULL,
        color TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `,
  },
  {
    version: 2,
    up: async (db: SQLite.SQLiteDatabase) => {
      const cols = await db.getAllAsync<{ name: string }>(
        "PRAGMA table_info(profiles)"
      );
      if (!cols.some((c) => c.name === 'grade')) {
        await db.execAsync(
          'ALTER TABLE profiles ADD COLUMN grade INTEGER NOT NULL DEFAULT 1;'
        );
      }
    },
  },
];

async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY);`);
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_version'
  );
  const current = row?.version ?? 0;

  for (const m of MIGRATIONS) {
    if (m.version > current) {
      if (typeof m.up === 'string') {
        await db.execAsync(m.up);
      } else {
        await m.up(db);
      }
      await db.runAsync('INSERT INTO schema_version (version) VALUES (?)', m.version);
    }
  }

  await seedDefaults(db);
}

async function seedDefaults(db: SQLite.SQLiteDatabase) {
  const wheelCount = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM wheel_segments'
  );
  if ((wheelCount?.c ?? 0) === 0) {
    const defaults = [
      { points: 5, color: '#FF6B9D' },
      { points: 10, color: '#5BC0EB' },
      { points: 20, color: '#52B788' },
      { points: 5, color: '#FF8A00' },
      { points: 50, color: '#9B5DE5' },
      { points: 10, color: '#FFC107' },
    ];
    for (let i = 0; i < defaults.length; i++) {
      const d = defaults[i];
      await db.runAsync(
        'INSERT INTO wheel_segments (id, points, color, sort_order) VALUES (?, ?, ?, ?)',
        `seed-wheel-${i}`,
        d.points,
        d.color,
        i
      );
    }
  }

  const rewardCount = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM rewards'
  );
  if ((rewardCount?.c ?? 0) === 0) {
    const defaults = [
      { name: 'Xem TV 15 phút', cost: 50, emoji: '📺' },
      { name: 'Chơi game 30 phút', cost: 100, emoji: '🎮' },
      { name: 'Ăn kem', cost: 200, emoji: '🍦' },
      { name: 'Đi công viên', cost: 500, emoji: '🎡' },
    ];
    for (let i = 0; i < defaults.length; i++) {
      const d = defaults[i];
      await db.runAsync(
        'INSERT INTO rewards (id, name, cost, emoji, sort_order) VALUES (?, ?, ?, ?, ?)',
        `seed-reward-${i}`,
        d.name,
        d.cost,
        d.emoji,
        i
      );
    }
  }

  const pin = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    'parent_pin'
  );
  if (!pin) {
    await db.runAsync(
      'INSERT INTO app_settings (key, value) VALUES (?, ?)',
      'parent_pin',
      '1234'
    );
  }

  const profileCount = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM profiles'
  );
  if ((profileCount?.c ?? 0) === 0) {
    await db.runAsync(
      'INSERT INTO profiles (id, name, avatar_uri, total_points, grade, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      'seed-default-be',
      'Bé',
      '🦁',
      0,
      1,
      Date.now()
    );
  }
}
