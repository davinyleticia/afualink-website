'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, DollarSign, ArrowLeft, Trash2, Loader2, Save, TrendingDown, TrendingUp, Edit2, X, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';

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
    course_name: 'Geral', // Valor padrão para evitar Null no Banco
    amount: '', 
    transaction_type: 'debit', 
    description: '',
    due_date: '',
    file_path: '', // Inicializado como string vazia
    status: 'Pendente'
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

  // --- SUBMIT: ADD OU UPDATE (COM FIX PARA NULL) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // FIX: Garante que campos opcionais não enviem NULL para o banco
    const payload = {
      ...form,
      file_path: form.file_path || "S/N", // Envia "S/N" ou string vazia se nulo
      course_name: form.course_name || "Administrativo"
    };

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/update/${editingId}` : `${API_BASE}/add`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        cancelEditing();
        fetchInvoices();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error || err.message}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor");
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
      course_name: inv.course_name || 'Geral',
      amount: inv.amount.toString(),
      transaction_type: inv.transaction_type || 'debit',
      description: inv.description,
      due_date: inv.due_date ? inv.due_date.split('T')[0] : '',
      file_path: inv.file_path || '',
      status: inv.status || 'Pendente'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ ra_aluno: '', course_name: 'Geral', amount: '', transaction_type: 'debit', description: '', due_date: '', file_path: '', status: 'Pendente' });
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 pb-20 selection:bg-green-500">
      <div className="max-w-[1400px] mx-auto px-4 space-y-8">
        
        <button onClick={() => router.push('/42/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-green-700 transition-all">
          <ArrowLeft size={14} /> Painel Administrativo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA 1: FORMULÁRIO */}
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
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">RA do Aluno</label>
                  <input type="text" required className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-green-600 outline-none rounded-2xl text-sm font-bold shadow-inner" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Valor (R$)</label>
                    <input type="number" step="0.01" required className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Vencimento</label>
                    <input type="date" required className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Link / Comprovante</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-4 text-slate-300" size={16} />
                    <input type="text" placeholder="URL opcional" className="w-full mt-2 pl-12 p-4 bg-slate-50 rounded-2xl text-sm border-none shadow-inner" value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Descrição</label>
                  <textarea required className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm h-24 resize-none shadow-inner leading-relaxed" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>

                <div className="flex gap-3">
                  {editingId && (
                    <button type="button" onClick={cancelEditing} className="flex-1 bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center">
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" disabled={loading} className={`flex-[3] text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-[#003366]' : 'bg-green-700'}`}>
                    <Save size={18} /> {loading ? 'Gravando...' : editingId ? 'Atualizar' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-5 text-slate-300 group-focus-within:text-green-600 transition-colors" size={20} />
              <input type="text" placeholder="Pesquisar por RA ou Nome do Aluno..." className="w-full pl-16 pr-8 py-5 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-green-500 transition-all text-sm font-medium" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-green-600" size={40} /></td></tr>
                  ) : invoices.length > 0 ? (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="p-6">
                          <p className="font-black text-[#003366] uppercase text-sm italic">{inv.student_name}</p>
                          <p className="text-[10px] font-mono text-slate-400 italic">RA: {inv.student_ra}</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-medium">{inv.description}</p>
                        </td>
                        <td className="p-6 text-center">
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${inv.transaction_type === 'credit' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                            {inv.transaction_type === 'credit' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                            {inv.transaction_type === 'credit' ? 'Crédito' : 'Débito'}
                          </div>
                        </td>
                        <td className="p-6 text-right space-x-2 whitespace-nowrap">
                          <div className="mb-2">
                             <p className={`font-black text-sm italic ${inv.transaction_type === 'credit' ? 'text-blue-600' : 'text-slate-800'}`}>
                               R$ {Number(inv.amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                             </p>
                             <div className="flex flex-col items-end gap-1">
                               <p className="text-[9px] text-slate-400 uppercase font-black">Venc: {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '--'}</p>
                               <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${inv.status === 'Pago' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                 {inv.status}
                               </span>
                             </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            {inv.file_path && inv.file_path !== "S/N" && (
                              <a href={inv.file_path} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                <ExternalLink size={16} />
                              </a>
                            )}
                            <button onClick={() => startEditing(inv)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all shadow-sm"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(inv.id, inv.description)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum lançamento encontrado.</td></tr>
                  )}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Página {page} de {totalPages}</span>
                <div className="flex gap-3">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-green-600 hover:text-white transition-all text-green-600 shadow-sm">
                    <ChevronLeft size={20} />
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-green-600 hover:text-white transition-all text-green-600 shadow-sm">
                    <ChevronRight size={20} />
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