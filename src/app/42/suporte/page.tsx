'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtendimento } from '@/hooks/useAtendimento';
import styles from '../../atendimento/Atendimento.module.css';

export default function AdminSuportePage() {
  const router = useRouter();
  const [view, setView] = useState<'lista' | 'chat'>('lista');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const { fetchData, sendReply, data, loading, error } = useAtendimento();

  // Pegamos o Token gerado no Login do Admin
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/42/login');
      return;
    }
    // Carrega todos os tickets usando o token
    fetchDataWithToken();
  }, [token]);

  const fetchDataWithToken = async () => {
    // Aqui usamos o fetch padrão pois o hook precisaria ser adaptado para GET + JWT
    const res = await fetch('https://serverless-tau-green.vercel.app/customer_service/42/tickets/list_all', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (res.ok) setSelectedTicket(null); // Limpa seleção ao atualizar
  };

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).message;
    
    const res = await fetch('https://serverless-tau-green.vercel.app/customer_service/42/tickets/reply', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ ticket_id: selectedTicket.id, content: input.value })
    });

    if (res.ok) {
      input.value = '';
      // Recarrega os dados do ticket específico
      const updatedList = await (await fetch('https://serverless-tau-green.vercel.app/customer_service/42/tickets/list_all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })).json();
      
      const current = updatedList.find((t: any) => t.id === selectedTicket.id);
      setSelectedTicket(current);
    }
  };

  const closeTicket = async (id: number) => {
    if (!confirm("Deseja realmente encerrar este chamado?")) return;
    
    await fetch('https://serverless-tau-green.vercel.app/customer_service/42/tickets/close', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ ticket_id: id })
    });
    setView('lista');
    fetchDataWithToken();
  };

  return (
    <main className="min-h-screen pt-10 bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header igual ao anterior, mas com o botão de fechar no Chat */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Central de Chamados</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Painel 42 • Gerenciamento</p>
          </div>
          {view === 'chat' && (
             <div className="flex gap-2">
                <button onClick={() => closeTicket(selectedTicket.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase">Encerrar Ticket</button>
                <button onClick={() => setView('lista')} className="bg-slate-200 px-4 py-2 rounded-lg font-bold text-[10px] uppercase text-slate-600">Voltar</button>
             </div>
          )}
        </header>

        {/* Listagem de Tickets (Tabela) */}
        {view === 'lista' && (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Reaproveite o <table> do seu código original aqui */}
           </div>
        )}

        {/* Chat de Suporte */}
        {view === 'chat' && selectedTicket && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[650px] animate-in fade-in duration-300">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{selectedTicket.student_name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{selectedTicket.id} — {selectedTicket.title}</p>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${selectedTicket.status === 'Aberto' ? 'bg-orange-500' : 'bg-green-600'}`}>
                {selectedTicket.status}
              </span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-[#f8fafc] flex flex-col gap-6">
              {/* O mapeamento de mensagens isStudent permanece igual ao que você já tem */}
            </div>

            {selectedTicket.status !== 'Concluído' ? (
              <form onSubmit={handleAdminReply} className="p-4 border-t bg-white flex gap-3">
                <input name="message" type="text" placeholder="Escreva a resposta oficial da Afulink..." className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#f37021] transition-all" required />
                <button type="submit" className="bg-[#f37021] text-white px-8 py-2 rounded-xl font-bold text-xs uppercase hover:bg-[#003366] transition-all">Enviar</button>
              </form>
            ) : (
              <div className="p-6 bg-slate-50 text-center border-t">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Este chamado foi encerrado e não aceita novas respostas.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}