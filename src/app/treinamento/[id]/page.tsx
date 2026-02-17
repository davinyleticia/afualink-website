'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../atendimento/Atendimento.module.css';

export default function DetalheTreinamento() {
  const { id } = useParams();
  const router = useRouter();
  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        // Usa o endpoint que você já criou no Flask
        const res = await fetch(`https://serverless-tau-green.vercel.app/api/customer-service/training/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setTraining(data);
        } else {
          console.error("Treinamento não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar treinamento:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTraining();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">CARREGANDO CONTEÚDO...</div>;

  if (!training) return <div className="min-h-screen flex flex-col items-center justify-center">
    <p className="font-bold text-slate-800">Treinamento não encontrado.</p>
    <button onClick={() => router.back()} className="mt-4 text-orange-500 font-bold uppercase text-xs">Voltar</button>
  </div>;

  return (
    <main className="min-h-screen bg-white">
      {/* Header do Treinamento */}
      <div className="bg-[#003366] pt-32 pb-20 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-[10px] font-black text-blue-300 mb-6 uppercase tracking-widest hover:text-white transition">
            ← Voltar aos cursos
          </button>
          <h1 className="text-4xl font-black italic uppercase leading-none mb-4">{training.name}</h1>
          <p className="text-blue-100 opacity-80 text-sm max-w-2xl leading-relaxed">{training.description}</p>
        </div>
      </div>

      {/* Conteúdo / Vídeo / Material */}
      <div className="max-w-4xl mx-auto px-6 -mt-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Espaço para o vídeo ou imagem principal */}
          <div className="aspect-video bg-slate-900 flex items-center justify-center relative group">
             {training.video_url ? (
               <iframe 
                 className="w-full h-full"
                 src={training.video_url.replace("watch?v=", "embed/")} 
                 title={training.name}
                 allowFullScreen
               ></iframe>
             ) : (
               <div className="text-slate-500 font-bold text-xs uppercase italic">Vídeo indisponível</div>
             )}
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Módulo Único
              </span>
              <span className="text-slate-400 text-[10px] font-bold uppercase">
                Duração: {training.duration || '--'} min
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-800 uppercase italic mb-4">Sobre este treinamento</h2>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
              {/* Aqui renderizamos o conteúdo detalhado */}
              <p>{training.content || "Nenhum conteúdo detalhado disponível para este treinamento."}</p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status do Progresso</p>
                  <p className="text-sm font-bold text-slate-700">Aguardando Conclusão</p>
               </div>
               <button className="bg-[#f37021] text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-[#003366] transition-all">
                  Marcar como Concluído
               </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}