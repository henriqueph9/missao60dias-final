
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
  const [enviado, setEnviado] = useState({});
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

  const handleSelect = (dayKey, field, value) => {
    const newDay = data[dayKey] || { treino: '', dieta: '', agua: '', obs: '' };
    newDay[field] = value;
    const newData = { ...data, [dayKey]: newDay };
    setData(newData);
    setDoc(doc(db, 'usuarios', user.uid), newData);
  };

  const handleObsChange = (dayKey, value) => {
    setObsBuffer({ ...obsBuffer, [dayKey]: value });
  };

  const handleObsSave = (dayKey) => {
    const newDay = data[dayKey] || { treino: '', dieta: '', agua: '', obs: '' };
    newDay.obs = obsBuffer[dayKey] || '';
    const newData = { ...data, [dayKey]: newDay };
    setData(newData);
    setDoc(doc(db, 'usuarios', user.uid), newData);
    setEnviado({ ...enviado, [dayKey]: true });
    setTimeout(() => setEnviado((prev) => ({ ...prev, [dayKey]: false })), 3000);
  };

  const handleLogout = () => {
    signOut(auth);
    window.location.href = '/';
  };

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Relatório Diário Missão 60 Dias</h2>
        <button onClick={handleLogout} className="text-sm text-red-600 underline">Sair</button>
      </div>
      <div className="flex flex-wrap gap-4">
        {calendarDays.map(({ key, label }) => (
          <div key={key} className="border rounded p-3 w-[200px] bg-white shadow">
            <strong className="block mb-1">{label}</strong>
            {['treino', 'dieta', 'agua'].map((field) => (
              <div key={field} className="flex items-center gap-2 mb-1">
                <span className="capitalize">{field}:</span>
                <button
                  className={`px-2 ${data[key]?.[field] === '✔️' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleSelect(key, field, '✔️')}
                >
                  ✔️
                </button>
                <button
                  className={`px-2 ${data[key]?.[field] === '❌' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleSelect(key, field, '❌')}
                >
                  ❌
                </button>
              </div>
            ))}
            <textarea
              rows="2"
              placeholder="Observações"
              value={obsBuffer[key] !== undefined ? obsBuffer[key] : data[key]?.obs || ''}
              onChange={(e) => handleObsChange(key, e.target.value)}
              className="w-full mt-1 border p-1 rounded"
            />
            <button
              onClick={() => handleObsSave(key)}
              className="w-full mt-2 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
            >
              Enviar
            </button>
            {enviado[key] && <p className="text-green-600 text-sm mt-1">Enviado com sucesso!</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
