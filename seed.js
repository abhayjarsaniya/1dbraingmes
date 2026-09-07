import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  projectId: "gen-lang-client-0446611541",
  appId: "1:548743003226:web:14918284f7419e7068ec63",
  apiKey: "AIzaSyAANGKVf0MlpdjxIGfl35a1L_YQ2Khcf9g",
  authDomain: "gen-lang-client-0446611541.firebaseapp.com",
  storageBucket: "gen-lang-client-0446611541.firebasestorage.app",
  messagingSenderId: "548743003226"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-1dbraingamepuzzl-b5ddc9cd-12d1-41cd-8673-2e5450254dfa");

async function seed() {
  try {
    const data = JSON.parse(fs.readFileSync('./db.json', 'utf8'));

    // Games
    for (const game of data.games) {
      await setDoc(doc(db, 'games', game.id), game);
    }
    console.log('Games seeded');

    // Pages
    for (const page of data.pages) {
      await setDoc(doc(db, 'pages', page.id), page);
    }
    console.log('Pages seeded');

    // Settings
    await setDoc(doc(db, 'settings', 'global'), data.settings);
    console.log('Settings seeded');

    // Privacy Policy
    await setDoc(doc(db, 'privacyPolicy', 'global'), data.privacyPolicy);
    console.log('Privacy Policy seeded');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
