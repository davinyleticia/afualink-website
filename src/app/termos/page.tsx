'use client';

import styles from './Termos.module.css';

const TermosPage = () => {
  const lastUpdate = "08 de Janeiro de 2026";

  return (
    <main className="min-h-screen pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-[#003366] text-4xl md:text-5xl font-black mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-400 text-sm italic">
            Última atualização: {lastUpdate}
          </p>
        </header>

        <section className={styles.content}>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Bem-vindo à <strong>Afulink</strong>. Ao acessar nosso site e utilizar nossos serviços, você concorda em cumprir estes termos. Por favor, leia-os com atenção para garantir uma experiência segura e produtiva.
          </p>

          <div className={styles.topic}>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              O uso dos serviços prestados pela Afulink (Consultoria, Softwares e Treinamentos) implica na aceitação plena das condições aqui estabelecidas. Caso não concorde com algum ponto, recomendamos que não utilize nossas plataformas.
            </p>
          </div>

          <div className={styles.topic}>
            <h2>2. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo presente em nosso site e ferramentas — incluindo logotipos, textos, designs das interfaces (Visitela/CMS) e materiais didáticos de treinamento — é de propriedade exclusiva da Afulink ou de seus licenciadores, sendo protegido pelas leis de direitos autorais.
            </p>
          </div>

          <div className={styles.topic}>
            <h2>3. Responsabilidades do Usuário</h2>
            <p>Ao utilizar nossos serviços, você se compromete a:</p>
            <ul>
              <li>Fornecer informações verídicas em formulários e cadastros.</li>
              <li>Não utilizar nossas ferramentas para fins ilícitos ou que violem direitos de terceiros.</li>
              <li>Manter a confidencialidade de suas credenciais de acesso (Password) em nossa área de atendimento.</li>
            </ul>
          </div>

          <div className={styles.topic}>
            <h2>4. Limitação de Responsabilidade</h2>
            <p>
              A Afulink busca a excelência técnica, mas não se responsabiliza por danos indiretos, perda de dados causados por mau uso de hardware local (NAS) ou interrupções de serviços de terceiros (hospedagens externas). Nossa responsabilidade limita-se à prestação do serviço contratado conforme diagnóstico técnico.
            </p>
          </div>

          <div className={styles.topic}>
            <h2>5. Modificações</h2>
            <p>
              Reservamo-nos o direito de alterar estes termos a qualquer momento para refletir mudanças em nossas operações ou na legislação vigente. Recomendamos a consulta periódica a esta página.
            </p>
          </div>

          <div className={styles.topic}>
            <h2>6. Jurisdição</h2>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de <strong>Mogi das Cruzes/SP</strong> para dirimir quaisquer controvérsias.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TermosPage;