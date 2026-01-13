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

    const { fetchData, openTicket, sendReply, data, loading } = useAtendimento();

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
            {!isLogged ? (<>
                <div className={styles.authCard + " mx-auto"}>
                    <h2 className={styles.authTitle}>Suporte Afulink</h2>
                    <p className="text-center text-gray-500 text-sm mb-6">Acesse com seu RA e Senha para gerenciar seus chamados.</p>
                    <form onSubmit={handleAccess} className="flex flex-col gap-4">
                        <input type="text" placeholder="Seu RA" className={styles.inputField} onChange={e => setRa(e.target.value)} required />
                        <input type="password" placeholder="Sua Senha" className={styles.inputField} onChange={e => setPassword(e.target.value)} required />
                        <button className={styles.btnVerify} disabled={loading}>{loading ? 'Verificando...' : 'Acessar Suporte'}</button>
                    </form>
                    <hr className='w-full my-6'></hr>
                    <div className="flex items-center gap-6 py-4">

                        <div className={styles.iconBox}>📧</div>
                        <div>
                            <h3 className="font-bold text-[#003366]">Suporte para não clientes</h3>
                            <p className="text-gray-500 text-sm">suporte@afulink.com.br</p>
                        </div>
                    </div>
                </div>



            </>
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
                                    onChange={e => setFormTicket({ ...formTicket, title: e.target.value })}
                                    required
                                />
                                <select
                                    className={styles.selectField}
                                    onChange={e => setFormTicket({ ...formTicket, category: e.target.value })}
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
                                    onChange={e => setFormTicket({ ...formTicket, description: e.target.value })}
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
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] animate-in fade-in duration-300">
                            {/* Cabeçalho do Chat */}
                            <div className="bg-[#003366] p-4 text-white flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="font-bold leading-tight">{selectedTicket.title}</h3>
                                    <span className="text-[10px] opacity-70 uppercase font-bold tracking-widest">{selectedTicket.category}</span>
                                </div>
                                <button onClick={() => setView('lista')} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition">Fechar</button>
                            </div>

                            {/* Área de Mensagens */}
                            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50">
                                {selectedTicket.messages?.map((msg: any, index: number) => {
                                    // Verifica se quem enviou foi o usuário (RA logado) ou o suporte (admin)
                                    const isMe = msg.sender === selectedTicket.user_id; // Simulação: use IDs reais do seu banco

                                    return (
                                        <div key={index} className={`max-w-[85%] flex flex-col ${isMe ? 'self-end' : 'self-start'}`}>
                                            <div className={`p-3 rounded-2xl text-sm ${isMe
                                                ? 'bg-[#003366] text-white rounded-tr-none'
                                                : 'bg-white border border-slate-200 text-gray-800 rounded-tl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className={`text-[9px] mt-1 font-bold text-gray-400 uppercase ${isMe ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Campo de Resposta */}
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const input = (e.target as any).message;
                                    const success = await sendReply(ra, password, selectedTicket.id, input.value);
                                    if (success) {
                                        input.value = '';
                                        // Atualiza a lista para pegar a nova mensagem
                                        const updated = await fetchData(ra, password, 'tickets/list_tickets');
                                        // Encontra o ticket atualizado para refletir no chat aberto
                                        const current = updated.find((t: any) => t.id === selectedTicket.id);
                                        setSelectedTicket(current);
                                    }
                                }}
                                className="p-4 border-t bg-white flex gap-2"
                            >
                                <input
                                    name="message"
                                    type="text"
                                    placeholder="Escreva sua resposta..."
                                    autoComplete="off"
                                    className="flex-1 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#f37021] transition"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#f37021] text-white px-5 py-2 rounded-lg font-black text-xs uppercase tracking-tighter hover:bg-[#d95d10] transition"
                                >
                                    {loading ? '...' : 'Enviar'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}