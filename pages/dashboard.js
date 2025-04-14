import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const generateCalendar = () => {
  const start = new Date('2025-04-14');
  const end = new Date('2025-06-14');
  const days = [];
  let current = new Date(start);
  while (current <= end) {
    const weekday = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][current.getDay()];
    const dateBR = current.toLocaleDateString('pt-BR');
    days.push({ key: current.toISOString().split('T')[0], label: `${weekday} - ${dateBR}` });
    current.setDate(current.getDate() + 1);
  }
  return days;
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  const [obsBuffer, setObsBuffer] = useState({});
  const calendarDays = generateCalendar();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'usuarios', user.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            setData(docSnap.data());
          }
        });
      }
    });
  }, []);

  const handleToggle = (dayKey, field) => {
    const newDay = data[dayKey] || { treino: false, dieta: false, agua: false, obs: '' };
    newDay[field] = !newDay[field];
    const newData = { ...data, [dayKey]: newDay };
    setData(newData);
    setDoc(doc(db, 'usuarios', user.uid), newData);
  };

  const handleObsChange = (dayKey, value) => {
    setObsBuffer({ ...obsBuffer, [dayKey]: value });
  };

  const handleObsSave = (dayKey) => {
    const newDay = data[dayKey] || { treino: false, dieta: false, agua: false, obs: '' };
    newDay.obs = obsBuffer[dayKey] || '';
    const newData = { ...data, [dayKey]: newDay };
    setData(newData);
    setDoc(doc(db, 'usuarios', user.uid), newData);
  };

  return (
    <main style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center' }}>Painel do Participante</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {calendarDays.map(({ key, label }) => (
          <div key={key} style={{ border: '1px solid #ccc', margin: '4px', padding: '6px', width: '180px' }}>
            <strong>{label}</strong>
            <div>
              <button onClick={() => handleToggle(key, 'treino')} style={{ background: data[key]?.treino ? '#333' : '#eee' }}>
                Treino {data[key]?.treino ? '✔️' : '❌'}
              </button>
            </div>
            <div>
              <button onClick={() => handleToggle(key, 'dieta')} style={{ background: data[key]?.dieta ? '#333' : '#eee' }}>
                Dieta {data[key]?.dieta ? '✔️' : '❌'}
              </button>
            </div>
            <div>
              <button onClick={() => handleToggle(key, 'agua')} style={{ background: data[key]?.agua ? '#333' : '#eee' }}>
                Água {data[key]?.agua ? '✔️' : '❌'}
              </button>
            </div>
            <textarea
              rows="2"
              placeholder="Observações"
              value={obsBuffer[key] !== undefined ? obsBuffer[key] : data[key]?.obs || ''}
              onChange={(e) => handleObsChange(key, e.target.value)}
              style={{ width: '100%' }}
            />
            <button onClick={() => handleObsSave(key)} style={{ marginTop: '4px', width: '100%' }}>Enviar</button>
          </div>
        ))}
      </div>
    </main>
  );
}