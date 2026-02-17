'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GerenciamentoCursos() {
  const router = useRouter();
  
  // Estados de Dados
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // --- LOGIC: AUTO SLUG NO CREATE ---
  const handleTitleChange = (title: string) => {
    if (!editingId) { // Só gera slug automático se for um NOVO curso
      const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      setForm({ ...form, title, slug });
    } else {
      setForm({ ...form, title });
    }
  };

  // --- SUBMIT: ADD OR UPDATE ---
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
        setIsModalOpen(false);
        setEditingId(null);
        setForm({ title: '', slug: '', imgbanner: '', startDate: '', week_duration: '', description: '', enroll: '', status: 'Ativo' });
        fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || "Erro na operação");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Confirmar exclusão de: ${title}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCourses();
    } catch (error) {
      alert("Erro ao excluir");
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', slug: '', imgbanner: '', startDate: '', week_duration: '', description: '', enroll: '', status: 'Ativo' });
    setIsModalOpen(true);
  };

  const openEdit = (course: any) => {
    setEditingId(course.id);
    setForm(course);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen pt-28 bg-slate-50 selection:bg-orange-500 selection:text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        
        {/* BREADCRUMB / BACK */}
        <button 
          onClick={() => router.push('/42/dashboard')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#003366] transition-colors"
        >
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#003366] p-8 rounded-[2.5rem] shadow-2xl gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10 blur-3xl"></div>
          <div className="z-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Cursos & Treinamentos</h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.4em] mt-1">Gestão de Landing Pages Afulink</p>
          </div>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 z-10">
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="text" placeholder="Pesquisar curso..."
                className="pl-12 pr-6 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:ring-2 ring-orange-500 w-full md:w-72 text-sm transition-all placeholder:text-slate-400"
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <button
              onClick={openCreate}
              className="bg-orange-500 hover:bg-white hover:text-[#003366] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              <Plus size={16} /> Adicionar Curso
            </button>
          </div>
        </div>

        {/* TABLE LIST */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Treinamento</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Início / Duração</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={40} /></td></tr>
                ) : courses.length > 0 ? (
                  courses.map((course: any) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={course.imgbanner} className="w-14 h-14 rounded-xl object-cover shadow-sm bg-slate-100 border border-slate-200" alt="" />
                          <div>
                            <p className="font-black text-[#003366] uppercase text-sm italic">{course.title}</p>
                            <p className="text-[10px] font-mono text-slate-400 italic">/{course.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-bold text-slate-600 tracking-tight">{course.startDate}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black">{course.week_duration}</p>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${course.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => openEdit(course)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(course.id, course.title)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase text-xs">Nenhum curso localizado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-6 bg-white rounded-[2rem] shadow-sm border border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Página {page} de {totalPages}</p>
          <div className="flex gap-3">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-3 bg-slate-100 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all"><ChevronLeft size={18} /></button>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-3 bg-slate-100 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* --- MODAL DE CREATE / UPDATE --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#003366]/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              
              {/* MODAL HEADER */}
              <div className="p-8 bg-[#003366] text-white flex justify-between items-center relative">
                <div className="z-10">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">
                    {editingId ? 'Editar Treinamento' : 'Novo Treinamento'}
                  </h2>
                  <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest mt-1">
                    {editingId ? `ID: ${editingId}` : 'Preencha os dados da LP'}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-orange-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* MODAL FORM */}
              <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-white">
                <div className="space-y-6">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Título Principal</span>
                    <input 
                      type="text" required value={form.title} 
                      onChange={(e) => handleTitleChange(e.target.value)} 
                      className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm font-bold shadow-inner"
                    />
                  </label>

                  {/* SLUG: EDITÁVEL SÓ NO CREATE */}
                  <label className="block">
                    <span className={`text-[10px] font-black uppercase ml-2 italic ${editingId ? 'text-slate-300' : 'text-orange-600'}`}>
                      {editingId ? 'Slug (Bloqueado para preservar URLs)' : 'URL Amigável (Slug)'}
                    </span>
                    <input 
                      type="text" 
                      readOnly={!!editingId}
                      value={form.slug} 
                      onChange={(e) => !editingId && setForm({ ...form, slug: e.target.value })}
                      className={`w-full mt-2 p-4 border-none rounded-2xl text-xs font-mono transition-all ${
                        editingId 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed italic' 
                          : 'bg-orange-50 text-orange-700 font-bold focus:ring-2 ring-orange-400'
                      }`} 
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Início</span>
                      <input type="text" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="Ex: Mar/26" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent shadow-inner" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Duração</span>
                      <input type="text" value={form.week_duration} onChange={(e) => setForm({ ...form, week_duration: e.target.value })} placeholder="Ex: 8 Sem" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent shadow-inner" />
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Banner URL</span>
                    <input type="text" value={form.imgbanner} onChange={(e) => setForm({ ...form, imgbanner: e.target.value })} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent shadow-inner" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Inscrição</span>
                    <input type="url" value={form.enroll} onChange={(e) => setForm({ ...form, enroll: e.target.value })} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent shadow-inner" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição Hero</span>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm h-32 outline-none focus:border-orange-500 border-2 border-transparent resize-none shadow-inner" />
                  </label>
                </div>

                <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-6 border-t pt-8 border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-all">Descartar</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`px-16 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 ${editingId ? 'bg-[#003366]' : 'bg-orange-500'}`}
                  >
                    {loading ? 'Processando...' : editingId ? 'Salvar Alterações' : 'Publicar Curso'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}