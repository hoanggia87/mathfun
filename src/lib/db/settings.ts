import { getDb } from './database';

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    key
  );
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    value
  );
}

export async function getParentPin(): Promise<string> {
  return (await getSetting('parent_pin')) ?? '1234';
}

export async function setParentPin(pin: string): Promise<void> {
  await setSetting('parent_pin', pin);
}

export async function getSoundEnabled(): Promise<boolean> {
  return (await getSetting('sound_enabled')) !== '0';
}

export async function setSoundEnabled(enabled: boolean): Promise<void> {
  await setSetting('sound_enabled', enabled ? '1' : '0');
}
