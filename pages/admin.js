import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';

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

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Painel Administrativo</h1>
      {usuarios.map((u) => (
        <div key={u.uid} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
          <h3>Usuário: {u.uid}</h3>
          {Object.entries(u).filter(([k]) => k !== 'uid').map(([dia, dados]) => (
            <div key={dia}>
              <strong>{dia}</strong>: Treino {dados.treino ? '✔️' : '❌'} | Dieta {dados.dieta ? '✔️' : '❌'} | Água {dados.agua ? '✔️' : '❌'}<br />
              Obs: {dados.obs || '-'}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}