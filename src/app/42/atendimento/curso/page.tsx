'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';

export default function GerenciamentoCursos() {
  // Estados de Dados
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados de UI (Modais e Edição)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', imgbanner: '', startDate: '', 
    week_duration: '', description: '', enroll: '', status: 'Ativo'
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const API_BASE = 'https://serverless-tau-green.vercel.app/api/customer-service/42/training';

  // --- BUSCAR CURSOS (LIST & SEARCH) ---
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

  // --- GERAR SLUG AUTOMÁTICO ---
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    setForm({ ...form, title, slug });
  };

  // --- CRIAR OU ATUALIZAR (CREATE & UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    } catch (error) {
      alert("Erro ao salvar curso");
    }
  };

  // --- DELETAR (DELETE) ---
  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Deseja excluir permanentemente o curso: ${title}?`)) return;
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

  // --- PREPARAR EDIÇÃO ---
  const openEdit = (course: any) => {
    setEditingId(course.id);
    setForm(course);
    setIsModalOpen(true);
  };

  return (
        <main className="min-h-screen pt-34 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER & BUSCA */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#003366] p-8 rounded-[2.5rem] shadow-2xl gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Gestão de Treinamentos</h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.3em]">Painel de Controle Afulink</p>
          </div>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" placeholder="Pesquisar..." 
                className="pl-12 pr-6 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:ring-2 ring-orange-500 w-full md:w-64 text-sm transition-all"
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <button 
              onClick={() => { setEditingId(null); setIsModalOpen(true); }}
              className="bg-orange-500 hover:bg-white hover:text-[#003366] text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <Plus size={16} /> Novo Curso
            </button>
          </div>
        </div>

        {/* LISTAGEM EM GRID/TABELA */}
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
                ) : courses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img src={course.imgbanner} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-[#003366] uppercase text-sm italic">{course.title}</p>
                          <p className="text-[10px] font-mono text-slate-400 italic">/{course.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-slate-600">{course.startDate}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{course.week_duration}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${course.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                      <button onClick={() => openEdit(course)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-[#003366] hover:text-white transition-all"><Edit2 size={14}/></button>
                      <button onClick={() => handleDelete(course.id, course.title)} className="p-3 bg-red-50 text-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all text-red-600"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINAÇÃO */}
        <div className="flex justify-between items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Página {page} de {totalPages}</p>
          <div className="flex gap-3">
            <button disabled={page === 1} onClick={() => setPage(page-1)} className="p-3 bg-slate-100 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all"><ChevronLeft size={18}/></button>
            <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="p-3 bg-slate-100 rounded-xl disabled:opacity-30 hover:bg-orange-500 hover:text-white transition-all"><ChevronRight size={18}/></button>
          </div>
        </div>

        {/* MODAL DE CADASTRO / EDIÇÃO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-[#003366]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 bg-[#003366] text-white flex justify-between items-center">
                <h2 className="text-xl font-black uppercase italic">{editingId ? 'Editar Curso' : 'Novo Treinamento'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-orange-400 hover:text-white transition-colors"><X size={32}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Curso</span>
                    <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full mt-2 p-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 outline-none rounded-2xl text-sm font-bold"/>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-orange-600 ml-2 italic">URL Amigável (Slug)</span>
                    <input type="text" readOnly value={form.slug} className="w-full mt-2 p-4 bg-slate-100 border-none rounded-2xl text-xs font-mono text-slate-500 cursor-not-allowed"/>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Início</span>
                      <input type="text" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} placeholder="Ex: Março/26" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent"/>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Duração</span>
                      <input type="text" value={form.week_duration} onChange={(e) => setForm({...form, week_duration: e.target.value})} placeholder="Ex: 8 Semanas" className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent"/>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Banner (URL)</span>
                    <input type="text" value={form.imgbanner} onChange={(e) => setForm({...form, imgbanner: e.target.value})} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent"/>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Inscrição (Hotmart/Eduzz)</span>
                    <input type="url" value={form.enroll} onChange={(e) => setForm({...form, enroll: e.target.value})} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:border-orange-500 border-2 border-transparent"/>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição</span>
                    <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full mt-2 p-4 bg-slate-50 rounded-2xl text-sm h-32 outline-none focus:border-orange-500 border-2 border-transparent resize-none"/>
                  </label>
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-[#003366] transition-all">Cancelar</button>
                  <button type="submit" className="px-12 py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all active:scale-95">
                    {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
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