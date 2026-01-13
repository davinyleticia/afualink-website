'use client';

import { useState } from 'react';
import { useAtendimento } from '@/hooks/useAtendimento';
import styles from '../Atendimento.module.css';

export default function SuportePage() {
  const [isLogged, setIsLogged] = useState(false);
  const [view, setView] = useState<'lista' | 'chat' | 'novo'>('lista');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  // Estados de Login
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');

  // Estado para o formulário de novo ticket
  const [formTicket, setFormTicket] = useState({ title: '', category: '', description: '' });
  
  const { fetchData, openTicket, data, loading } = useAtendimento();

  // Função de Login/Acesso
  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await fetchData(ra, password, 'tickets/list_tickets');
    if (result) setIsLogged(true);
  };

  // Função para enviar o novo ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enviamos os dados do ticket + credenciais para o backend identificar o autor
    const success = await openTicket({ ...formTicket, ra, password });
    if (success) {
      setView('lista');
      fetchData(ra, password, 'tickets/list_tickets'); // Recarrega a lista
    }
  };

  return (
    <main className="min-h-screen pt-32 bg-slate-50 p-4">
      {!isLogged ? (
        <div className={styles.authCard + " mx-auto"}>
          <h2 className={styles.authTitle}>Suporte Afulink</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Acesse com seu RA e Senha para gerenciar seus chamados.</p>
          <form onSubmit={handleAccess} className="flex flex-col gap-4">
            <input type="text" placeholder="Seu RA" className={styles.inputField} onChange={e => setRa(e.target.value)} required />
            <input type="password" placeholder="Sua Senha" className={styles.inputField} onChange={e => setPassword(e.target.value)} required />
            <button className={styles.btnVerify} disabled={loading}>{loading ? 'Verificando...' : 'Acessar Suporte'}</button>
          </form>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#003366]">
              {view === 'novo' ? 'Novo Chamado' : view === 'chat' ? 'Conversa' : 'Meus Chamados'}
            </h2>
            {view === 'lista' && (
              <button 
                onClick={() => setView('novo')} 
                className="bg-[#28a745] text-white px-4 py-2 rounded-lg font-bold text-sm"
              >
                + Novo Ticket
              </button>
            )}
            {view !== 'lista' && (
              <button onClick={() => setView('lista')} className="text-sm text-gray-500 font-bold underline">Voltar</button>
            )}
          </div>

          {/* 1. LISTA DE TICKETS */}
          {view === 'lista' && (
            <div className="grid gap-4">
              {Array.isArray(data) && data.length > 0 ? data.map((ticket: any) => (
                <div 
                  key={ticket.id} 
                  onClick={() => { setSelectedTicket(ticket); setView('chat'); }}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center cursor-pointer hover:border-[#f37021] transition"
                >
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">#{ticket.id}</span>
                    <h4 className="font-bold text-[#003366]">{ticket.title}</h4>
                    <p className="text-xs text-gray-500">{ticket.category} • Criado em {new Date(ticket.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${ticket.status === 'Aberto' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    {ticket.status}
                  </span>
                </div>
              )) : <p className="text-center text-gray-400">Nenhum ticket encontrado.</p>}
            </div>
          )}

          {/* 2. FORMULÁRIO DE NOVO TICKET */}
          {view === 'novo' && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Assunto do chamado" 
                  className={styles.inputField}
                  onChange={e => setFormTicket({...formTicket, title: e.target.value})}
                  required 
                />
                <select 
                  className={styles.selectField}
                  onChange={e => setFormTicket({...formTicket, category: e.target.value})}
                  required
                >
                  <option value="">Selecione o Setor</option>
                  <option value="Suporte">Suporte Técnico</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Comercial">Comercial</option>
                </select>
                <textarea 
                  placeholder="Descreva seu problema..." 
                  className={styles.inputField} 
                  rows={5}
                  onChange={e => setFormTicket({...formTicket, description: e.target.value})}
                  required 
                />
                <button className={styles.btnVerify + " bg-[#28a745]"} disabled={loading}>
                  {loading ? 'Enviando...' : 'Abrir Chamado'}
                </button>
              </form>
            </div>
          )}

          {/* 3. INTERFACE DE CHAT */}
          {view === 'chat' && selectedTicket && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-[#003366] p-4 text-white">
                <h3 className="font-bold">{selectedTicket.title}</h3>
              </div>
              <div className="h-96 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50">
                 {/* Aqui você faria um map nas mensagens reais vindo do backend */}
                 <div className="self-end bg-[#003366] text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                  {selectedTicket.description || "Mensagem inicial do ticket."}
                </div>
              </div>
              <div className="p-4 border-t flex gap-2">
                <input type="text" placeholder="Escreva sua resposta..." className="flex-1 border rounded-lg px-4 py-2 outline-none" />
                <button className="bg-[#f37021] text-white px-6 py-2 rounded-lg font-bold">Enviar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}