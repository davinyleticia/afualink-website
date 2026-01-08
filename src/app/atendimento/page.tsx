'use client';

import { useState } from 'react';
import { useAtendimento } from '@/hooks/useAtendimento';
import styles from './Atendimento.module.css';

const AtendimentoPage = () => {
  const [view, setView] = useState<'login' | 'results' | 'new-ticket'>('login');
  const [formAuth, setFormAuth] = useState({ servico: '', identification: '', password: '' });
  const [formTicket, setFormTicket] = useState({ email: '', titulo: '', setor: '', descricao: '' });
  
  const { fetchData, openTicket, data, loading } = useAtendimento();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchData(formAuth.identification, formAuth.password, formAuth.servico);
    setView('results');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await openTicket(formTicket);
    if (success) setView('login');
  };

  return (
    <main className="min-h-screen pt-24 bg-slate-50 flex items-center justify-center p-4">
      
      {/* TELA 1: LOGIN / ESCOLHA */}
      {view === 'login' && (
        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>Área de Atendimento</h2>
          <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-lg">
            <button className="flex-1 py-2 rounded-md bg-white shadow-sm text-[#003366] font-bold text-sm">Consultar</button>
            <button onClick={() => setView('new-ticket')} className="flex-1 py-2 text-gray-500 text-sm font-medium">Abrir Chamado</button>
          </div>
          
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
             <select className={styles.selectField} onChange={e => setFormAuth({...formAuth, servico: e.target.value})} required>
                <option value="">O que deseja consultar?</option>
                <option value="tickets/list">Meus Tickets Abertos</option>
                <option value="documentos">Documentos / Certificados</option>
                <option value="financeiro">Financeiro</option>
             </select>
             <input type="text" placeholder="RA ou RC" className={styles.inputField} onChange={e => setFormAuth({...formAuth, identification: e.target.value})} required />
             <input type="password" placeholder="Password" className={styles.inputField} onChange={e => setFormAuth({...formAuth, password: e.target.value})} required />
             <button className={styles.btnVerify} disabled={loading}>{loading ? 'Verificando...' : 'Entrar'}</button>
          </form>
        </div>
      )}

      {/* TELA 2: FORMULÁRIO DE NOVO TICKET */}
      {view === 'new-ticket' && (
        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>Abrir Novo Chamado</h2>
          <form onSubmit={handleCreateTicket} className="flex flex-col gap-4">
            <input type="email" placeholder="Seu e-mail cadastrado" className={styles.inputField} onChange={e => setFormTicket({...formTicket, email: e.target.value})} required />
            <input type="text" placeholder="Título do Problema" className={styles.inputField} onChange={e => setFormTicket({...formTicket, titulo: e.target.value})} required />
            <select className={styles.selectField} onChange={e => setFormTicket({...formTicket, setor: e.target.value})} required>
              <option value="">Selecione o Setor</option>
              <option value="suporte">Suporte Técnico</option>
              <option value="financeiro">Financeiro</option>
              <option value="comercial">Comercial</option>
            </select>
            <textarea placeholder="Descrição detalhada..." className={styles.inputField} rows={4} onChange={e => setFormTicket({...formTicket, descricao: e.target.value})} required />
            <div className="flex gap-3">
              <button type="button" onClick={() => setView('login')} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">Cancelar</button>
              <button type="submit" className="flex-[2] bg-[#28a745] text-white py-3 rounded-lg font-bold" disabled={loading}>
                {loading ? 'Enviando...' : 'Abrir Ticket'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TELA 3: LISTAGEM (RESULTADOS) */}
      {view === 'results' && data && (
        <div className="w-full max-w-4xl animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[#003366] text-3xl font-bold">Histórico / Resultados</h2>
            <button onClick={() => setView('login')} className="text-[#f37021] font-bold underline">Voltar</button>
          </div>
          
          <div className="space-y-4">
            {data.itens?.map((item: {status: string, id?: number, titulo?: string, nome?: string, descricao?: string, data?: string}, i: number) => (
              <div key={i} className={styles.resultItem}>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase">#{item.id || i+1}</span>
                  <h4 className="font-bold text-[#003366] text-lg">{item.titulo || item.nome}</h4>
                  <p className="text-sm text-gray-500">{item.descricao || item.data}</p>
                </div>
                <div className="text-right">
                  <span className={`${styles.statusBadge} ${item.status === 'Aberto' ? styles.bgOrange : styles.bgGreen}`}>
                    {item.status || 'Concluído'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default AtendimentoPage;