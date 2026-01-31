'use client';

import { useState, useEffect } from 'react';
import { useAtendimento } from '@/hooks/useAtendimento';
import styles from '../../atendimento/Atendimento.module.css';

export default function AdminSuportePage() {
  const [view, setView] = useState<'lista' | 'chat'>('lista');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const { fetchData, sendReply, data, loading } = useAtendimento();

  // Credenciais do Admin guardadas no login
  const ra = typeof window !== 'undefined' ? localStorage.getItem('admin_ra') || '' : '';
  const pass = typeof window !== 'undefined' ? localStorage.getItem('admin_pass') || '' : '';

  useEffect(() => {
    if (ra && pass) fetchData(ra, pass, '42/tickets/list_all');
  }, []);

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).message;
    // No Admin, o sendReply envia a mensagem como suporte
    const success = await sendReply(ra, pass, selectedTicket.id, input.value);
    if (success) {
      input.value = '';
      const updated = await fetchData(ra, pass, '42/tickets/list_all');
      const current = updated.find((t: any) => t.id === selectedTicket.id);
      setSelectedTicket(current);
    }
  };

  return (
    <main className="min-h-screen pt-10 bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Central de Chamados</h1>
            <p className="text-sm text-slate-500">Gerencie as dúvidas dos alunos da Afulink</p>
          </div>
          {view === 'chat' && (
            <button onClick={() => setView('lista')} className="bg-slate-200 px-4 py-2 rounded-lg font-bold text-xs uppercase">Voltar à Lista</button>
          )}
        </header>

        {view === 'lista' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Aluno</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Assunto</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Data</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((ticket: any) => (
                  <tr key={ticket.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                    <td className="p-4">
                      <p className="font-bold text-sm text-slate-700">{ticket.student_name}</p>
                      <p className="text-[10px] text-slate-400">RA: {ticket.student_ra}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-sm text-slate-600">{ticket.title}</p>
                      <p className="text-[10px] text-orange-500 font-bold uppercase">{ticket.category}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${ticket.status === 'Aberto' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => { setSelectedTicket(ticket); setView('chat'); }}
                        className="bg-[#003366] text-white px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-black transition"
                      >
                        Responder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'chat' && selectedTicket && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="bg-slate-800 p-4 text-white">
              <h3 className="font-bold">Chat com {selectedTicket.student_name}</h3>
              <p className="text-[10px] opacity-60">Ticket #{selectedTicket.id} - {selectedTicket.title}</p>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
              {selectedTicket.messages.map((msg: any, i: number) => {
                const isStudent = msg.sender_id !== 999; // Lógica: se o ID não for do suporte, é aluno
                return (
                  <div key={i} className={`max-w-[70%] ${isStudent ? 'self-start' : 'self-end'}`}>
                    <div className={`p-3 rounded-xl text-sm ${isStudent ? 'bg-white border border-slate-200 text-slate-700' : 'bg-[#003366] text-white'}`}>
                      {msg.content}
                    </div>
                    <p className="text-[9px] mt-1 text-slate-400 font-bold">{isStudent ? 'ALUNO' : 'SUPORTE'}</p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAdminReply} className="p-4 border-t flex gap-2">
              <input name="message" type="text" placeholder="Digite a resposta oficial..." className="flex-1 border rounded-lg px-4 py-2 outline-none focus:border-orange-500" required />
              <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold text-sm">ENVIAR</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}