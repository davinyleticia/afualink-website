import Image from 'next/image';
import Button from '@/app/components/atoms/Button/Button';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>
            Otimize processos, inove com tecnologia e conquiste resultado personalizado!
          </h1>
          <p className={styles.subheading}>
            Transforme sua empresa com nossas soluções de consultoria em TI!
          </p>
          <Button href="/produtos" variant="primary">
            VEJA OS NOSSO PRODUTOS
          </Button>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/img1.jpg" // Salve a imagem da seção na pasta /public
            alt="Ilustração de pessoas desenvolvendo software"
            width={600}
            height={450}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;