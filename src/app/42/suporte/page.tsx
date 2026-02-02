'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../atendimento/Atendimento.module.css';

export default function AdminSuportePage() {
  const router = useRouter();
  const [view, setView] = useState<'lista' | 'chat'>('lista');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Recupera o Token salvo no login para usar nas chamadas
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  // 1. Função para carregar todos os tickets do sistema
  const fetchAllTickets = async () => {
    if (!token) {
      router.push('/42/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/tickets/list_all', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data);
      } else {
        // Se o token expirou ou for inválido, volta para o login
        router.push('/42/login');
      }
    } catch (err) {
      console.error("Erro ao carregar tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  // 2. Função para o Admin enviar uma resposta
  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).message;
    const content = input.value;

    try {
      const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/tickets/reply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticket_id: selectedTicket.id, content })
      });

      if (res.ok) {
        input.value = '';
        // Atualiza a lista geral e o ticket selecionado para mostrar a nova mensagem
        await fetchAllTickets();
        // Opcional: recarregar o selectedTicket aqui se necessário
      }
    } catch (err) {
      alert("Erro ao enviar resposta.");
    }
  };

  return (
    <main className="min-h-screen pt-34 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Central de Chamados</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Painel 42 • Gestão de Alunos</p>
          </div>
          {view === 'chat' && (
            <button 
              onClick={() => setView('lista')} 
              className="bg-slate-200 px-4 py-2 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition"
            >
              Voltar à Lista
            </button>
          )}
        </header>

        {/* LISTA DE TICKETS */}
        {view === 'lista' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Aluno</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Assunto</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-bold animate-pulse">CARREGANDO CHAMADOS...</td></tr>
                ) : tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                    <td className="p-4">
                      <p className="font-bold text-sm text-slate-700">{ticket.student_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">RA: {ticket.student_ra}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-sm text-slate-600 leading-tight">{ticket.title}</p>
                      <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">{ticket.category}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${ticket.status === 'Aberto' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => { setSelectedTicket(ticket); setView('chat'); }}
                        className="bg-[#003366] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-black transition"
                      >
                        Atender
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* INTERFACE DE CHAT (RESPOSTA) */}
        {view === 'chat' && selectedTicket && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[650px] animate-in fade-in duration-300">
            <div className="bg-slate-900 p-5 text-white">
              <h3 className="font-bold text-lg">{selectedTicket.student_name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{selectedTicket.title}</p>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-[#f8fafc] flex flex-col gap-6">
              {selectedTicket.messages?.map((msg: any, i: number) => {
                // Lógica: se o sender_id for diferente do suporte (ex: 999), é aluno
                const isStudent = msg.sender_id !== 999; 
                return (
                  <div key={i} className={`max-w-[75%] ${isStudent ? 'self-start' : 'self-end'}`}>
                    <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                      isStudent 
                        ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                        : 'bg-[#003366] text-white rounded-tr-none'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[9px] mt-2 font-bold text-slate-400 uppercase ${isStudent ? '' : 'text-right'}`}>
                      {isStudent ? 'Mensagem do Aluno' : 'Resposta Suporte'} • {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAdminReply} className="p-4 border-t bg-white flex gap-2">
              <input 
                name="message" 
                type="text" 
                placeholder="Digite a resposta oficial da Afulink..." 
                className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-all" 
                required 
              />
              <button 
                type="submit" 
                className="bg-orange-500 text-white px-8 py-2 rounded-xl font-bold text-xs uppercase hover:bg-slate-800 transition-all shadow-lg"
              >
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}