import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'missao60dias.firebaseapp.com',
  projectId: 'missao60dias',
  storageBucket: 'missao60dias.appspot.com',
  messagingSenderId: 'SEU_ID',
  appId: 'SEU_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };