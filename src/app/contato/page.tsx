'use client';

import { useState } from 'react';
import styles from './Contato.module.css';

const ContatoPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de envio
    setTimeout(() => {
      setLoading(false);
      alert('Mensagem enviada com sucesso! Nossa equipa entrará em contacto em breve.');
    }, 2000);
  };

  return (
    <main className="min-h-screen pt-24 bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* COLUNA 1: INFO E SUPORTE */}
          <div className="space-y-12">
            <div>
              <span className="text-[#f37021] font-bold uppercase tracking-widest text-sm mb-4 block">Contacto</span>
              <h1 className="text-[#003366] text-4xl md:text-5xl font-black mb-6 leading-tight">
                Estamos prontos para <br/>impulsionar o seu negócio.
              </h1>
              <p className="text-gray-600 text-lg">
                Seja para uma consultoria técnica, suporte ou parcerias, a nossa equipa de especialistas está à disposição.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className={styles.iconBox}>📍</div>
                <div>
                  <h3 className="font-bold text-[#003366]">Escritório Central</h3>
                  <p className="text-gray-500 text-sm">Mogi das Cruzes, SP - Brasil</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className={styles.iconBox}>📧</div>
                <div>
                  <h3 className="font-bold text-[#003366]">E-mail</h3>
                  <p className="text-gray-500 text-sm">contacto@afulink.com.br</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className={styles.iconBox}>💬</div>
                <div>
                  <h3 className="font-bold text-[#003366]">WhatsApp Business</h3>
                  <p className="text-gray-500 text-sm">+55 (11) 99999-9999</p>
                </div>
              </div>
            </div>

            {/* SELO DE SEGURANÇA / LGPD */}
            <div className="p-6 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="text-2xl">🔒</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Os seus dados estão seguros connosco. Utilizamos criptografia de ponta e estamos em total conformidade com a <strong>LGPD</strong>.
              </p>
            </div>
          </div>

          {/* COLUNA 2: FORMULÁRIO */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className={styles.label}>Nome</label>
                  <input type="text" placeholder="Seu nome" className={styles.input} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={styles.label}>Empresa</label>
                  <input type="text" placeholder="Nome da empresa" className={styles.input} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={styles.label}>E-mail Corporativo</label>
                <input type="email" placeholder="exemplo@empresa.com" className={styles.input} required />
              </div>

              <div className="flex flex-col gap-2">
                <label className={styles.label}>Assunto</label>
                <select className={styles.input} required>
                  <option value="">Selecione o motivo</option>
                  <option value="consultoria">Consultoria Técnica</option>
                  <option value="treinamento">Treinamentos e Certificados</option>
                  <option value="parceria">Parcerias Estratégicas</option>
                  <option value="suporte">Suporte ao Cliente</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={styles.label}>Mensagem</label>
                <textarea 
                  rows={5} 
                  placeholder="Como podemos ajudar o seu projeto hoje?" 
                  className={styles.input} 
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? 'A enviar...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ContatoPage;