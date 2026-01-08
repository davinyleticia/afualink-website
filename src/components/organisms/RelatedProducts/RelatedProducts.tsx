import Link from 'next/link';
import { productsData } from '@/app/constants/produtos';
import styles from './RelatedProducts.module.css';

interface RelatedProductsProps {
  currentSlug: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentSlug }) => {
  // Filtra para NÃO mostrar o produto que o usuário já está lendo
  const otherProducts = Object.entries(productsData).filter(
    ([slug]) => slug !== currentSlug
  );

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-[#003366] text-3xl font-bold">Conheça outras soluções</h2>
        <div className="w-16 h-1 bg-[#f37021] mx-auto mt-4"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherProducts.map(([slug, product]) => (
            <Link key={slug} href={`/produtos/${slug}`} className={styles.relatedCard}>
              <div className={styles.dot} style={{ backgroundColor: product.color }}></div>
              <h3 className="font-bold text-[#003366] mb-2">{product.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{product.tagline}</p>
              <span className="text-[#f37021] text-xs font-bold mt-4 block uppercase tracking-wider">
                Ver Detalhes →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;