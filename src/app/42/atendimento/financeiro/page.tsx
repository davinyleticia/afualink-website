'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, DollarSign, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import styles from '../../../atendimento/Atendimento.module.css';

export default function AdminFinanceiro() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  // Ajustado para os campos reais do seu Model Finance: user_id (RA), amount, transaction_type, description
  const [form, setForm] = useState({ 
    ra_aluno: '', 
    amount: '', 
    transaction_type: 'debit', 
    description: '' 
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/42/financeiro/list_all?page=${page}&q=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Se o backend retornar o objeto com paginação
        setInvoices(data.invoices || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Erro ao buscar finanças:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, token]);

  useEffect(() => { if (token) fetchInvoices(); }, [fetchInvoices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/financeiro/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ ra_aluno: '', amount: '', transaction_type: 'debit', description: '' });
      setPage(1);
      fetchInvoices();
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 pb-20 selection:bg-green-500">
      <div className="max-w-6xl mx-auto px-4">
        
        <button 
          onClick={() => router.push('/42/dashboard')} 
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-green-700 transition-all"
        >
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LANÇAMENTO BASEADO NO SEU MODEL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className="bg-green-800 p-6 text-white text-center">
                <DollarSign className="mx-auto mb-2 text-green-300" size={28} />
                <h1 className="text-sm font-black uppercase italic tracking-tighter">Novo Lançamento</h1>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input type="text" placeholder="RA do Aluno" className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 ring-green-500" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Valor (Ex: 150.00)" className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 ring-green-500" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                <select className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 ring-green-500" value={form.transaction_type} onChange={e => setForm({...form, transaction_type: e.target.value})}>
                  <option value="debit">Débito (Cobrança)</option>
                  <option value="credit">Crédito (Pagamento)</option>
                </select>
                <textarea placeholder="Descrição da Transação" className="w-full p-4 bg-slate-50 rounded-2xl text-sm h-24 outline-none focus:ring-2 ring-green-500 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
                <button className="w-full bg-green-700 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">Registrar no Banco</button>
              </form>
            </div>
          </div>

          {/* LISTAGEM COM BUSCA E PAGINAÇÃO */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="relative group">
              <Search className="absolute left-5 top-4.5 text-slate-300 group-focus-within:text-green-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar por RA, Aluno ou Descrição..." 
                className="w-full pl-14 pr-6 py-4.5 bg-white rounded-[2rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-green-500 transition-all text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-10 text-center animate-pulse"><Loader2 className="animate-spin mx-auto text-green-600" /></td></tr>
                  ) : invoices.length > 0 ? (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="p-6">
                          <p className="font-black text-[#003366] uppercase text-xs">{inv.student_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tighter">RA: {inv.student_ra}</p>
                          <p className="text-[9px] text-slate-500 mt-1 italic">{inv.description}</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inv.transaction_type === 'credit' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                            {inv.transaction_type === 'credit' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <p className={`font-black text-sm italic ${inv.transaction_type === 'credit' ? 'text-blue-600' : 'text-slate-700'}`}>
                            R$ {Number(inv.amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold">{new Date(inv.transaction_date).toLocaleDateString()}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum registro localizado.</td></tr>
                  )}
                </tbody>
              </table>

              {/* CONTROLES DE PÁGINA */}
              <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Página {page} de {totalPages}</span>
                <div className="flex gap-2 mr-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-green-700 hover:text-white transition-all">
                    <ChevronLeft size={18} />
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-green-700 hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}