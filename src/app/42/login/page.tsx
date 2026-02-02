'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../atendimento/Atendimento.module.css';

export default function AdminLoginPage() {
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://serverless-tau-green.vercel.app/api/customer_service/42/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ra, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // --- MUDANÇA AQUI: Armazenamos o Token e o Nome, nunca a senha ---
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_name', data.admin_name);
        
        // Redireciona para a Dashboard que criamos
        router.push('/42/dashboard'); 
      } else {
        setError(data.error || "Erro ao acessar painel.");
      }
    } catch (err) {
      setError("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className={`${styles.authCard} border-t-4 border-[#f37021]`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#003366] uppercase tracking-tighter">Painel 42</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acesso Administrativo</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Usuário Admin (RA)" 
            className={styles.inputField} 
            value={ra}
            onChange={e => setRa(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Senha Mestra" 
            className={styles.inputField} 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.btnVerify} bg-slate-800 hover:bg-black transition-colors`}
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-[9px] text-gray-400 uppercase font-medium">
          Acesso monitorado • Afulink Tech
        </p>
      </div>
    </main>
  );
}