'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../atendimento/Atendimento.module.css';

export default function AdminCertificados() {
  const router = useRouter();
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ra_aluno: '', course_name: '', certificate_number: '', issue_date: '', file_path: '' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  // Carrega a lista de certificados
  const fetchCerts = async () => {
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/certificates/list_all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setCerts(data);
  };

  useEffect(() => { if (token) fetchCerts(); }, [token]);

  // Deleta um certificado
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja excluir permanentemente este certificado?")) return;
    
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
      fetchCerts();
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-24 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push('/42/dashboard')} className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest hover:text-[#003366]">← Painel Principal</button>

        {/* Form de Cadastro */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="bg-[#003366] p-6 text-white text-center">
            <h1 className="text-xl font-black uppercase tracking-tighter">Cadastrar Novo Certificado</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" placeholder="RA do Aluno" className={styles.inputField} value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} required />
             <input type="text" placeholder="Nome do Curso" className={styles.inputField} value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} required />
             <input type="text" placeholder="Nº Registro" className={styles.inputField} value={form.certificate_number} onChange={e => setForm({...form, certificate_number: e.target.value})} required />
             <input type="date" className={styles.inputField} value={form.issue_date} onChange={e => setForm({...form, issue_date: e.target.value})} required />
             <input type="text" placeholder="URL do PDF" className={`${styles.inputField} md:col-span-1`} value={form.file_path} onChange={e => setForm({...form, file_path: e.target.value})} required />
             <button className="bg-[#f37021] text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-black transition">Salvar Certificado</button>
          </form>
        </div>

        {/* Tabela de Gestão */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="font-black text-slate-800 uppercase text-xs tracking-widest">Certificados Emitidos</h2>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">{certs.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno / RA</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Curso</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº Registro</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-slate-50 transition text-sm">
                    <td className="p-4">
                      <p className="font-bold text-slate-700">{c.student_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">RA: {c.student_ra}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-600">{c.course_name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{new Date(c.issue_date).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{c.certificate_number}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors group"
                        title="Excluir Certificado"
                      >
                        <span className="text-[10px] font-black uppercase">Excluir</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}