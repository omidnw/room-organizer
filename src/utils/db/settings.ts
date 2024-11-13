import { getDB } from './config';

export const settingsOperations = {
  async getTimezone(): Promise<string> {
    const db = await getDB();
    const settings = await db.get('settings', 'timezone');
    return settings?.value?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  },

  async setTimezone(timezone: string): Promise<void> {
    const db = await getDB();
    await db.put('settings', {
      key: 'timezone',
      value: { timezone }
    });
  },

  async getCurrency(): Promise<string> {
    const db = await getDB();
    const settings = await db.get('settings', 'currency');
    return settings?.value?.currency || 'USD';
  },

  async setCurrency(currency: string): Promise<void> {
    const db = await getDB();
    await db.put('settings', {
      key: 'currency',
      value: { currency }
    });
  }
}; 