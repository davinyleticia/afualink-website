'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MensageriaPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]); 
  const [isLote, setIsLote] = useState(false);
  
  // ESTADO ALTERADO: Agora é um Array de e-mails
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(''); // Controla o texto do input
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    message: '',
    signature: 'Atenciosamente, Letícia Vidal - Afulink',
    canReply: true
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/42/login');
      return;
    }

    const fetchUsers = async () => {
      const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/users-messaging/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    };
    fetchUsers();
  }, [token, router]);

  // FUNÇÃO PARA ADICIONAR E-MAIL À LISTA
  const addEmail = (email: string) => {
    const cleanEmail = email.trim();
    if (cleanEmail && !selectedEmails.includes(cleanEmail)) {
      setSelectedEmails([...selectedEmails, cleanEmail]);
      setInputValue(''); // Limpa o campo
    }
  };

  // FUNÇÃO PARA REMOVER E-MAIL DA LISTA
  const removeEmail = (emailToRemove: string) => {
    setSelectedEmails(selectedEmails.filter(e => e !== emailToRemove));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const recipients = isLote ? users.map(u => u.email) : selectedEmails;

    if (recipients.length === 0) {
      alert("Selecione ao menos um destinatário.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/send-messenger', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, recipients })
      });

      if (res.ok) {
        alert("✅ Mensagens disparadas com sucesso!");
        setForm({ ...form, subject: '', message: '' });
        setSelectedEmails([]); // Limpa os e-mails após o envio
      } else {
        alert("❌ Erro ao enviar.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-34 bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#003366] p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Central de Mensageria</h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-1">Envio Interno e Externo</p>
          </div>
          <div className="flex bg-blue-900/50 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setIsLote(false)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${!isLote ? 'bg-orange-500' : 'hover:text-orange-400'}`}
            >
              Individual / Grupo
            </button>
            <button 
              type="button"
              onClick={() => setIsLote(true)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${isLote ? 'bg-orange-500' : 'hover:text-orange-400'}`}
            >
              Lote ({users.length})
            </button>
          </div>
        </div>

        <form onSubmit={handleSend} className="p-8 space-y-6">
          
          {/* SELEÇÃO DE MÚLTIPLOS E-MAILS */}
          {!isLote ? (
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Destinatários Selecionados</label>
              
              {/* ÁREA DE TAGS */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedEmails.map(email => (
                  <span key={email} className="bg-orange-100 text-[#003366] px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 border border-orange-200 animate-in fade-in zoom-in duration-300">
                    {email}
                    <button 
                      type="button" 
                      onClick={() => removeEmail(email)}
                      className="hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {selectedEmails.length === 0 && (
                  <span className="text-[10px] text-slate-300 font-bold uppercase italic italic">Nenhum e-mail selecionado...</span>
                )}
              </div>

              <input 
                list="users-datalist"
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm transition-all"
                placeholder="Busque pelo nome ou digite e aperte Enter..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // Se o valor selecionado existir na lista de usuários, adiciona automaticamente
                  const matchedUser = users.find(u => u.email === e.target.value);
                  if (matchedUser) addEmail(matchedUser.email);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addEmail(inputValue);
                  }
                }}
              />
              <datalist id="users-datalist">
                {users.map(u => (
                  <option key={u.id} value={u.email}>{u.name}</option>
                ))}
              </datalist>
            </div>
          ) : (
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
              <span className="text-xl">📢</span>
              <p className="text-[10px] font-black text-orange-700 uppercase">O e-mail será enviado para todos os {users.length} usuários ativos do banco.</p>
            </div>
          )}

          {/* RESTO DO FORMULÁRIO */}
          <input 
            type="text" required placeholder="Assunto da Mensagem"
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm font-bold"
            value={form.subject}
            onChange={(e) => setForm({...form, subject: e.target.value})}
          />

          <textarea 
            required placeholder="Escreva sua mensagem aqui..."
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm min-h-[200px]"
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
          />

          <input 
            type="text" placeholder="Assinatura"
            className="w-full p-4 bg-slate-100 rounded-2xl text-slate-500 italic text-sm border-none"
            value={form.signature}
            onChange={(e) => setForm({...form, signature: e.target.value})}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                className="w-5 h-5 accent-orange-500 rounded"
                checked={form.canReply}
                onChange={(e) => setForm({...form, canReply: e.target.checked})}
              />
              <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-slate-600 transition">Permitir Resposta (Reply-to)</span>
            </label>

            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-[#003366] hover:bg-orange-500 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processando Disparo...' : `Disparar para ${isLote ? users.length : selectedEmails.length} pessoas`}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}