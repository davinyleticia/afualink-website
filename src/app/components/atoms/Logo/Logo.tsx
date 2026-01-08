import Image from 'next/image';
import Link from 'next/link';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Link href="/" className={styles.logoLink}>
      <Image
        src="/logo.svg" // Coloque seu logo na pasta /public
        alt="Afulink Logo"
        width={120}
        height={40}
        priority // Prioriza o carregamento do logo
      />
    </Link>
  );
};

export default Logo;