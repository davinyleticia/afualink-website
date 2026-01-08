// components/molecules/ProductCard/ProductCard.tsx
import Button from '@/app/components/atoms/Button/Button';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  title: string;
  description: string;
  link: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, link }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.footer}>
        {/* Usando o seu átomo de Button */}
        <Button href={link} variant="primary">
          Saber Mais
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;