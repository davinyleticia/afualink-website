'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button/Button';

export default function TrainingLP() {
  const { id } = useParams();
  const router = useRouter();
  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    
    const fetchLPData = async () => {
      try {
        const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/training/${id}`);
        const data = await res.json();
        if (res.ok) setTraining(data);
      } catch (err) {
        console.error("Erro ao carregar LP:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLPData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-slate-300 animate-pulse uppercase tracking-widest">Carregando Experiência...</div>;
  if (!training) return <div className="min-h-screen flex items-center justify-center font-bold">Treinamento não localizado.</div>;

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 0. STICKY HEADER */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-black text-[#003366] uppercase italic text-sm">{training.title}</span>
          <a href={training.enroll} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-black uppercase text-[10px] hover:scale-105 transition-transform">Inscrever-se</a>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative bg-[#003366] pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 -skew-x-12 translate-x-20"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded uppercase tracking-[0.2em]">Início: {training.startDate}</span>
              <span className="bg-red-800 text-white text-[9px] font-black px-3 py-1 rounded uppercase tracking-[0.2em]">Vagas Limitadas</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase leading-[0.9] mb-8 tracking-tighter">
              {training.title}
            </h1>
            <p className="text-blue-100 text-lg opacity-80 mb-10 leading-relaxed max-w-xl">
              {training.description}
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <a href={training.enroll} className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs hover:bg-white hover:text-[#003366] transition-all shadow-2xl shadow-orange-500/20 active:scale-95 text-center">
                Quero garantir minha vaga
              </a>
              <div className="flex flex-col">
                <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Duração total</span>
                <span className="text-white font-bold text-sm italic">{training.week_duration}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-500/20 rounded-[3rem] blur-2xl group-hover:bg-orange-500/30 transition duration-500"></div>
              <img 
                src={training.imgbanner} 
                alt={training.title} 
                className="relative rounded-[2.5rem] shadow-2xl border-4 border-white/10 w-full aspect-video lg:aspect-square object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIFERENCIAIS */}
      <section className="py-16 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Certificado', val: 'Incluso', icon: '📜' },
            { label: 'Acesso', val: 'Durante o treinamento', icon: '⚡' },
            { label: 'Suporte', val: 'Prioritário', icon: '💬' },
            { label: 'Formato', val: '100% Online', icon: '🌍' },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</p>
              <p className="text-sm font-black text-[#003366] italic uppercase">{item.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SYLLABUS */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl font-black text-[#003366] uppercase italic mb-4">O que você vai dominar</h2>
          <div className="w-20 h-1.5 bg-orange-500 rounded-full"></div>
          <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Cronograma Completo</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {training.syllabus?.map((item: any, idx: number) => (
            <div key={item.id} className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
              <span className="text-orange-500 font-black text-xs mb-4 block">Módulo {idx + 1}</span>
              <h3 className="font-black text-[#003366] uppercase text-lg mb-3 italic tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQ SECTION (FUNDO CLARO) */}
      <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#003366] uppercase italic">Perguntas Comuns</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4"></div>
          </div>
          
          <div className="space-y-4">
            {training.faq?.map((f: any, idx: number) => (
              <div key={f.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center group transition-colors hover:bg-slate-50"
                >
                  <span className="font-bold text-slate-700 group-hover:text-[#003366] transition-colors">{f.question}</span>
                  <span className={`text-orange-500 transition-transform duration-300 font-black text-xl ${activeFaq === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-100 italic">
                    {f.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-24 bg-[#003366] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-orange-500/5 -skew-y-6 translate-y-24"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-6 tracking-tighter">Pronto para transformar sua carreira?</h2>
            <p className="text-blue-100 mb-12 max-w-xl mx-auto text-lg font-medium opacity-80">
              Garanta sua vaga agora mesmo e comece sua jornada na Afulink.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <a href={training.enroll} className="bg-orange-500 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-all shadow-xl shadow-orange-500/20">
                Garantir minha vaga
              </a>
              
            </div>
          </div>
        </section>

      
    </main>
  );
}