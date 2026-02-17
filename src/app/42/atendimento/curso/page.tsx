'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, ArrowLeft, BookOpen, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GerenciamentoCursos() {
  const router = useRouter();
  
  // Estados de Dados
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de UI (Edição controlada na coluna lateral)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', imgbanner: '', startDate: '',
    week_duration: '', description: '', enroll: '', status: 'Ativo'
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const API_BASE = 'https://serverless-tau-green.vercel.app/api/customer-service/42/training';

  // --- FETCH DATA ---
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list?page=${page}&q=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data.trainings || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, token]);

  useEffect(() => { if (token) fetchCourses(); }, [fetchCourses]);

  // --- LOGIC: AUTO SLUG ---
  const handleTitleChange = (title: string) => {
    if (!editingId) {
      const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      setForm({ ...form, title, slug });
    } else {
      setForm({ ...form, title });
    }
  };

  // --- SUBMIT ---
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
        setEditingId(null);
        setForm({ title: '', slug: '', imgbanner: '', startDate: '', week_duration: '', description: '', enroll: '', status: 'Ativo' });
        fetchCourses();
      }
    } catch (error) {
      alert("Erro na operação");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Excluir: ${title}?`)) return;
    const res = await fetch(`${API_BASE}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchCourses();
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 selection:bg-orange-500 pb-20">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.push('/42/dashboard')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest hover:text-[#003366] transition-all"
        >
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA 1: FORMULÁRIO (30% da largura) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className={`p-6 text-white text-center transition-colors ${editingId ? 'bg-[#003366]' : 'bg-orange-500'}`}>
                <BookOpen className="mx-auto mb-2 opacity-50" size={24} />
                <h1 className="text-sm font-black uppercase italic tracking-tighter">
                  {editingId ? 'Editar Treinamento' : 'Novo Treinamento'}
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Curso</label>
                  <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none focus:ring-2 ring-orange-500 shadow-inner" />
                </div>

                <div>
                  <label className={`text-[10px] font-black uppercase ml-2 ${editingId ? 'text-slate-300' : 'text-orange-600'}`}>Slug (URL)</label>
                  <input type="text" readOnly={!!editingId} value={form.slug} className={`w-full mt-1 p-4 rounded-2xl text-xs font-mono border-none ${editingId ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-orange-50 text-orange-700 shadow-inner'}`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Início</label>
                    <input type="text" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} placeholder="Ex: Mar/26" className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm border-none shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Duração</label>
                    <input type="text" value={form.week_duration} onChange={(e) => setForm({...form, week_duration: e.target.value})} placeholder="Ex: 8 Sem" className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm border-none shadow-inner" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Banner URL</label>
                  <input type="text" value={form.imgbanner} onChange={(e) => setForm({...form, imgbanner: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm border-none shadow-inner" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Inscrição</label>
                  <input type="url" value={form.enroll} onChange={(e) => setForm({...form, enroll: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm border-none shadow-inner" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição</label>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full mt-1 p-4 bg-slate-50 rounded-2xl text-sm h-24 border-none shadow-inner resize-none leading-tight" />
                </div>

                <div className="flex gap-2 pt-2">
                  {editingId && (
                    <button type="button" onClick={() => {setEditingId(null); setForm({title:'', slug:'', imgbanner:'', startDate:'', week_duration:'', description:'', enroll:'', status:'Ativo'})}} className="flex-1 bg-slate-100 text-slate-400 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
                  )}
                  <button type="submit" disabled={loading} className={`flex-[2] text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${editingId ? 'bg-[#003366]' : 'bg-orange-500'}`}>
                    <Save size={16} /> {editingId ? 'Salvar Alterações' : 'Publicar Curso'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM (70% da largura) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* BUSCA */}
            <div className="relative group">
              <Search className="absolute left-6 top-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar por título ou slug..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-orange-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>

            {/* TABELA */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Treinamento</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={40} /></td></tr>
                  ) : courses.map((course: any) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={course.imgbanner} className="w-14 h-14 rounded-xl object-cover shadow-sm bg-slate-100 border border-slate-200" alt="" />
                          <div>
                            <p className="font-black text-[#003366] uppercase text-sm italic">{course.title}</p>
                            <p className="text-[10px] font-mono text-slate-400 italic">/{course.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${course.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => { setEditingId(course.id); setForm(course); }} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(course.id, course.title)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINAÇÃO */}
              <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página {page} de {totalPages}</span>
                <div className="flex gap-3">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all text-[#003366]">
                    <ChevronLeft size={20} />
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all text-[#003366]">
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