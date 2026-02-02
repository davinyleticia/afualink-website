'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // 1. Busca o token e o nome salvos no login
    const token = localStorage.getItem('admin_token');
    const name = localStorage.getItem('admin_name');

    // 2. Proteção de Rota: Se não houver token, volta para o login
    if (!token) {
      router.push('/42/login');
      return;
    }

    setAdminName(name || 'Administrador');
  }, [router]);

  const menuItems = [
    {
      title: 'Suporte / Tickets',
      desc: 'Responder chamados e gerenciar conversas',
      icon: '💬',
      path: '/42/suporte',
      color: 'bg-orange-500'
    },
    {
      title: 'Certificados',
      desc: 'Cadastrar e excluir certificados de alunos',
      icon: '🎓',
      path: '/42/atendimento/certificados',
      color: 'bg-blue-600'
    },
    {
      title: 'Financeiro / Boletos',
      desc: 'Gerenciar faturas e status de pagamento',
      icon: '💰',
      path: '/42/atendimento/financeiro',
      color: 'bg-green-600'
    },
    {
      title: 'Documentos',
      desc: 'Upload de declarações e documentos gerais',
      icon: '📁',
      path: '/42/atendimento/documentos',
      color: 'bg-slate-700'
    }
  ];

  return (
    <main className="min-h-screen pt-10 bg-slate-100 p-4">
      {/* Header Adm */}
      <div className="bg-[#003366] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-orange-400 font-bold text-xs uppercase tracking-widest">Painel de Controle</p>
            <h1 className="text-3xl font-black italic">Olá, {adminName}</h1>
          </div>
          <button 
            onClick={() => { 
              // Limpa tudo ao sair
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_name');
              router.push('/42/login'); 
            }}
            className="text-xs bg-red-500/20 hover:bg-red-500 px-4 py-2 rounded font-bold transition"
          >
            Sair do Sistema
          </button>
        </div>
      </div>

      {/* Grid de Ações */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-start text-left hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-[#003366] text-lg">{item.title}</h3>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
              <div className="mt-6 text-[10px] font-black text-gray-300 group-hover:text-orange-500 transition uppercase">
                Acessar Módulo ➔
              </div>
            </button>
          ))}
        </div>

        {/* Status Rápido - No futuro você fará um fetch aqui para dados reais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="text-gray-400 font-bold text-[10px] uppercase">Chamados em Aberto</h4>
            <p className="text-3xl font-black text-[#003366]">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="text-gray-400 font-bold text-[10px] uppercase">Certificados Emitidos (Mês)</h4>
            <p className="text-3xl font-black text-[#003366]">154</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="text-gray-400 font-bold text-[10px] uppercase">Boletos Vencendo Hoje</h4>
            <p className="text-3xl font-black text-orange-500">5</p>
          </div>
        </div>
      </div>
    </main>
  );
}