// Projeto Next.js completo com Firebase para o Missão 60 Dias
// Funcionalidades: Login por e-mail, calendário 14/04 a 14/06, ✔️❌ treino/dieta/água, observações, gráfico, painel admin
// A estrutura segue pages-based routing, pronta para Vercel

// Estrutura:
// - pages/index.js: login + redirecionamento
// - pages/dashboard.js: calendário com registros
// - pages/admin.js: painel administrativo
// - lib/firebase.js: config Firebase
// - components: CalendarGrid, Tracker, WeeklyChart, etc.

// Começando a inserção dos arquivos agora... (em andamento)

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Missão 60 Dias</h1>
        <p className="text-lg text-gray-700">Carregando aplicação...</p>
      </div>
    </main>
  );
} // Próximo passo: inserir login, Firebase, dashboard e painel admin
