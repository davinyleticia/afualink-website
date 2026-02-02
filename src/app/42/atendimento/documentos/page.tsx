'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../atendimento/Atendimento.module.css';

export default function AdminDocumentos() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [form, setForm] = useState({ ra_aluno: '', title: '', category: 'Declaração', file_path: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const fetchDocs = async () => {
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/documents/list_all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setDocs(data);
  };

  useEffect(() => { if (token) fetchDocs(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/documents/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ ra_aluno: '', title: '', category: 'Declaração', file_path: '' });
      fetchDocs();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este documento?")) return;
    await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/42/documents/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchDocs();
  };

  return (
    <main className="min-h-screen pt-34 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push('/42/dashboard')} className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest hover:text-slate-800">← Painel</button>

        {/* Formulário de Upload de Links */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
          <div className="bg-slate-700 p-6 text-white text-center">
            <h1 className="text-xl font-black uppercase italic">Gestão de Documentos</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="RA" className={styles.inputField} value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} required />
            <input type="text" placeholder="Título (ex: Histórico)" className={styles.inputField} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            <select className={styles.inputField} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="Declaração">Declaração</option>
              <option value="Contrato">Contrato</option>
              <option value="Histórico">Histórico</option>
              <option value="Outros">Outros</option>
            </select>
            <input type="text" placeholder="URL do Documento" className={styles.inputField} value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} required />
            <button className="md:col-span-4 bg-slate-800 text-white font-black py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-black transition">Publicar Documento</button>
          </form>
        </div>

        {/* Listagem */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Aluno / RA</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Documento</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-slate-50 transition text-sm">
                  <td className="p-4">
                    <p className="font-bold text-slate-700">{doc.student_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">RA: {doc.student_ra}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-slate-600">{doc.title}</p>
                    <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-black uppercase">{doc.category}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(doc.id)} className="text-red-500 font-black text-[10px] uppercase hover:underline">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}