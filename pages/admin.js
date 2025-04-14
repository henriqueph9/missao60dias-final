
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ uid: doc.id, ...doc.data() });
      });
      setUsuarios(data);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    window.location.href = '/';
  };

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Painel Administrativo</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 underline">Sair</button>
      </div>
      {usuarios.map((u) => (
        <div key={u.uid} className="border p-3 mb-4 bg-white rounded shadow">
          <h3 className="font-semibold text-blue-600">
            Participante: {u.nome || 'Sem nome'}
          </h3>
          <div className="text-sm text-gray-700 space-y-1 mt-2">
            {Object.entries(u)
              .filter(([k]) => k !== 'uid' && k !== 'nome')
              .map(([dia, dados]) => (
                <div key={dia}>
                  <strong>{dia}:</strong> Treino {dados.treino || '–'} | Dieta {dados.dieta || '–'} | Água {dados.agua || '–'}
                  <br />
                  Obs: {dados.obs || '–'}
                </div>
              ))}
          </div>
        </div>
      ))}
    </main>
  );
}
