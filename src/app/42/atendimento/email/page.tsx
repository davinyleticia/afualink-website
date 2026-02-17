'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button/Button';

export default function MensageriaPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]); 
  const [isLote, setIsLote] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
    subject: '',
    message: '',
    signature: 'Atenciosamente, Letícia Vidal - Afulink',
    canReply: true
  });

  // Recupera o token de forma segura
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/42/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/users-messaging/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setUsers(await res.json());
      } catch (err) {
        console.error("Erro ao carregar lista de usuários:", err);
      }
    };
    fetchUsers();
  }, [token, router]);

  const addEmail = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (cleanEmail && emailRegex.test(cleanEmail) && !selectedEmails.includes(cleanEmail)) {
      setSelectedEmails([...selectedEmails, cleanEmail]);
      setInputValue('');
      setStatusMessage({ type: '', text: '' });
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setSelectedEmails(selectedEmails.filter(e => e !== emailToRemove));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const recipients = isLote ? users.map(u => u.email) : selectedEmails;

    if (recipients.length === 0) {
      setStatusMessage({ type: 'error', text: 'Selecione ao menos um destinatário válido.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Processando disparo de e-mails...' });

    try {
      const res = await fetch('/api/send-messenger', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ ...form, recipients })
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ type: 'success', text: `✅ Sucesso! ${recipients.length} e-mail(s) enviados.` });
        setForm({ ...form, subject: '', message: '' });
        setSelectedEmails([]);
      } else {
        setStatusMessage({ type: 'error', text: `❌ Erro: ${data.error}` });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: '❌ Falha crítica na comunicação com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-34 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden mb-10">
        
        {/* HEADER DINÂMICO */}
        <div className="bg-[#003366] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Central de Mensageria</h1>
            
          </div>
          
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
            <button 
              type="button"
              onClick={() => { setIsLote(false); setStatusMessage({type:'', text:''}); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${!isLote ? 'bg-orange-500 text-white shadow-lg' : 'text-blue-200 hover:text-white'}`}
            >
              Individual
            </button>
            <button 
              type="button"
              onClick={() => { setIsLote(true); setStatusMessage({type:'', text:''}); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isLote ? 'bg-orange-500 text-white shadow-lg' : 'text-blue-200 hover:text-white'}`}
            >
              Lote ({users.length})
            </button>
          </div>
        </div>

        <form onSubmit={handleSend} className="p-8 space-y-6">
          
          {/* GESTÃO DE DESTINATÁRIOS */}
          {!isLote ? (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
                Destinatários ({selectedEmails.length})
              </label>
              
              <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                {selectedEmails.map(email => (
                  <span key={email} className="bg-[#003366] text-white px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 hover:bg-orange-500 transition-colors">
                    {email}
                    <button type="button" onClick={() => removeEmail(email)} className="text-orange-400 hover:text-white">✕</button>
                  </span>
                ))}
                {selectedEmails.length === 0 && <span className="text-slate-300 text-[10px] font-bold uppercase italic">Aguardando seleção...</span>}
              </div>

              <input 
                list="users-datalist"
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm transition-all shadow-inner"
                placeholder="Busque pelo nome ou digite e dê Enter..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  const matchedUser = users.find(u => u.email.toLowerCase() === e.target.value.toLowerCase());
                  if (matchedUser) addEmail(matchedUser.email);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addEmail(inputValue); }
                }}
              />
              <datalist id="users-datalist">
                {users.map(u => <option key={u.id} value={u.email}>{u.name}</option>)}
              </datalist>
            </div>
          ) : (
            <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-200 flex items-center gap-4 animate-in zoom-in duration-300">
              <div className="text-3xl">📢</div>
              <div>
                <p className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Modo Transmissão Ativado</p>
                <p className="text-sm font-bold text-[#003366]">Esta mensagem será entregue para {users.length} usuários.</p>
              </div>
            </div>
          )}

          {/* CAMPOS DE MENSAGEM */}
          <div className="space-y-4">
            <input 
              type="text" required placeholder="ASSUNTO"
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm font-black text-[#003366] uppercase tracking-tight shadow-inner"
              value={form.subject}
              onChange={(e) => setForm({...form, subject: e.target.value})}
            />

            <textarea 
              required placeholder="ESCREVA SUA MENSAGEM..."
              className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-[2rem] text-sm min-h-[220px] shadow-inner leading-relaxed"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
            />

            <input 
              type="text" placeholder="ASSINATURA"
              className="w-full p-4 bg-slate-100 rounded-2xl text-slate-400 italic text-xs border-none tracking-wide"
              value={form.signature}
              onChange={(e) => setForm({...form, signature: e.target.value})}
            />
          </div>

          {/* FEEDBACK E AÇÕES */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                className="w-6 h-6 accent-orange-500 rounded-lg cursor-pointer"
                checked={form.canReply}
                onChange={(e) => setForm({...form, canReply: e.target.checked})}
              />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#003366] transition">Permitir Resposta</span>
            </label>

            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              {statusMessage.text && (
                <p className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg mb-2 ${
                  statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 
                  statusMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {statusMessage.text}
                </p>
              )}
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#003366] hover:bg-orange-500 text-white px-16 py-5 rounded-2xl font-black uppercase text-xs transition-all shadow-xl disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Disparando...' : `Disparar para ${isLote ? users.length : selectedEmails.length} Alunos`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}