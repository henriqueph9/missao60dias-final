import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase-config';

export default function Home() {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'henriqueph9@hotmail.com') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    const email = prompt('Digite seu e-mail:');
    const password = prompt('Digite sua senha:');
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Missão 60 Dias</h1>
      <p>Faça login para acessar seu painel</p>
      <button onClick={handleLogin}>Entrar com e-mail</button>
    </div>
  );
}