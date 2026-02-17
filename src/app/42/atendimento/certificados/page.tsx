'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, Award, Trash2, ArrowLeft, Loader2, Save, Edit2, X, ExternalLink } from 'lucide-react';

export default function AdminCertificados() {
  const router = useRouter();
  
  // Estados de Dados
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Estados de UI
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ 
    ra_aluno: '', 
    course_name: '', 
    certificate_number: '', 
    issue_date: '', 
    file_path: '' 
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const API_BASE = 'https://serverless-tau-green.vercel.app/api/customer-service/42/certificates';

  // --- BUSCAR DADOS ---
  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list_all?page=${page}&q=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCerts(data.certs || []);
        setTotalPages(data.total_pages || 1);
        setTotalCount(data.total_count || 0);
      }
    } catch (err) {
      console.error("Erro ao carregar certificados", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, token]);

  useEffect(() => { if (token) fetchCerts(); }, [fetchCerts]);

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
        fetchCerts();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.message || "Erro na operação"}`);
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: number, student: string) => {
    if (!confirm(`Excluir permanentemente o certificado de: ${student}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCerts();
    } catch (err) {
      alert("Erro ao excluir");
    }
  };

  // --- AUXILIARES DE EDIÇÃO ---
  const startEditing = (c: any) => {
    setEditingId(c.id);
    setForm({
      ra_aluno: c.student_ra.toString(),
      course_name: c.course_name,
      certificate_number: c.certificate_number,
      issue_date: c.issue_date ? c.issue_date.split('T')[0] : '', // Ajuste para input date
      file_path: c.file_path || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ ra_aluno: '', course_name: '', certificate_number: '', issue_date: '', file_path: '' });
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 selection:bg-orange-500 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 space-y-8">
        
        <button onClick={() => router.push('/42/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-[#003366] transition-all">
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA 1: FORMULÁRIO (ADD/EDIT) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className={`p-6 text-white text-center transition-colors duration-500 ${editingId ? 'bg-[#003366]' : 'bg-orange-500'}`}>
                {editingId ? <Edit2 className="mx-auto mb-2 opacity-50" size={24} /> : <Award className="mx-auto mb-2 opacity-50" size={24} />}
                <h1 className="text-sm font-black uppercase italic tracking-tighter">
                  {editingId ? 'Editar Certificado' : 'Novo Certificado'}
                </h1>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">RA do Aluno</label>
                  <input type="text" required className="w-full mt-1 p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm font-bold shadow-inner" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Treinamento</label>
                  <input type="text" required className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nº Registro</label>
                    <input type="text" required className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.certificate_number} onChange={e => setForm({...form, certificate_number: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Emissão</label>
                    <input type="date" required className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Link do PDF</label>
                  <input type="url" required placeholder="https://..." className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} />
                </div>

                <div className="flex gap-3 pt-4">
                  {editingId && (
                    <button type="button" onClick={cancelEditing} className="flex-1 bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center">
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" disabled={loading} className={`flex-[3] text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-[#003366]' : 'bg-orange-500'}`}>
                    <Save size={18} /> {loading ? 'Gravando...' : editingId ? 'Atualizar' : 'Publicar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input type="text" placeholder="Pesquisar por RA, Aluno ou Registro..." className="w-full pl-16 pr-8 py-5 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-orange-500 transition-all text-sm font-medium" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <span className="text-[10px] font-black text-[#003366] uppercase tracking-widest">Registros Emitidos</span>
                <span className="bg-[#003366] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-tighter">{totalCount} Total</span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Curso / Data</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={40} /></td></tr>
                  ) : certs.length > 0 ? (
                    certs.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="p-6">
                          <p className="font-black text-[#003366] uppercase text-sm italic">{c.student_name}</p>
                          <p className="text-[10px] font-mono text-slate-400 tracking-tighter">RA: {c.student_ra}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-600 text-xs tracking-tight">{c.course_name}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[8px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase border border-slate-200">Reg: {c.certificate_number}</span>
                             <span className="text-[9px] text-orange-500 font-bold uppercase">{new Date(c.issue_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-6 text-right space-x-2 whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            {/* LINK DO PDF */}
                            {c.file_path && (
                              <a href={c.file_path} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                <ExternalLink size={16} />
                              </a>
                            )}
                            {/* BOTÃO EDITAR */}
                            <button onClick={() => startEditing(c)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all shadow-sm">
                              <Edit2 size={16} />
                            </button>
                            {/* BOTÃO EXCLUIR */}
                            <button onClick={() => handleDelete(c.id, c.student_name)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum certificado encontrado.</td></tr>
                  )}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Página {page} de {totalPages}</span>
                <div className="flex gap-3">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all text-orange-600 shadow-sm">
                    <ChevronLeft size={20} />
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all text-orange-600 shadow-sm">
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