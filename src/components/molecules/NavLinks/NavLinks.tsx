"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavLinks.module.css';

interface NavLinksProps {
  onLinkClick?: () => void; // Para fechar o menu mobile ao clicar
}

const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick }) => {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Atendimento', href: '/atendimento' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <ul className={styles.navList}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <li key={link.href} className={styles.navItem}>
            <Link 
              href={link.href} 
              onClick={onLinkClick}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;