// components/organisms/ProductsSection/ProductsSection.tsx
import ProductCard from '../../molecules/ProductCard/ProductCard';

const productsData = [
  { id: 1, title: "Visitela Biolink", description: "Sua vitrine digital personalizada para redes sociais.", link: "/produtos/biolink" },
  { id: 3, title: "Arquivme Drive Local NAS", description: "Privacidade e controle total dos seus dados com storage local.", link: "/produtos/arquivme" },
  { id: 4, title: "Treinamento B2B", description: "Capacitação técnica para elevar o nível da sua equipe.", link: "/produtos/treinamento" },
  { id: 5, title: "Consultoria", description: "Estratégia personalizada para acelerar sua transformação digital.", link: "/produtos/consultoria" },
];

const ProductsSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-[#003366] text-3xl md:text-4xl font-bold mb-4 py-10">
            Nossas Soluções
          </h2>
          <div className="w-24 h-1 bg-[#f37021] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Produtos desenvolvidos para otimizar processos e impulsionar resultados.
          </p>
        </header>

        {/* Grid configurado para 3 colunas no desktop e centralizar os itens restantes */}
        <div className="flex flex-wrap justify-center gap-8">
          {productsData.map((product) => (
            <div key={product.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
    
  );
};

export default ProductsSection;