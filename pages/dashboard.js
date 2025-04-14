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
    days.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return days;
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
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

  const handleToggle = (day, field) => {
    const newDay = data[day] || { treino: false, dieta: false, agua: false, obs: '' };
    newDay[field] = !newDay[field];
    const newData = { ...data, [day]: newDay };
    setData(newData);
    setDoc(doc(db, 'usuarios', user.uid), newData);
  };

  const handleObsChange = (day, value) => {
    const newDay = data[day] || { treino: false, dieta: false, agua: false, obs: '' };
    newDay.obs = value;
    const newData = { ...data, [day]: newDay };
    setData(newData);
    setDoc(doc(db, 'usuarios', user.uid), newData);
  };

  return (
    <main style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center' }}>Painel do Participante</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {calendarDays.map((day) => (
          <div key={day} style={{ border: '1px solid #ccc', margin: '4px', padding: '6px', width: '150px' }}>
            <strong>{day}</strong>
            <div>
              <button onClick={() => handleToggle(day, 'treino')}>
                Treino {data[day]?.treino ? '✔️' : '❌'}
              </button>
            </div>
            <div>
              <button onClick={() => handleToggle(day, 'dieta')}>
                Dieta {data[day]?.dieta ? '✔️' : '❌'}
              </button>
            </div>
            <div>
              <button onClick={() => handleToggle(day, 'agua')}>
                Água {data[day]?.agua ? '✔️' : '❌'}
              </button>
            </div>
            <textarea
              rows="2"
              placeholder="Observações"
              value={data[day]?.obs || ''}
              onChange={(e) => handleObsChange(day, e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}