import { DatabaseSchema } from '../types';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export async function getDb(): Promise<DatabaseSchema> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }
  return { games: [], pages: [], settings: {} as any, privacyPolicy: { enabled: false, title: '', content: '', lastUpdated: '' } };
}

export async function saveDb(data: DatabaseSchema): Promise<void> {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

