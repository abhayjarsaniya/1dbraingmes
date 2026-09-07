import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0446611541",
  appId: "1:548743003226:web:14918284f7419e7068ec63",
  apiKey: "AIzaSyAANGKVf0MlpdjxIGfl35a1L_YQ2Khcf9g",
  authDomain: "gen-lang-client-0446611541.firebaseapp.com",
  storageBucket: "gen-lang-client-0446611541.firebasestorage.app",
  messagingSenderId: "548743003226"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-1dbraingamepuzzl-b5ddc9cd-12d1-41cd-8673-2e5450254dfa");
export const auth = getAuth(app);
