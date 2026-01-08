'use client';

import { useParams } from 'next/navigation';
import { productsData } from '@/app/constants/produtos';

import styles from './ProductPage.module.css';
import RelatedProducts from '@/components/organisms/RelatedProducts/RelatedProducts';
import Button from '@/components/atoms/Button/Button';

const ProductPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const product = productsData[slug as keyof typeof productsData];

  if (!product) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-[#003366]">Produto não encontrado.</h1>
        <Button href="/produtos" variant="primary">Voltar aos produtos</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section - Layout via Tailwind, Estilo via CSS Modules */}
      <section className="py-16 md:py-24 bg-white section">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <span className={styles.tagline}>{product.tagline}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.description}>{product.description}</p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <Button href="/contato" variant="secondary">Falar com especialista</Button>
            </div>
          </div>

          <div className="flex justify-center items-center">
             <div 
               className={styles.visualCard} 
               style={{ backgroundColor: product.color }}
             >
               <span className="text-white text-8xl font-black opacity-40">
                 {product.title.charAt(0)}
               </span>
             </div>
          </div>
        </div>
      </section>

      {/* Features - Organismo */}
      <section className="py-20 bg-slate-50 section">
        <div className="container mx-auto px-4">
          <h2 className="text-[#003366] text-3xl font-bold text-center mb-12">
            O que está incluso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.checkIcon}>✓</div>
                <p className="font-medium text-[#003366]">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Seção de Módulos/Cursos (Aparece apenas se houver 'modules') */}
        {product.modules && product.modules.length > 0 && (
  <section className={ `py-20 ${styles.animatedSection} section`}>
  <div className="container mx-auto px-4 max-w-4xl">
    <h2 className="text-[#003366] text-3xl font-bold mb-10 text-center">
      Conteúdo Programático
    </h2>
    
    {product.modules?.map((module, i) => (
      <details key={i} className={styles.accordion}>
        <summary>
          {module.title}
          <span className="text-[#f37021]">+</span>
        </summary>
        <ul className={styles.moduleList}>
          {module.content.map((topic, j) => (
            <li key={j}>{topic}</li>
          ))}
        </ul>
      </details>
    ))}
  </div>
</section>
)}

{/* Seção FAQ */}
<section className="py-20 bg-slate-50 section">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-[#003366] text-3xl font-bold mb-12">Dúvidas Frequentes</h2>
    <div className="text-left space-y-8">
      {product.faq?.map((item, i) => (
        <div key={i} className="border-b border-gray-200 pb-6">
          <h4 className="font-bold text-[#003366] mb-2">{item.q}</h4>
          <p className="text-gray-600">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* SEÇÃO VITRINE / SHOWCASE */}
{product.gallery && product.gallery.length > 0 && (
  <section className="py-20 bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-[#003366] text-3xl font-bold mb-4">Explore a Interface</h2>
        <div className="w-16 h-1 bg-[#f37021] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2a gap-8 items-center">
        {product.gallery.map((img, index) => (
          <div 
            key={index} 
            className="relative"
          >
            <img 
              src={img.url} 
              alt={img.alt}
            />
            {/* Overlay sutil no hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  </section>
)}

{/* CTA Final - Impacto para Conversão */}
<section className="py-20 bg-[#003366] text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar sua empresa?</h2>
    <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
      Junte-se a dezenas de empresas que já otimizaram seus resultados com a {product.title}.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <Button href="/contato" variant="primary">Solicitar Orçamento</Button>
      <a href="https://wa.me/seunumeroaqui" className="border-2 border-white/30 hover:bg-white/10 px-8 py-3 rounded-full font-bold transition-all">
        Falar no WhatsApp
      </a>
    </div>
  </div>
</section>
<RelatedProducts currentSlug={slug} />
    </main>
  );
};

export default ProductPage;