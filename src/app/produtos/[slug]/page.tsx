'use client';

import { useParams } from 'next/navigation';
import { productsData } from '@/app/constants/produtos';

import styles from './ProductPage.module.css';
import RelatedProducts from '@/components/organisms/RelatedProducts/RelatedProducts';
import Button from '@/components/atoms/Button/Button';
import Image from 'next/image';
import { title } from 'process';

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
            <h1 className={styles.title}>{product.title}</h1>
            <span className={styles.tagline}>{product.tagline}</span>

            <p className={styles.description}>{product.description}</p>

            <div className="flex flex-wrap gap-4 mt-10">
              {product.login && <Button href={product.login} variant="primary">login</Button>}
              <Button href="/contato" variant="secondary" >Venha falar com especialista</Button>
            </div>
          </div>

          {'imgPrincipal' in product && product.imgPrincipal !== "" && (
            <div className="flex justify-center items-center">
              <Image
                src={product.imgPrincipal}
                alt={product.altPrincipal}
                className="rounded-2xl "
                width={'widthImgPrincipal' in product ? parseInt(product.widthImgPrincipal) : 60}
                height={100}
              />
            </div>
          )}

          {/* Imagem de destaque - usando a cor do produto como background para um visual mais integrado */}
          {'imgPrincipal' in product && product.imgPrincipal.length === 0 && (

            <div className="flex justify-center items-center">
              <div
                className={styles.visualCard}
                style={{ backgroundColor: product.color }}
              >
                <span className="text-white text-8xl font-black opacity-40">
                  {product.title.charAt(0)}
                </span>
              </div>
            </div>)}
        </div>
      </section>

      {/* Seção de Galeria - Aparece apenas se houver 'gallery' */}
      {product.gallery && product.gallery.length > 0 && (

        <section className="py-20 bg-slate-200 section">
          <div className="container mx-auto px-4 space-y-24">

            {product.gallery.map((item, index) => {
              const image = product.gallery[index];
              const isReverse = index % 2 === 1;

              return (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 items-center gap-12 ${isReverse ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                >
                  {/* Image */}
                  <img
                    src={image?.url}
                    alt={image?.alt || item.title}
                    className="max-w-md mx-auto"
                    width={image?.widthImg || "50%"}
                  />

                  {/* Text */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </section>
      )}

      {/* Seção de Módulos/Cursos (Aparece apenas se houver 'modules') */}
      {product.modules && product.modules.length > 0 && (
        <section className={`py-20 ${styles.animatedSection} section`}>
          <div className="container mx-auto px-4">
            <h2 className="text-[#003366] text-3xl font-bold mb-10 text-center">
              Cursos e Módulos Oferecido
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

      {/* Features - Organismo */}
      <section className="py-20 bg-white section">
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


      {/* Seção FAQ */}
      <section className="py-20 bg-white-50 section">
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








      {/* CTA Final - com banner */}
      {'banner' in product && product.banner && (
        <section className="relative py-20 text-white">

          {/* Background com opacity */}
          <div
            className="absolute inset-0 bg-[url('/img/border-img.svg')] opacity-20"
            aria-hidden="true"
          />

          {/* Conteúdo */}
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Pronto para transformar sua empresa?
            </h2>

            <p className="mb-10 max-w-xl mx-auto text-lg text-black">
              Junte-se a dezenas de empresas que já otimizaram seus resultados com a {product.title}.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex justify-center">
                <div className="flex items-center bg-white rounded-md overflow-hidden shadow-md w-full max-w-md">

                  <span className="px-3 text-gray-500 border-r border-gray-300">
                    Visite.la/
                  </span>

                  <input
                    type="text"
                    placeholder="seu-link"
                    className="flex-1 px-3 py-2 outline-none text-gray-700"
                  />

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 font-semibold transition"
                  >
                    Criar
                  </button>

                </div>
              </div>

            </div>
          </div>

        </section>
      )}



      {/* CTA Final - Impacto para Conversão */}
      {'banner' in product && product.banner.length === 0 && (
        <section className="py-20 bg-[#003366] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar sua empresa?</h2>
            <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
              Junte-se a dezenas de empresas que já otimizaram seus resultados com a {product.title}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contato" variant="primary">Solicitar Orçamento</Button>
              {/* <a href="https://wa.me/seunumeroaqui" className="border-2 border-white/30 hover:bg-white/10 px-8 py-3 rounded-full font-bold transition-all">
        Falar no WhatsApp
      </a> */}
            </div>
          </div>
        </section>
      )}

      {/* Seção de Produtos Relacionados */}
      <RelatedProducts currentSlug={slug} />
    </main>
  );
};

export default ProductPage;