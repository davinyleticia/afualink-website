// components/organisms/AboutSection.tsx
export const AboutSection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-[#003366] text-3xl md:text-4xl font-bold mb-8 leading-tight">
          Somos um escritório inovador, com muita criatividade e foco em resultados.
        </h2>
        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>
            A Afulink nasceu da inconformidade de sua fundadora com os desperdícios e ineficiências observados na gestão de projetos em empresas de diversos segmentos e tamanhos.
          </p>
          <p>
            Nossa missão é transformar a maneira como os negócios operam, garantindo maior eficiência, produtividade e retorno sobre investimento (ROI) através de soluções tecnológicas inovadoras.
          </p>
          <p>
            Diagnosticamos sua infraestrutura tecnológica e indicamos caminhos para a transformação digital, eliminando gargalos e impulsionando sua empresa rumo ao futuro.
          </p>
        </div>
      </div>
    </section>
  );
};