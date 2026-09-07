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

import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db as firestoreDb, auth } from '../lib/firebase';

export const useStore = create<AppState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchPublicData: async () => {
    set({ loading: true });
    try {
      const gamesSnap = await getDocs(collection(firestoreDb, 'games'));
      const games = gamesSnap.docs.map(d => d.data() as Game);

      const pagesSnap = await getDocs(collection(firestoreDb, 'pages'));
      const pages = pagesSnap.docs.map(d => d.data() as any);

      const settingsSnap = await getDoc(doc(firestoreDb, 'settings', 'global'));
      const settings = (settingsSnap.exists() ? settingsSnap.data() : null) as SiteSettings;

      const privacySnap = await getDoc(doc(firestoreDb, 'privacyPolicy', 'global'));
      const privacyPolicy = privacySnap.exists() ? privacySnap.data() : { enabled: false, title: '', content: '', lastUpdated: '' };

      if (games.length > 0) {
        const data = { games, pages, settings, privacyPolicy };
        set({ data, loading: false, error: null });
        return;
      }
    } catch (err: any) {
      console.warn('Firestore fetchPublicData failed, attempting local API fallback:', err?.message || err);
    }

    // Fallback to local server API / db.json
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const localData = await res.json();
        set({ data: localData, loading: false, error: null });
        return;
      }
    } catch (apiErr: any) {
      console.error('API fallback fetch failed:', apiErr);
    }
    set({ loading: false });
  }
}));

interface AdminState {
  db: DatabaseSchema | null;
  loading: boolean;
  token: string | null;
  login: (password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  fetchAdminData: () => Promise<void>;
  saveAdminData: (newData: DatabaseSchema) => Promise<boolean>;
  updateGame: (game: Game) => Promise<boolean>;
  deleteGame: (gameId: string) => Promise<boolean>;
  addGame: (game: Game) => Promise<boolean>;
  deletePage: (pageId: string) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  db: null,
  loading: false,
  token: localStorage.getItem('admin_token'),
  login: async (password: string, email: string = 'abhay@gmail.com') => {
    try {
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
    let loadedData: DatabaseSchema | null = null;
    try {
      const gamesSnap = await getDocs(collection(firestoreDb, 'games'));
      const games = gamesSnap.docs.map(d => d.data() as Game);

      const pagesSnap = await getDocs(collection(firestoreDb, 'pages'));
      const pages = pagesSnap.docs.map(d => d.data() as any);

      const settingsSnap = await getDoc(doc(firestoreDb, 'settings', 'global'));
      const settings = (settingsSnap.exists() ? settingsSnap.data() : null) as SiteSettings;

      const privacySnap = await getDoc(doc(firestoreDb, 'privacyPolicy', 'global'));
      const privacyPolicy = privacySnap.exists() ? privacySnap.data() : { enabled: false, title: '', content: '', lastUpdated: '' };

      if (games.length > 0) {
        loadedData = { games, pages, settings: settings as any, privacyPolicy: privacyPolicy as any };
      }
    } catch (err) {
      console.warn('Firestore fetchAdminData error, checking local fallback:', err);
    }

    if (!loadedData) {
      try {
        const res = await fetch('/api/admin/db', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          loadedData = await res.json();
        }
      } catch (apiErr) {
        console.error('Fallback /api/admin/db error:', apiErr);
      }
    }

    if (loadedData) {
      set({ db: loadedData, loading: false });
      // Keep public store synchronized
      useStore.setState({
        data: {
          games: loadedData.games,
          pages: loadedData.pages,
          settings: loadedData.settings,
          privacyPolicy: loadedData.privacyPolicy
        },
        loading: false,
        error: null
      });
    } else {
      set({ loading: false });
    }
  },
  saveAdminData: async (newData: DatabaseSchema): Promise<boolean> => {
    const { token } = get();
    if (!token) return false;
    try {
      // 1. Persist to Firestore
      for (const game of newData.games) {
        await setDoc(doc(firestoreDb, 'games', game.id), game);
      }
      for (const page of newData.pages) {
        await setDoc(doc(firestoreDb, 'pages', page.id), page);
      }
      if (newData.settings) {
        await setDoc(doc(firestoreDb, 'settings', 'global'), newData.settings);
      }
      if (newData.privacyPolicy) {
        await setDoc(doc(firestoreDb, 'privacyPolicy', 'global'), newData.privacyPolicy);
      }

      // 2. Mirror to local server db.json for backup and static persistence
      try {
        await fetch('/api/admin/db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newData)
        });
      } catch (mirrorErr) {
        console.warn('Mirror to /api/admin/db notice:', mirrorErr);
      }
      
      // 3. Update Admin state
      set({ db: newData });

      // 4. Instantly update Public state so public site reflects edits immediately
      useStore.setState({
        data: {
          games: newData.games,
          pages: newData.pages,
          settings: newData.settings,
          privacyPolicy: newData.privacyPolicy
        },
        loading: false,
        error: null
      });

      return true;
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Failed to save changes: ' + (err?.message || 'Permission denied'));
      return false;
    }
  },
  updateGame: async (game: Game): Promise<boolean> => {
    const { db: currentDb, saveAdminData } = get();
    if (!currentDb) return false;
    const newData = {
      ...currentDb,
      games: currentDb.games.map(g => g.id === game.id ? game : g)
    };
    return await saveAdminData(newData);
  },
  addGame: async (game: Game): Promise<boolean> => {
    const { db: currentDb, saveAdminData } = get();
    if (!currentDb) return false;
    const existing = currentDb.games.findIndex(g => g.id === game.id);
    let newGames = [...currentDb.games];
    if (existing >= 0) {
      newGames[existing] = game;
    } else {
      newGames.push(game);
    }
    const newData = {
      ...currentDb,
      games: newGames
    };
    return await saveAdminData(newData);
  },
  deleteGame: async (gameId: string): Promise<boolean> => {
    const { db: currentDb, saveAdminData } = get();
    if (!currentDb) return false;

    // Remove from Firestore directly
    try {
      await deleteDoc(doc(firestoreDb, 'games', gameId));
    } catch (err) {
      console.warn('deleteDoc warning from Firestore:', err);
    }

    const newData = {
      ...currentDb,
      games: currentDb.games.filter(g => g.id !== gameId)
    };
    return await saveAdminData(newData);
  },
  deletePage: async (pageId: string): Promise<boolean> => {
    const { db: currentDb, saveAdminData } = get();
    if (!currentDb) return false;

    try {
      await deleteDoc(doc(firestoreDb, 'pages', pageId));
    } catch (err) {
      console.warn('deleteDoc page warning from Firestore:', err);
    }

    const newData = {
      ...currentDb,
      pages: currentDb.pages.filter(p => p.id !== pageId)
    };
    return await saveAdminData(newData);
  }
}));

