'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, FileText, ArrowLeft, Trash2, Loader2, Save, Edit2, X, Link as LinkIcon, ExternalLink, Tag } from 'lucide-react';

export default function AdminDocumentos() {
  const router = useRouter();
  
  const categorias: { [key: number]: string } = {
    1: 'Declaração',
    2: 'Contrato',
    3: 'Histórico',
    4: 'Certificado Parcial',
    5: 'Outros'
  };

  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState({ 
    ra_aluno: '', 
    document_name: '', 
    file_path: '', 
    type_doc: '1' 
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const API_BASE = 'https://serverless-tau-green.vercel.app/api/customer-service/42/documents';

  // --- BUSCAR DADOS (READ) ---
  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list_all?page=${page}&q=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDocs(data.docs || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, token]);

  useEffect(() => { if (token) fetchDocs(); }, [fetchDocs]);

  // --- SALVAR OU ATUALIZAR (CREATE / UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ra_aluno: form.ra_aluno,
      document_name: form.document_name || "Documento Sem Nome",
      file_path: form.file_path || "S/N",
      type_doc: parseInt(form.type_doc) || 1,
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
        fetchDocs();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.message || "Verifique os dados"}`);
      }
    } catch (error) {
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  // --- EXCLUIR (DELETE) ---
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja excluir permanentemente o documento: "${name}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchDocs();
    } catch (err) {
      alert("Erro ao excluir");
    }
  };

  // --- ENTRAR NO MODO EDIÇÃO ---
  const startEditing = (doc: any) => {
    setEditingId(doc.id);
    setForm({
      ra_aluno: doc.student_ra.toString(),
      document_name: doc.document_name,
      file_path: doc.file_path,
      type_doc: doc.type_doc.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ ra_aluno: '', document_name: '', file_path: '', type_doc: '1' });
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 pb-20 selection:bg-slate-800 selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 space-y-8">
        
        <button onClick={() => router.push('/42/dashboard')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-slate-800 transition-all">
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* FORMULÁRIO LATERAL (CREATE/UPDATE) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className={`p-6 text-white text-center transition-colors duration-500 ${editingId ? 'bg-[#003366]' : 'bg-slate-800'}`}>
                <FileText className="mx-auto mb-2 opacity-50" size={24} />
                <h1 className="text-sm font-black uppercase italic tracking-tighter">
                  {editingId ? 'Editar Documento' : 'Novo Documento'}
                </h1>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">RA do Aluno</label>
                  <input type="text" required className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-slate-800 outline-none rounded-2xl text-sm font-bold shadow-inner" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nome do Arquivo</label>
                  <input type="text" required placeholder="Ex: Histórico Escolar" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner" value={form.document_name} onChange={e => setForm({...form, document_name: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Categoria</label>
                  <select className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none shadow-inner appearance-none cursor-pointer" value={form.type_doc} onChange={e => setForm({...form, type_doc: e.target.value})}>
                    {Object.entries(categorias).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">URL do Documento</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-4 text-slate-300" size={16} />
                    <input type="url" required placeholder="https://..." className="w-full mt-2 pl-12 p-4 bg-slate-50 rounded-2xl text-sm border-none shadow-inner" value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <button type="button" onClick={cancelEditing} className="flex-1 bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center">
                      <X size={16} />
                    </button>
                  )}
                  <button type="submit" disabled={loading} className={`flex-[3] text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${editingId ? 'bg-[#003366]' : 'bg-slate-800'}`}>
                    <Save size={18} /> {loading ? 'Gravando...' : editingId ? 'Atualizar' : 'Publicar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM COM SEARCH & ACTIONS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-5 text-slate-300 group-focus-within:text-slate-800 transition-colors" size={20} />
              <input type="text" placeholder="Pesquisar..." className="w-full pl-16 pr-8 py-5 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-slate-800 transition-all text-sm font-medium" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" size={40} /></td></tr>
                  ) : docs.length > 0 ? (
                    docs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-all">
                        <td className="p-6">
                          <p className="font-black text-[#003366] uppercase text-sm italic">{doc.student_name}</p>
                          <p className="text-[10px] font-mono text-slate-400 tracking-tighter">RA: {doc.student_ra}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-600 text-xs tracking-tight">{doc.document_name}</p>
                          <span className="text-[8px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase tracking-widest mt-2 inline-flex items-center gap-1 border border-slate-200">
                            <Tag size={10} /> {categorias[doc.type_doc] || 'Outros'}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-2">
                            <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                              <ExternalLink size={16} />
                            </a>
                            <button onClick={() => startEditing(doc)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all shadow-sm">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(doc.id, doc.document_name)} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum documento localizado.</td></tr>
                  )}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="bg-slate-50 p-6 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase ml-4">Página {page} de {totalPages}</span>
                <div className="flex gap-2 mr-4">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 bg-white border rounded-xl disabled:opacity-30 hover:bg-slate-800 hover:text-white transition-all"><ChevronLeft size={18} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-3 bg-white border rounded-xl disabled:opacity-30 hover:bg-slate-800 hover:text-white transition-all"><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}