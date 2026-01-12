'use client';

import { useState } from 'react';
import { useAtendimento } from '@/hooks/useAtendimento';
import styles from './Atendimento.module.css';

export default function AtendimentoPage() {
  const [mode, setMode] = useState<'consulta' | 'validacao'>('consulta');
  const [section, setSection] = useState(false);

  // Estados dos formulários
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [service, setService] = useState('');
  const [codigoCertificado, setCodigoCertificado] = useState('');
  const [resultData, setResultData] = useState<string | null>(null);
  const [resultDataError, setResultDataError] = useState<string | null>(null);

  const { fetchData, validateCertificate, data, loading, error } = useAtendimento();

  // 1. Lógica de Consulta (Com Senha)
  const handleConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return alert("Escolha um serviço");

    const result = await fetchData(ra, password, service);
    if (result) setSection(true);
  };

  // 2. Lógica de Validação de Certificado (Sem Senha)
  const handleValidacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultData(null);
    setResultDataError(null);
    const result = await validateCertificate(ra, codigoCertificado);
    if (result.result === 'valided') {
      setResultData("Certificado Válido!");
    } else {
      setResultDataError("Certificado Inválido ou Não Encontrado.");
    }

  };
  console.log(resultData)
  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center p-4">
      {!section ? (
        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>Área de Atendimento</h2>

          {/* Alternador de Modo */}
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('consulta')}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition ${mode === 'consulta' ? 'bg-white shadow-sm text-[#003366]' : 'text-gray-500'}`}
            >
              Consultar
            </button>
            <button
              onClick={() => setMode('validacao')}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition ${mode === 'validacao' ? 'bg-white shadow-sm text-[#003366]' : 'text-gray-500'}`}
            >
              Validar Certificado
            </button>

          </div>

          {/* FORMULÁRIO DE CONSULTA (CERTIFICADOS/FINANCEIRO/DOCS) */}
          {mode === 'consulta' && (
            <form onSubmit={handleConsulta} className="flex flex-col gap-4">
              <select className={styles.selectField} value={service} onChange={e => setService(e.target.value)} required>
                <option value="">O que deseja consultar?</option>
                <option value="certificates/list_certificates">Meus Certificados</option>
                <option value="invoices/list_invoices">Financeiro / Boletos</option>
                <option value="documents/list_documents">Documentos e Declarações</option>
              </select>
              <input type="text" placeholder="Seu RA" className={styles.inputField} value={ra} onChange={e => setRa(e.target.value)} required />
              <input type="password" placeholder="Sua Senha" className={styles.inputField} value={password} onChange={e => setPassword(e.target.value)} required />
              <button className={styles.btnVerify} disabled={loading}>{loading ? 'Aguarde...' : 'Entrar'}</button>
            </form>
          )}

          {/* FORMULÁRIO DE VALIDAÇÃO (PÚBLICO) */}
          {mode === 'validacao' && (
            <>
              <form onSubmit={handleValidacao} className="flex flex-col gap-4">
                <p className="text-xs text-gray-500 text-center mb-2">Valide a autenticidade de certificados emitidos pela Afulink.</p>

                <input type="text" placeholder="RA do Aluno" className={styles.inputField} value={ra} onChange={e => setRa(e.target.value)} required />
                <input type="text" placeholder="Código do Certificado" className={styles.inputField} value={codigoCertificado} onChange={e => setCodigoCertificado(e.target.value)} required />
                <button className={`${styles.btnVerify} bg-[#f37021]`} disabled={loading}>{loading ? 'Validando...' : 'Validar Agora'}</button>
              </form>
              <div className="h-4 my-4 flex flex-col items-center justify-center">
                {resultDataError && <div className=" text-red-500 text-l">{resultDataError}</div>}
                {resultData && <p className=" text-green-500 text-l">{resultData}</p>}
              </div>
            </>
          )}
        </div>
      ) : (<>
        <div className="flex flex-col items-start w-full max-w-6xl mb-6 px-2"> {/* Adicionado padding lateral para mobile */}
          <div className="w-full flex justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-[#003366]">Seus Resultados</h2>
              <p className="text-xs md:text-sm text-gray-500">Aqui estão os resultados da sua consulta.</p>
            </div>
            <button
              onClick={() => { setSection(false); }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z" />
              </svg>
              Voltar
            </button>
          </div>

          <div className="grid gap-4 w-full max-w-6xl"> {/* Aumentado o gap para separar melhor os cards no mobile */}
            {(Array.isArray(data) ? data : [data]).map((item: any, i: number) => (
              <div
                key={i}
                className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
              >
                {/* Lado Esquerdo / Topo (Informações) */}
                <div className="flex flex-col gap-1 w-full md:w-auto">
                  <h4 className="font-bold text-[#003366] text-base md:text-lg leading-tight">
                    {item.name || item.course_name || item.document_name || "Documento"}
                  </h4>

                  <p className="text-sm text-gray-500 font-medium">
                    {item.number ? `Nº ${item.number}` : item.invoice_number ? `Fatura: ${item.invoice_number}` : ""}
                  </p>

                  {item.status && (
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded w-fit mt-1 ${item.status === 'pago' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {item.status}
                    </span>
                  )}
                </div>

                {/* Lado Direito / Base (Datas e Download) */}
                <div className="flex flex-col md:items-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                  <div className="text-xs font-bold text-gray-400 space-y-1">
                    {item.issue_date && <p>Emitido em: {new Date(item.issue_date).toLocaleDateString()}</p>}
                    {item.due_date && <p>Vence em: {new Date(item.due_date).toLocaleDateString()}</p>}
                    {item.amount && <p className="text-[#003366] text-lg mt-1">R$ {item.amount}</p>}
                  </div>

                  {item.file_path && (
                    <a
                      href={item.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#f8fafc] border border-slate-200 text-[#003366] px-4 py-3 md:py-2 rounded-lg text-sm font-bold hover:bg-[#f37021] hover:text-white hover:border-[#f37021] transition-all w-full md:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                      </svg>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>)}
    </main>
  );
}