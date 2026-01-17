'use client';

import { useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import styles from './Carreira.module.css';

type Job = {
  id: string;
  title: string;
  area: string;
  type: string;
  level: string;
};

const jobs: Job[] = [
  // { id: 'dev-001', title: 'Desenvolvedor Frontend', area: 'Tecnologia', type: 'CLT', level: 'Pleno' },
  // { id: 'dev-002', title: 'Desenvolvedor Backend', area: 'Tecnologia', type: 'PJ', level: 'Sênior' },
  // { id: 'sales-001', title: 'Executivo de Vendas', area: 'Comercial', type: 'CLT', level: 'Júnior' },
];

const CarreiraPage = () => {
  return (
    <main className="min-h-screen pt-20 bg-white">
      {/* SECTION: HERO / CULTURA */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <span className="text-[#f37021] font-bold uppercase tracking-widest text-sm mb-4 block">Trabalhe Conosco</span>
          <h1 className="text-[#003366] text-4xl md:text-6xl font-black mb-6">Venha inovar com a Afulink</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Estamos em busca de talentos que desejam transformar o mercado de tecnologia.
            Aqui, valorizamos a criatividade, o foco em resultados e o aprendizado contínuo.
          </p>
        </div>
      </section>

      {/* SECTION: VAGAS ABERTAS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-[#003366] text-3xl font-bold mb-12">Vagas em Destaque</h2>

          <div className="grid gap-4">
            {jobs.length === 0 && (
              <p className="text-gray-500">No momento, não há vagas abertas.</p>
            )}
            {jobs?.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                  <div>
                    <h3 className="text-xl font-bold text-[#003366]">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className={styles.tag}>{job.area}</span>
                      <span className={styles.tag}>{job.type}</span>
                      <span className={styles.tag}>{job.level}</span>
                    </div>
                  </div>
                  <Button href={`/carreira/vaga/${job.id}`} variant="secondary">Ver Detalhes</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: BANCO DE TALENTOS (FORM) */}
      <section className="py-20 bg-[#003366] text-white">
        <div className="container mx-auto px-4 max-w-3xl space-y-8 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-0">Não encontrou sua vaga?</h2>
            <p className="text-blue-100 text-lg mb-6">
              Deixe seu currículo em nosso banco de talentos. Assim que surgir uma oportunidade que combine com seu perfil, entraremos em contato.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-xl">
            <a href="mailto:contato@afualink.com" className={styles.btnSubmit}>Enviar Candidatura</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CarreiraPage;