import { DatabaseSchema, Game, Page, SiteSettings } from '../types';

export async function getDb(): Promise<DatabaseSchema> {
  return { games: [], pages: [], settings: {} as any, privacyPolicy: { enabled: false, title: '', content: '', lastUpdated: '' } };
}

export async function saveDb(data: DatabaseSchema): Promise<void> {
  // Not used anymore. Client saves directly to Firestore.
}
