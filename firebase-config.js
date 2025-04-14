import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuhIbm_mb8lHsr72cw8S459RZtza1Teh4",
  authDomain: "missao60dias.firebaseapp.com",
  projectId: "missao60dias",
  storageBucket: "missao60dias.firebasestorage.app",
  messagingSenderId: "281398802860",
  appId: "1:281398802860:web:ddd068788f5b4e6610e209"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };