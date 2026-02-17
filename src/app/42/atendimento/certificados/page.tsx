'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, Award, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import styles from '../../../atendimento/Atendimento.module.css';

export default function AdminCertificados() {
  const router = useRouter();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const [form, setForm] = useState({ ra_aluno: '', course_name: '', certificate_number: '', issue_date: '', file_path: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/42/certificates/list_all?page=${page}&q=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCerts(data.certs);
        setTotalPages(data.total_pages);
        setTotalCount(data.total_count);
      }
    } catch (err) {
      console.error("Erro ao carregar certificados", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, token]);

  useEffect(() => { if (token) fetchCerts(); }, [fetchCerts]);

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este certificado permanentemente?")) return;
    const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/42/certificates/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) fetchCerts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/certificates/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ ra_aluno: '', course_name: '', certificate_number: '', issue_date: '', file_path: '' });
      setPage(1); // Volta para a primeira página após cadastrar
      fetchCerts();
    }
    setLoading(false);
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
          
          {/* COLUNA 1: FORMULÁRIO */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden sticky top-28">
              <div className="bg-[#003366] p-6 text-white text-center">
                <Award className="mx-auto mb-2 text-orange-400 shadow-lg" size={28} />
                <h1 className="text-sm font-black uppercase italic tracking-tighter">Novo Certificado</h1>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input type="text" placeholder="RA do Aluno" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} required />
                <input type="text" placeholder="Nome do Curso" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} required />
                <input type="text" placeholder="Nº Registro" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.certificate_number} onChange={e => setForm({...form, certificate_number: e.target.value})} required />
                <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500 text-slate-500" value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} required />
                <input type="text" placeholder="URL do PDF" className="w-full p-4 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 ring-orange-500" value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} required />
                <button className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-[#003366] transition-all shadow-xl active:scale-95">Salvar Registro</button>
              </form>
            </div>
          </div>

          {/* COLUNA 2: LISTAGEM */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* BUSCA */}
            <div className="relative group">
              <Search className="absolute left-5 top-4.5 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar por Aluno, RA ou Nº Registro..." 
                className="w-full pl-14 pr-6 py-4.5 bg-white rounded-[2rem] border border-slate-200 shadow-sm outline-none focus:ring-2 ring-orange-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>

            {/* TABELA */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50/50 border-b flex justify-between items-center">
                <span className="text-[10px] font-black text-[#003366] uppercase tracking-widest">Base de Dados</span>
                <span className="bg-[#003366] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-tighter">{totalCount} Registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Treinamento</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" size={32} /></td></tr>
                    ) : certs?.length > 0 ? (
                      certs.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-all group">
                          <td className="p-6">
                            <p className="font-black text-[#003366] uppercase text-xs">{c.student_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono tracking-tighter">RA: {c.student_ra}</p>
                          </td>
                          <td className="p-6">
                            <p className="font-bold text-slate-600 text-xs">{c.course_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Reg: {c.certificate_number}</span>
                              <span className="text-[9px] text-orange-500 font-black italic">{new Date(c.issue_date).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <button 
                              onClick={() => handleDelete(c.id)} 
                              className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:scale-105"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={3} className="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">Nenhum certificado localizado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

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