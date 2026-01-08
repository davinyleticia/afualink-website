'use client';

import styles from './Sobre.module.css';

const timeline = [
  { year: '2021', title: 'A Fundação', desc: 'A Afulink nasce da inconformidade com ineficiências na gestão de projetos e tecnologia.' },
  { year: '2022', title: 'Primeiros Passos', desc: 'Aulas  B2B e início das consultorias em transformação digital.' },
  
  { year: '2023', title: 'Expansão Digital', desc: 'Lançamento das soluções Visitela e consolidação da consultoria em transformação digital.' },
  { year: '', title: 'Parcerias Estratégicas', desc: 'Colaborações com startups e empresas focadas em diversidade e inovação tecnológica.' },
  { year: '2023', title: 'Lançamento do CMS ', desc: 'Afulink apresenta o Visitela CMS, facilitando a criação e gestão de sites dinâmicos.' },
  { year: '2025', title: 'Crescimento e Diversificação', desc: 'Introdução do Visitela CMS e do Arquivme Drive Local NAS ao portfólio de produtos.' },
  { year: '2026', title: 'Inovação e Soberania', desc: 'Foco em soberania de dados com o Arquivme Drive NAS e parcerias estratégicas.' },
];

const SobrePage = () => {
  return (
    <main className="min-h-screen pt-20 bg-white">
      {/* HERO SECTION */}
      <section className="py-20 bg-slate-50 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#f37021] font-bold uppercase tracking-widest text-sm mb-4 block">Sobre a Afulink</span>
          <h1 className="text-[#003366] text-4xl md:text-6xl font-black mb-6 leading-tight">
            Tecnologia com propósito, <br />resultados com ética.
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Diagnosticamos infraestruturas e indicamos caminhos para a transformação digital, eliminando gargalos e impulsionando empresas através da inovação consciente.
          </p>
        </div>
      </section>
      {/* SECTION: HISTÓRIA (TIMELINE) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-[#003366] text-3xl font-bold mb-16 text-center">Nossa Jornada</h2>
          <div className={styles.timelineContainer}>
            {timeline.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h3 className="font-bold text-[#003366] text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: MISSÃO, VISÃO, VALORES */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className={styles.mvvCard}>
            <div className="text-[#f37021] text-3xl mb-4 font-black">01.</div>
            <h3 className="text-xl font-bold text-[#003366] mb-4">Missão</h3>
            <p className="text-gray-600 text-sm">Garantir maior eficiência e ROI através de soluções tecnológicas que priorizam a diversidade e inovação.</p>
          </div>
          <div className={styles.mvvCard}>
            <div className="text-[#f37021] text-3xl mb-4 font-black">02.</div>
            <h3 className="text-xl font-bold text-[#003366] mb-4">Visão</h3>
            <p className="text-gray-600 text-sm">Ser referência em criatividade técnica e foco em resultados para transformação digital soberana no Brasil.</p>
          </div>
          <div className={styles.mvvCard}>
            <div className="text-[#f37021] text-3xl mb-4 font-black">03.</div>
            <h3 className="text-xl font-bold text-[#003366] mb-4">Valores</h3>
            <p className="text-gray-600 text-sm">Transparência radical, ética em dados, compromisso com a diversidade e inconformismo com o desperdício.</p>
          </div>
        </div>
      </section>

      {/* SECTION: ESG & ODS */}
      <section className="py-24 bg-[#003366] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compromisso ESG</h2>
            <p className="text-blue-200">Integrando sustentabilidade, responsabilidade social e governança ética.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-[#f37021] font-bold text-xl">Environmental (E)</h3>
              <p className="text-sm text-blue-100">Otimização de recursos computacionais para redução de pegada de carbono e fomento a tecnologias de baixo consumo energético (NAS/Soberania de Dados).</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[#f37021] font-bold text-xl">Social (S)</h3>
              <p className="text-sm text-blue-100">Fomento à diversidade em times de tecnologia, educação de qualidade através de nossos treinamentos e inclusão digital para PMEs.</p>
              <div className="flex gap-2 mt-4">
                <span className={styles.odsMiniBadge} style={{ background: '#C5192D' }}>ODS 4</span>
                <span className={styles.odsMiniBadge} style={{ background: '#FF3A21' }}>ODS 5</span>
                <span className={styles.odsMiniBadge} style={{ background: '#A21942' }}>ODS 8</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[#f37021] font-bold text-xl">Governance (G)</h3>
              <p className="text-sm text-blue-100">Governança transparente, conformidade rigorosa com a LGPD e processos de auditoria técnica para garantir a segurança dos nossos clientes.</p>
              <div className="flex gap-2 mt-4">
                <span className={styles.odsMiniBadge} style={{ background: '#FD6925' }}>ODS 9</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* SECTION: DIVERSIDADE E INOVAÇÃO */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[#003366] text-4xl font-black mb-6 leading-tight">Diversidade é nossa <br /><span className="text-[#f37021]">estratégia de inovação.</span></h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Acreditamos que soluções disruptivas não nascem em ambientes homogêneos. Na Afulink, a diversidade de pensamento, gênero e história é o que nos permite enxergar além do óbvio.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold text-[#003366]">100%</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Foco em Ética</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#f37021]">Inovação</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Inclusiva</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white p-4 rounded-3xl shadow-2xl rotate-3">
              <div className="bg-slate-200 aspect-video rounded-2xl flex items-center justify-center italic text-gray-400">
                Espaço para imagem de equipe/escritório
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#f37021] text-white p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="font-bold">#AfulinkCulture</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center container mx-auto px-4">
        <h2 className="text-[#003366] text-3xl font-bold mb-8">Pronto para transformar seu negócio?</h2>
        <a href="/contato" className="inline-block bg-[#f37021] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d95d16] transition shadow-lg">
          Fale com um Especialista
        </a>
      </section>
    </main>
  );
};

export default SobrePage;