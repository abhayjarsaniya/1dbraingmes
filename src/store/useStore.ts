import { create } from 'zustand';
import { DatabaseSchema, Game, SiteSettings } from '../types';

interface AppState {
  data: {
    games: Game[];
    settings: SiteSettings | null;
    privacyPolicy: any;
    pages?: any[];
  } | null;
  loading: boolean;
  error: string | null;
  fetchPublicData: () => Promise<void>;
}

import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export const useStore = create<AppState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchPublicData: async () => {
    set({ loading: true });
    try {
      const gamesSnap = await getDocs(collection(db, 'games'));
      const games = gamesSnap.docs.map(d => d.data() as Game);

      const pagesSnap = await getDocs(collection(db, 'pages'));
      const pages = pagesSnap.docs.map(d => d.data() as any);

      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      const settings = (settingsSnap.exists() ? settingsSnap.data() : null) as SiteSettings;

      const privacySnap = await getDoc(doc(db, 'privacyPolicy', 'global'));
      const privacyPolicy = privacySnap.exists() ? privacySnap.data() : { enabled: false, title: '', content: '', lastUpdated: '' };

      const data = { games, pages, settings, privacyPolicy };
      set({ data, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));

interface AdminState {
  db: DatabaseSchema | null;
  loading: boolean;
  token: string | null;
  login: (password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  fetchAdminData: () => Promise<void>;
  saveAdminData: (newData: DatabaseSchema) => Promise<void>;
  updateGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
  addGame: (game: Game) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  db: null,
  loading: false,
  token: localStorage.getItem('admin_token'),
  login: async (password: string, email: string = 'abhay@gmail.com') => {
    try {
      // Firebase auth login
      const cred = await signInWithEmailAndPassword(auth, email || 'abhay@gmail.com', password);
      const token = await cred.user.getIdToken();
      localStorage.setItem('admin_token', token);
      set({ token });
      return true;
    } catch (err: any) {
      console.error('Firebase auth login error:', err?.message || err);
      return false;
    }
  },
  logout: () => {
    signOut(auth);
    localStorage.removeItem('admin_token');
    set({ token: null, db: null });
  },
  fetchAdminData: async () => {
    const { token } = get();
    if (!token) return;
    set({ loading: true });
    try {
      const gamesSnap = await getDocs(collection(db, 'games'));
      const games = gamesSnap.docs.map(d => d.data() as Game);

      const pagesSnap = await getDocs(collection(db, 'pages'));
      const pages = pagesSnap.docs.map(d => d.data() as any);

      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      const settings = (settingsSnap.exists() ? settingsSnap.data() : null) as SiteSettings;

      const privacySnap = await getDoc(doc(db, 'privacyPolicy', 'global'));
      const privacyPolicy = privacySnap.exists() ? privacySnap.data() : { enabled: false, title: '', content: '', lastUpdated: '' };

      set({ db: { games, pages, settings: settings as any, privacyPolicy: privacyPolicy as any }, loading: false });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },
  saveAdminData: async (newData: DatabaseSchema) => {
    const { token } = get();
    if (!token) return;
    try {
      for (const game of newData.games) {
        await setDoc(doc(db, 'games', game.id), game);
      }
      for (const page of newData.pages) {
        await setDoc(doc(db, 'pages', page.id), page);
      }
      await setDoc(doc(db, 'settings', 'global'), newData.settings);
      await setDoc(doc(db, 'privacyPolicy', 'global'), newData.privacyPolicy);
      
      set({ db: newData });
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save to Firebase. Ensure you have Write permissions.');
    }
  },
  updateGame: (game: Game) => {
    const { db, saveAdminData } = get();
    if (!db) return;
    const newData = {
      ...db,
      games: db.games.map(g => g.id === game.id ? game : g)
    };
    saveAdminData(newData);
  },
  addGame: (game: Game) => {
    const { db, saveAdminData } = get();
    if (!db) return;
    const newData = {
      ...db,
      games: [...db.games, game]
    };
    saveAdminData(newData);
  },
  deleteGame: (gameId: string) => {
    const { db, saveAdminData } = get();
    if (!db) return;
    const newData = {
      ...db,
      games: db.games.filter(g => g.id !== gameId)
    };
    saveAdminData(newData);
  }
}));
