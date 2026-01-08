'use client';

import styles from './Privacidade.module.css';

const PrivacidadePage = () => {
  const lastUpdate = "08 de Janeiro de 2026";

  return (
    <main className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-[#003366] text-4xl md:text-5xl font-black mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-400 text-sm italic">
            Última atualização: {lastUpdate}
          </p>
        </header>

        <section className={styles.content}>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Na <strong>Afulink</strong>, privacidade e transparência são pilares fundamentais. Esta política descreve como coletamos, utilizamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>

          <div className={styles.topic}>
            <h2>1. Coleta de Dados</h2>
            <p>
              Coletamos informações que você nos fornece diretamente ao solicitar uma consultoria, abrir um ticket de atendimento ou candidatar-se a uma vaga em nossa página de carreira. Isso inclui:
            </p>
            <ul>
              <li>Nome, e-mail corporativo e empresa.</li>
              <li>Dados de identificação (RA/RC) para validação de certificados.</li>
              <li>Currículos e links de LinkedIn para processos seletivos.</li>
            </ul>
          </div>

          <div className={styles.topic}>
            <h2>2. Finalidade do Tratamento</h2>
            <p>Os dados coletados são utilizados exclusivamente para:</p>
            <ul>
              <li>Prestação de serviços de consultoria e suporte técnico.</li>
              <li>Validação da autenticidade de certificados emitidos.</li>
              <li>Comunicação sobre atualizações de produtos (Visitela, Arquivme).</li>
              <li>Processos internos de recrutamento e seleção.</li>
            </ul>
          </div>

          <div className={styles.topic}>
            <h2>3. Soberania e Segurança</h2>
            <p>
              Diferente de modelos convencionais, a Afulink promove a soberania de dados. Seus dados são armazenados em infraestruturas seguras com criptografia de ponta e, no caso do uso de nossas soluções locais (NAS), os dados permanecem sob controle total do cliente.
            </p>
          </div>

          <div className={styles.topic}>
            <h2>4. Seus Direitos</h2>
            <p>
              Você possui o direito de solicitar o acesso, a correção ou a exclusão de seus dados pessoais a qualquer momento. Para isso, basta entrar em contato através do nosso canal de atendimento.
            </p>
          </div>

          <div className={styles.topic}>
            <h2>5. Contato</h2>
            <p>
              Para dúvidas sobre esta política, entre em contato pelo e-mail: 
              <span className="text-[#f37021] font-bold"> privacidade@afulink.com.br</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PrivacidadePage;