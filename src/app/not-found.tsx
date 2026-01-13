import Link from 'next/link';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <div className={styles.divider}></div>
        <h2 className={styles.title}>Página não encontrada</h2>
        <p className={styles.description}>
          O conteúdo que você está procurando não existe ou foi movido. 
          Verifique o link ou retorne para a nossa página inicial.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            Voltar para a Home
          </Link>
          <Link href="/atendimento/suporte" className={styles.btnSecondary}>
            Suporte Técnico
          </Link>
        </div>
      </div>
      
      {/* Background Decorativo Sutil */}
      <div className={styles.bgShape}></div>
    </main>
  );
}