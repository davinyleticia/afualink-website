'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, FilePlus, Trash2, ArrowLeft } from 'lucide-react';
import styles from '../../../atendimento/Atendimento.module.css';

export default function AdminDocumentos() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  
  const [form, setForm] = useState({ ra_aluno: '', title: '', category: 'Declaração', file_path: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/42/documents/list_all?page=${page}&q=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDocs(data.docs);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, token]);

  useEffect(() => { if (token) fetchDocs(); }, [fetchDocs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/documents/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ ra_aluno: '', title: '', category: 'Declaração', file_path: '' });
      setPage(1);
      fetchDocs();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este documento permanentemente?")) return;
    const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/42/documents/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchDocs();
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 selection:bg-orange-500">
      <div className="max-w-6xl mx-auto px-4">
        
        <button 
          onClick={() => router.push('/42/dashboard')} 
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-[#003366] transition-all"
        >
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA 1: FORMULÁRIO (ADD) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className="bg-[#003366] p-6 text-white text-center">
                <FilePlus className="mx-auto mb-2 text-orange-400" size={24} />
                <h1 className="text-sm font-black uppercase italic tracking-tighter">Novo Documento</h1>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input type="text" placeholder="RA do Aluno" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} required />
                <input type="text" placeholder="Título (ex: Histórico)" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                <select className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Declaração">Declaração</option>
                  <option value="Contrato">Contrato</option>
                  <option value="Histórico">Histórico</option>
                  <option value="Outros">Outros</option>
                </select>
                <input type="text" placeholder="URL do Arquivo" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} required />
                <button className="w-full bg-[#003366] text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95">Publicar Agora</button>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM E BUSCA */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* BUSCA */}
            <div className="relative group">
              <Search className="absolute left-5 top-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar por RA, Aluno ou Título..." 
                className="w-full pl-14 pr-6 py-4.5 bg-white rounded-[2rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-orange-500 transition-all text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* TABELA */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-10 text-center animate-pulse text-slate-300 font-bold uppercase italic tracking-widest text-xs">Carregando Dados...</td></tr>
                  ) : docs?.length > 0 ? (
                    docs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="p-6">
                          <p className="font-black text-[#003366] uppercase text-xs">{doc.student_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono italic tracking-tighter">RA: {doc.student_ra}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-600 text-xs tracking-tight">{doc.title}</p>
                          <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-orange-200">{doc.category}</span>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => handleDelete(doc.id)} 
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum registro encontrado.</td></tr>
                  )}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Página {page} de {totalPages}</span>
                <div className="flex gap-2 mr-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all text-[#003366]">
                    <ChevronLeft size={18} />
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all text-[#003366]">
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