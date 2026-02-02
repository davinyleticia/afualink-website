'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../atendimento/Atendimento.module.css';

export default function AdminFinanceiro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [form, setForm] = useState({ ra_aluno: '', description: '', amount: '', due_date: '', payment_link: '', status: 'Pendente' });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const fetchInvoices = async () => {
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/financeiro/list_all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setInvoices(data);
  };

  useEffect(() => { if (token) fetchInvoices(); }, [token]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/financeiro/update_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id, status: newStatus })
    });
    fetchInvoices();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('https://serverless-tau-green.vercel.app/api/customer-service/42/financeiro/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ ra_aluno: '', description: '', amount: '', due_date: '', payment_link: '', status: 'Pendente' });
      fetchInvoices();
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-34 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Formulário (Mesmo do anterior, encurtado aqui para brevidade) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
          <div className="bg-green-700 p-6 text-white text-center">
            <h1 className="text-xl font-black uppercase">Novo Lançamento Financeiro</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" placeholder="RA" className={styles.inputField} value={form.ra_aluno} onChange={e => setForm({...form, ra_aluno: e.target.value})} required />
             <input type="text" placeholder="Descrição" className={styles.inputField} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
             <input type="number" placeholder="Valor" className={styles.inputField} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
             <input type="date" className={styles.inputField} value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} required />
             <input type="text" placeholder="Link Pagamento" className={styles.inputField} value={form.payment_link} onChange={e => setForm({...form, payment_link: e.target.value})} required />
             <button className="bg-green-600 text-white font-bold rounded-xl uppercase text-xs">Cadastrar</button>
          </form>
        </div>

        {/* TABELA DE LISTAGEM */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b bg-slate-50">
            <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Faturas Lançadas</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Aluno / RA</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Valor</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Vencimento</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-slate-50 transition text-sm">
                  <td className="p-4">
                    <p className="font-bold text-slate-700">{inv.student_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">RA: {inv.student_ra}</p>
                  </td>
                  <td className="p-4 font-black text-slate-600">R$ {Number(inv.amount).toFixed(2)}</td>
                  <td className="p-4 text-slate-500">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${inv.status === 'Pago' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button onClick={() => handleUpdateStatus(inv.id, 'Pago')} className="bg-green-500 text-white p-1 rounded text-[9px] font-bold uppercase">Marcar Pago</button>
                    <button onClick={() => handleUpdateStatus(inv.id, 'Pendente')} className="bg-slate-200 text-slate-600 p-1 rounded text-[9px] font-bold uppercase">Pendente</button>
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