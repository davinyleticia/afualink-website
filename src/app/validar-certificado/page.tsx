'use client';

import { useState } from 'react';
import { useAtendimento } from '@/hooks/useAtendimento';
import styles from './ValidarCertificado.module.css';

const ValidarCertificadoPage = () => {
  const [codigoCertificado, setCodigoCertificado] = useState('');
  const { fetchData, data, loading } = useAtendimento();

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    // Chamada simplificada enviando apenas o código para a API
    fetchData(codigoCertificado, "public_access", 'certificados/validar');
  };

  return (
    <main className="min-h-screen pt-24 bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {!data ? (
          <div className={styles.validarCard}>
            <div className="text-center mb-8">
              <h1 className={styles.title}>Validar Certificado</h1>
              <p className="text-gray-500 text-sm mt-2">Informe o código único impresso no documento.</p>
            </div>

            <form onSubmit={handleValidation} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className={styles.label}>Código do Certificado</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  placeholder="Ex: AFU-123456-ABC"
                  value={codigoCertificado}
                  onChange={(e) => setCodigoCertificado(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <button type="submit" className={styles.btnValidar} disabled={loading}>
                {loading ? 'Consultando...' : 'Verificar Agora'}
              </button>
            </form>
          </div>
        ) : (
          /* TELA DE RESULTADO */
          <div className={`${styles.resultCard} animate-in fade-in zoom-in duration-500`}>
            {data.valid ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  ✓
                </div>
                <h2 className="text-[#28a745] text-2xl font-bold mb-6">Certificado Autêntico</h2>
                
                <div className="space-y-4 text-left border-t border-b border-gray-100 py-6">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase">Aluno</span>
                    <p className="text-[#003366] font-bold text-lg">{data.aluno}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase">Treinamento</span>
                    <p className="text-[#003366] font-bold">{data.curso}</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-black uppercase">Emissão</span>
                      <p className="text-[#003366] font-medium text-sm">{data.data_emissao}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-black uppercase">Carga Horária</span>
                      <p className="text-[#003366] font-medium text-sm">{data.carga_horaria}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-8 text-[#f37021] font-bold hover:underline"
                >
                  Validar outro código
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  ✕
                </div>
                <h2 className="text-red-500 text-2xl font-bold mb-2">Código Inválido</h2>
                <p className="text-gray-500 mb-8">Não encontramos registros para este código.</p>
                <button onClick={() => window.location.reload()} className={styles.btnRetry}>
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default ValidarCertificadoPage;