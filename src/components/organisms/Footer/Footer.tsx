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
          </div>

          {/* Colunas de Links */}
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h4>Empresa</h4>
              <Link href="https://afulink.com//sobre">Sobre</Link>
              <Link href="https://afulink.com//carreira">Carreira</Link>
              <Link href="https://afulink.com//contato">Contato</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Produtos</h4>
              <Link href="https://afulink.com/produtos/biolink">Biolink</Link>
              <Link href="https://afulink.com/produtos/arquivme">Arquivme</Link>
              <Link href="https://afulink.com/produtos/treinamento">Treinamento B2B</Link>
              <Link href="https://afulink.com/produtos/consultoria">Consultoria</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Treinamentos B2C</h4>
              <Link href="https://afulink.com/treinamento/desenvolvimento-agil-com-11ty">Desenvolvimento ágil com 11ty</Link>
              
            </div>
            <div className={styles.linkColumn}>
              <h4>Informações</h4>
              <Link href="https://docs.afu.link">Documentação</Link>
              <Link href="https://afulink.com/atendimento/?section=validar-certificado">Validar Certificado</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Minha Conta</h4>
              <Link href="https://afulink.com/atendimento">Serviços de Atendimento</Link>
              <Link href="https://afulink.com/atendimento/suporte">Suporte / Ticket</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Rede Sociais</h4>
              <a href="https://instagram.com/afulink_oficial" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
              <a href="https://linkedin.com/in/canalafulink" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
              <a href="https://youtube.com/@afulink_oficial" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a>
              <a href="https://github.com/afulink" target="_blank" rel="noopener noreferrer"><FaGithub /> Github</a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.trademarkContainer}>
        <p className={styles.trademark}>Afulink Educação, Tecnologia e Inovação Ltda</p>
        <p className={styles.trademark}><strong>Visitela, Arquivme e Afulink são marcas e produtos da Afulink®.</strong></p>
        <p className={styles.trademark}><strong>
          Todos os direitos reservados. © 2021 – 2026. Trademark.</strong></p>
      </div>
    </footer>
  );
};

export default Footer;