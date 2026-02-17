'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, DollarSign, ArrowLeft, Trash2, Loader2, Save, TrendingDown, TrendingUp, Edit2, X } from 'lucide-react';

export default function AdminFinanceiro() {
  const router = useRouter();
  
  // Estados de Dados
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de UI
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ 
    ra_aluno: '', 
    amount: '', 
    transaction_type: 'debit', 
    description: '' 
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const API_BASE = 'https://serverless-tau-green.vercel.app/api/customer-service/42/financeiro';

  // --- BUSCAR DADOS ---
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list_all?page=${page}&q=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.invoices || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Erro financeiro:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, token]);

  useEffect(() => { if (token) fetchInvoices(); }, [fetchInvoices]);

  // --- SUBMIT: ADD OU UPDATE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/update/${editingId}` : `${API_BASE}/add`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        cancelEditing();
        fetchInvoices();
      } else {
        const err = await res.json();
        alert(err.message || "Erro na operação");
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number, desc: string) => {
    if (!confirm(`Excluir lançamento: "${desc}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchInvoices();
    } catch (err) {
      alert("Erro ao excluir");
    }
  };

  // --- FUNÇÕES DE AUXÍLIO ---
  const startEditing = (inv: any) => {
    setEditingId(inv.id);
    setForm({
      ra_aluno: inv.student_ra.toString(),
      amount: inv.amount.toString(),
      transaction_type: inv.transaction_type,
      description: inv.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ ra_aluno: '', amount: '', transaction_type: 'debit', description: '' });
  };

  return (
<main className="min-h-screen pt-28 bg-slate-50 selection:bg-orange-500">
      <div className="max-w-[1400px] mx-auto px-4 space-y-8">
        
        <button onClick={() => router.push('/42/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-green-700 transition-all">
          <ArrowLeft size={14} /> Painel Administrativo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA 1: FORMULÁRIO (ADD/EDIT) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className={`p-6 text-white text-center transition-colors duration-500 ${editingId ? 'bg-[#003366]' : 'bg-green-700'}`}>
                {editingId ? <Edit2 className="mx-auto mb-2 opacity-50" size={24} /> : <DollarSign className="mx-auto mb-2 opacity-50" size={24} />}
                <h1 className="text-sm font-black uppercase italic tracking-tighter">
                  {editingId ? 'Editar Lançamento' : 'Novo Lançamento'}
                </h1>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">RA do Aluno</label>
                  <input type="text" required className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-green-600 outline-none rounded-2xl text-sm font-bold shadow-inner" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Valor (R$)</label>
                  <input type="number" step="0.01" required className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-green-600 outline-none rounded-2xl text-sm font-bold shadow-inner" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tipo</label>
                  <select className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-green-600 outline-none rounded-2xl text-sm font-bold shadow-inner appearance-none" value={form.transaction_type} onChange={e => setForm({...form, transaction_type: e.target.value})}>
                    <option value="debit">Débito (Cobrança)</option>
                    <option value="credit">Crédito (Pagamento)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição</label>
                  <textarea required className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-green-600 outline-none rounded-2xl text-sm h-24 resize-none shadow-inner" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="flex gap-3">
                  {editingId && (
                    <button type="button" onClick={cancelEditing} className="flex-1 bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center">
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" disabled={loading} className={`flex-[3] text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-[#003366]' : 'bg-green-700'}`}>
                    <Save size={18} /> {editingId ? 'Atualizar' : 'Registrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-5 text-slate-300 group-focus-within:text-green-600 transition-colors" size={20} />
              <input type="text" placeholder="Pesquisar por RA ou Aluno..." className="w-full pl-16 pr-8 py-5 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-green-500 transition-all text-sm font-medium" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-green-600" size={40} /></td></tr>
                  ) : invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="p-6">
                        <p className="font-black text-[#003366] uppercase text-sm italic">{inv.student_name}</p>
                        <p className="text-[10px] font-mono text-slate-400">RA: {inv.student_ra}</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-medium">{inv.description}</p>
                      </td>
                      <td className="p-6 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inv.transaction_type === 'credit' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                          {inv.transaction_type === 'credit' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                          {inv.transaction_type === 'credit' ? 'Crédito' : 'Débito'}
                        </div>
                      </td>
                      <td className="p-6 text-right space-x-2 whitespace-nowrap">
                        <div className="mb-2">
                           <p className={`font-black text-sm italic ${inv.transaction_type === 'credit' ? 'text-blue-600' : 'text-slate-800'}`}>
                             R$ {Number(inv.amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                           </p>
                           <p className="text-[9px] text-slate-400 uppercase font-black">{new Date(inv.transaction_date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => startEditing(inv)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all shadow-sm"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(inv.id, inv.description)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="bg-slate-50 p-6 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 tracking-widest ml-4">Página {page} de {totalPages}</span>
                <div className="flex gap-3">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 bg-white border rounded-xl disabled:opacity-30 hover:bg-green-600 hover:text-white transition-all text-green-600 shadow-sm"><ChevronLeft size={20} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-3 bg-white border rounded-xl disabled:opacity-30 hover:bg-green-600 hover:text-white transition-all text-green-600 shadow-sm"><ChevronRight size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}