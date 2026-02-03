'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/42/login');
      return;
    }

    // Busca os dados reais da API
    const fetchDashboard = async () => {
      try {
        const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/dashboard', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          // Opcional: Atualiza o nome no storage se mudou no banco
          localStorage.setItem('admin_name', data.user.name);
        } else {
          router.push('/42/login');
        }
      } catch (err) {
        console.error("Erro no dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // Itens do menu permanecem iguais...
  const menuItems = [
    { title: 'Suporte / Tickets', desc: 'Responder chamados', icon: '💬', path: '/42/suporte', color: 'bg-orange-500' },
    { title: 'Certificados', desc: 'Gerenciar certificados', icon: '🎓', path: '/42/atendimento/certificados', color: 'bg-blue-600' },
    { title: 'Financeiro', desc: 'Status de pagamento', icon: '💰', path: '/42/atendimento/financeiro', color: 'bg-green-600' },
    { title: 'Documentos', desc: 'Upload de declarações', icon: '📁', path: '/42/atendimento/documentos', color: 'bg-slate-700' },
    { title: 'Mensageria', desc: 'Enviar mensagens', icon: '✉️', path: '/42/atendimento/documentos', color: 'bg-blue-700' },
    { title: 'Cadastrar Biolink', desc: 'Cadastrar biolink', icon: '🔗', path: '/42/atendimento/documentos', color: 'bg-gray-100' },
    { title: 'Curso', desc: 'Cadastrar curso', icon: '🎓', path: '/42/atendimento/documentos', color: 'bg-slate-100' },
    { title: 'Ementa', desc: 'Cadastrar ementa', icon: '📋', path: '/42/atendimento/documentos', color: 'bg-blue-700' }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100 font-bold text-slate-400">CARREGANDO PAINEL...</div>;

  return (
    <main className="min-h-screen pt-4 bg-slate-50">
      {/* Header Adm */}
      <div className="bg-[#003366] text-white py-16 px-6 pt-24">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-orange-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Sessão Administrativa</p>
            <h1 className="text-3xl font-black italic">Olá, {stats?.user.name}</h1>
          </div>
          <button 
            onClick={() => { localStorage.clear(); router.push('/42/login'); }}
            className="text-[10px] bg-white/10 hover:bg-red-500 px-6 py-2 rounded-full font-black transition-all uppercase tracking-widest"
          >
            Sair do Sistema
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        {/* Grid de Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, idx) => (
            <button key={idx} onClick={() => router.push(item.path)} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-start hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition`}>{item.icon}</div>
              <h3 className="font-bold text-[#003366] text-lg">{item.title}</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* STATUS REAL VINDO DA API */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-gray-400 font-black text-[9px] uppercase tracking-widest">Total de Alunos</h4>
            <p className="text-4xl font-black text-[#003366] mt-2">{stats?.total_users}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-orange-500 font-black text-[9px] uppercase tracking-widest">Chamados Abertos</h4>
            <p className="text-4xl font-black text-orange-500 mt-2">{stats?.open_tickets}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-green-600 font-black text-[9px] uppercase tracking-widest">Chamados Resolvidos</h4>
            <p className="text-4xl font-black text-green-600 mt-2">{stats?.closed_tickets}</p>
          </div>
          <div className="bg-[#003366] p-6 rounded-3xl shadow-lg shadow-blue-900/20">
            <h4 className="text-blue-300 font-black text-[9px] uppercase tracking-widest">Seu Perfil</h4>
            <p className="text-white font-black mt-2 text-sm uppercase italic">{stats?.user.role}</p>
            <p className="text-blue-200 text-[10px] font-mono mt-1 opacity-70">RA: {stats?.user.ra}</p>
          </div>
        </div>
      </div>
    </main>
  );
}