import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';

export default function Home() {
  const router = useRouter();

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
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Missão 60 Dias</h1>
      <p>Faça login com seu e-mail</p>
      <button onClick={handleLogin}>Entrar</button>
    </main>
  );
}