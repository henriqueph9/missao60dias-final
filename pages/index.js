
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, { nome });
        }
        if (user.email === 'henriqueph9@hotmail.com') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    });
    return () => unsub();
  }, []);

  const handleRegisterLogin = async (e) => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, 'usuarios', cred.user.uid), { nome });
    } catch (err) {
      // Se já for registrado, tenta logar
      try {
        const login = await signInWithEmailAndPassword(auth, email, senha);
        const docRef = doc(db, 'usuarios', login.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, { nome });
        }
      } catch (e) {
        setError('Erro ao entrar ou cadastrar');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Missão 60 Dias</h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Preencha nome, e-mail e senha para entrar ou se cadastrar
        </p>
        <form onSubmit={handleRegisterLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar / Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
