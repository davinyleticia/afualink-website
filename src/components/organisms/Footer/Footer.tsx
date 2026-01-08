import Link from 'next/link';
import { FaInstagram, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';
import Logo from '@/components/atoms/Logo/Logo';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Coluna 1: Logo e Copyright */}
          <div className={styles.brandColumn}>
            <Logo />
            <div className={styles.legal}>
              <Link href="/termos">Termo de Uso</Link> | <Link href="/privacidade">Privacidade</Link>
            </div>
            <p className={styles.trademark}>Trademark Afulink® 2021 - 2026</p>
          </div>

          {/* Colunas de Links */}
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h4>Empresa</h4>
              <Link href="/sobre">Sobre</Link>
              <Link href="/carreira">Carreira</Link>
              <Link href="/contato">Contato</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Informações</h4>
              <Link href="https://docs.afu.link">Documentação</Link>
              <Link href="/validar-certificado">Validar Certificado</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Minha Conta</h4>
              <Link href="/atendimento">Serviços de Atendimento</Link>
           
            </div>
            <div className={styles.linkColumn}>
              <h4>Rede Sociais</h4>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /> Github</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;